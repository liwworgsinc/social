import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ALLOWED_ORIGINS = new Set([
  "https://liwworgsinc.github.io",
  "https://social.liwworgs.com",
  "https://liwworgs.com",
  "http://localhost:8765",
  "http://127.0.0.1:8765",
]);

function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://liwworgsinc.github.io",
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-liw-studio-key",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const STUDIO_KEY = "gWIQUKkxqYjINOl8HlPdxF_NhtJ95WPlfIRUfPmINk4";
const ALLOWED_SIZES = new Set(["1024x1024", "1536x1024", "1024x1536"]);
const usage = new Map<string, { count: number; day: string }>();

function json(data: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

function getClientId(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("cf-connecting-ip")
    || "unknown";
}

function withinLimit(clientId: string) {
  const day = new Date().toISOString().slice(0, 10);
  const current = usage.get(clientId);
  if (!current || current.day !== day) {
    usage.set(clientId, { day, count: 1 });
    return true;
  }
  if (current.count >= 20) return false;
  current.count += 1;
  return true;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return json({ error: "This image tool is restricted to the LIW Worgs studio website." }, 403, origin);
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
  if (req.headers.get("x-liw-studio-key") !== STUDIO_KEY) return json({ error: "LIW Studio request key was rejected." }, 403, origin);

  const clientId = getClientId(req);
  if (!withinLimit(clientId)) return json({ error: "Daily image-generation limit reached. Try again tomorrow." }, 429, origin);

  try {
    const payload = await req.json();
    const prompt = String(payload?.prompt || "").trim();
    const size = ALLOWED_SIZES.has(payload?.size) ? payload.size : "1024x1024";
    const quality = ["low", "medium", "high"].includes(payload?.quality) ? payload.quality : "medium";

    if (prompt.length < 30) return json({ error: "The image prompt is too short." }, 400, origin);
    if (prompt.length > 4000) return json({ error: "The image prompt is too long." }, 400, origin);

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return json({
        error: "AI image generation is not activated yet. Add an OPENAI_API_KEY secret to the Supabase project, then try again."
      }, 503, origin);
    }

    const openAIResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt,
        size,
        quality,
        output_format: "png",
        n: 1,
      }),
    });

    const data = await openAIResponse.json();
    if (!openAIResponse.ok) {
      console.error("OpenAI image error", data);
      const message = data?.error?.message || "The image model could not complete the request.";
      return json({ error: message }, openAIResponse.status >= 500 ? 502 : 400, origin);
    }

    const imageBase64 = data?.data?.[0]?.b64_json;
    if (!imageBase64) return json({ error: "The image model returned no image data." }, 502, origin);

    return json({ imageBase64, mimeType: "image/png", size, quality }, 200, origin);
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : "Unable to generate the image." }, 400, origin);
  }
});

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const stopWords = new Set("a an and are as at be been but by can do for from get has have how if in into is it its more not of on or our so than that the their them there they this to we what when where which who will with you your website home about contact services service learn click page privacy terms all any us".split(" "));
const openers: Record<string, string[]> = {
  professional: ["A common challenge deserves a practical solution.", "Better results start with a clearer process.", "Your customers should not have to settle for unnecessary frustration."],
  friendly: ["Let’s make this easier.", "You already have enough on your plate.", "The good news is that there is a simpler way."],
  bold: ["Stop letting this problem cost you time and money.", "The old way is not working.", "This problem does not need another temporary fix."],
  luxury: ["The right solution should feel effortless.", "Elevate the way you handle this challenge.", "Premium service begins where frustration ends."],
  local: ["Our community deserves dependable solutions close to home.", "Local problems need people who understand the neighborhood.", "You should not have to go far for reliable help."],
};

const reply = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json" } });
const clean = (text = "") => text.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
const short = (text: string, max: number) => text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;

function keywords(text: string) {
  const counts = new Map<string, number>();
  for (const raw of clean(text).toLowerCase().match(/[a-z][a-z'-]{2,}/g) ?? []) {
    const word = raw.replace(/'s$/, "");
    if (!stopWords.has(word) && word.length > 3) counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([word]) => word);
}

function sentence(text: string, terms: string[]) {
  return clean(text).split(/(?<=[.!?])\s+/).find((line) => line.length > 35 && terms.some((term) => line.toLowerCase().includes(term))) ?? "";
}

function analyze(text: string) {
  const key = keywords(text);
  return {
    keywords: key,
    problem: short(sentence(text, ["struggle", "problem", "challenge", "difficult", "stress", "frustrat", "costly", "slow", "waste", "need"]) || `Customers may be losing time, money, or peace of mind trying to handle ${key[0] ?? "this challenge"} without the right support.`, 180),
    solution: short(sentence(text, ["we help", "we provide", "we offer", "solution", "save time", "simplify", "improve", "support"]) || `A clear, dependable service can simplify ${key[0] ?? "the process"} and help customers move forward with confidence.`, 190),
    offer: short(sentence(text, ["service", "provide", "offer", "specialize", "solution"]) || `Professional ${key.slice(0, 3).join(", ") || "customer"} support`, 145),
  };
}

function headline(index: number, framework: string, keyword: string, audience: string) {
  const sets: Record<string, string[]> = {
    "problem-solution": [`Tired of ${keyword} problems?`, `There’s a better way to handle ${keyword}`, `${audience || "Customers"} deserve a simpler solution`, `Turn ${keyword} frustration into results`],
    pas: [`${keyword} should not be this stressful`, `Stop letting ${keyword} slow you down`, `The hidden cost of ignoring ${keyword}`, "Fix the problem before it gets bigger"],
    aida: [`What if ${keyword} could be easier?`, `A smarter way to improve ${keyword}`, "Ready for a better result?", "The solution you have been looking for"],
    "before-after": ["From frustrated to confident", "Before: stress. After: a clear solution.", `A better ${keyword} experience starts here`, "See what changes with the right support"],
    educational: [`3 signs you need help with ${keyword}`, `What most people get wrong about ${keyword}`, `A simple tip for better ${keyword}`, "Know this before choosing a provider"],
  };
  const choices = sets[framework] ?? sets["problem-solution"];
  return choices[index % choices.length];
}

function buildPost(input: any) {
  const { index, platform, framework, tone, analysis, brandName, audience, callToAction, includeHashtags } = input;
  const key = analysis.keywords[index % Math.max(1, analysis.keywords.length)] ?? "the process";
  const title = headline(index, framework, key, audience);
  const opener = (openers[tone] ?? openers.professional)[index % 3];
  const brand = brandName || "Our team";
  const cta = callToAction || "Send us a message to get started.";
  let body = `${opener}\n\nThe problem: ${analysis.problem}\n\nThe solution: ${brand} provides ${analysis.offer.toLowerCase()} ${analysis.solution}\n\nThe goal is simple: help ${audience || "customers"} save time, reduce stress, and get a stronger result.\n\n${cta}`;
  if (framework === "pas") body = `${opener}\n\nThe problem: ${analysis.problem}\n\nWhen this continues, it can create more delays, more expense, and more stress than necessary.\n\nThe solution: ${brand} offers ${analysis.offer.toLowerCase()} ${analysis.solution}\n\n${cta}`;
  if (framework === "aida") body = `${title}\n\n${opener} ${analysis.problem}\n\nImagine having a clear path forward instead. ${brand} helps ${audience || "customers"} through ${analysis.offer.toLowerCase()}\n\n${analysis.solution}\n\n${cta}`;
  if (framework === "before-after") body = `BEFORE: ${analysis.problem}\n\nAFTER: More clarity, less stress, and a solution built around what you actually need.\n\nThe bridge between the two is the right support. ${brand} provides ${analysis.offer.toLowerCase()} so ${audience || "customers"} can move forward confidently.\n\n${cta}`;
  if (framework === "educational") body = `${title}\n\n1. The problem keeps returning.\n2. It is costing more time or money than expected.\n3. You are unsure what the next step should be.\n\n${brand} makes ${key} easier through ${analysis.offer.toLowerCase()}\n\n${analysis.solution}\n\n${cta}`;
  const tags = includeHashtags ? [...new Set([brandName.replace(/[^a-z0-9]/gi, ""), ...analysis.keywords.slice(0, 7)].filter(Boolean).map((item: string) => `#${item}`))] : [];
  if (tags.length && platform !== "x") body += `\n\n${tags.join(" ")}`;
  if (platform === "x" && body.length > 275) body = `${body.slice(0, 272).trim()}…`;
  return { platform, framework, tone, headline: title, body, hashtags: tags };
}

function publicUrl(input: string) {
  const url = new URL(input);
  const host = url.hostname.toLowerCase();
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only HTTP and HTTPS URLs are supported.");
  if (host === "localhost" || host.endsWith(".local") || host === "::1" || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) throw new Error("Private network URLs are not supported.");
  return url.toString();
}

async function readWebsite(input: string) {
  const response = await fetch(publicUrl(input), { redirect: "follow", signal: AbortSignal.timeout(12000), headers: { "User-Agent": "PostPilotBot/2.0" } });
  if (!response.ok) throw new Error(`Website returned ${response.status}.`);
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html") && !type.includes("text/plain")) throw new Error("The URL did not return readable webpage text.");
  return clean((await response.text()).slice(0, 600000)).slice(0, 30000);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  if (!req.headers.get("Authorization")) return reply({ error: "Authentication required" }, 401);
  try {
    const payload = await req.json();
    let source = clean(payload.websiteText ?? "");
    if (!source && payload.websiteUrl) source = await readWebsite(payload.websiteUrl);
    if (source.length < 60) return reply({ error: "Add a website URL or at least 60 characters of website information." }, 400);
    const platforms = payload.platforms?.length ? payload.platforms : ["instagram", "facebook"];
    const count = Math.min(Math.max(Number(payload.count) || 6, 1), 12);
    const analysis = analyze(source);
    const posts = Array.from({ length: count }, (_, index) => buildPost({ ...payload, index, analysis, platform: platforms[index % platforms.length], framework: payload.framework ?? "problem-solution", tone: payload.tone ?? "professional", includeHashtags: payload.includeHashtags !== false }));
    return reply({ analysis, posts, sourceLength: source.length });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : "Unable to generate posts." }, 400);
  }
});

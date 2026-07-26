(() => {
  "use strict";

  const config = window.POSTPILOT_CONFIG;
  if (!config?.supabaseUrl || !config?.supabasePublishableKey) {
    document.body.innerHTML = "<p style='padding:30px;font-family:sans-serif'>Supabase configuration is missing.</p>";
    return;
  }

  const db = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey);
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const state = {
    session: null,
    user: null,
    brand: null,
    templates: [],
    generatedPosts: [],
    libraryPosts: [],
    queue: [],
    activeTemplate: null,
    currentWebsiteId: null,
    authMode: "signin",
    workspaceLoaded: false,
    selectedPlatforms: new Set(["instagram", "facebook"]),
    designer: {
      canvas: null,
      size: "square",
      history: [],
      historyIndex: -1,
      historyLock: false,
    },
  };

  const routes = {
    generator: ["generatorRoute", "Content engine", "Generate posts"],
    designer: ["designerRoute", "Built-in creative studio", "Design a social graphic"],
    library: ["libraryRoute", "Supabase content database", "Post library"],
    calendar: ["calendarRoute", "Approval and scheduling", "Content queue"],
    brand: ["brandRoute", "Reusable business identity", "Brand kit"],
  };

  const platformNames = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn", x: "X / Twitter" };
  const canvasSizes = {
    square: { width: 620, height: 620 },
    portrait: { width: 560, height: 700 },
    landscape: { width: 760, height: 398 },
    story: { width: 405, height: 720 },
  };

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function setMessage(element, message = "", type = "") {
    element.textContent = message;
    element.className = `form-message${type ? ` ${type}` : ""}`;
  }

  function setSaving(saving, message = "Saving…") {
    $("#saveState").textContent = saving ? message : "All changes saved";
  }

  function setButtonBusy(button, busy, label = "Working…") {
    if (busy) {
      button.dataset.original = button.textContent;
      button.disabled = true;
      button.textContent = label;
    } else {
      button.disabled = false;
      button.textContent = button.dataset.original || button.textContent;
    }
  }

  function switchRoute(routeName) {
    const route = routes[routeName] ? routeName : "generator";
    $$(".route").forEach((section) => section.classList.remove("active"));
    $$(".nav-link").forEach((button) => button.classList.toggle("active", button.dataset.route === route));
    $(`#${routes[route][0]}`).classList.add("active");
    $("#pageEyebrow").textContent = routes[route][1];
    $("#pageTitle").textContent = routes[route][2];
    $("#sidebar").classList.remove("open");
    history.replaceState(null, "", `#${route}`);
    if (route === "designer" && state.designer.canvas) setTimeout(() => state.designer.canvas.calcOffset(), 40);
  }

  function updateAccountUI() {
    const email = state.user?.email || "Sign in";
    $("#accountEmail").textContent = email;
    $("#accountInitial").textContent = (state.brand?.name || email || "?").charAt(0).toUpperCase();
    $("#authModal").classList.toggle("active", !state.user);
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    const email = $("#authEmail").value.trim();
    const password = $("#authPassword").value;
    const displayName = $("#authName").value.trim();
    const button = $("#authSubmitButton");
    const message = $("#authMessage");
    setMessage(message);
    setButtonBusy(button, true, state.authMode === "signin" ? "Signing in…" : "Creating account…");

    try {
      if (state.authMode === "signin") {
        const { error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await db.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split("@")[0] },
            emailRedirectTo: `${location.origin}${location.pathname}`,
          },
        });
        if (error) throw error;
        if (!data.session) setMessage(message, "Account created. Check your email to confirm it, then sign in.", "success");
      }
    } catch (error) {
      setMessage(message, error.message || "Authentication failed.", "error");
    } finally {
      setButtonBusy(button, false);
    }
  }

  function toggleAuthMode() {
    state.authMode = state.authMode === "signin" ? "signup" : "signin";
    const signup = state.authMode === "signup";
    $("#authName").classList.toggle("hidden", !signup);
    $("#authNameLabel").classList.toggle("hidden", !signup);
    $("#authPassword").autocomplete = signup ? "new-password" : "current-password";
    $("#authSubmitButton").textContent = signup ? "Create account" : "Sign in";
    $("#toggleAuthMode").textContent = signup ? "I already have an account" : "Create a new account";
    $("#authMessage").textContent = "";
  }

  async function signOut() {
    await db.auth.signOut();
    state.workspaceLoaded = false;
    state.brand = null;
    state.libraryPosts = [];
    state.queue = [];
    updateAccountUI();
  }

  async function initializeAuth() {
    const { data } = await db.auth.getSession();
    state.session = data.session;
    state.user = data.session?.user || null;
    updateAccountUI();
    if (state.user) await loadWorkspace();

    db.auth.onAuthStateChange(async (_event, session) => {
      state.session = session;
      state.user = session?.user || null;
      updateAccountUI();
      if (state.user && !state.workspaceLoaded) await loadWorkspace();
    });
  }

  async function loadWorkspace() {
    state.workspaceLoaded = true;
    setSaving(true, "Loading workspace…");
    await Promise.all([loadTemplates(), loadBrand(), loadLibrary(), loadQueue()]);
    if (!state.designer.canvas) initDesigner();
    renderTemplateList();
    populateBrandForms();
    updateAccountUI();
    setSaving(false);
  }

  async function loadTemplates() {
    const { data, error } = await db.from("design_templates").select("*").order("created_at");
    if (error) {
      console.error(error);
      return;
    }
    state.templates = data || [];
    state.activeTemplate ||= state.templates[0] || null;
  }

  async function loadBrand() {
    const { data, error } = await db.from("brands").select("*").order("created_at").limit(1).maybeSingle();
    if (error) console.error(error);
    if (data) {
      state.brand = data;
      return;
    }

    const defaultName = state.user?.user_metadata?.display_name ? `${state.user.user_metadata.display_name}'s Brand` : "My Business";
    const { data: inserted, error: insertError } = await db.from("brands").insert({ user_id: state.user.id, name: defaultName }).select().single();
    if (insertError) console.error(insertError);
    state.brand = inserted || null;
  }

  function populateBrandForms() {
    if (!state.brand) return;
    const brand = state.brand;
    $("#brandName").value = brand.name || "";
    $("#websiteUrl").value = brand.website_url || "";
    $("#audience").value = brand.audience || "";
    $("#callToAction").value = brand.call_to_action || "";
    $("#brandVoice").value = brand.brand_voice || "professional";
    $("#tone").value = brand.brand_voice || "professional";

    $("#brandSettingsName").value = brand.name || "";
    $("#brandSettingsWebsite").value = brand.website_url || "";
    $("#brandSettingsAudience").value = brand.audience || "";
    $("#brandSettingsCta").value = brand.call_to_action || "";
    $("#brandSettingsVoice").value = brand.brand_voice || "professional";
    $("#primaryColor").value = brand.primary_color || "#5b3df5";
    $("#secondaryColor").value = brand.secondary_color || "#171629";
    $("#accentColor").value = brand.accent_color || "#f3b63f";
    if (brand.logo_path) loadLogoPreview(brand.logo_path);
  }

  async function saveBrand() {
    if (!state.user) return;
    const button = $("#saveBrandButton");
    setButtonBusy(button, true, "Saving…");
    setSaving(true);
    const payload = {
      user_id: state.user.id,
      name: $("#brandSettingsName").value.trim() || "My Business",
      website_url: $("#brandSettingsWebsite").value.trim() || null,
      audience: $("#brandSettingsAudience").value.trim() || null,
      call_to_action: $("#brandSettingsCta").value.trim() || null,
      brand_voice: $("#brandSettingsVoice").value,
      primary_color: $("#primaryColor").value,
      secondary_color: $("#secondaryColor").value,
      accent_color: $("#accentColor").value,
    };

    const query = state.brand?.id
      ? db.from("brands").update(payload).eq("id", state.brand.id)
      : db.from("brands").insert(payload);
    const { data, error } = await query.select().single();
    if (error) showToast(error.message);
    else {
      state.brand = data;
      populateBrandForms();
      updateAccountUI();
      showToast("Brand kit saved.");
    }
    setSaving(false);
    setButtonBusy(button, false);
  }

  async function uploadLogo(file) {
    if (!file || !state.user) return;
    if (file.size > 10 * 1024 * 1024) return showToast("Logo must be smaller than 10 MB.");
    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${state.user.id}/logos/logo-${Date.now()}.${extension}`;
    setSaving(true, "Uploading logo…");
    const { error: uploadError } = await db.storage.from("brand-assets").upload(path, file, { cacheControl: "3600", upsert: false });
    if (uploadError) {
      setSaving(false);
      return showToast(uploadError.message);
    }
    const { data, error } = await db.from("brands").update({ logo_path: path }).eq("id", state.brand.id).select().single();
    if (error) showToast(error.message);
    else {
      state.brand = data;
      await loadLogoPreview(path);
      showToast("Logo uploaded.");
    }
    setSaving(false);
  }

  async function signedAssetUrl(path, expires = 3600) {
    const { data, error } = await db.storage.from("brand-assets").createSignedUrl(path, expires);
    if (error) throw error;
    return data.signedUrl;
  }

  async function loadLogoPreview(path) {
    try {
      const url = await signedAssetUrl(path);
      $("#logoPreview").innerHTML = `<img src="${escapeHtml(url)}" alt="Brand logo">`;
    } catch (error) {
      console.error(error);
    }
  }

  async function generatePosts() {
    if (!state.user) return;
    const websiteUrl = $("#websiteUrl").value.trim();
    const websiteText = $("#websiteText").value.trim();
    if (!websiteUrl && websiteText.length < 60) {
      setMessage($("#generatorMessage"), "Add a website URL or paste at least 60 characters of website information.", "error");
      return;
    }
    const platforms = [...state.selectedPlatforms];
    if (!platforms.length) return setMessage($("#generatorMessage"), "Select at least one platform.", "error");

    const button = $("#generateButton");
    setButtonBusy(button, true, "Analyzing and writing…");
    setMessage($("#generatorMessage"), "Reading the offer and building problem–solution content…");

    try {
      const { data, error } = await db.functions.invoke("generate-posts", {
        body: {
          websiteUrl,
          websiteText,
          brandName: $("#brandName").value.trim(),
          audience: $("#audience").value.trim(),
          callToAction: $("#callToAction").value.trim(),
          platforms,
          framework: $("#framework").value,
          tone: $("#tone").value,
          count: Number($("#generationCount").value),
          includeHashtags: $("#includeHashtags").checked,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      state.generatedPosts = (data.posts || []).map((post) => ({ ...post, id: null, status: "draft" }));
      renderGeneratedPosts();
      $("#resultsSection").classList.remove("hidden");
      setMessage($("#generatorMessage"), `${state.generatedPosts.length} posts created. Edit, save or design them.`, "success");

      const { data: websiteRow, error: websiteError } = await db.from("websites").insert({
        user_id: state.user.id,
        brand_id: state.brand?.id || null,
        url: websiteUrl || null,
        content: websiteText || null,
        summary: data.analysis || {},
        last_scanned_at: new Date().toISOString(),
      }).select("id").single();
      if (!websiteError) state.currentWebsiteId = websiteRow.id;
      $("#resultsSection").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error(error);
      setMessage($("#generatorMessage"), error.message || "Post generation failed.", "error");
    } finally {
      setButtonBusy(button, false);
    }
  }

  function createPostCard(post, mode) {
    const card = $("#postCardTemplate").content.firstElementChild.cloneNode(true);
    const platformBadge = $(".platform-badge", card);
    const status = $(".post-status", card);
    const headline = $(".headline-input", card);
    const body = $(".post-body-input", card);
    const count = $(".character-count", card);
    const framework = $(".framework-badge", card);
    const saveButton = $(".save-post", card);

    platformBadge.textContent = platformNames[post.platform] || post.platform;
    status.textContent = post.status || (mode === "generated" ? "Draft" : "Saved");
    headline.value = post.headline || "";
    body.value = post.body || "";
    framework.textContent = (post.framework || "problem-solution").replaceAll("-", " ");

    const sync = () => {
      post.headline = headline.value;
      post.body = body.value;
      count.textContent = `${body.value.length} characters`;
    };
    sync();
    headline.addEventListener("input", sync);
    body.addEventListener("input", sync);
    $(".copy-post", card).addEventListener("click", () => copyText(`${headline.value}\n\n${body.value}`));
    $(".design-post", card).addEventListener("click", () => loadPostIntoDesigner(post));

    if (mode === "library") {
      saveButton.textContent = "Update";
      saveButton.addEventListener("click", () => updatePost(post));
    } else {
      saveButton.addEventListener("click", async () => {
        sync();
        await savePost(post);
      });
    }
    return card;
  }

  function renderGeneratedPosts() {
    const grid = $("#generatedPosts");
    grid.innerHTML = "";
    state.generatedPosts.forEach((post) => grid.append(createPostCard(post, "generated")));
  }

  async function savePost(post) {
    if (post.id) return updatePost(post);
    setSaving(true);
    const { data, error } = await db.from("posts").insert({
      user_id: state.user.id,
      brand_id: state.brand?.id || null,
      website_id: state.currentWebsiteId,
      platform: post.platform,
      framework: post.framework,
      tone: post.tone,
      headline: post.headline,
      body: post.body,
      hashtags: post.hashtags || [],
      status: "saved",
    }).select().single();
    if (error) showToast(error.message);
    else {
      Object.assign(post, data);
      showToast("Post saved to Supabase.");
      await loadLibrary();
    }
    setSaving(false);
  }

  async function updatePost(post) {
    if (!post.id) return savePost(post);
    setSaving(true);
    const { data, error } = await db.from("posts").update({ headline: post.headline, body: post.body, status: post.status === "draft" ? "saved" : post.status }).eq("id", post.id).select().single();
    if (error) showToast(error.message);
    else {
      Object.assign(post, data);
      showToast("Post updated.");
      await loadLibrary();
    }
    setSaving(false);
  }

  async function saveAllGeneratedPosts() {
    const button = $("#saveAllPostsButton");
    setButtonBusy(button, true, "Saving…");
    for (const post of state.generatedPosts) if (!post.id) await savePost(post);
    setButtonBusy(button, false);
    showToast("Generated posts saved.");
  }

  async function loadLibrary() {
    const { data, error } = await db.from("posts").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    state.libraryPosts = data || [];
    renderLibrary();
    $("#postCountBadge").textContent = state.libraryPosts.length;
    populateScheduleSelect();
  }

  function renderLibrary() {
    const grid = $("#libraryPosts");
    grid.innerHTML = "";
    state.libraryPosts.forEach((post) => grid.append(createPostCard(post, "library")));
  }

  function populateScheduleSelect() {
    const select = $("#schedulePostSelect");
    if (!state.libraryPosts.length) {
      select.innerHTML = '<option value="">Save a post first</option>';
      return;
    }
    select.innerHTML = state.libraryPosts.map((post) => `<option value="${post.id}">${escapeHtml(post.headline)} — ${escapeHtml(platformNames[post.platform])}</option>`).join("");
  }

  async function schedulePost() {
    const postId = $("#schedulePostSelect").value;
    const date = $("#scheduleDate").value;
    const time = $("#scheduleTime").value;
    const post = state.libraryPosts.find((item) => item.id === postId);
    if (!post) return showToast("Choose a saved post.");
    if (!date || !time) return showToast("Choose a date and time.");
    const scheduledAt = new Date(`${date}T${time}`).toISOString();
    const { error } = await db.from("scheduled_posts").insert({ user_id: state.user.id, post_id: post.id, platform: post.platform, scheduled_at: scheduledAt });
    if (error) return showToast(error.message.includes("duplicate") ? "That post is already queued." : error.message);
    await db.from("posts").update({ status: "queued", scheduled_at: scheduledAt }).eq("id", post.id);
    await Promise.all([loadQueue(), loadLibrary()]);
    showToast("Post added to the queue.");
  }

  async function loadQueue() {
    const { data, error } = await db.from("scheduled_posts").select("*, posts(headline, body, platform)").order("scheduled_at");
    if (error) {
      console.error(error);
      return;
    }
    state.queue = data || [];
    renderQueue();
    $("#queueCountBadge").textContent = state.queue.filter((item) => item.status === "pending").length;
  }

  function renderQueue() {
    const list = $("#queueList");
    list.innerHTML = "";
    $("#queueSummary").textContent = `${state.queue.length} queued`;
    state.queue.forEach((item) => {
      const date = new Date(item.scheduled_at);
      const row = document.createElement("article");
      row.className = "queue-item";
      row.innerHTML = `<div class="queue-date"><strong>${date.getDate()}</strong><span>${date.toLocaleString("en-US", { month: "short" })}</span></div><div class="queue-info"><strong>${escapeHtml(item.posts?.headline || "Scheduled post")}</strong><p>${escapeHtml(platformNames[item.platform] || item.platform)} · ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} · ${escapeHtml(item.status)}</p></div><button aria-label="Remove">×</button>`;
      $("button", row).addEventListener("click", () => removeFromQueue(item));
      list.append(row);
    });
  }

  async function removeFromQueue(item) {
    const { error } = await db.from("scheduled_posts").delete().eq("id", item.id);
    if (error) return showToast(error.message);
    await db.from("posts").update({ status: "saved", scheduled_at: null }).eq("id", item.post_id);
    await Promise.all([loadQueue(), loadLibrary()]);
    showToast("Post removed from queue.");
  }

  function renderTemplateList() {
    const list = $("#templateList");
    list.innerHTML = "";
    state.templates.forEach((template) => {
      const card = document.createElement("button");
      card.className = `template-card${state.activeTemplate?.id === template.id ? " active" : ""}`;
      card.style.background = template.config?.background || "#5b3df5";
      card.innerHTML = `<strong>${escapeHtml(template.name)}</strong><small>${escapeHtml(template.canvas_size)}</small>`;
      card.addEventListener("click", () => {
        state.activeTemplate = template;
        state.designer.size = template.canvas_size || "square";
        updateSizeButtons();
        applyTemplate(template);
        renderTemplateList();
      });
      list.append(card);
    });
  }

  function initDesigner() {
    const canvas = new fabric.Canvas("designCanvas", { preserveObjectStacking: true, selectionColor: "rgba(91,61,245,.12)", selectionBorderColor: "#5b3df5", selectionLineWidth: 2 });
    state.designer.canvas = canvas;
    setCanvasSize("square", false);

    ["object:added", "object:modified", "object:removed"].forEach((eventName) => canvas.on(eventName, () => {
      refreshLayers();
      pushHistory();
    }));
    canvas.on("selection:created", updateObjectProperties);
    canvas.on("selection:updated", updateObjectProperties);
    canvas.on("selection:cleared", updateObjectProperties);

    if (state.activeTemplate) applyTemplate(state.activeTemplate);
  }

  function setCanvasSize(size, preserve = true) {
    const canvas = state.designer.canvas;
    if (!canvas) return;
    const dimensions = canvasSizes[size] || canvasSizes.square;
    let json = null;
    if (preserve && canvas.getObjects().length) json = canvas.toDatalessJSON(["dataRole", "dataLabel"]);
    canvas.setDimensions(dimensions);
    state.designer.size = size;
    if (json) canvas.loadFromJSON(json, () => { canvas.renderAll(); resetHistory(); });
    updateSizeButtons();
  }

  function updateSizeButtons() {
    $$("#canvasSizePicker button").forEach((button) => button.classList.toggle("active", button.dataset.size === state.designer.size));
  }

  function makeTextbox(text, options = {}) {
    return new fabric.Textbox(text, {
      fontFamily: "Manrope",
      fontWeight: 700,
      fill: "#ffffff",
      lineHeight: 1.05,
      editable: true,
      ...options,
    });
  }

  function applyTemplate(template) {
    const canvas = state.designer.canvas;
    if (!canvas) return;
    state.designer.historyLock = true;
    const size = template.canvas_size || state.designer.size || "square";
    setCanvasSize(size, false);
    canvas.clear();
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const cfg = template.config || {};
    const background = cfg.background || state.brand?.primary_color || "#5b3df5";
    const accent = cfg.accent || state.brand?.accent_color || "#f3b63f";
    const textColor = cfg.text || "#ffffff";
    canvas.backgroundColor = background;

    const layout = cfg.layout || "split";
    if (layout === "split") {
      canvas.add(new fabric.Circle({ left: width * .67, top: -height * .13, radius: width * .3, fill: "rgba(255,255,255,.10)", selectable: false, evented: false, dataRole: "decoration", dataLabel: "Background circle" }));
      canvas.add(new fabric.Rect({ left: 0, top: height * .75, width, height: height * .25, fill: accent, selectable: false, evented: false, dataRole: "accent", dataLabel: "Accent block" }));
    } else if (layout === "editorial") {
      canvas.add(new fabric.Rect({ left: width * .63, top: 0, width: width * .37, height, fill: accent, selectable: false, evented: false, dataRole: "accent", dataLabel: "Editorial column" }));
    } else if (layout === "bold") {
      canvas.add(new fabric.Rect({ left: -width * .1, top: height * .68, width: width * 1.2, height: height * .24, angle: -5, fill: accent, selectable: false, evented: false, dataRole: "accent", dataLabel: "Offer stripe" }));
    } else if (layout === "community") {
      canvas.add(new fabric.Circle({ left: width * .58, top: height * .58, radius: width * .28, fill: "rgba(255,255,255,.07)", stroke: accent, strokeWidth: 3, selectable: false, evented: false, dataRole: "accent", dataLabel: "Community ring" }));
    } else if (layout === "clean") {
      canvas.add(new fabric.Rect({ left: 0, top: 0, width: Math.max(16, width * .035), height, fill: accent, selectable: false, evented: false, dataRole: "accent", dataLabel: "Side rule" }));
    } else if (layout === "luxury") {
      canvas.add(new fabric.Rect({ left: width * .07, top: height * .07, width: width * .86, height: height * .86, fill: "transparent", stroke: accent, strokeWidth: 2, selectable: false, evented: false, dataRole: "accent", dataLabel: "Gold frame" }));
    }

    const margin = width * .085;
    const badge = makeTextbox(cfg.badge || "PROBLEM → SOLUTION", { left: margin, top: height * .09, width: width * .58, fontSize: Math.max(12, width * .022), fill: accent, charSpacing: 80, dataRole: "badge", dataLabel: "Badge" });
    const headline = makeTextbox("Your customer has a problem. Your business has the solution.", { left: margin, top: height * .24, width: width * .78, fontSize: Math.max(30, width * .065), fill: textColor, dataRole: "headline", dataLabel: "Headline" });
    const body = makeTextbox("Explain how your service saves time, reduces stress and helps customers get a stronger result.", { left: margin, top: height * .58, width: width * .68, fontFamily: "DM Sans", fontWeight: 400, fontSize: Math.max(15, width * .027), lineHeight: 1.35, fill: textColor, opacity: .82, dataRole: "body", dataLabel: "Supporting text" });
    const brand = makeTextbox((state.brand?.name || "YOUR BRAND").toUpperCase(), { left: margin, top: height * .88, width: width * .65, fontSize: Math.max(11, width * .02), fill: layout === "split" ? background : textColor, charSpacing: 60, dataRole: "brand", dataLabel: "Brand name" });
    canvas.add(badge, headline, body, brand);
    state.designer.historyLock = false;
    canvas.renderAll();
    resetHistory();
    refreshLayers();
  }

  function addText(type) {
    const canvas = state.designer.canvas;
    const isHeading = type === "heading";
    const object = makeTextbox(isHeading ? "New headline" : "Add supporting text here.", {
      left: canvas.getWidth() * .15,
      top: canvas.getHeight() * .35,
      width: canvas.getWidth() * .65,
      fontSize: isHeading ? 44 : 22,
      fontWeight: isHeading ? 800 : 400,
      fill: "#ffffff",
      dataRole: type,
      dataLabel: isHeading ? "Heading" : "Body text",
    });
    canvas.add(object).setActiveObject(object);
    canvas.renderAll();
  }

  function addShape(type) {
    const canvas = state.designer.canvas;
    const common = { left: canvas.getWidth() * .35, top: canvas.getHeight() * .35, fill: state.brand?.accent_color || "#f3b63f", opacity: .95, dataRole: "shape", dataLabel: type === "circle" ? "Circle" : "Rectangle" };
    const object = type === "circle" ? new fabric.Circle({ ...common, radius: 70 }) : new fabric.Rect({ ...common, width: 180, height: 100, rx: 8, ry: 8 });
    canvas.add(object).setActiveObject(object);
    canvas.renderAll();
  }

  function addUploadedImage(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => fabric.Image.fromURL(reader.result, (image) => {
      const canvas = state.designer.canvas;
      image.set({ left: canvas.getWidth() * .2, top: canvas.getHeight() * .2, dataRole: "image", dataLabel: file.name });
      image.scaleToWidth(Math.min(canvas.getWidth() * .55, image.width || 300));
      canvas.add(image).setActiveObject(image);
      canvas.renderAll();
    }, { crossOrigin: "anonymous" });
    reader.readAsDataURL(file);
  }

  function selectedObject() {
    return state.designer.canvas?.getActiveObject() || null;
  }

  function updateObjectProperties() {
    const object = selectedObject();
    $("#noSelectionMessage").classList.toggle("hidden", Boolean(object));
    $("#objectProperties").classList.toggle("hidden", !object);
    if (!object) return refreshLayers();
    const isText = ["textbox", "i-text", "text"].includes(object.type);
    $("#objectText").disabled = !isText;
    $("#fontFamily").disabled = !isText;
    $("#fontSize").disabled = !isText;
    $("#boldButton").disabled = !isText;
    $("#alignLeftButton").disabled = !isText;
    $("#alignCenterButton").disabled = !isText;
    $("#alignRightButton").disabled = !isText;
    $("#objectText").value = isText ? object.text || "" : "Not a text element";
    $("#fontFamily").value = object.fontFamily || "Manrope";
    $("#fontSize").value = Math.round(object.fontSize || 20);
    $("#objectColor").value = normalizeColor(object.fill);
    $("#objectOpacity").value = object.opacity ?? 1;
    refreshLayers();
  }

  function normalizeColor(value) {
    if (typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)) return value;
    return "#5b3df5";
  }

  function updateSelected(props) {
    const object = selectedObject();
    if (!object) return;
    object.set(props);
    object.setCoords();
    state.designer.canvas.requestRenderAll();
    pushHistory();
    refreshLayers();
  }

  function refreshLayers() {
    const canvas = state.designer.canvas;
    if (!canvas) return;
    const list = $("#layersList");
    list.innerHTML = "";
    [...canvas.getObjects()].reverse().forEach((object) => {
      const row = document.createElement("div");
      row.className = `layer-item${canvas.getActiveObject() === object ? " active" : ""}`;
      row.innerHTML = `<span>${escapeHtml(object.dataLabel || object.dataRole || object.type)}</span><button title="Select">Select</button>`;
      $("button", row).addEventListener("click", () => { canvas.setActiveObject(object); canvas.requestRenderAll(); updateObjectProperties(); });
      list.append(row);
    });
  }

  function resetHistory() {
    const canvas = state.designer.canvas;
    state.designer.history = [JSON.stringify(canvas.toDatalessJSON(["dataRole", "dataLabel"]))];
    state.designer.historyIndex = 0;
  }

  function pushHistory() {
    const designer = state.designer;
    if (!designer.canvas || designer.historyLock) return;
    clearTimeout(pushHistory.timer);
    pushHistory.timer = setTimeout(() => {
      const snapshot = JSON.stringify(designer.canvas.toDatalessJSON(["dataRole", "dataLabel"]));
      if (designer.history[designer.historyIndex] === snapshot) return;
      designer.history = designer.history.slice(0, designer.historyIndex + 1);
      designer.history.push(snapshot);
      if (designer.history.length > 40) designer.history.shift();
      designer.historyIndex = designer.history.length - 1;
    }, 80);
  }

  function loadHistory(index) {
    const designer = state.designer;
    const snapshot = designer.history[index];
    if (!snapshot) return;
    designer.historyLock = true;
    designer.canvas.loadFromJSON(snapshot, () => {
      designer.canvas.renderAll();
      designer.historyIndex = index;
      designer.historyLock = false;
      refreshLayers();
      updateObjectProperties();
    });
  }

  function loadPostIntoDesigner(post) {
    switchRoute("designer");
    if (state.activeTemplate) applyTemplate(state.activeTemplate);
    const canvas = state.designer.canvas;
    const headline = canvas.getObjects().find((item) => item.dataRole === "headline");
    const body = canvas.getObjects().find((item) => item.dataRole === "body");
    if (headline) headline.set({ text: post.headline || "Your headline" });
    if (body) body.set({ text: summarizeForDesign(post.body) });
    canvas.requestRenderAll();
    resetHistory();
    showToast("Post loaded into the designer.");
  }

  function summarizeForDesign(text = "") {
    const paragraphs = text.split(/\n+/).map((part) => part.trim()).filter(Boolean).filter((part) => !part.startsWith("#"));
    const useful = paragraphs.find((part) => part.length > 45) || paragraphs[0] || "";
    return useful.length > 170 ? `${useful.slice(0, 167).trim()}…` : useful;
  }

  async function saveDesign() {
    if (!state.user || !state.designer.canvas) return;
    const button = $("#saveDesignButton");
    setButtonBusy(button, true, "Saving…");
    setSaving(true);
    const canvas = state.designer.canvas;
    canvas.discardActiveObject().requestRenderAll();
    try {
      const previewUrl = canvas.toDataURL({ format: "png", multiplier: 1.6, quality: .95 });
      const blob = await (await fetch(previewUrl)).blob();
      const path = `${state.user.id}/designs/design-${Date.now()}.png`;
      const { error: uploadError } = await db.storage.from("brand-assets").upload(path, blob, { contentType: "image/png", cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const { error } = await db.from("designs").insert({
        user_id: state.user.id,
        brand_id: state.brand?.id || null,
        name: `${state.activeTemplate?.name || "Custom"} ${new Date().toLocaleDateString()}`,
        canvas_size: state.designer.size,
        template_slug: state.activeTemplate?.slug || null,
        design_json: canvas.toDatalessJSON(["dataRole", "dataLabel"]),
        preview_path: path,
      });
      if (error) throw error;
      showToast("Design and preview saved.");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Could not save the design.");
    } finally {
      setSaving(false);
      setButtonBusy(button, false);
    }
  }

  function downloadDesign() {
    const canvas = state.designer.canvas;
    if (!canvas) return;
    canvas.discardActiveObject().requestRenderAll();
    const link = document.createElement("a");
    link.download = `${(state.brand?.name || "postpilot").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${state.designer.size}-${Date.now()}.png`;
    link.href = canvas.toDataURL({ format: "png", multiplier: 3, quality: 1 });
    link.click();
    showToast("High-resolution PNG downloaded.");
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => showToast("Copied to clipboard.")).catch(() => showToast("Copy failed."));
  }

  function bindEvents() {
    $$("[data-route]").forEach((element) => element.addEventListener("click", (event) => { event.preventDefault(); switchRoute(element.dataset.route); }));
    $("#mobileMenuButton").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    $("#authForm").addEventListener("submit", handleAuthSubmit);
    $("#toggleAuthMode").addEventListener("click", toggleAuthMode);
    $("#accountButton").addEventListener("click", () => state.user ? (confirm("Sign out of PostPilot?") && signOut()) : $("#authModal").classList.add("active"));

    $$(".platform").forEach((button) => button.addEventListener("click", () => {
      const platform = button.dataset.platform;
      button.classList.toggle("selected");
      button.classList.contains("selected") ? state.selectedPlatforms.add(platform) : state.selectedPlatforms.delete(platform);
    }));
    $("#brandVoice").addEventListener("change", (event) => $("#tone").value = event.target.value);
    $("#generateButton").addEventListener("click", generatePosts);
    $("#saveAllPostsButton").addEventListener("click", saveAllGeneratedPosts);
    $("#refreshLibraryButton").addEventListener("click", loadLibrary);
    $("#scheduleButton").addEventListener("click", schedulePost);
    $("#saveBrandButton").addEventListener("click", saveBrand);
    $("#logoUpload").addEventListener("change", (event) => uploadLogo(event.target.files?.[0]));

    $("#addHeadingButton").addEventListener("click", () => addText("heading"));
    $("#addBodyButton").addEventListener("click", () => addText("body"));
    $("#addRectangleButton").addEventListener("click", () => addShape("rectangle"));
    $("#addCircleButton").addEventListener("click", () => addShape("circle"));
    $("#designerImageUpload").addEventListener("change", (event) => addUploadedImage(event.target.files?.[0]));
    $$("#canvasSizePicker button").forEach((button) => button.addEventListener("click", () => setCanvasSize(button.dataset.size)));
    $("#saveDesignButton").addEventListener("click", saveDesign);
    $("#downloadDesignButton").addEventListener("click", downloadDesign);
    $("#undoButton").addEventListener("click", () => loadHistory(state.designer.historyIndex - 1));
    $("#redoButton").addEventListener("click", () => loadHistory(state.designer.historyIndex + 1));
    $("#bringForwardButton").addEventListener("click", () => { const object = selectedObject(); if (object) { state.designer.canvas.bringForward(object); state.designer.canvas.requestRenderAll(); pushHistory(); refreshLayers(); } });
    $("#sendBackwardButton").addEventListener("click", () => { const object = selectedObject(); if (object) { state.designer.canvas.sendBackwards(object); state.designer.canvas.requestRenderAll(); pushHistory(); refreshLayers(); } });
    $("#deleteObjectButton").addEventListener("click", () => { const object = selectedObject(); if (object) { state.designer.canvas.remove(object); state.designer.canvas.discardActiveObject(); state.designer.canvas.requestRenderAll(); } });

    $("#objectText").addEventListener("input", (event) => updateSelected({ text: event.target.value }));
    $("#fontFamily").addEventListener("change", (event) => updateSelected({ fontFamily: event.target.value }));
    $("#fontSize").addEventListener("input", (event) => updateSelected({ fontSize: Number(event.target.value) }));
    $("#objectColor").addEventListener("input", (event) => updateSelected({ fill: event.target.value }));
    $("#objectOpacity").addEventListener("input", (event) => updateSelected({ opacity: Number(event.target.value) }));
    $("#boldButton").addEventListener("click", () => { const object = selectedObject(); if (object) updateSelected({ fontWeight: object.fontWeight === "bold" || Number(object.fontWeight) >= 700 ? 400 : 800 }); });
    $("#alignLeftButton").addEventListener("click", () => updateSelected({ textAlign: "left" }));
    $("#alignCenterButton").addEventListener("click", () => updateSelected({ textAlign: "center" }));
    $("#alignRightButton").addEventListener("click", () => updateSelected({ textAlign: "right" }));

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    $("#scheduleDate").min = new Date().toISOString().split("T")[0];
    $("#scheduleDate").value = tomorrow.toISOString().split("T")[0];
  }

  async function start() {
    bindEvents();
    switchRoute(location.hash.replace("#", "") || "generator");
    await initializeAuth();
  }

  start().catch((error) => {
    console.error(error);
    showToast("PostPilot could not start. Check the browser console.");
  });
})();

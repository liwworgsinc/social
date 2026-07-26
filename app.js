(() => {
  "use strict";

  const cfg = window.LIW_STUDIO_CONFIG || {};
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const SERVICES = [
    {
      id: "advertising",
      name: "Business Advertising",
      short: "Ads & promotion",
      icon: "megaphone",
      audience: "local businesses that need more attention and customers",
      problem: "Many good businesses stay invisible because their message is unclear, inconsistent, or not reaching the right people.",
      solution: "LIW Worgs Inc. creates coordinated advertising across social media, websites, print, radio, television, and digital business tools.",
      defaultTopic: "We help local businesses get noticed with social media content, websites, print advertising, digital business cards, radio and television promotion.",
      benefits: ["Stronger visibility", "Professional brand image", "More ways for customers to find you"],
      visuals: "a confident Black small-business owner reviewing professional advertising materials and social media content in a modern Brooklyn office",
      hashtags: ["LIWWorgs", "BrooklynBusiness", "SmallBusinessMarketing", "BusinessAdvertising", "GetNoticed"],
      headlines: ["MAKE YOUR BUSINESS IMPOSSIBLE TO IGNORE.", "GOOD BUSINESS DESERVES GREAT ADVERTISING.", "GET SEEN. GET REMEMBERED. GET CUSTOMERS."]
    },
    {
      id: "web-design",
      name: "Web & Digital Solutions",
      short: "Websites & NFC",
      icon: "monitor-smartphone",
      audience: "business owners who need a professional online presence",
      problem: "An outdated, confusing, or missing website can make a legitimate business look unprepared and cost it valuable leads.",
      solution: "LIW Worgs Inc. builds mobile-friendly websites, landing pages, forms, digital business cards, NFC tools, and online customer experiences.",
      defaultTopic: "We build professional mobile-friendly websites and digital tools that help customers understand, trust, and contact your business.",
      benefits: ["Mobile-friendly design", "Better customer experience", "Clear calls to action"],
      visuals: "a professional Black web designer presenting a polished business website on a desktop monitor and smartphone, modern office, Brooklyn entrepreneur",
      hashtags: ["LIWWorgs", "WebDesign", "BrooklynWebDesigner", "DigitalBusiness", "SmallBusinessWebsite"],
      headlines: ["YOUR WEBSITE SHOULD WORK AS HARD AS YOU DO.", "TURN CLICKS INTO REAL CUSTOMERS.", "BUILD A DIGITAL PRESENCE PEOPLE TRUST."]
    },
    {
      id: "print",
      name: "Print & Graphic Design",
      short: "Flyers, banners & logos",
      icon: "printer",
      audience: "businesses, events, organizations, and professionals that need polished printed materials",
      problem: "Poor-quality graphics and inconsistent print materials can make a strong offer look unprofessional.",
      solution: "LIW Worgs Inc. designs logos, flyers, banners, signs, business cards, menus, labels, and other print-ready marketing materials.",
      defaultTopic: "From logos and flyers to banners and business cards, we create professional print designs that make your business stand out.",
      benefits: ["Print-ready artwork", "Consistent branding", "Professional presentation"],
      visuals: "a stylish display of premium flyers, business cards, banners and branded print materials on a design studio table, Black-owned business branding",
      hashtags: ["LIWWorgs", "GraphicDesign", "BrooklynPrinting", "FlyerDesign", "BusinessBranding"],
      headlines: ["PRINT MATERIALS THAT DEMAND ATTENTION.", "YOUR BRAND SHOULD LOOK PROFESSIONAL EVERYWHERE.", "FROM IDEA TO PRINT-READY DESIGN."]
    },
    {
      id: "real-estate",
      name: "Real Estate Services",
      short: "Sales & rentals",
      icon: "house-key",
      audience: "buyers, sellers, renters, landlords, and property owners in New York",
      problem: "Finding the right property or qualified customer can be stressful when information, communication, and follow-up are scattered.",
      solution: "LIW Worgs Inc. supports residential and commercial sales, rentals, property marketing, and customer guidance from inquiry through the next step.",
      defaultTopic: "Looking to buy, sell, or rent in New York? LIW Worgs Inc. helps you understand your options and move forward confidently.",
      benefits: ["Local market guidance", "Property promotion", "Responsive communication"],
      visuals: "a professional Black real estate advisor standing outside a beautiful Brooklyn brownstone with a confident client, warm daylight, authentic New York neighborhood",
      hashtags: ["LIWWorgs", "BrooklynRealEstate", "NYCRentals", "HomeBuyers", "PropertyForSale"],
      headlines: ["YOUR NEXT MOVE STARTS WITH THE RIGHT GUIDANCE.", "BUY. SELL. RENT. MOVE FORWARD.", "REAL ESTATE SUPPORT BUILT AROUND YOU."]
    },
    {
      id: "property-management",
      name: "Property Management",
      short: "Reliable property support",
      icon: "building-2",
      audience: "landlords and property owners who want dependable day-to-day support",
      problem: "Maintenance coordination, tenant communication, inspections, and recurring property tasks can consume an owner’s time and energy.",
      solution: "LIW Worgs Inc. provides practical property-management support designed to protect the property, improve communication, and reduce owner stress.",
      defaultTopic: "Spend less time chasing property problems. LIW Worgs Inc. helps owners coordinate maintenance, communication, inspections, and recurring property needs.",
      benefits: ["Less owner stress", "Organized communication", "Dependable coordination"],
      visuals: "a professional Black property manager inspecting a clean Brooklyn apartment building with tablet and keys, trustworthy and organized",
      hashtags: ["LIWWorgs", "PropertyManagement", "BrooklynLandlord", "RentalProperty", "PropertyCare"],
      headlines: ["OWN THE PROPERTY—NOT THE DAILY STRESS.", "DEPENDABLE SUPPORT FOR YOUR PROPERTY.", "PROTECT YOUR PROPERTY. SAVE YOUR TIME."]
    },
    {
      id: "taxes",
      name: "Income Tax Services",
      short: "Personal & business taxes",
      icon: "receipt-text",
      audience: "individuals, families, and small-business owners who need organized tax help",
      problem: "Tax paperwork, missed documents, and uncertainty about filing can create stress and expensive mistakes.",
      solution: "LIW Worgs Inc. helps customers organize information, understand the process, and prepare personal or business tax filings accurately.",
      defaultTopic: "Tax time does not have to feel overwhelming. Get organized, understand what you need, and file with professional support from LIW Worgs Inc.",
      benefits: ["Clear guidance", "Organized preparation", "Personal and business support"],
      visuals: "a professional Black tax preparer helping a client review organized financial documents in a welcoming Brooklyn office, calm and trustworthy",
      hashtags: ["LIWWorgs", "TaxPreparation", "BrooklynTaxes", "SmallBusinessTaxes", "TaxHelp"],
      headlines: ["TAX TIME WITHOUT THE CONFUSION.", "GET ORGANIZED. GET PREPARED. GET FILED.", "PROFESSIONAL TAX SUPPORT STARTS HERE."]
    },
    {
      id: "credit",
      name: "Credit Solutions",
      short: "Credit education & disputes",
      icon: "chart-no-axes-combined",
      audience: "people who want to better understand and improve their credit profile",
      problem: "Errors, outdated information, high balances, and a lack of strategy can make credit improvement feel confusing and discouraging.",
      solution: "LIW Worgs Inc. provides credit analysis, education, dispute support, progress tracking, and a practical plan for stronger financial habits.",
      defaultTopic: "Your credit report should tell the correct story. LIW Worgs Inc. helps you review, understand, and address questionable information while building better habits.",
      benefits: ["Credit-report review", "Dispute support", "Education and progress tracking"],
      visuals: "a confident Black financial consultant explaining a credit improvement plan to a client using a tablet, professional office, hopeful and empowering",
      hashtags: ["LIWWorgs", "CreditEducation", "CreditRepair", "FinancialGoals", "BetterCredit"],
      headlines: ["YOUR CREDIT STORY CAN CHANGE.", "UNDERSTAND IT. ADDRESS IT. IMPROVE IT.", "A STRONGER CREDIT PLAN STARTS TODAY."]
    },
    {
      id: "business-loans",
      name: "Business Funding",
      short: "Loan & funding guidance",
      icon: "landmark",
      audience: "entrepreneurs and established businesses exploring funding options",
      problem: "Business owners often need capital but are unsure which funding options fit their goals, qualifications, and repayment ability.",
      solution: "LIW Worgs Inc. helps business owners organize their information, explore possible funding paths, and prepare for conversations with financing providers.",
      defaultTopic: "Need capital to grow, purchase equipment, or manage cash flow? Start by understanding your business-funding options with LIW Worgs Inc.",
      benefits: ["Funding-option guidance", "Document preparation", "Clear next steps"],
      visuals: "a Black entrepreneur and professional business advisor reviewing a growth and funding plan in a modern office, ambitious small business setting",
      hashtags: ["LIWWorgs", "BusinessFunding", "SmallBusinessLoans", "EntrepreneurSupport", "BusinessGrowth"],
      headlines: ["FUND YOUR NEXT BUSINESS MOVE.", "GROWTH NEEDS A PLAN—AND THE RIGHT CAPITAL.", "EXPLORE FUNDING WITH CLARITY."]
    },
    {
      id: "eyeglasses",
      name: "Eyeglasses Repair",
      short: "Just Eyes mobile service",
      icon: "glasses",
      audience: "people who need convenient eyewear repair, adjustment, or frame support",
      problem: "Loose, bent, or damaged glasses are uncomfortable and can disrupt work, driving, reading, and everyday life.",
      solution: "LIW Worgs Inc. and Just Eyes provide practical eyeglasses repair, adjustments, frame support, and convenient service options.",
      defaultTopic: "Do not struggle with uncomfortable or damaged eyewear. Ask about eyeglasses repair, adjustments, frames, and convenient service from Just Eyes.",
      benefits: ["Convenient repair", "Professional adjustment", "Frame and eyewear support"],
      visuals: "a skilled Black optical professional carefully adjusting eyeglasses with precision tools at a clean eyewear repair station, clear focus on the glasses",
      hashtags: ["JustEyes", "LIWWorgs", "EyeglassesRepair", "BrooklynOptical", "GlassesAdjustment"],
      headlines: ["BROKEN OR UNCOMFORTABLE GLASSES? LET’S FIX THAT.", "SEE BETTER. FEEL BETTER. WEAR THEM COMFORTABLY.", "PROFESSIONAL EYEGLASS REPAIR MADE CONVENIENT."]
    }
  ];

  const GOALS = {
    awareness: { label: "Build awareness", hook: "People cannot choose a service they do not know exists.", ending: "Save this post and share it with someone who may need this service." },
    leads: { label: "Get calls and leads", hook: "Ready to stop searching and speak with someone who can help?", ending: "Call now to discuss what you need and the next step." },
    offer: { label: "Promote a special offer", hook: "A better time to take action may be right now.", ending: "Ask about current pricing, availability, or promotional options." },
    education: { label: "Educate customers", hook: "Knowing what to look for can save time, money, and frustration.", ending: "Follow LIW Worgs Inc. for more practical business and service information." },
    trust: { label: "Build trust and credibility", hook: "The right provider should explain the process and treat your goals seriously.", ending: "Choose local support that values clear communication and professional service." },
    urgent: { label: "Create urgency", hook: "Waiting can allow a small problem to become more expensive or harder to solve.", ending: "Contact LIW Worgs Inc. today instead of putting it off again." }
  };

  const TONES = {
    bold: { label: "Bold", opener: "STOP SETTLING FOR A WEAK SOLUTION.", adjective: "direct, confident, energetic" },
    professional: { label: "Professional", opener: "Professional support can make the next step clearer.", adjective: "professional, polished, trustworthy" },
    friendly: { label: "Friendly", opener: "Let’s make this easier for you.", adjective: "warm, welcoming, authentic" },
    premium: { label: "Premium", opener: "Your goals deserve a more polished experience.", adjective: "premium, sophisticated, refined" },
    urgent: { label: "Urgent", opener: "Do not wait until the problem gets worse.", adjective: "urgent, high-impact, action-oriented" }
  };

  const PLATFORMS = {
    instagram: { label: "Instagram", size: "square" },
    facebook: { label: "Facebook", size: "landscape" },
    linkedin: { label: "LinkedIn", size: "landscape" },
    story: { label: "Story", size: "story" }
  };

  const TEMPLATES = ["impact", "split", "glass", "light", "offer", "local", "editorial", "blueprint"];
  const state = {
    service: SERVICES[0],
    captions: [],
    selectedCaption: 0,
    imageUrl: "",
    imagePrompt: "",
    imageStyle: "commercial",
    template: "impact",
    canvasSize: "square",
    saved: loadSaved(),
    campaign: []
  };

  function loadSaved() {
    try { return JSON.parse(localStorage.getItem("liw_ad_studio_saved") || "[]"); }
    catch { return []; }
  }

  function persistSaved() {
    localStorage.setItem("liw_ad_studio_saved", JSON.stringify(state.saved.slice(0, 15)));
    $("#savedBadge").textContent = state.saved.length;
  }

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function setLoading(active, title = "Creating your image", text = "This may take a moment.") {
    $("#loadingOverlay").classList.toggle("active", active);
    $("#loadingOverlay").setAttribute("aria-hidden", String(!active));
    $("#loadingTitle").textContent = title;
    $("#loadingText").textContent = text;
  }

  function switchView(viewName) {
    $$(".view").forEach(view => view.classList.toggle("active", view.id === `${viewName}View`));
    $$(".nav-button").forEach(button => button.classList.toggle("active", button.dataset.view === viewName));
    $(".top-nav")?.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchWorkspace(name) {
    $$(".workspace-tab").forEach(button => button.classList.toggle("active", button.dataset.workspace === name));
    $$(".workspace-panel").forEach(panel => panel.classList.toggle("active", panel.id === `${name}Workspace`));
    if (name === "design") syncDesignFromCurrent();
  }

  function renderServices() {
    const grid = $("#serviceGrid");
    grid.innerHTML = SERVICES.map(service => `
      <button class="service-card${service.id === state.service.id ? " selected" : ""}" data-service="${service.id}">
        <span class="service-icon"><i data-lucide="${service.icon}"></i></span>
        <strong>${escapeHtml(service.name)}</strong>
        <small>${escapeHtml(service.short)}</small>
        <i>✓</i>
      </button>
    `).join("");
    $$(".service-card", grid).forEach(button => button.addEventListener("click", () => selectService(button.dataset.service)));
    lucide.createIcons();
  }

  function selectService(serviceId) {
    state.service = SERVICES.find(service => service.id === serviceId) || SERVICES[0];
    renderServices();
    $("#serviceStatus").textContent = state.service.name;
    $("#postTopic").value = state.service.defaultTopic;
    $("#canvasServiceTag").textContent = state.service.name.toUpperCase();
    $("#campaignServiceName").textContent = state.service.name;
    updateCampaignSummary();
    generatePostPackage();
  }

  function currentSettings() {
    return {
      goal: GOALS[$("#campaignGoal").value] || GOALS.awareness,
      goalId: $("#campaignGoal").value,
      tone: TONES[$("#tone").value] || TONES.bold,
      toneId: $("#tone").value,
      platform: PLATFORMS[$("#platform").value] || PLATFORMS.instagram,
      platformId: $("#platform").value,
      topic: $("#postTopic").value.trim() || state.service.defaultTopic,
      cta: $("#customCta").value.trim() || "Call LIW Worgs Inc. today at 347-423-9364"
    };
  }

  function makeHashtags(service, platformId) {
    if (platformId === "linkedin") return service.hashtags.slice(0, 4).map(tag => `#${tag}`).join(" ");
    return service.hashtags.map(tag => `#${tag}`).join(" ");
  }

  function generateCaptions() {
    const service = state.service;
    const s = currentSettings();
    const hashtags = makeHashtags(service, s.platformId);
    const benefitLine = service.benefits.map(item => `✓ ${item}`).join("\n");

    const concise = `${s.tone.opener}\n\n${s.topic}\n\n${service.solution}\n\n${s.cta}\n\n${hashtags}`;

    const problemSolution = `${s.goal.hook}\n\nTHE PROBLEM:\n${service.problem}\n\nTHE LIW SOLUTION:\n${service.solution}\n\n${benefitLine}\n\n${s.cta}\n\n873 Liberty Ave, Brooklyn, NY 11208\n${hashtags}`;

    const story = `What happens when ${service.audience} finally get the right support?\n\nThey spend less time feeling stuck and more time moving forward.\n\n${s.topic}\n\nAt LIW Worgs Inc., we focus on practical solutions, clear communication, and professional service.\n\n${s.goal.ending}\n\n${s.cta}\n\n${hashtags}`;

    state.captions = [
      { name: "Direct", tag: "High impact", text: concise },
      { name: "Problem–Solution", tag: "Best default", text: problemSolution },
      { name: "Trust Story", tag: "Relationship", text: story }
    ];
    state.selectedCaption = 1;
    renderCaptions();
  }

  function renderCaptions() {
    const wrap = $("#captionOptions");
    wrap.innerHTML = state.captions.map((caption, index) => `
      <article class="caption-option${index === state.selectedCaption ? " selected" : ""}" data-caption-index="${index}">
        <div class="caption-option-header"><strong>${caption.name}</strong><span>${caption.tag}</span></div>
        <p>${escapeHtml(caption.text.length > 430 ? `${caption.text.slice(0, 430)}…` : caption.text)}</p>
        <button>${index === state.selectedCaption ? "Selected" : "Use this caption"}</button>
      </article>
    `).join("");
    $$(".caption-option", wrap).forEach(card => card.addEventListener("click", () => selectCaption(Number(card.dataset.captionIndex))));
    const selected = state.captions[state.selectedCaption]?.text || "";
    $("#finalCaption").value = selected;
    updateCaptionCount();
  }

  function selectCaption(index) {
    state.selectedCaption = index;
    renderCaptions();
  }

  function updateCaptionCount() {
    $("#captionCount").textContent = `${$("#finalCaption").value.length} characters`;
  }

  function buildImagePrompt() {
    const service = state.service;
    const s = currentSettings();
    const styleInstructions = {
      commercial: "polished commercial advertising photography, crisp lighting, clean composition, room for text overlay",
      photorealistic: "highly photorealistic documentary-style photography, authentic people, natural skin texture, realistic New York setting",
      local: "authentic Brooklyn neighborhood atmosphere, diverse local community, warm natural light, credible small-business advertising",
      premium: "premium luxury advertising photography, sophisticated lighting, refined composition, dark navy and subtle gold visual accents",
      "3d": "modern 3D commercial illustration, realistic materials, dynamic depth, polished advertising render, navy blue and gold accent details",
      editorial: "high-end editorial magazine photography, striking composition, cinematic contrast, authentic professional subject"
    };
    const sizeNote = s.platformId === "story" ? "vertical 9:16 composition" : s.platformId === "facebook" || s.platformId === "linkedin" ? "wide 1.91:1 composition" : "square 1:1 composition";
    return `Create an original advertising background image for LIW Worgs Inc. promoting ${service.name}. Scene: ${service.visuals}. ${styleInstructions[state.imageStyle]}. ${sizeNote}. Use a professional color atmosphere compatible with dark navy blue, royal blue, white, and gold branding. No logos, no readable text, no watermarks, no extra fingers, no distorted objects. Leave clean negative space where a headline can be added. The image should feel trustworthy, modern, useful, and appropriate for a real Brooklyn service business.`;
  }

  function updateImagePrompt() {
    state.imagePrompt = buildImagePrompt();
    $("#imagePrompt").value = state.imagePrompt;
  }

  function generatePostPackage() {
    generateCaptions();
    updateImagePrompt();
    const serviceHeadline = state.service.headlines[Math.floor(Math.random() * state.service.headlines.length)];
    $("#designHeadlineInput").value = serviceHeadline;
    $("#designSubtextInput").value = currentSettings().topic;
    $("#canvasHeadline").textContent = serviceHeadline;
    $("#canvasSubtext").textContent = currentSettings().topic;
    $("#canvasKicker").textContent = currentSettings().goal.label.toUpperCase();
    $("#canvasServiceTag").textContent = state.service.name.toUpperCase();
    if (!state.imageUrl) useAbstractBackground(false);
    switchWorkspace("copy");
    showToast("Post package created for LIW Worgs Inc.");
  }

  function abstractSvg(service, accent = "#f5b301") {
    const title = service.name.toUpperCase().replace(/&/g, "AND");
    const icon = service.id === "real-estate" ? "⌂" : service.id === "eyeglasses" ? "◉—◉" : service.id === "taxes" ? "$" : "LIW";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1400" viewBox="0 0 1400 1400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#061329"/><stop offset=".58" stop-color="#123e77"/><stop offset="1" stop-color="#1871dc"/></linearGradient>
        <radialGradient id="r" cx="70%" cy="20%" r="70%"><stop stop-color="#ffffff" stop-opacity=".25"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1400" height="1400" fill="url(#g)"/>
      <circle cx="1120" cy="160" r="410" fill="url(#r)"/>
      <circle cx="1120" cy="160" r="300" fill="none" stroke="${accent}" stroke-width="8" opacity=".65"/>
      <circle cx="1120" cy="160" r="230" fill="none" stroke="#fff" stroke-width="2" opacity=".26"/>
      <path d="M-80 1110 C330 810 560 1350 970 1030 S1510 800 1520 800 V1460 H-80Z" fill="${accent}" opacity=".16"/>
      <path d="M0 1220 C360 1000 620 1430 1010 1110 S1430 960 1430 960" fill="none" stroke="#fff" stroke-width="5" opacity=".17"/>
      <g transform="translate(900 790)"><rect x="0" y="0" width="330" height="330" rx="72" fill="${accent}"/><text x="165" y="194" text-anchor="middle" font-family="Arial" font-size="92" font-weight="800" fill="#08172f">${icon}</text></g>
      <text x="85" y="1230" font-family="Arial" font-size="24" font-weight="700" letter-spacing="6" fill="#fff" opacity=".45">${title}</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function useAbstractBackground(notify = true) {
    const url = abstractSvg(state.service, $("#accentColor")?.value || "#f5b301");
    setImage(url);
    if (notify) showToast("LIW branded graphic background applied.");
  }

  function setImage(url) {
    state.imageUrl = url;
    const image = $("#generatedImage");
    image.src = url;
    $("#imagePreview").classList.add("has-image");
    $("#downloadRawImageButton").disabled = false;
    applyCanvasBackground();
  }

  function applyCanvasBackground() {
    const bg = $("#canvasBackground");
    if (state.imageUrl) bg.style.backgroundImage = `url("${state.imageUrl.replace(/"/g, "%22")}")`;
    bg.style.transform = `scale(${$("#imageZoom").value / 100})`;
    bg.style.backgroundPosition = `center ${$("#imagePosition").value}%`;
  }

  async function generateAiImage() {
    const prompt = $("#imagePrompt").value.trim();
    if (!prompt) return showToast("Add an image prompt first.");
    if (!cfg.supabaseUrl || !cfg.supabasePublishableKey) return showToast("Supabase image configuration is missing.");

    const size = currentSettings().platformId === "story" ? "1024x1536" : currentSettings().platformId === "facebook" || currentSettings().platformId === "linkedin" ? "1536x1024" : "1024x1024";
    setLoading(true, "Generating the LIW advertising image", "The secure Supabase function is contacting the image model.");
    $("#aiStatus").classList.remove("ready");

    try {
      const response = await fetch(`${cfg.supabaseUrl}/functions/v1/${cfg.imageFunction || "liw-generate-image"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": cfg.supabasePublishableKey,
          "Authorization": `Bearer ${cfg.supabasePublishableKey}`,
          "x-liw-studio-key": cfg.studioKey || ""
        },
        body: JSON.stringify({ prompt, size, quality: "medium" })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Image generation failed.");
      if (!data.imageBase64) throw new Error("The image service returned no image.");
      setImage(`data:${data.mimeType || "image/png"};base64,${data.imageBase64}`);
      $("#aiStatus").classList.add("ready");
      $("#aiStatus").innerHTML = '<i data-lucide="circle-check"></i>AI image generated';
      lucide.createIcons();
      showToast("AI advertising image generated.");
    } catch (error) {
      console.error(error);
      useAbstractBackground(false);
      showToast(`${error.message} A branded background was applied instead.`);
    } finally {
      setLoading(false);
    }
  }

  function handleImageUpload(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return showToast("Choose a PNG, JPG, or WebP image.");
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      showToast("Image uploaded.");
    };
    reader.readAsDataURL(file);
  }

  function downloadDataUrl(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
  }

  function syncDesignFromCurrent() {
    const headline = $("#designHeadlineInput").value.trim() || state.service.headlines[0];
    const subtext = $("#designSubtextInput").value.trim() || currentSettings().topic;
    $("#canvasHeadline").textContent = headline;
    $("#canvasSubtext").textContent = subtext;
    $("#canvasServiceTag").textContent = state.service.name.toUpperCase();
    $("#canvasKicker").textContent = currentSettings().goal.label.toUpperCase();
    applyCanvasBackground();
  }

  function renderTemplates() {
    $("#templatePicker").innerHTML = TEMPLATES.map(template => `<button class="template-thumb${template === state.template ? " selected" : ""}" data-template="${template}" title="${template}"></button>`).join("");
    $$(".template-thumb").forEach(button => button.addEventListener("click", () => {
      state.template = button.dataset.template;
      renderTemplates();
      updateCanvasClass();
    }));
  }

  function updateCanvasClass() {
    const canvas = $("#postCanvas");
    canvas.className = `post-canvas size-${state.canvasSize} template-${state.template}`;
    canvas.style.setProperty("--canvas-headline", $("#headlineColor").value);
    canvas.style.setProperty("--canvas-accent", $("#accentColor").value);
  }

  function selectCanvasSize(size) {
    state.canvasSize = size;
    $$("#sizePicker button").forEach(button => button.classList.toggle("selected", button.dataset.size === size));
    updateCanvasClass();
  }

  function resetCanvasLayout() {
    const positions = {
      logo: { x: 0, y: 0 },
      tag: { x: 0, y: 0 },
      copy: { x: 0, y: 0 },
      contact: { x: 0, y: 0 }
    };
    $$(".draggable", $("#postCanvas")).forEach(element => {
      element.style.transform = "translate(0px, 0px)";
      element.dataset.x = "0";
      element.dataset.y = "0";
    });
    $("#extraElements").innerHTML = "";
    showToast("Design layout reset.");
  }

  function initInteract() {
    if (!window.interact) return;
    interact(".draggable").draggable({
      modifiers: [interact.modifiers.restrictRect({ restriction: "parent", endOnly: true })],
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.dataset.x) || 0) + event.dx;
          const y = (parseFloat(target.dataset.y) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.dataset.x = String(x);
          target.dataset.y = String(y);
        }
      }
    });
    interact(".resizable, .extra-element").resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      modifiers: [interact.modifiers.restrictEdges({ outer: "parent" }), interact.modifiers.restrictSize({ min: { width: 80, height: 34 } })],
      listeners: {
        move(event) {
          const target = event.target;
          let x = parseFloat(target.dataset.x) || 0;
          let y = parseFloat(target.dataset.y) || 0;
          target.style.width = `${event.rect.width}px`;
          target.style.height = `${event.rect.height}px`;
          x += event.deltaRect.left;
          y += event.deltaRect.top;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.dataset.x = String(x);
          target.dataset.y = String(y);
        }
      }
    });
  }

  function addExtraElement(type) {
    const id = `extra-${Date.now()}`;
    const el = document.createElement("div");
    el.id = id;
    el.className = `extra-element ${type}`;
    el.contentEditable = "true";
    el.textContent = type === "badge" ? "CALL NOW" : "Double-click to edit";
    el.style.left = type === "badge" ? "63%" : "12%";
    el.style.top = type === "badge" ? "19%" : "68%";
    el.dataset.x = "0";
    el.dataset.y = "0";
    $("#extraElements").append(el);
    initInteract();
    showToast(`${type === "badge" ? "Badge" : "Text"} added. Click the words to edit.`);
  }

  async function renderCanvas(scale = 2.5) {
    return html2canvas($("#postCanvas"), { scale, useCORS: true, backgroundColor: null, logging: false });
  }

  async function downloadPost() {
    setLoading(true, "Preparing high-resolution post", "Rendering the finished LIW design as a PNG.");
    try {
      const canvas = await renderCanvas(3);
      downloadDataUrl(canvas.toDataURL("image/png", 1), `liw-${state.service.id}-${state.canvasSize}-${Date.now()}.png`);
      showToast("Finished post downloaded.");
    } catch (error) {
      console.error(error);
      showToast("The design could not be exported. Try using an uploaded image or branded background.");
    } finally {
      setLoading(false);
    }
  }

  async function savePost() {
    setLoading(true, "Saving LIW post", "Creating a lightweight preview for the browser library.");
    try {
      const canvas = await renderCanvas(1.2);
      const preview = await compressCanvas(canvas, 620, 0.76);
      state.saved.unshift({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        serviceId: state.service.id,
        serviceName: state.service.name,
        headline: $("#designHeadlineInput").value,
        subtext: $("#designSubtextInput").value,
        caption: $("#finalCaption").value,
        template: state.template,
        size: state.canvasSize,
        preview,
        createdAt: new Date().toISOString()
      });
      state.saved = state.saved.slice(0, 15);
      persistSaved();
      renderLibrary();
      showToast("Post saved in this browser.");
    } catch (error) {
      console.error(error);
      showToast("Could not save the post preview.");
    } finally {
      setLoading(false);
    }
  }

  function compressCanvas(sourceCanvas, maxWidth, quality) {
    return new Promise(resolve => {
      const ratio = Math.min(1, maxWidth / sourceCanvas.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(sourceCanvas.width * ratio);
      canvas.height = Math.round(sourceCanvas.height * ratio);
      canvas.getContext("2d").drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    });
  }

  function renderLibrary() {
    $("#savedBadge").textContent = state.saved.length;
    const grid = $("#libraryGrid");
    grid.innerHTML = state.saved.map(item => `
      <article class="library-card" data-id="${item.id}">
        <img src="${item.preview}" alt="${escapeHtml(item.serviceName)} post preview">
        <div class="library-card-content">
          <h3>${escapeHtml(item.headline || item.serviceName)}</h3>
          <p>${escapeHtml(item.caption || "")}</p>
          <div class="library-actions">
            <button data-action="copy">Copy caption</button>
            <button data-action="reopen">Reopen</button>
            <button data-action="delete">Delete</button>
          </div>
        </div>
      </article>
    `).join("");
    $$(".library-card", grid).forEach(card => {
      const item = state.saved.find(saved => saved.id === card.dataset.id);
      $$("button", card).forEach(button => button.addEventListener("click", () => handleLibraryAction(button.dataset.action, item)));
    });
  }

  function handleLibraryAction(action, item) {
    if (!item) return;
    if (action === "copy") return copyText(item.caption);
    if (action === "delete") {
      state.saved = state.saved.filter(saved => saved.id !== item.id);
      persistSaved();
      renderLibrary();
      return showToast("Saved post deleted.");
    }
    const service = SERVICES.find(entry => entry.id === item.serviceId) || SERVICES[0];
    state.service = service;
    state.template = item.template || "impact";
    state.canvasSize = item.size || "square";
    $("#designHeadlineInput").value = item.headline || service.headlines[0];
    $("#designSubtextInput").value = item.subtext || service.defaultTopic;
    $("#finalCaption").value = item.caption || "";
    renderServices();
    renderTemplates();
    selectCanvasSize(state.canvasSize);
    syncDesignFromCurrent();
    switchView("create");
    switchWorkspace("design");
    showToast("Saved post reopened. The original background preview remains in the library card.");
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => showToast("Copied to clipboard.")).catch(() => {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      showToast("Copied to clipboard.");
    });
  }

  function updateCampaignSummary() {
    const s = currentSettings();
    $("#campaignServiceName").textContent = state.service.name;
    $("#campaignGoalName").textContent = s.goal.label;
    $("#campaignPlatformName").textContent = s.platform.label;
  }

  function generateCampaign() {
    const service = state.service;
    const s = currentSettings();
    const themes = [
      { type: "Problem", title: `The real cost of ignoring ${service.name.toLowerCase()}`, body: `${service.problem}\n\n${s.cta}` },
      { type: "Solution", title: `A better way to handle ${service.name.toLowerCase()}`, body: `${service.solution}\n\n${s.cta}` },
      { type: "Benefits", title: `Three reasons to choose LIW`, body: `${service.benefits.map((benefit, index) => `${index + 1}. ${benefit}`).join("\n")}\n\n${s.cta}` },
      { type: "Education", title: `What customers should know`, body: `${s.topic}\n\nKnowing the process before you begin can save time and reduce confusion.\n\n${s.cta}` },
      { type: "Trust", title: `Local service. Clear communication.`, body: `LIW Worgs Inc. serves Brooklyn and the surrounding New York community with practical support and professional service.\n\n${s.cta}` },
      { type: "FAQ", title: `Do you need help with ${service.name.toLowerCase()}?`, body: `Start with a conversation about your situation, goals, timing, and the result you need. We will explain the next step clearly.\n\n${s.cta}` },
      { type: "Action", title: service.headlines[0], body: `${s.goal.hook}\n\n${s.topic}\n\n${s.goal.ending}\n\n${s.cta}` }
    ];
    state.campaign = themes.map((theme, index) => ({
      day: index + 1,
      ...theme,
      caption: `${theme.body}\n\n${makeHashtags(service, s.platformId)}`
    }));
    renderCampaign();
    showToast("Seven-day LIW campaign created.");
  }

  function renderCampaign() {
    const grid = $("#campaignGrid");
    grid.innerHTML = state.campaign.map(item => `
      <article class="campaign-card">
        <div class="campaign-card-top"><span class="campaign-day">DAY ${item.day}</span><h3>${escapeHtml(item.title)}</h3><span>${escapeHtml(item.type)} post</span></div>
        <div class="campaign-card-body"><p>${escapeHtml(item.caption)}</p><div class="campaign-card-actions"><button data-copy="${item.day}">Copy</button><button data-design="${item.day}">Design</button></div></div>
      </article>
    `).join("");
    $$('[data-copy]', grid).forEach(button => button.addEventListener("click", () => copyText(state.campaign[Number(button.dataset.copy) - 1].caption)));
    $$('[data-design]', grid).forEach(button => button.addEventListener("click", () => {
      const item = state.campaign[Number(button.dataset.design) - 1];
      $("#finalCaption").value = item.caption;
      $("#designHeadlineInput").value = item.title;
      $("#designSubtextInput").value = item.body.split("\n\n")[0];
      syncDesignFromCurrent();
      switchView("create");
      switchWorkspace("design");
    }));
  }

  function bindEvents() {
    $$(".nav-button").forEach(button => button.addEventListener("click", () => switchView(button.dataset.view)));
    $("#mobileMenu").addEventListener("click", () => $(".top-nav").classList.toggle("open"));
    $$(".workspace-tab").forEach(button => button.addEventListener("click", () => switchWorkspace(button.dataset.workspace)));
    $$('[data-next-workspace]').forEach(button => button.addEventListener("click", () => switchWorkspace(button.dataset.nextWorkspace)));

    $("#generatePostButton").addEventListener("click", generatePostPackage);
    $("#regenerateCopyButton").addEventListener("click", generatePostPackage);
    $("#finalCaption").addEventListener("input", updateCaptionCount);
    $("#copyCaptionButton").addEventListener("click", () => copyText($("#finalCaption").value));

    $("#campaignGoal").addEventListener("change", () => { updateCampaignSummary(); updateImagePrompt(); });
    $("#platform").addEventListener("change", () => { updateCampaignSummary(); updateImagePrompt(); selectCanvasSize(PLATFORMS[$("#platform").value].size); });
    $("#tone").addEventListener("change", updateImagePrompt);
    $("#postTopic").addEventListener("input", () => { $("#designSubtextInput").value = $("#postTopic").value; });

    $$("#stylePicker button").forEach(button => button.addEventListener("click", () => {
      state.imageStyle = button.dataset.style;
      $$("#stylePicker button").forEach(item => item.classList.toggle("selected", item === button));
      updateImagePrompt();
    }));
    $("#generateImageButton").addEventListener("click", generateAiImage);
    $("#imageUpload").addEventListener("change", event => handleImageUpload(event.target.files[0]));
    $("#useAbstractButton").addEventListener("click", () => useAbstractBackground());
    $("#downloadRawImageButton").addEventListener("click", () => state.imageUrl && downloadDataUrl(state.imageUrl, `liw-${state.service.id}-image.png`));

    $("#designHeadlineInput").addEventListener("input", syncDesignFromCurrent);
    $("#designSubtextInput").addEventListener("input", syncDesignFromCurrent);
    $("#headlineColor").addEventListener("input", updateCanvasClass);
    $("#accentColor").addEventListener("input", () => { updateCanvasClass(); if (state.imageUrl.startsWith("data:image/svg")) useAbstractBackground(false); });
    $("#imageZoom").addEventListener("input", applyCanvasBackground);
    $("#imagePosition").addEventListener("input", applyCanvasBackground);
    $$("#sizePicker button").forEach(button => button.addEventListener("click", () => selectCanvasSize(button.dataset.size)));
    $("#addBadgeButton").addEventListener("click", () => addExtraElement("badge"));
    $("#addTextButton").addEventListener("click", () => addExtraElement("text"));
    $("#resetLayoutButton").addEventListener("click", resetCanvasLayout);
    $("#downloadPostButton").addEventListener("click", downloadPost);
    $("#savePostButton").addEventListener("click", savePost);

    $("#generateCampaignButton").addEventListener("click", generateCampaign);
    $("#clearLibraryButton").addEventListener("click", () => {
      state.saved = [];
      persistSaved();
      renderLibrary();
      showToast("Saved-post library cleared.");
    });
  }

  function init() {
    $("#postTopic").value = state.service.defaultTopic;
    renderServices();
    renderTemplates();
    renderLibrary();
    persistSaved();
    generatePostPackage();
    selectCanvasSize(PLATFORMS[$("#platform").value].size);
    bindEvents();
    initInteract();
    updateCampaignSummary();
    lucide.createIcons();
  }

  init();
})();

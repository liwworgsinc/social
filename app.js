(() => {
  "use strict";
  const cfg = window.LIW_STUDIO_CONFIG || {};
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  const SERVICES = [
    {id:"advertising",name:"Business Advertising",kicker:"BROOKLYN BUSINESS SOLUTIONS",message:"We help local businesses get noticed with social media content, websites, print advertising, digital business cards, radio and television promotion.",problem:"Too many good businesses are invisible because their message is weak or inconsistent.",solution:"LIW Worgs Inc. creates coordinated advertising that helps your business get seen, remembered and contacted.",audience:"local business owners",visual:"a confident Black small-business owner reviewing polished advertising materials in a modern Brooklyn office",headlines:["MAKE YOUR BUSINESS IMPOSSIBLE TO IGNORE.","GOOD BUSINESS DESERVES GREAT ADVERTISING.","GET SEEN. GET REMEMBERED. GET CUSTOMERS."],hashtags:["#LIWWorgs","#BrooklynBusiness","#BusinessAdvertising","#SmallBusinessMarketing"]},
    {id:"web",name:"Web & Digital Solutions",kicker:"WEBSITES THAT WORK",message:"We build professional mobile-friendly websites, landing pages, digital business cards, forms and NFC tools for small businesses.",problem:"An outdated or missing website can make a legitimate business look unprepared and cost valuable leads.",solution:"LIW builds clear, mobile-friendly digital experiences that help customers trust and contact your business.",audience:"business owners who need a stronger online presence",visual:"a professional Black web designer presenting a polished business website on a desktop monitor and smartphone",headlines:["YOUR WEBSITE SHOULD WORK AS HARD AS YOU DO.","TURN CLICKS INTO REAL CUSTOMERS.","BUILD A DIGITAL PRESENCE PEOPLE TRUST."],hashtags:["#LIWWorgs","#WebDesign","#BrooklynWebDesigner","#DigitalBusiness"]},
    {id:"print",name:"Print & Graphic Design",kicker:"DESIGN THAT GETS NOTICED",message:"From logos and flyers to banners, signs and business cards, we create professional print-ready designs.",problem:"Weak graphics can make a strong business or offer look unprofessional.",solution:"LIW creates polished, consistent visuals that make your brand look ready for business everywhere.",audience:"businesses and organizations that need professional marketing materials",visual:"premium flyers, business cards, banners and branded print materials arranged in a modern design studio",headlines:["PRINT MATERIALS THAT DEMAND ATTENTION.","YOUR BRAND SHOULD LOOK PROFESSIONAL EVERYWHERE.","FROM IDEA TO PRINT-READY DESIGN."],hashtags:["#LIWWorgs","#GraphicDesign","#BrooklynPrinting","#BusinessBranding"]},
    {id:"realestate",name:"Real Estate Services",kicker:"NEW YORK REAL ESTATE SUPPORT",message:"Looking to buy, sell or rent? LIW Worgs Inc. helps you understand your options and move forward confidently.",problem:"Property searches and transactions become stressful when communication and information are scattered.",solution:"LIW provides local guidance, property promotion and responsive support from inquiry through the next step.",audience:"buyers, sellers, renters and landlords",visual:"a professional Black real estate advisor outside a beautiful Brooklyn brownstone with a confident client",headlines:["YOUR NEXT MOVE STARTS WITH THE RIGHT GUIDANCE.","BUY. SELL. RENT. MOVE FORWARD.","REAL ESTATE SUPPORT BUILT AROUND YOU."],hashtags:["#LIWWorgs","#BrooklynRealEstate","#NYCRentals","#HomeSearch"]},
    {id:"property",name:"Property Management",kicker:"DEPENDABLE PROPERTY SUPPORT",message:"LIW helps property owners coordinate maintenance, inspections, communication and recurring property needs.",problem:"Daily property issues can consume an owner’s time and create unnecessary stress.",solution:"LIW provides organized, dependable support designed to protect the property and reduce owner workload.",audience:"landlords and property owners",visual:"a professional Black property manager inspecting a clean Brooklyn apartment building with tablet and keys",headlines:["OWN THE PROPERTY—NOT THE DAILY STRESS.","DEPENDABLE SUPPORT FOR YOUR PROPERTY.","PROTECT YOUR PROPERTY. SAVE YOUR TIME."],hashtags:["#LIWWorgs","#PropertyManagement","#BrooklynLandlord","#PropertyCare"]},
    {id:"tax",name:"Income Tax Services",kicker:"PERSONAL & BUSINESS TAX SUPPORT",message:"Get organized, understand what you need and prepare your personal or business tax filing with professional support.",problem:"Tax paperwork and missed documents can create stress, delays and costly mistakes.",solution:"LIW helps customers organize information and approach tax preparation with greater clarity.",audience:"individuals, families and business owners",visual:"a professional Black tax preparer helping a client review organized financial documents in a welcoming office",headlines:["TAX TIME WITHOUT THE CONFUSION.","GET ORGANIZED. GET PREPARED. GET FILED.","PROFESSIONAL TAX SUPPORT STARTS HERE."],hashtags:["#LIWWorgs","#TaxPreparation","#BrooklynTaxes","#SmallBusinessTaxes"]},
    {id:"credit",name:"Credit Solutions",kicker:"A CLEARER CREDIT PLAN",message:"Review your credit report, understand questionable information and build practical financial habits with LIW support.",problem:"Errors, outdated information and a lack of strategy can make credit improvement feel discouraging.",solution:"LIW offers credit analysis, education, dispute support and progress tracking.",audience:"people working toward stronger credit",visual:"a confident Black financial consultant explaining a credit improvement plan to a client using a tablet",headlines:["YOUR CREDIT STORY CAN CHANGE.","UNDERSTAND IT. ADDRESS IT. IMPROVE IT.","A STRONGER CREDIT PLAN STARTS TODAY."],hashtags:["#LIWWorgs","#CreditEducation","#CreditSolutions","#FinancialGoals"]},
    {id:"funding",name:"Business Funding",kicker:"FUND YOUR NEXT MOVE",message:"Understand possible funding paths, organize your business information and prepare for financing conversations.",problem:"Business owners often need capital but do not know which options fit their goals and qualifications.",solution:"LIW helps entrepreneurs explore funding possibilities with clearer information and next steps.",audience:"entrepreneurs and growing businesses",visual:"a Black entrepreneur and professional advisor reviewing a business growth and funding plan in a modern office",headlines:["FUND YOUR NEXT BUSINESS MOVE.","GROWTH NEEDS A PLAN—AND THE RIGHT CAPITAL.","EXPLORE FUNDING WITH CLARITY."],hashtags:["#LIWWorgs","#BusinessFunding","#EntrepreneurSupport","#BusinessGrowth"]},
    {id:"eyeglasses",name:"Eyeglasses Repair",kicker:"JUST EYES MOBILE SERVICE",message:"Convenient eyewear repair, adjustment and frame support from LIW Worgs Inc. and Just Eyes.",problem:"Broken or poorly fitting eyewear can interrupt your day and be difficult to repair quickly.",solution:"LIW provides convenient eyeglasses repair and adjustment support with practical service options.",audience:"people who need fast, convenient eyewear help",visual:"a skilled Black optical professional carefully repairing and adjusting eyeglasses at a clean workbench",headlines:["BROKEN GLASSES? LET’S FIX THAT.","SEE CLEARLY. WEAR COMFORTABLY.","CONVENIENT EYEWEAR REPAIR STARTS HERE."],hashtags:["#LIWWorgs","#JustEyes","#EyeglassesRepair","#BrooklynOptical"]}
  ];

  const LAYOUTS = [
    {id:"executive",name:"Executive Split"},{id:"poster",name:"Bold Poster"},{id:"editorial",name:"Editorial"},{id:"local",name:"Local Business"},{id:"premium",name:"Premium"},{id:"offer",name:"Offer Blast"}
  ];

  const state = {
    service: SERVICES[0], layout:"executive", format:"square", image:null, zoom:.90,
    subjects:[], selectedSubject:"", recipients:[], saved:loadJSON("liw_marketing_saved",[]), currentEmail:""
  };

  const goalHooks = {
    leads:["Ready to get more calls and qualified leads?","Your next customer may already be looking for you.","Make it easier for customers to choose your business."],
    awareness:["People cannot choose a business they never notice.","Strong visibility starts with a clear message.","Let more people know what your business can do."],
    offer:["A better way to move forward is available now.","This is the right time to take the next step.","Do not miss the opportunity to improve your results."],
    trust:["Professional presentation builds professional trust.","Customers notice how a business communicates.","Credibility starts before the first conversation."],
    education:["Here is what more customers should know.","The right information can prevent expensive mistakes.","Understanding the process makes the next step easier."]
  };

  function loadJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
  function saveJSON(){localStorage.setItem("liw_marketing_saved",JSON.stringify(state.saved))}
  function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function clean(v=""){return String(v).replace(/\s+/g," ").trim()}
  function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),2400)}
  function setLoading(show,title="Working",text="Please wait."){const o=$("#loadingOverlay");o.classList.toggle("show",show);o.setAttribute("aria-hidden",String(!show));$("#loadingTitle").textContent=title;$("#loadingText").textContent=text}
  function copy(text){navigator.clipboard?.writeText(text).then(()=>showToast("Copied to clipboard.")).catch(()=>{const a=document.createElement("textarea");a.value=text;document.body.append(a);a.select();document.execCommand("copy");a.remove();showToast("Copied to clipboard.")})}
  function download(content,name,type="text/plain"){const blob=new Blob([content],{type});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}

  function initialize(){
    populateServices();renderLayouts();bind();applyService(true);generateEmail();renderCampaign();renderLibrary();updateSavedCount();setZoom();lucide.createIcons();
  }

  function populateServices(){
    const options=SERVICES.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("");
    $("#serviceSelect").innerHTML=options;$("#emailService").innerHTML=options;
  }

  function renderLayouts(){
    $("#layoutPicker").innerHTML=LAYOUTS.map(l=>`<button class="layout-card ${l.id===state.layout?"active":""}" data-layout="${l.id}"><span class="layout-mini ${l.id}"></span><strong>${l.name}</strong></button>`).join("");
    $$(".layout-card").forEach(b=>b.addEventListener("click",()=>{state.layout=b.dataset.layout;applyLayout()}));
  }

  function bind(){
    $$(".nav-item").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
    $("#menuButton").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
    $("#serviceSelect").addEventListener("change",e=>{state.service=SERVICES.find(s=>s.id===e.target.value)||SERVICES[0];applyService(true)});
    $("#goalSelect").addEventListener("change",generateCopy);
    $("#toneSelect").addEventListener("change",generateCopy);
    $("#formatSelect").addEventListener("change",e=>{state.format=e.target.value;applyFormat()});
    $("#generateCopy").addEventListener("click",generateCopy);
    ["headlineInput","subtextInput","ctaInput"].forEach(id=>$("#"+id).addEventListener("input",updateCanvasCopy));
    $("#copyCaption").addEventListener("click",()=>copy($("#captionInput").value));
    $("#imageUpload").addEventListener("change",uploadImage);
    $("#generateImage").addEventListener("click",generateImage);
    $("#useBrandArt").addEventListener("click",useBrandArt);
    $("#clearImage").addEventListener("click",()=>setImage(null));
    $("#zoomIn").addEventListener("click",()=>{state.zoom=Math.min(1.08,state.zoom+.08);setZoom()});
    $("#zoomOut").addEventListener("click",()=>{state.zoom=Math.max(.45,state.zoom-.08);setZoom()});
    $("#downloadPost").addEventListener("click",downloadPost);
    $("#loadDemo").addEventListener("click",()=>{state.service=SERVICES[0];$("#serviceSelect").value="advertising";applyService(true);useBrandArt();showToast("LIW advertising demo loaded.")});
    $("#quickSave").addEventListener("click",quickSave);

    $("#emailService").addEventListener("change",generateEmail);
    ["businessName","contactName","recipientEmail","businessType","emailTemplate","emailOffer","emailTone"].forEach(id=>$("#"+id).addEventListener("input",generateEmail));
    $("#generateEmail").addEventListener("click",generateEmail);
    $("#refreshSubjects").addEventListener("click",generateEmail);
    $("#emailBodyEditor").addEventListener("input",e=>{state.currentEmail=e.target.value;renderEmailPreview()});
    $("#copySubject").addEventListener("click",()=>copy(state.selectedSubject));
    $("#copyEmail").addEventListener("click",()=>copy($("#emailBodyEditor").value));
    $("#downloadEmail").addEventListener("click",downloadEmailHtml);
    $("#openMail").addEventListener("click",openMail);
    $("#openGmail").addEventListener("click",openGmail);
    $("#csvUpload").addEventListener("change",readCSV);

    $("#generateCampaign").addEventListener("click",renderCampaign);
    $("#clearLibrary").addEventListener("click",()=>{state.saved=[];saveJSON();renderLibrary();updateSavedCount();showToast("Saved work cleared.")});
  }

  function switchView(view){
    $$(".view").forEach(v=>v.classList.remove("active"));$("#"+view+"View")?.classList.add("active");
    $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
    const titles={post:"Post Studio",email:"Email Studio",campaign:"Campaign Builder",library:"Saved Work"};$("#pageTitle").textContent=titles[view];$("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});
  }

  function applyService(resetCopy=false){
    $("#messageInput").value=state.service.message;$("#imagePrompt").value=makeImagePrompt();
    if(resetCopy)generateCopy();
  }

  function generateCopy(){
    const s=state.service;const goal=$("#goalSelect").value;const tone=$("#toneSelect").value;const custom=clean($("#messageInput").value)||s.message;
    const hook=goalHooks[goal][Math.floor(Math.random()*goalHooks[goal].length)];
    const headline=s.headlines[Math.floor(Math.random()*s.headlines.length)];
    const toneLine={bold:"Stop settling for weak results.",professional:"A clear, professional solution makes the next step easier.",friendly:"Let’s make this simpler for you.",premium:"Your business deserves a more polished experience."}[tone];
    const caption=`${hook}\n\n${toneLine}\n\nTHE PROBLEM\n${s.problem}\n\nTHE LIW SOLUTION\n${s.solution}\n\n${custom}\n\nCall LIW Worgs Inc. at 347-423-9364 or visit liwworgs.com.\n\n${s.hashtags.join(" ")}`;
    $("#headlineInput").value=headline;$("#subtextInput").value=custom;$("#captionInput").value=caption;$("#imagePrompt").value=makeImagePrompt();updateCanvasCopy();showToast("Message package created.");
  }

  function updateCanvasCopy(){
    $("#canvasService").textContent=state.service.name.toUpperCase();$("#canvasKicker").textContent=state.service.kicker;$("#canvasHeadline").textContent=$("#headlineInput").value||state.service.headlines[0];$("#canvasSubtext").textContent=$("#subtextInput").value||state.service.message;$("#canvasCta").textContent=$("#ctaInput").value||"CALL 347-423-9364 TODAY";
  }

  function applyLayout(){
    const c=$("#postCanvas");LAYOUTS.forEach(l=>c.classList.remove("layout-"+l.id));c.classList.add("layout-"+state.layout);$$(".layout-card").forEach(b=>b.classList.toggle("active",b.dataset.layout===state.layout));$("#layoutName").textContent=LAYOUTS.find(l=>l.id===state.layout)?.name||"Layout";
  }

  function applyFormat(){
    const c=$("#postCanvas");["square","portrait","story","landscape"].forEach(f=>c.classList.remove("size-"+f));c.classList.add("size-"+state.format);setZoom();
  }
  function setZoom(){const c=$("#postCanvas");c.style.transform=`scale(${state.zoom})`;$("#zoomLabel").textContent=Math.round(state.zoom*100)+"%"}

  function makeImagePrompt(){
    const s=state.service;const format=$("#formatSelect").value||"square";
    return `Create a premium commercial advertising photograph for LIW Worgs Inc. showing ${s.visual}. Authentic Brooklyn/New York atmosphere, professional Black-owned business representation, clean realistic lighting, confident and trustworthy mood, enough negative space for headline text, no words, no letters, no logos, no watermarks. Composition optimized for a ${format} social media advertisement.`;
  }

  async function generateImage(){
    const prompt=clean($("#imagePrompt").value);if(prompt.length<30)return showToast("Add a more detailed image prompt.");
    const size=state.format==="landscape"?"1536x1024":state.format==="square"?"1024x1024":"1024x1536";
    setLoading(true,"Creating LIW advertising image","Generating a clean commercial visual without text.");
    try{
      const res=await fetch(`${cfg.supabaseUrl}/functions/v1/${cfg.imageFunction}`,{method:"POST",headers:{"Content-Type":"application/json","apikey":cfg.supabasePublishableKey,"x-liw-studio-key":cfg.studioKey},body:JSON.stringify({prompt,size,quality:"medium"})});
      const data=await res.json();if(!res.ok)throw new Error(data.error||"Image generation failed.");setImage(`data:${data.mimeType||"image/png"};base64,${data.imageBase64}`);showToast("AI image added to the design.");
    }catch(error){showToast(error.message);if(!state.image)useBrandArt()}finally{setLoading(false)}
  }

  function uploadImage(event){const file=event.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{setImage(reader.result);showToast("Image uploaded.")};reader.readAsDataURL(file)}
  function setImage(url){state.image=url;const layer=$("#photoLayer"),thumb=$("#imageThumb"),img=$("#imageThumbImg");layer.style.backgroundImage=url?`url("${url}")`:"";if(url){img.src=url;thumb.classList.add("has-image")}else{img.removeAttribute("src");thumb.classList.remove("has-image")}}

  function useBrandArt(){
    const canvas=document.createElement("canvas");canvas.width=1200;canvas.height=1200;const x=canvas.getContext("2d");
    const palettes={advertising:["#06192d","#1670d9","#f4b51f"],web:["#071b37","#1d72e8","#7ec8ff"],print:["#1a1231","#dc3f76","#f6b923"],realestate:["#072c2c","#218c74","#e3b65d"],property:["#12243e","#3c6e91","#e8c16c"],tax:["#14283a","#1f8a70","#f1c75b"],credit:["#201344","#7448d8","#f0b429"],funding:["#092c28","#1a9b72","#e3bd5d"],eyeglasses:["#162138","#4773c9","#f0b429"]};
    const [a,b,c]=palettes[state.service.id]||palettes.advertising;let g=x.createLinearGradient(0,0,1200,1200);g.addColorStop(0,a);g.addColorStop(.62,b);g.addColorStop(1,a);x.fillStyle=g;x.fillRect(0,0,1200,1200);
    x.globalAlpha=.17;x.fillStyle="#fff";x.beginPath();x.arc(980,160,330,0,Math.PI*2);x.fill();x.globalAlpha=.12;x.lineWidth=3;x.strokeStyle="#fff";for(let i=0;i<6;i++){x.beginPath();x.arc(930,200,110+i*55,0,Math.PI*2);x.stroke()}
    x.globalAlpha=.9;x.fillStyle=c;x.beginPath();x.moveTo(0,950);x.lineTo(730,1200);x.lineTo(0,1200);x.closePath();x.fill();x.globalAlpha=.08;x.fillStyle="#fff";for(let i=0;i<9;i++)x.fillRect(80+i*120,90,2,760);
    setImage(canvas.toDataURL("image/png"));showToast("LIW brand artwork applied.");
  }

  async function downloadPost(){
    const c=$("#postCanvas");const old=c.style.transform;c.style.transform="none";setLoading(true,"Exporting post","Rendering a high-resolution PNG.");
    try{const out=await html2canvas(c,{scale:2,useCORS:true,backgroundColor:null,logging:false});const a=document.createElement("a");a.download=`LIW-${state.service.id}-${state.layout}-${state.format}.png`;a.href=out.toDataURL("image/png",1);a.click();showToast("Post downloaded.")}catch(e){showToast("Could not export the design.")}finally{c.style.transform=old;setLoading(false)}
  }

  function emailContext(){return {business:clean($("#businessName").value)||"your business",contact:clean($("#contactName").value)||"Business Owner",email:clean($("#recipientEmail").value),type:$("#businessType").value,template:$("#emailTemplate").value,service:SERVICES.find(s=>s.id===$("#emailService").value)||SERVICES[0],offer:clean($("#emailOffer").value)||"a brief consultation",tone:$("#emailTone").value}}

  function generateEmail(){
    const c=emailContext();const subjects=subjectLines(c);state.subjects=subjects;state.selectedSubject=subjects[0];renderSubjects();
    state.currentEmail=emailBody(c);$("#emailBodyEditor").value=state.currentEmail;$("#previewTo").textContent=c.email?`${c.contact} <${c.email}>`:c.contact;renderEmailPreview();
  }

  function subjectLines(c){
    const n=c.business==="your business"?"your business":c.business;
    const map={
      introduction:[`A local resource for ${n}`,`${n} + LIW Worgs Inc.`,`Ways LIW can support ${n}`],
      "website-audit":[`A quick website opportunity for ${n}`,`Could ${n}'s website generate more leads?`,`A practical digital improvement for ${n}`],
      visibility:[`Helping more local customers find ${n}`,`A visibility idea for ${n}`,`Get ${n} seen by more customers`],
      print:[`Professional marketing materials for ${n}`,`A stronger visual brand for ${n}`,`Flyers, banners and design support for ${n}`],
      partnership:[`A referral partnership idea for ${n}`,`Can LIW support your customers?`,`Local partnership opportunity`],
      "follow-up":[`Following up from LIW Worgs Inc.`,`Next steps for ${n}`,`Checking in regarding ${c.service.name}`],
      offer:[`A special LIW opportunity for ${n}`,`${c.offer} for ${n}`,`An offer to strengthen ${n}`]
    };return map[c.template]||map.introduction;
  }

  function emailBody(c){
    const greeting=c.contact==="Business Owner"?"Hello,":`Hello ${c.contact},`;
    const intro=c.tone==="friendly"?`I hope your week is going well. I’m reaching out from LIW Worgs Inc., a Brooklyn-based business solutions company.`:c.tone==="direct"?`I’m reaching out from LIW Worgs Inc. because we help businesses improve how they present, promote and serve customers.`:`I’m contacting you on behalf of LIW Worgs Inc., a Brooklyn-based company providing practical business and marketing solutions.`;
    const specific={
      introduction:`I came across ${c.business} and wanted to introduce our team. We support ${c.type.toLowerCase()} operators with ${c.service.name.toLowerCase()} and related business services.`,
      "website-audit":`A business website should quickly explain what you do, build trust and make it easy for customers to contact you. We help businesses improve that experience through mobile-friendly websites, landing pages, forms and digital tools.`,
      visibility:`Many strong local businesses are difficult to find online or do not have a consistent message across social media, print and their website. LIW helps create a clearer, more professional advertising presence.`,
      print:`Professional flyers, banners, signs, business cards and branded graphics can make a major difference in how customers view a company. LIW provides design and print-ready marketing support.`,
      partnership:`LIW provides services that may complement what ${c.business} already offers. I would like to explore a simple referral relationship that could create value for both businesses and our customers.`,
      "follow-up":`I wanted to follow up regarding ${c.service.name.toLowerCase()} and see whether this is still something ${c.business} would like to improve.`,
      offer:`We are currently offering ${c.offer}. This could be a useful first step for ${c.business} to review its current marketing and identify practical improvements.`
    }[c.template];
    return `${greeting}\n\n${intro}\n\n${specific}\n\nFor ${c.business}, we can provide ${c.service.name.toLowerCase()} focused on clearer communication, stronger presentation and easier customer response. We are currently offering ${c.offer}.\n\nWould you be open to a short conversation this week? I can explain the options and answer any questions without obligation.\n\nThank you,\nDamion Thomas\nLIW Worgs Inc.\n873 Liberty Ave, Brooklyn, NY 11208\n347-423-9364\nliwworgsinc@gmail.com\nhttps://liwworgs.com`;
  }

  function renderSubjects(){
    $("#subjectOptions").innerHTML=state.subjects.map((s,i)=>`<button class="subject-option ${i===0?"active":""}" data-subject="${esc(s)}">${esc(s)}</button>`).join("");
    $$(".subject-option").forEach(b=>b.addEventListener("click",()=>{state.selectedSubject=b.dataset.subject;$$(".subject-option").forEach(x=>x.classList.toggle("active",x===b));renderEmailPreview()}));
  }

  function renderEmailPreview(){
    $("#previewSubject").textContent=state.selectedSubject;const text=$("#emailBodyEditor").value||state.currentEmail;const html=esc(text).replace(/(https:\/\/liwworgs\.com)/g,'<a href="$1">$1</a>').replace(/\n/g,"<br>");$("#emailBodyPreview").innerHTML=html;
  }

  function openGmail(){const c=emailContext();const url=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(c.email)}&su=${encodeURIComponent(state.selectedSubject)}&body=${encodeURIComponent($("#emailBodyEditor").value)}`;window.open(url,"_blank","noopener")}
  function openMail(){const c=emailContext();window.location.href=`mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent(state.selectedSubject)}&body=${encodeURIComponent($("#emailBodyEditor").value)}`}
  function downloadEmailHtml(){const body=$("#emailBodyEditor").value;const html=`<!doctype html><html><body style="font-family:Arial,sans-serif;color:#1f2d3d;line-height:1.65;max-width:680px;margin:40px auto;padding:24px"><div style="border-top:8px solid #071a2d;padding-top:24px"><div style="display:inline-block;background:#f4b51f;color:#071a2d;font-weight:bold;padding:10px 14px;border-radius:10px">LIW WORGS INC.</div><h2 style="color:#071a2d">${esc(state.selectedSubject)}</h2><p style="white-space:pre-wrap">${esc(body)}</p></div></body></html>`;download(html,`LIW-email-${Date.now()}.html`,`text/html`);showToast("Email HTML downloaded.")}

  function readCSV(event){const file=event.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const lines=String(reader.result).split(/\r?\n/).filter(Boolean);const rows=lines.slice(1).map(line=>parseCSVLine(line)).filter(r=>r.length);state.recipients=rows.map(r=>({business:r[0]||"",contact:r[1]||"",email:r[2]||""})).filter(r=>r.email);renderRecipients();showToast(`${state.recipients.length} contacts imported.`)};reader.readAsText(file)}
  function parseCSVLine(line){const result=[];let value="",quoted=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'&&line[i+1]==='"'){value+='"';i++}else if(ch==='"'){quoted=!quoted}else if(ch===','&&!quoted){result.push(value.trim());value=""}else value+=ch}result.push(value.trim());return result}
  function renderRecipients(){$("#recipientList").innerHTML=state.recipients.slice(0,30).map((r,i)=>`<div class="recipient-chip"><span>${esc(r.business||r.contact)} · ${esc(r.email)}</span><button data-recipient="${i}">Use</button></div>`).join("");$$('[data-recipient]').forEach(b=>b.addEventListener("click",()=>{const r=state.recipients[Number(b.dataset.recipient)];$("#businessName").value=r.business;$("#contactName").value=r.contact;$("#recipientEmail").value=r.email;generateEmail();showToast("Recipient loaded.")}))}

  function renderCampaign(){
    const s=state.service;const days=["Monday: Problem","Tuesday: Education","Wednesday: Service","Thursday: Trust","Friday: Offer","Saturday: Local","Sunday: Call to action"];
    $("#campaignGrid").innerHTML=days.map((d,i)=>{const headline=s.headlines[i%s.headlines.length];const copy=[s.problem,`Three reasons to consider ${s.name.toLowerCase()}: clearer guidance, professional support and practical next steps.`,s.solution,`LIW Worgs Inc. is a Brooklyn-based company focused on practical, responsive service.`,`This week, ask about ${s.name.toLowerCase()} and the best next step for your needs.`,`Brooklyn businesses and residents deserve dependable support close to home.`,`Call 347-423-9364 to discuss ${s.name.toLowerCase()} today.`][i];return `<article class="campaign-card"><span>${d}</span><h3>${esc(headline)}</h3><p>${esc(copy)}</p><button class="button ghost" data-campaign="${i}">Load into Post Studio</button></article>`}).join("");$$('[data-campaign]').forEach(b=>b.addEventListener("click",()=>{const i=Number(b.dataset.campaign);$("#headlineInput").value=s.headlines[i%s.headlines.length];$("#subtextInput").value=$(".campaign-card p",b.closest(".campaign-card")).textContent;updateCanvasCopy();switchView("post");showToast("Campaign idea loaded.")}));lucide.createIcons();
  }

  function quickSave(){
    const active=$(".view.active")?.id;if(active==="emailView")saveEmail();else savePost();
  }
  function savePost(){state.saved.unshift({id:crypto.randomUUID?.()||Date.now(),type:"post",service:state.service.name,headline:$("#headlineInput").value,subtext:$("#subtextInput").value,caption:$("#captionInput").value,layout:state.layout,format:state.format,image:state.image,created:new Date().toISOString()});state.saved=state.saved.slice(0,40);saveJSON();renderLibrary();updateSavedCount();showToast("Post saved in this browser.")}
  function saveEmail(){const c=emailContext();state.saved.unshift({id:crypto.randomUUID?.()||Date.now(),type:"email",business:c.business,recipient:c.email,subject:state.selectedSubject,body:$("#emailBodyEditor").value,created:new Date().toISOString()});state.saved=state.saved.slice(0,40);saveJSON();renderLibrary();updateSavedCount();showToast("Email saved in this browser.")}
  function updateSavedCount(){$("#savedCount").textContent=state.saved.length}
  function renderLibrary(){
    const grid=$("#libraryGrid");if(!state.saved.length){grid.innerHTML=`<article class="panel" style="padding:30px;grid-column:1/-1;text-align:center;color:#6d7b8f">Nothing saved yet. Create a post or email and click Save.</article>`;return}
    grid.innerHTML=state.saved.map((item,i)=>`<article class="library-card">${item.type==="post"?`<div class="library-thumb" style="${item.image?`background-image:url('${item.image}')`:""}"></div>`:""}<div class="library-body"><span>${item.type}</span><h3>${esc(item.type==="post"?item.headline:item.subject)}</h3><p>${esc(item.type==="post"?item.service:`${item.business}${item.recipient?" · "+item.recipient:""}`)}</p><div class="library-actions"><button class="button ghost" data-load="${i}">Load</button><button class="button ghost" data-delete="${i}">Delete</button></div></div></article>`).join("");
    $$('[data-load]').forEach(b=>b.addEventListener("click",()=>loadSaved(Number(b.dataset.load))));$$('[data-delete]').forEach(b=>b.addEventListener("click",()=>{state.saved.splice(Number(b.dataset.delete),1);saveJSON();renderLibrary();updateSavedCount()}));
  }
  function loadSaved(i){const item=state.saved[i];if(item.type==="post"){$("#headlineInput").value=item.headline;$("#subtextInput").value=item.subtext;$("#captionInput").value=item.caption;state.layout=item.layout||"executive";state.format=item.format||"square";$("#formatSelect").value=state.format;setImage(item.image||null);applyLayout();applyFormat();updateCanvasCopy();switchView("post")}else{$("#businessName").value=item.business||"";$("#recipientEmail").value=item.recipient||"";state.selectedSubject=item.subject;state.subjects=[item.subject];state.currentEmail=item.body;$("#emailBodyEditor").value=item.body;renderSubjects();renderEmailPreview();switchView("email")}showToast("Saved work loaded.")}

  initialize();
})();

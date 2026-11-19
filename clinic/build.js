// ============================================================
// GROUNDWORK STUDIOS — CLINIC DRAFT BUILD
// Config-driven static site for a private medical and aesthetics
// clinic. Called from the root build.js. `base` is the URL prefix
// the site is served under: "" on its own domain, "/edgbaston"
// when it sits inside the driveways demo.
// ============================================================

const fs   = require("fs");
const path = require("path");

const SRC = __dirname;

function esc(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

const ICONS = {
  phone:    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  pin:      '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  mail:     '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  check:    '<path d="M20 6 9 17l-5-5"/>',
  arrow:    '<path d="M5 12h14M13 6l6 6-6 6"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  menu:     '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close:    '<path d="M18 6 6 18M6 6l12 12"/>',
  insta:    '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  search:   '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  shield:   '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
};
function icon(name, size = 20) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}
const WA_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";
const waIcon = (s = 24) => `<svg class="icon" width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${WA_PATH}"/></svg>`;

function build({ dist, base = "", site = "edgbaston" }) {
  const SITE = path.join(SRC, "sites", site);
  if (!fs.existsSync(SITE)) throw new Error(`No such site: clinic/sites/${site}`);
  const c    = require(path.join(SITE, "site.config.js"));
  const data = JSON.parse(fs.readFileSync(path.join(SITE, "treatments.json"), "utf8"));
  const year = new Date().getFullYear();
  const u    = (p) => base + p;
  const detailsFile = path.join(SITE, "treatment-details.json");
  const details = fs.existsSync(detailsFile) ? JSON.parse(fs.readFileSync(detailsFile, "utf8")) : {};
  // Wording that differs between clinics. Defaults are the Edgbaston wording.
  const T = Object.assign({
    HERO_CTA: "Book a consultation",
    NAV_BOOK: "Book online",
    CTA_TEXT: "Book a consultation and talk it through with a member of the team, or ask for a call back.",
    CATS_HEADING: "Treatments and medical services",
    CATS_SUB: "Seven areas of care under one roof. Choose one to see everything we offer.",
    BOOK_EYEBROW: "Booking, made simple",
    BOOK_HEADING: "Everything in one place",
    BOOK_LEAD: "Choose a consultation, pick a practitioner and a time, and book. No bouncing between websites.",
    BOOK_STEPS: [
      ["Choose a consultation", "Aesthetic, IV drip, GP or specialist."],
      ["Pick a practitioner and time", "See the real availability."],
      ["Talk it through", "Your treatment plan starts with a conversation."],
    ],
    PRICE_PANEL_TITLE: "Consultation prices",
    PRICE_PANEL_LINK: "See all consultations",
    ABOUT_EYEBROW: "About the clinic",
    ABOUT_HEADING: "Look and feel great for life",
    ABOUT_IMG_ALT: "A doctor talking with a patient in a consultation",
    ABOUT_SECTION_HEADING: "The clinic",
    VISIT_HEADING: "In Edgbaston Village",
    TEAM_SUB: "As listed on the clinic's booking page. Photos and profiles to come.",
    BOOK_HERO_TEXT: "Choose a consultation, pick a practitioner and a time that suits you. Your booking is made with the clinic directly.",
    BOOK_PRICES_NOTE: "Prices as listed on the clinic's booking page, including tax where applicable.",
    TRUST_LABEL: "About the clinic",
    PRICES_FOOT: "Prices as published by the clinic.",
    REQUEST_HEADING: "Request an appointment",
    REQUEST_TEXT: "Tell us what you need and the team will confirm your appointment.",
  }, c.TEXT || {});
  const logoSrc = c.LOGO_FILE || "/images/logo.png";
  // For logos made for dark backgrounds: show them on a coloured plate.
  const logoStyle = c.LOGO_BG ? ` style="background:${esc(c.LOGO_BG)};padding:7px 14px;border-radius:10px;box-sizing:content-box"` : "";
  const cats = data.categories;
  const catName = (id) => cats.find(k => k.id === id).name;
  const treatmentsOf = (id) => data.treatments.filter(t => t.cat === id);

  // ── WhatsApp ────────────────────────────────────────────
  const waOn = !!(c.WHATSAPP_NUMBER && (c.WHATSAPP_OPTIONS || []).length);
  const waText = (msg) => msg.replace(/\{name\}/g, c.BUSINESS_NAME);
  const waLink = (msg) => `https://wa.me/${c.WHATSAPP_NUMBER}?text=${encodeURIComponent(waText(msg))}`;
  const waAbout = (treatment) => waLink(`Hi {name}, I'd like to ask about ${treatment}. Could someone call me back?`);
  function waOptions(cls) {
    return `<ul class="${cls}">
      ${c.WHATSAPP_OPTIONS.map(o => `<li><a href="${esc(waLink(o.message))}" target="_blank" rel="noopener"><span><strong>${esc(o.label)}</strong><small>${esc(o.hint)}</small></span>${icon("arrow", 18)}</a></li>`).join("\n      ")}
    </ul>`;
  }
  function whatsappWidget() {
    if (!waOn) return "";
    return `<div class="wa" id="wa">
  <div class="wa-panel" id="wa-panel" role="dialog" aria-labelledby="wa-title" hidden>
    <div class="wa-head">
      <span class="wa-head-icon">${waIcon(22)}</span>
      <div><h2 id="wa-title">Message us on WhatsApp</h2><p>Pick what it's about and we'll open WhatsApp with the message ready to send.</p></div>
      <button type="button" class="wa-close" id="wa-close" aria-label="Close">${icon("close", 20)}</button>
    </div>
    ${waOptions("wa-options")}
    ${c.DEMO_NOTICE ? '<p class="wa-demo">Draft: this uses a sample number, so no real message will arrive.</p>' : ""}
  </div>
  <button type="button" class="wa-fab" id="wa-fab" aria-expanded="false" aria-controls="wa-panel">${waIcon(26)}<span>WhatsApp</span></button>
</div>`;
  }

  // Data for the front end
  const clientData = { base, themes: c.THEMES, defaultTheme: c.DEFAULT_THEME };
  const dataScript = `<script id="clinic-data" type="application/json">${JSON.stringify(clientData).replace(/</g, "\\u003c")}</script>`;

  // ── shared partials ─────────────────────────────────────
  function head({ title, description, canonical, bodyClass = "" }) {
    const schema = {
      "@context": "https://schema.org", "@type": "MedicalClinic",
      name: c.BUSINESS_NAME, telephone: c.PHONE, email: c.EMAIL,
      address: { "@type": "PostalAddress", streetAddress: c.ADDRESS_LINES[0], addressLocality: c.CITY || "Birmingham", postalCode: c.POSTCODE || "B15 3AU", addressCountry: "GB" },
    };
    return `<!DOCTYPE html>
<html lang="en-GB" data-theme="${c.DEFAULT_THEME}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="noindex, nofollow" />
  <link rel="canonical" href="https://${esc(c.DOMAIN)}${esc(canonical)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script>try{var t=localStorage.getItem("clinic-theme");if(${c.THEMES.map(x => `t==="${x.id}"`).join("||")})document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
  <link rel="stylesheet" href="${u("/css/clinic.css")}" />
  ${c.PALETTE ? `<style>:root,html[data-theme]{${Object.entries(c.PALETTE).map(([k, v]) => `--${k}:${v}`).join(";")}}</style>` : ""}
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
<a class="skip-link" href="#main">Skip to content</a>`;
  }

  function demoBar() {
    if (!c.DEMO_NOTICE) return "";
    return `<div class="demo-bar"><span>${esc(c.DEMO_NOTICE)}</span> <a href="${esc(c.STUDIO_URL)}" target="_blank" rel="noopener">Groundwork Studios</a></div>`;
  }

  const NAV = [
    ["/treatments/", "Treatments"],
    ["/book/",       T.NAV_BOOK],
    ["/about/",      "About"],
    ["/contact/",    "Contact"],
  ];

  function header(current) {
    const links = NAV.map(([href, label]) =>
      `<li><a href="${u(href)}"${href === current ? ' aria-current="page"' : ""}>${label}</a></li>`).join("");
    return `${demoBar()}
<header class="site-header">
  <div class="container header-inner">
    <a href="${u("/")}" class="logo" aria-label="${esc(c.BUSINESS_NAME)} home"><img src="${u(logoSrc)}" alt="${esc(c.LOGO_ALT)}" width="150" height="50"${logoStyle} /></a>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul>${links}</ul>
      <a href="tel:${esc(c.PHONE_HREF)}" class="nav-phone">${icon("phone", 16)} ${esc(c.PHONE)}</a>
    </nav>
    <div class="header-actions">
      <a href="${u("/book/")}" class="btn btn-primary btn-sm">${esc(T.HERO_CTA)}</a>
      <button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">${icon("menu", 22)}</button>
    </div>
  </div>
</header>`;
  }

  function ctaBand() {
    return `<section class="cta-band">
  <div class="container cta-inner">
    <div>
      <h2>Not sure where to start?</h2>
      <p>${esc(T.CTA_TEXT)}</p>
    </div>
    <div class="cta-actions">
      <a href="${u("/book/")}" class="btn btn-gold">${esc(T.HERO_CTA)} ${icon("arrow", 18)}</a>
      <a href="tel:${esc(c.PHONE_HREF)}" class="btn btn-ghost-light">${icon("phone", 18)} ${esc(c.PHONE)}</a>
    </div>
  </div>
</section>`;
  }

  function themeToggle() {
    return `<div class="theme-toggle" id="theme-toggle" role="group" aria-label="Preview colours">
  <span>Colours</span>
  ${c.THEMES.map(t => `<button type="button" data-theme="${t.id}" aria-pressed="${t.id === c.DEFAULT_THEME}"><i class="swatch swatch-${t.id}"></i>${esc(t.label)}</button>`).join("")}
</div>`;
  }

  function footer() {
    return `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <a href="${u("/")}" class="footer-logo"${c.LOGO_BG ? ' style="background:transparent;padding:0"' : ""}><img src="${u(logoSrc)}" alt="${esc(c.LOGO_ALT)}" width="150" height="50"${logoStyle} /></a>
      <p class="footer-about">Private medical and aesthetics clinic in Edgbaston, Birmingham.</p>
      ${c.INSTAGRAM_HANDLE ? `<p class="footer-insta">${icon("insta", 18)} <a href="https://www.instagram.com/${esc(c.INSTAGRAM_HANDLE)}/" target="_blank" rel="noopener">@${esc(c.INSTAGRAM_HANDLE)}</a></p>` : ""}
    </div>
    <div>
      <h3>Visit</h3>
      <p>${c.ADDRESS_LINES.map(esc).join("<br />")}</p>
    </div>
    <div>
      <h3>Contact</h3>
      <p><a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a>${c.EMAIL ? `<br /><a href="mailto:${esc(c.EMAIL)}">${esc(c.EMAIL)}</a>` : ""}</p>
    </div>
    <div>
      <h3>Explore</h3>
      <ul class="footer-links">
        ${NAV.map(([href, label]) => `<li><a href="${u(href)}">${label}</a></li>`).join("")}
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>&copy; ${year} ${esc(c.BUSINESS_NAME)}${c.DEMO_NOTICE ? " (draft concept)" : ""}</span>
    <span>Draft by <a href="${esc(c.STUDIO_URL)}" rel="noopener" target="_blank">Groundwork Studios</a></span>
  </div>
</footer>
<div class="mobile-bar">
  <a href="tel:${esc(c.PHONE_HREF)}" class="mobile-bar-call">${icon("phone", 18)} Call</a>
  <a href="${u("/book/")}" class="mobile-bar-book">${icon("calendar", 18)} ${esc(T.HERO_CTA)}</a>
</div>
${whatsappWidget()}
${c.DEMO_NOTICE && c.THEMES.length > 1 ? themeToggle() : ""}
${dataScript}
<script src="${u("/js/clinic.js")}" defer></script>
</body>
</html>`;
  }

  function pageHero(eyebrow, title, text) {
    return `<section class="page-hero">
  <div class="container">
    <span class="eyebrow">${esc(eyebrow)}</span>
    <h1>${esc(title)}</h1>
    ${text ? `<p>${esc(text)}</p>` : ""}
  </div>
</section>`;
  }

  // First sentence or two of the clinic's own description, kept short for the card.
  function summaryOf(t) {
    const text = ((details[t.slug] || {}).intro || [])[0] || "";
    if (text.length <= 170) return text;
    const cut = text.slice(0, 170);
    const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
    return stop > 70 ? cut.slice(0, stop + 1) : cut.slice(0, cut.lastIndexOf(" ")) + "…";
  }
  const detailHref = (t) => u(`/treatments/${t.cat}/${t.slug}/`);

  function treatmentCard(t) {
    const sum = summaryOf(t);
    return `<article class="tr-card" data-name="${esc(t.name.toLowerCase())}">
      <span class="tr-kind">${esc(t.kind)}</span>
      <h3><a href="${detailHref(t)}">${esc(t.name)}</a></h3>
      <p class="tr-price${t.price ? "" : " tr-price-none"}">${t.price ? esc(t.price) : "Price on consultation"}</p>
      ${sum ? `<p class="tr-summary">${esc(sum)}</p>` : ""}
      <a class="text-link tr-more" href="${detailHref(t)}">Read more ${icon("arrow", 16)}</a>
      <div class="tr-actions">
        <a class="btn btn-primary btn-sm" href="${u("/book/")}">${esc(T.HERO_CTA)}</a>
        ${waOn ? `<a class="btn btn-outline btn-sm" href="${esc(waAbout(t.name))}" target="_blank" rel="noopener">${waIcon(16)} Ask about this</a>` : ""}
      </div>
    </article>`;
  }

  function instagramSection() {
    const posts = c.INSTAGRAM_POSTS || [];
    if (!c.INSTAGRAM_HANDLE || !posts.length) return "";
    const profile = `https://www.instagram.com/${c.INSTAGRAM_HANDLE}/`;
    return `<section class="section section-tint" id="instagram">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">From our Instagram</span>
        <h2>See what we've been up to</h2>
        <p>Recent posts from the clinic. Follow us for updates, information and news.</p>
      </div>
      ${posts.length ? `<div class="ig-row" tabindex="0" aria-label="Instagram posts, scroll sideways">
        ${posts.map((code, i) => `<div class="ig-post"><iframe src="https://www.instagram.com/p/${esc(code)}/embed/" title="Instagram post ${i + 1} from ${esc(c.BUSINESS_NAME)}" loading="lazy" scrolling="no" allowtransparency="true"></iframe></div>`).join("\n        ")}
      </div>` : ""}
      <p class="center"><a class="btn btn-outline" href="${esc(profile)}" target="_blank" rel="noopener">${icon("insta", 18)} Follow @${esc(c.INSTAGRAM_HANDLE)}</a></p>
    </div>
  </section>`;
  }

  // ── pages ───────────────────────────────────────────────

  function homePage() {
    return head({ title: c.META_TITLE, description: c.META_DESCRIPTION, canonical: "/" }) + `
${header("/")}
<main id="main">
  <section class="hero">
    <img class="hero-img" src="${u(c.HERO_IMAGE)}" alt=""${c.HERO_POSITION ? ` style="object-position:${esc(c.HERO_POSITION)}"` : ""} fetchpriority="high" />
    <div class="hero-shade"></div>
    <div class="container hero-inner">
      <span class="eyebrow eyebrow-gold">${esc(c.HERO_EYEBROW)}</span>
      <h1>${esc(c.HERO_HEADLINE)}</h1>
      <p class="hero-sub">${esc(c.HERO_SUBHEADLINE)}</p>
      <div class="hero-actions">
        <a href="${u("/book/")}" class="btn btn-gold">${esc(T.HERO_CTA)} ${icon("arrow", 18)}</a>
        <a href="${u("/contact/")}#callback" class="btn btn-ghost-light">Request a call back</a>
      </div>
    </div>
  </section>

  ${(c.TRUST || []).length ? `<section class="trust-strip" aria-label="${esc(T.TRUST_LABEL)}">
    <div class="container trust-inner" style="--n:${c.TRUST.length};--m:${c.TRUST.length === 3 ? 3 : 2}">
      ${c.TRUST.map(t => `<div class="trust-item"><strong>${esc(t.value.replace("{count}", String(data.treatments.length)).replace("{prices}", String(data.treatments.reduce((n, x) => n + (x.prices || []).length, 0))))}</strong><span>${esc(t.label)}</span></div>`).join("")}
    </div>
  </section>` : ""}

  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">What we do</span>
        <h2>${esc(T.CATS_HEADING)}</h2>
        <p>${esc(T.CATS_SUB)}</p>
      </div>
      <div class="cat-grid">
        ${cats.map(k => `<a class="cat-card" href="${u("/treatments/" + k.id + "/")}">
          <img src="${u(c.CATEGORY_IMAGES[k.id])}" alt="" loading="lazy" width="900" height="700" />
          <div class="cat-card-body">
            <h3>${esc(k.name)}</h3>
            <p>${esc(c.CATEGORY_BLURBS[k.id])}</p>
            <span class="cat-count">${treatmentsOf(k.id).length} ${treatmentsOf(k.id).length === 1 ? "treatment" : "treatments"} ${icon("arrow", 16)}</span>
          </div>
        </a>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="section section-tint">
    <div class="container split">
      <div class="split-body">
        <span class="eyebrow">${esc(T.BOOK_EYEBROW)}</span>
        <h2>${esc(T.BOOK_HEADING)}</h2>
        <p class="lead">${esc(T.BOOK_LEAD)}</p>
        <ol class="steps-list">
          ${T.BOOK_STEPS.map((st, i) => `<li><span>${i + 1}</span><div><strong>${esc(st[0])}</strong><small>${esc(st[1])}</small></div></li>`).join("\n          ")}
        </ol>
        <a class="btn btn-primary" href="${u("/book/")}">Book online ${icon("arrow", 18)}</a>
      </div>
      ${(c.CONSULTATIONS || []).length ? `<div class="price-panel">
        <h3>${esc(T.PRICE_PANEL_TITLE)}</h3>
        <ul>
          ${c.CONSULTATIONS.slice(0, 6).map(x => `<li><span>${esc(x.name)}${x.mins ? `<small>${x.mins} min</small>` : ""}</span><strong>${esc(x.price)}</strong></li>`).join("\n          ")}
        </ul>
        <a class="text-link" href="${u("/book/")}#prices">${esc(T.PRICE_PANEL_LINK)} ${icon("arrow", 16)}</a>
      </div>` : ""}
    </div>
  </section>

  ${instagramSection()}

  <section class="section">
    <div class="container split split-reverse">
      <div class="split-media">
        <img src="${u(c.ABOUT_IMAGE)}" alt="${esc(T.ABOUT_IMG_ALT)}" loading="lazy" width="1200" height="900" />
      </div>
      <div class="split-body">
        <span class="eyebrow">${esc(T.ABOUT_EYEBROW)}</span>
        <h2>${esc(T.ABOUT_HEADING)}</h2>
        <p class="lead">${esc(c.ABOUT_INTRO)}</p>
        <a class="text-link" href="${u("/about/")}">Our story ${icon("arrow", 16)}</a>
      </div>
    </div>
  </section>

  ${assuranceSection()}

  <section class="section section-tint">
    <div class="container visit">
      <div>
        <span class="eyebrow">Find us</span>
        <h2>${esc(T.VISIT_HEADING)}</h2>
        <p class="visit-line">${icon("pin", 18)} <span>${c.ADDRESS_LINES.map(esc).join(", ")}</span></p>
        <p class="visit-line">${icon("phone", 18)} <a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a></p>
        ${c.EMAIL ? `<p class="visit-line">${icon("mail", 18)} <a href="mailto:${esc(c.EMAIL)}">${esc(c.EMAIL)}</a></p>` : ""}
      </div>
      ${mapEmbed()}
    </div>
  </section>

  ${emailSignup()}

  ${ctaBand()}
</main>
${footer()}`;
  }

  function assuranceSection() {
    const a = c.ASSURANCE;
    if (!a) return "";
    return `<section class="section assurance" id="trust">
    <div class="container">
      <div class="assurance-inner">
        <span class="eyebrow">${esc(a.EYEBROW)}</span>
        <h2>${esc(a.HEADING)} <em>${esc(a.HEADING_EM)}</em></h2>
        <p>${esc(a.TEXT)}</p>
        <ul class="assurance-logos" aria-label="Regulators and professional bodies">
          ${a.LOGOS.map(l => `<li><img src="${u(l.src)}" alt="${esc(l.alt)}" loading="lazy" /></li>`).join("\n          ")}
        </ul>
        ${c.DEMO_NOTICE ? `<p class="fine">Draft: wording and logos are taken from the clinic's current website, and the clinic must confirm them.</p>` : ""}
      </div>
    </div>
  </section>`;
  }

  function emailSignup() {
    const e = c.EMAIL_SIGNUP;
    if (!e) return "";
    return `<section class="section" id="signup">
    <div class="container">
      <div class="signup">
        <div class="signup-text">
          <span class="eyebrow">${esc(e.EYEBROW)}</span>
          <h2>${esc(e.HEADING)}</h2>
          <p>${esc(e.TEXT)}</p>
        </div>
        <form class="signup-form" id="signup-form" novalidate${e.ACTION ? ` action="${esc(e.ACTION)}" method="post"` : ""}>
          <div class="field">
            <label for="s-email">Email address</label>
            <input type="email" id="s-email" name="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required />
          </div>
          <label class="check"><input type="checkbox" id="s-consent" name="consent" required /> <span>${esc(e.CONSENT)}</span></label>
          <button type="submit" class="btn btn-primary">Sign up</button>
          <p class="form-status" id="signup-status" role="status" hidden></p>
          <p class="fine">We'll only use your email to send the updates you asked for.${c.DEMO_NOTICE && !e.ACTION ? " Draft: this form does not send or store anything yet." : ""}</p>
        </form>
      </div>
    </div>
  </section>`;
  }

  function mapEmbed() {
    const d = 0.004, lat = c.MAP_LAT, lon = c.MAP_LON;
    const bbox = [lon - d * 1.6, lat - d, lon + d * 1.6, lat + d].map(n => n.toFixed(5)).join("%2C");
    return `<div class="map-wrap"><iframe title="Map showing ${esc(c.BUSINESS_NAME)}" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&amp;layer=mapnik&amp;marker=${lat}%2C${lon}"></iframe></div>`;
  }

  function treatmentsPage() {
    return head({
      title: `Treatments | ${c.BUSINESS_NAME}`,
      description: `All treatments and medical services at ${c.BUSINESS_NAME}, Edgbaston. Search, then book a consultation.`,
      canonical: "/treatments/",
    }) + `
${header("/treatments/")}
<main id="main">
  ${pageHero("Treatments", "Everything we offer", "Search the full list, or choose an area. Prices are shown where the clinic publishes them. Everything else is discussed at a consultation.")}
  <section class="section section-tight">
    <div class="container">
      <nav class="cat-tabs" id="cat-tabs" aria-label="Choose a treatment area" style="--cols:${cats.length + 1 <= 5 ? cats.length + 1 : Math.ceil((cats.length + 1) / 2)}">
        <button type="button" data-cat="all" aria-pressed="true">All <span>${data.treatments.length}</span></button>
        ${cats.map(k => `<button type="button" data-cat="${k.id}" aria-pressed="false">${esc(k.name)} <span>${treatmentsOf(k.id).length}</span></button>`).join("\n        ")}
      </nav>
      <div class="search-bar">
        ${icon("search", 20)}
        <label class="sr-only" for="tr-search">Search treatments</label>
        <input type="search" id="tr-search" placeholder="Search treatments, for example IV, peel or GP" autocomplete="off" />
      </div>
      <p class="search-status" id="tr-status" role="status" aria-live="polite"></p>
      ${cats.map(k => `<section class="tr-group" data-group data-cat="${k.id}">
        <header class="tr-group-head">
          <h2 id="area-${k.id}"><a href="${u("/treatments/" + k.id + "/")}">${esc(k.name)}</a></h2>
          <span>${treatmentsOf(k.id).length}</span>
        </header>
        <div class="tr-grid">
          ${treatmentsOf(k.id).map(treatmentCard).join("\n          ")}
        </div>
      </section>`).join("\n      ")}
    </div>
  </section>
  ${ctaBand()}
</main>
${footer()}`;
  }

  function categoryPage(k) {
    return head({
      title: `${k.name} | ${c.BUSINESS_NAME}`,
      description: `${k.name} at ${c.BUSINESS_NAME}, Edgbaston. ${c.CATEGORY_BLURBS[k.id]}`,
      canonical: `/treatments/${k.id}/`,
    }) + `
${header("/treatments/")}
<main id="main">
  <section class="page-hero page-hero-image" style="--hero-img:url('${u(c.CATEGORY_IMAGES[k.id])}')">
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${u("/treatments/")}">Treatments</a> <span aria-hidden="true">/</span> <span>${esc(k.name)}</span></nav>
      <h1>${esc(k.name)}</h1>
      <p>${esc(c.CATEGORY_BLURBS[k.id])}</p>
    </div>
  </section>
  <section class="section section-tight">
    <div class="container">
      <div class="tr-grid tr-grid-wide">
        ${treatmentsOf(k.id).map(treatmentCard).join("\n        ")}
      </div>
      <p class="more-note">Looking for something else? <a href="${u("/treatments/")}">See every treatment</a>, or <a href="${u("/contact/")}#callback">request a call back</a>.</p>
    </div>
  </section>
  ${ctaBand()}
</main>
${footer()}`;
  }

  function treatmentPage(t) {
    const k = cats.find(x => x.id === t.cat);
    const d = details[t.slug] || { intro: [], facts: {}, faqs: [] };
    const dFacts = d.facts || {};
    const factRows = [
      ["Price", t.price || "On consultation"],
      dFacts.time ? ["Treatment time", dFacts.time] : null,
      dFacts.downtime ? ["Downtime", dFacts.downtime] : null,
      dFacts.risks ? ["Possible effects", dFacts.risks] : null,
      ...(d.factsList || []).map(f => [f[0], f[1]]),
    ].filter(Boolean);
    return head({
      title: `${t.name} | ${c.BUSINESS_NAME}`,
      description: ((d.intro || [])[0] || `${t.name} at ${c.BUSINESS_NAME}, Edgbaston.`).slice(0, 155),
      canonical: `/treatments/${t.cat}/${t.slug}/`,
    }) + `
${header("/treatments/")}
<main id="main">
  <section class="page-hero">
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${u("/treatments/")}">Treatments</a> <span aria-hidden="true">/</span> <a href="${u("/treatments/" + k.id + "/")}">${esc(k.name)}</a> <span aria-hidden="true">/</span> <span>${esc(t.name)}</span></nav>
      <span class="eyebrow">${esc(t.kind)}</span>
      <h1>${esc(t.name)}</h1>
    </div>
  </section>
  <section class="section section-tight">
    <div class="container detail-layout">
      <div class="detail-main">
        ${(d.intro || []).map((x, i) => `<p${i === 0 ? ' class="lead"' : ""}>${esc(x)}</p>`).join("\n        ")}
        ${(t.prices || []).length ? `<h2 class="detail-h">Prices</h2>
        <ul class="price-rows detail-prices">
          ${t.prices.map(r => `<li><span>${esc(r.label)}${r.note ? `<small>${esc(r.note)}</small>` : ""}</span><strong>${esc(r.price)}</strong></li>`).join("\n          ")}
        </ul>
        <p class="fine">${esc(T.PRICES_FOOT)}</p>` : ""}
        ${(d.faqs || []).length ? `<h2 class="detail-h">Common questions</h2>
        <div class="faq">
          ${d.faqs.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("\n          ")}
        </div>` : ""}
        <p class="fine">${c.DEMO_NOTICE ? "Draft: this text is the clinic's own wording from their website, and the clinic should check and approve it. " : ""}${t.orig ? `<a href="${esc(t.orig)}" target="_blank" rel="noopener">See it on their current website</a>` : ""}</p>
      </div>
      <aside class="detail-side">
        <div class="info-card">
          <h2>At a glance</h2>
          <ul class="price-rows">
            ${factRows.map(r => `<li><span>${esc(r[0])}</span><strong>${esc(r[1])}</strong></li>`).join("\n            ")}
          </ul>
          <p class="detail-actions">
            <a class="btn btn-primary" href="${u("/book/")}">${esc(T.HERO_CTA)}</a>
            ${waOn ? `<a class="btn btn-outline" href="${esc(waAbout(t.name))}" target="_blank" rel="noopener">${waIcon(18)} Ask about this</a>` : ""}
          </p>
        </div>
      </aside>
    </div>
  </section>
  ${ctaBand()}
</main>
${footer()}`;
  }

  function bookPage() {
    return head({
      title: `Book Online | ${c.BUSINESS_NAME}`,
      description: `Book a consultation at ${c.BUSINESS_NAME} online. Choose a consultation, a practitioner and a time.`,
      canonical: "/book/",
    }) + `
${header("/book/")}
<main id="main">
  ${pageHero("Book online", T.HERO_CTA, T.BOOK_HERO_TEXT)}
  <section class="section section-tight">
    <div class="container book-layout">
      <div class="book-main">
        ${c.BOOKING_NOTE ? `<p class="book-note">${icon("shield", 18)} <span>${esc(c.BOOKING_NOTE)}</span></p>` : ""}
        ${c.BOOKING_MODE === "request" ? `<form class="message-form" id="request-form" novalidate>
          <h2>${esc(T.REQUEST_HEADING)}</h2>
          <p>${esc(T.REQUEST_TEXT)}</p>
          <div class="field"><label for="r-name">Name</label><input type="text" id="r-name" name="name" autocomplete="name" required /></div>
          <div class="field"><label for="r-phone">Phone number</label><input type="tel" id="r-phone" name="phone" autocomplete="tel" inputmode="tel" required /></div>
          <div class="field"><label for="r-email">Email</label><input type="email" id="r-email" name="email" autocomplete="email" required /></div>
          <div class="field"><label for="r-type">Which appointment?</label>
            <select id="r-type" name="type" required><option value="">Choose one</option>${(c.CONSULTATIONS || []).map(x => `<option>${esc(x.name)}</option>`).join("")}<option>Not sure, please advise</option></select></div>
          <div class="field"><label for="r-note">Anything we should know? <span class="optional">(optional)</span></label><textarea id="r-note" name="note" rows="3"></textarea></div>
          <button type="submit" class="btn btn-primary">${esc(T.REQUEST_HEADING)}</button>
          <p class="form-status" id="request-status" role="status" hidden></p>
          ${c.DEMO_NOTICE ? '<p class="fine">Draft: this form does not send anything yet.</p>' : ""}
        </form>
        <p class="book-fallback">Prefer to talk? <a href="tel:${esc(c.PHONE_HREF)}">Call ${esc(c.PHONE)}</a>${c.PHONE_NOTE ? ` (${esc(c.PHONE_NOTE)})` : ""}.</p>` : c.BOOKING_EMBED === false ? `<div class="book-link-card">
          <h2>Book on the clinic's booking page</h2>
          <p>${esc(c.BOOKING_LINK_TEXT || "Choose a time and book. The booking page opens in a new tab.")}</p>
          <a class="btn btn-primary" href="${esc(c.BOOKING_URL)}" target="_blank" rel="noopener">Open the booking page ${icon("arrow", 18)}</a>
          <p class="fine">${esc(c.BOOKING_LINK_NOTE || "In a finished website this booking would sit inside the page, so patients never leave it.")}</p>
        </div>
        <p class="book-fallback">Prefer to talk? <a href="tel:${esc(c.PHONE_HREF)}">Call ${esc(c.PHONE)}</a> or <a href="${u("/contact/")}#callback">request a call back</a>.</p>` : `<div class="book-frame">
          <iframe id="book-iframe" title="Online booking for ${esc(c.BUSINESS_NAME)}" src="${esc(c.BOOKING_URL)}" scrolling="no" loading="lazy"></iframe>
        </div>
        <p class="book-fallback">Having trouble? <a href="${esc(c.BOOKING_URL)}" target="_blank" rel="noopener">Open the booking page in a new tab</a> or <a href="tel:${esc(c.PHONE_HREF)}">call ${esc(c.PHONE)}</a>.</p>`}
      </div>
      <aside class="book-side" id="prices">
        ${(c.CONSULTATIONS || []).length ? `<div class="info-card">
          <h2>${esc(T.PRICE_PANEL_TITLE)}</h2>
          <ul class="price-rows">
            ${c.CONSULTATIONS.map(x => { const meta = [x.mins ? x.mins + " min" : "", x.note || ""].filter(Boolean).join(" · "); return `<li><span>${esc(x.name)}${meta ? `<small>${esc(meta)}</small>` : ""}</span><strong>${esc(x.price)}</strong></li>`; }).join("\n            ")}
          </ul>
          <p class="fine">${esc(T.BOOK_PRICES_NOTE)}</p>
        </div>` : ""}
        <div class="info-card">
          <h2>Prefer to talk?</h2>
          <p>Call <a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a>, or <a href="${u("/contact/")}#callback">request a call back</a>.</p>
        </div>
      </aside>
    </div>
  </section>
</main>
${footer()}`;
  }

  function aboutPage() {
    return head({
      title: `About | ${c.BUSINESS_NAME}`,
      description: c.ABOUT_INTRO,
      canonical: "/about/",
    }) + `
${header("/about/")}
<main id="main">
  ${pageHero("About us", T.ABOUT_HEADING, c.ABOUT_INTRO)}
  <section class="section section-tight">
    <div class="container split">
      <div class="split-media">
        <img src="${u(c.ABOUT_IMAGE)}" alt="${esc(T.ABOUT_IMG_ALT)}" loading="lazy" width="1200" height="900" />
      </div>
      <div class="split-body">
        <h2>${esc(T.ABOUT_SECTION_HEADING)}</h2>
        ${c.ABOUT_TEXT.map(p => `<p>${esc(p)}</p>`).join("\n        ")}
      </div>
    </div>
  </section>
  ${(c.TEAM || []).length ? `<section class="section section-tint">
    <div class="container">
      <div class="section-head"><span class="eyebrow">The team</span><h2>Practitioners you can book with</h2><p>${esc(T.TEAM_SUB)}</p></div>
      <div class="team-grid">
        ${c.TEAM.map(m => `<article class="team-card"><div class="avatar" aria-hidden="true">${esc(m.name.replace(/^(Miss|Dr|Mr|Mrs)\s+/, "")[0])}</div><h3>${esc(m.name)}</h3><p>${esc(m.role)}</p></article>`).join("\n        ")}
      </div>
    </div>
  </section>` : ""}
  ${instagramSection()}
  ${ctaBand()}
</main>
${footer()}`;
  }

  function contactPage() {
    return head({
      title: `Contact | ${c.BUSINESS_NAME}`,
      description: `Contact ${c.BUSINESS_NAME} at ${c.ADDRESS_LINES.join(", ")}. Phone, email, call back request and online booking.`,
      canonical: "/contact/",
    }) + `
${header("/contact/")}
<main id="main">
  ${pageHero("Contact", "Get in touch", "The quickest way to see someone is to book a consultation online. For anything else, call, message us, or ask for a call back.")}
  <section class="section section-tight">
    <div class="container contact-grid">
      <div class="contact-cards">
        <div class="info-card">
          <h2>${icon("pin", 20)} Where we are</h2>
          <p>${c.ADDRESS_LINES.map(esc).join("<br />")}</p>
        </div>
        <div class="info-card">
          <h2>${icon("phone", 20)} Talk to us</h2>
          <p><a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a>${c.EMAIL ? `<br /><a href="mailto:${esc(c.EMAIL)}">${esc(c.EMAIL)}</a>` : ""}${c.PHONE_NOTE ? `<br /><small>${esc(c.PHONE_NOTE)}</small>` : ""}</p>
        </div>
        ${waOn ? `<div class="info-card">
          <h2>${waIcon(20)} WhatsApp us</h2>
          <p>Pick what it's about and we'll open WhatsApp with the message ready.</p>
          ${waOptions("wa-options wa-options-inline")}
        </div>` : ""}
      </div>
      <div class="contact-side">
        ${mapEmbed()}
        <form class="message-form" id="callback" novalidate>
          <h2>Request a call back</h2>
          <p>Leave your number and a member of the team will call you.</p>
          <div class="field"><label for="m-name">Name</label><input type="text" id="m-name" name="name" autocomplete="name" required /></div>
          <div class="field"><label for="m-phone">Phone number</label><input type="tel" id="m-phone" name="phone" autocomplete="tel" inputmode="tel" required /></div>
          <div class="field"><label for="m-topic">What is it about? <span class="optional">(optional)</span></label>
            <select id="m-topic" name="topic"><option value="">Choose one</option>${cats.map(k => `<option>${esc(k.name)}</option>`).join("")}<option>Something else</option></select></div>
          <button type="submit" class="btn btn-primary">Request a call back</button>
          <p class="form-status" id="callback-status" role="status" hidden></p>
          ${c.DEMO_NOTICE ? '<p class="fine">Draft: this form does not send anything yet.</p>' : ""}
        </form>
      </div>
    </div>
  </section>
  ${ctaBand()}
</main>
${footer()}`;
  }

  // ── write ───────────────────────────────────────────────
  writeFile(path.join(dist, "index.html"),            homePage());
  writeFile(path.join(dist, "treatments/index.html"), treatmentsPage());
  cats.forEach(k => writeFile(path.join(dist, `treatments/${k.id}/index.html`), categoryPage(k)));
  data.treatments.forEach(t => writeFile(path.join(dist, `treatments/${t.cat}/${t.slug}/index.html`), treatmentPage(t)));
  writeFile(path.join(dist, "book/index.html"),       bookPage());
  writeFile(path.join(dist, "about/index.html"),      aboutPage());
  writeFile(path.join(dist, "contact/index.html"),    contactPage());
  copyDir(path.join(SRC, "css"),    path.join(dist, "css"));
  copyDir(path.join(SRC, "js"),     path.join(dist, "js"));
  copyDir(path.join(SITE, "images"), path.join(dist, "images"));

  console.log(`✅ Clinic build complete → ${path.relative(process.cwd(), dist) || "."}${base ? ` (served at ${base}/)` : ""}`);
}

module.exports = { build };

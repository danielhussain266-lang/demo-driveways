#!/usr/bin/env node
// ============================================================
// GROUNDWORK STUDIOS — MULTI-PAGE STATIC BUILD SCRIPT v2
// Outputs: dist/index.html, dist/portfolio/, dist/about/,
//          dist/reviews/, dist/contact/, dist/services/<slug>/
// ============================================================

const fs   = require("fs");
const path = require("path");
const c    = require("./site.config.js");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

// ── helpers ──────────────────────────────────────────────

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slug(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function stars(n) { return "★".repeat(Math.min(5, Math.max(1, n || 5))); }

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return null; }
}

function readDataDir(dir) {
  const full = path.join(ROOT, "_data", dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full)
    .filter(f => f.endsWith(".json"))
    .map(f => readJson(path.join(full, f)))
    .filter(Boolean);
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach((f) => {
    const s = path.join(src, f);
    const d = path.join(dest, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  });
}

// ── merge CMS _data/ on top of config ────────────────────

const dataTestimonials = readDataDir("testimonials");
const dataPortfolio    = readDataDir("portfolio");
const dataFaqs         = readDataDir("faqs");

const testimonials = dataTestimonials.length ? dataTestimonials : c.TESTIMONIALS;
const portfolio    = dataPortfolio.length    ? dataPortfolio    : (c.PORTFOLIO || []);
const faqs         = dataFaqs.length
  ? dataFaqs.map(f => ({ q: f.question, a: f.answer }))
  : c.FAQS;

// Ensure each service has a slug
const services = (c.SERVICES || []).map(s => ({
  ...s,
  slug: s.slug || slug(s.name),
}));

const domain      = c.DOMAIN || "example.co.uk";
const businessShort = c.BUSINESS_NAME.split(" ")[0];
const year        = new Date().getFullYear();
const waMsg       = encodeURIComponent(c.WHATSAPP_MESSAGE || "Hi, I'd like a free quote please");
const heroHeadline  = c.HERO_HEADLINE    || `Expert ${c.TRADE} in ${c.SERVICE_AREA}`;
const heroSubline   = c.HERO_SUBHEADLINE || `Quality work, honest prices. Serving ${c.SERVICE_AREA} for over ${c.YEARS_TRADING} years.`;

// ── SVG icons ─────────────────────────────────────────────

const icons = {
  phone:    `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>`,
  mail:     `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`,
  shield:   `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  clock:    `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  pin:      `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,
  star:     `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
  check:    `<polyline points="20 6 9 17 4 12"/>`,
  arrow:    `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`,
  users:    `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  chevron:  `<polyline points="6 9 12 15 18 9"/>`,
  home:     `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  x:        `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  layers:   `<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`,
  tool:     `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  dollar:   `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
  msg:      `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  fb:       `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`,
  ig:       `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>`,
};

function svg(name, size = 20, extraClass = "") {
  const d = icons[name] || "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${extraClass ? ` class="${extraClass}"` : ""}>${d}</svg>`;
}

function svgFilled(name, size = 20) {
  const d = icons[name] || "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">${d}</svg>`;
}

// ── shared partials ───────────────────────────────────────

function buildHead({ title, description, canonical, extraSchema = "" }) {
  const cfAnalytics = c.CF_ANALYTICS_TOKEN
    ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${c.CF_ANALYTICS_TOKEN}"}'></script>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://${esc(domain)}${esc(canonical)}" />
  <meta property="og:title"       content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="https://${esc(domain)}${esc(canonical)}" />
  <meta property="og:image"       content="https://${esc(domain)}/images/og-image.jpg" />
  <link rel="stylesheet" href="/src/css/style.css" />
  ${extraSchema}
  ${cfAnalytics}
</head>
<body>`;
}

function buildSchema() {
  const sameAs = [c.FACEBOOK_URL, c.INSTAGRAM_URL, c.GOOGLE_MAPS_URL].filter(Boolean);
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": c.BUSINESS_NAME,
    "description": c.META_DESCRIPTION,
    "url": `https://${domain}/`,
    "telephone": c.PHONE,
    "email": c.EMAIL,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": c.ADDRESS_STREET || "",
      "addressLocality": c.ADDRESS_CITY || "",
      "postalCode": c.ADDRESS_POSTCODE || "",
      "addressCountry": "GB"
    },
    ...(sameAs.length ? { "sameAs": sameAs } : {})
  }, null, 2);
}

function buildFaqSchema(faqList) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  }, null, 2);
}

function buildUtilityBar() {
  const chips = (c.TRUST_CHIPS || []).map(t =>
    `<span class="util-chip">${svg("check", 13)}${esc(t)}</span>`
  ).join("");
  return `
<div id="utility-bar">
  <div class="util-inner">
    <div class="util-contact">
      <a href="tel:${esc(c.PHONE_HREF)}">${svg("phone", 13)} ${esc(c.PHONE)}</a>
      <a href="mailto:${esc(c.EMAIL)}">${svg("mail", 13)} ${esc(c.EMAIL)}</a>
    </div>
    <div class="util-chips">${chips}</div>
  </div>
</div>`;
}

function buildAnnouncementBar() {
  if (!c.ANNOUNCEMENT_BAR) return "";
  return `
<div id="announcement-bar">
  ${esc(c.ANNOUNCEMENT_BAR)}
  <button class="ann-close" aria-label="Dismiss">&times;</button>
</div>`;
}

function buildServicesDropdown() {
  const items = services.map(s =>
    `<a href="/services/${esc(s.slug)}/">${esc(s.name)}</a>`
  ).join("");
  return `
<div class="nav-dropdown">
  <button>${svg("layers", 15)} Services ${svg("chevron", 14)}</button>
  <div class="nav-dropdown-panel">${items}</div>
</div>`;
}

function buildHeader() {
  return `
<div id="announcement-bar-slot">${buildAnnouncementBar()}</div>
${buildUtilityBar()}
<header id="site-header" role="banner">
  <div class="header-inner">
    <a href="/" class="site-logo">${esc(businessShort)}<span>.</span></a>
    <nav class="nav-links" aria-label="Primary navigation">
      <a href="/">Home</a>
      ${buildServicesDropdown()}
      <a href="/portfolio/">Portfolio</a>
      <a href="/reviews/">Reviews</a>
      <a href="/about/">About</a>
      <a href="/contact/">Contact</a>
    </nav>
    <a href="/contact/" class="btn btn-primary nav-cta">Free Quote</a>
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
    <a href="/">Home</a>
    <a href="/portfolio/">Portfolio</a>
    <a href="/reviews/">Reviews</a>
    <a href="/about/">About</a>
    <a href="/contact/">Contact</a>
    ${services.map(s => `<a href="/services/${esc(s.slug)}/">&nbsp;&nbsp;↳ ${esc(s.name)}</a>`).join("")}
    <a href="/contact/" class="btn btn-primary mob-cta">Get a Free Quote</a>
  </nav>
</header>`;
}

function buildMobileStickyBar() {
  return `
<div id="mobile-sticky" role="navigation" aria-label="Quick actions">
  <a href="tel:${esc(c.PHONE_HREF)}" class="mob-call">
    ${svg("phone", 20)}
    Call Us
  </a>
  <a href="/contact/" class="mob-quote">
    ${svg("msg", 20)}
    Free Quote
  </a>
</div>`;
}

function buildWhatsApp() {
  if (!c.WHATSAPP_ENABLED || !c.WHATSAPP_NUMBER) return "";
  return `<a id="whatsapp-btn" href="https://wa.me/${esc(c.WHATSAPP_NUMBER)}?text=${waMsg}" aria-label="Chat on WhatsApp" target="_blank" rel="noopener">
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
</a>`;
}

function buildFooter() {
  const socialLinks = [
    c.FACEBOOK_URL  ? `<a href="${esc(c.FACEBOOK_URL)}"  aria-label="Facebook"  rel="noopener" target="_blank">${svgFilled("fb",  18)}</a>` : "",
    c.INSTAGRAM_URL ? `<a href="${esc(c.INSTAGRAM_URL)}" aria-label="Instagram" rel="noopener" target="_blank">${svg("ig", 18)}</a>` : "",
  ].filter(Boolean).join("");

  const serviceLinks = services.map(s =>
    `<li><a href="/services/${esc(s.slug)}/">${esc(s.name)}</a></li>`
  ).join("");

  return `
<footer id="site-footer" role="contentinfo">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="/" class="site-logo">${esc(businessShort)}<span>.</span></a>
        <p>Professional ${esc(c.TRADE)} serving ${esc(c.SERVICE_AREA)}. Quality work, honest prices.</p>
        ${socialLinks ? `<div class="footer-social">${socialLinks}</div>` : ""}
      </div>
      <div class="footer-links">
        <h4>Services</h4>
        <ul>${serviceLinks}</ul>
      </div>
      <div class="footer-links">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a></li>
          <li><a href="mailto:${esc(c.EMAIL)}">${esc(c.EMAIL)}</a></li>
          <li>${esc(c.SERVICE_AREA)}</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${year} ${esc(c.BUSINESS_NAME)}. All rights reserved.</span>
      <span>Website by <a href="https://groundworkstudios.co.uk" rel="noopener" target="_blank">Groundwork Studios</a></span>
    </div>
  </div>
</footer>`;
}

function buildCtaBand() {
  const chips = (c.TRUST_CHIPS || []).slice(0, 3).map(t =>
    `<span>${svg("check", 14)} ${esc(t)}</span>`
  ).join("");
  return `
<section class="cta-band" aria-labelledby="cta-heading">
  <div class="container">
    <h2 id="cta-heading">Ready to Transform Your ${c.TRADE.split(" ")[0]}?</h2>
    <p>Get a free, no-obligation quote from ${esc(c.BUSINESS_NAME)} today.</p>
    <div class="cta-band-actions">
      <a href="/contact/" class="btn btn-dark">Get a Free Quote</a>
      <a href="tel:${esc(c.PHONE_HREF)}" class="btn btn-ghost">${svg("phone", 16)} ${esc(c.PHONE)}</a>
    </div>
    ${chips ? `<div class="cta-band-trust">${chips}</div>` : ""}
  </div>
</section>`;
}

function buildLightbox() {
  return `
<div id="lightbox" role="dialog" aria-modal="true" aria-label="Project details">
  <div class="lightbox-inner">
    <button class="lightbox-close" aria-label="Close">${svg("x", 18)}</button>
    <div class="lightbox-slider">
      <div class="ba-slider" data-ba style="width:100%;height:100%;">
        <div class="ba-before">
          <img class="lb-before-img" src="" alt="" loading="lazy" />
          <span class="ba-label">Before</span>
        </div>
        <div class="ba-after">
          <img class="lb-after-img" src="" alt="" loading="lazy" />
          <span class="ba-label">After</span>
        </div>
        <div class="ba-handle" style="left:50%">
          <div class="ba-handle-line"></div>
          <button class="ba-handle-btn" aria-label="Drag to compare">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/><polyline points="9 18 3 12 9 6" transform="translate(6,0)"/></svg>
          </button>
        </div>
      </div>
    </div>
    <div class="lightbox-body">
      <span class="project-tag lb-tag"></span>
      <h3 class="lb-title" style="margin:.5rem 0 1rem;font-size:1.5rem;"></h3>
      <div class="project-meta">
        <span data-lb-row style="display:none">${svg("pin", 14)} <span class="lb-location"></span></span>
        <span data-lb-row style="display:none">${svg("clock", 14)} <span class="lb-duration"></span></span>
        <span data-lb-row style="display:none">${svg("dollar", 14)} <span class="lb-price"></span></span>
      </div>
      <p class="lb-desc" style="margin-top:.75rem;"></p>
    </div>
  </div>
</div>`;
}

function buildScripts() {
  return `
${buildWhatsApp()}
${buildMobileStickyBar()}
${buildLightbox()}
<script src="/src/js/main.js"></script>
</body>
</html>`;
}

// ── Hero section ──────────────────────────────────────────

function buildHeroSlider() {
  const before = c.HERO_BEFORE_IMAGE || "/images/placeholder.svg";
  const after  = c.HERO_AFTER_IMAGE  || "/images/placeholder.svg";
  return `
  <div class="ba-slider hero-slider" data-ba>
    <div class="ba-before">
      <img src="${esc(before)}" alt="Before — ${esc(c.SERVICE_AREA)}" loading="eager" />
      <span class="ba-label">Before</span>
    </div>
    <div class="ba-after">
      <img src="${esc(after)}" alt="After — ${esc(c.SERVICE_AREA)}" loading="eager" />
      <span class="ba-label">After</span>
    </div>
    <div class="ba-handle" style="left:50%">
      <div class="ba-handle-line"></div>
      <button class="ba-handle-btn" aria-label="Drag to compare before and after">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/><polyline points="9 18 3 12 9 6" transform="translate(6,0)"/></svg>
      </button>
    </div>
  </div>
  <div class="hero-overlay"></div>`;
}

function buildHeroTrustChips() {
  const items = [];
  if (c.RATING_TEXT)    items.push(`<span class="hero-trust-item">${svgFilled("star", 15)} ${esc(c.RATING_TEXT)}</span>`);
  items.push(`<span class="hero-trust-item">${svg("shield", 15)} Fully Insured</span>`);
  items.push(`<span class="hero-trust-item">${svg("clock", 15)} ${esc(c.YEARS_TRADING)} Years Experience</span>`);
  items.push(`<span class="hero-trust-item">${svg("pin", 15)} ${esc(c.SERVICE_AREA)}</span>`);
  return items.join("\n      ");
}

function buildHeroMiniForm() {
  const serviceOpts = services.map(s =>
    `<option value="${esc(s.name)}">${esc(s.name)}</option>`
  ).concat([`<option value="Other / Not sure">Other / Not sure</option>`]).join("\n");
  return `
    <div class="hero-form-card">
      <h3>60-Second Quote</h3>
      <p>Tell us about your project — we'll respond within 24 hours.</p>
      <form id="hero-form" novalidate>
        <input type="hidden" name="access_key"  value="${esc(c.WEB3FORMS_KEY)}" />
        <input type="hidden" name="subject"     value="Quick quote from ${esc(c.BUSINESS_NAME)} website" />
        <input type="hidden" name="from_name"   value="${esc(c.BUSINESS_NAME)} Website" />
        <input type="checkbox" name="botcheck" style="display:none" />
        <div class="form-group">
          <label for="hf-name">Your Name *</label>
          <input type="text" id="hf-name" name="name" required placeholder="John Smith" />
        </div>
        <div class="form-group">
          <label for="hf-phone">Phone *</label>
          <input type="tel" id="hf-phone" name="phone" required placeholder="07700 900000" />
        </div>
        <div class="form-group">
          <label for="hf-service">Service</label>
          <select id="hf-service" name="service">
            <option value="" disabled selected>Select a service…</option>
            ${serviceOpts}
          </select>
        </div>
        <button type="submit" class="btn btn-primary form-submit">Send Enquiry →</button>
        <p class="form-status" id="hero-form-status" aria-live="polite"></p>
      </form>
    </div>`;
}

// ── Home page sections ────────────────────────────────────

function buildBaTeaser() {
  const items = portfolio.slice(0, 3);
  if (items.length === 0) {
    const placeholders = [
      { caption: `Block Paving — ${c.SERVICE_AREA}`, meta: "2 days · Rugby" },
      { caption: `Tarmac Driveway — ${c.SERVICE_AREA}`, meta: "1 day · Coventry" },
      { caption: `Resin Bound — ${c.SERVICE_AREA}`, meta: "3 days · Warwick" },
    ];
    return `
<section id="ba-teaser" aria-labelledby="teaser-heading">
  <div class="container">
    <span class="section-label">Transformations</span>
    <h2 class="section-title" id="teaser-heading">Before &amp; After</h2>
    <p class="section-intro">Real jobs, real results. Drag the handle to compare each transformation.</p>
    <div class="teaser-grid">
      ${placeholders.map(p => `
      <div class="teaser-card">
        <div class="ba-slider" data-ba>
          <div class="ba-before">
            <img src="/images/placeholder.svg" alt="Before" loading="lazy" />
            <span class="ba-label">Before</span>
          </div>
          <div class="ba-after">
            <img src="/images/placeholder.svg" alt="After" loading="lazy" />
            <span class="ba-label">After</span>
          </div>
          <div class="ba-handle" style="left:50%">
            <div class="ba-handle-line"></div>
            <button class="ba-handle-btn" aria-label="Drag to compare">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/><polyline points="9 18 3 12 9 6" transform="translate(6,0)"/></svg>
            </button>
          </div>
        </div>
        <div class="teaser-caption">
          <span>${esc(p.caption)}</span>
          <span class="teaser-meta">${esc(p.meta)}</span>
        </div>
      </div>`).join("")}
    </div>
    <div class="teaser-cta">
      <a href="/portfolio/" class="btn btn-dark">View Full Portfolio ${svg("arrow", 16)}</a>
    </div>
  </div>
</section>`;
  }

  return `
<section id="ba-teaser" aria-labelledby="teaser-heading">
  <div class="container">
    <span class="section-label">Transformations</span>
    <h2 class="section-title" id="teaser-heading">Before &amp; After</h2>
    <p class="section-intro">Real jobs, real results. Drag the handle to compare each transformation.</p>
    <div class="teaser-grid">
      ${items.map(p => `
      <div class="teaser-card">
        <div class="ba-slider" data-ba>
          <div class="ba-before">
            <img src="${esc(p.beforeImage || "/images/placeholder.svg")}" alt="Before — ${esc(p.title || p.caption || "")}" loading="lazy" />
            <span class="ba-label">Before</span>
          </div>
          <div class="ba-after">
            <img src="${esc(p.afterImage || "/images/placeholder.svg")}" alt="After — ${esc(p.title || p.caption || "")}" loading="lazy" />
            <span class="ba-label">After</span>
          </div>
          <div class="ba-handle" style="left:50%">
            <div class="ba-handle-line"></div>
            <button class="ba-handle-btn" aria-label="Drag to compare">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/><polyline points="9 18 3 12 9 6" transform="translate(6,0)"/></svg>
            </button>
          </div>
        </div>
        <div class="teaser-caption">
          <span>${esc(p.title || p.caption || c.SERVICE_AREA)}</span>
          <span class="teaser-meta">${esc([p.location, p.duration].filter(Boolean).join(" · "))}</span>
        </div>
      </div>`).join("")}
    </div>
    <div class="teaser-cta">
      <a href="/portfolio/" class="btn btn-dark">View Full Portfolio ${svg("arrow", 16)}</a>
    </div>
  </div>
</section>`;
}

function buildServicesSection() {
  const cards = services.map(s => {
    const imgSrc = s.image || "/images/placeholder.svg";
    return `
    <div class="service-card">
      <img class="service-card-img" src="${esc(imgSrc)}" alt="${esc(s.name)}" loading="lazy" />
      <div class="service-card-body">
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.description || `Professional ${s.name.toLowerCase()} service delivered to the highest standard across ${c.SERVICE_AREA}.`)}</p>
        <a href="/services/${esc(s.slug)}/" class="service-card-link">Learn more ${svg("arrow", 15)}</a>
      </div>
    </div>`;
  });
  return `
<section id="services" aria-labelledby="services-heading">
  <div class="container">
    <span class="section-label">What We Do</span>
    <h2 class="section-title" id="services-heading">Our Services</h2>
    <p class="section-intro">Professional ${esc(c.TRADE)} services delivered to the highest standard across ${esc(c.SERVICE_AREA)}.</p>
    <div class="services-grid">
      ${cards.join("")}
    </div>
  </div>
</section>`;
}

function buildWhyUs() {
  return `
<section id="why-us" aria-labelledby="why-heading">
  <div class="container">
    <span class="section-label">Why Choose Us</span>
    <h2 class="section-title" id="why-heading">The ${esc(businessShort)} Difference</h2>
    <p class="section-intro">We're not the cheapest — we're the most reliable. Here's why customers keep choosing us.</p>
    <div class="usps-grid">
      <div class="usp-item">
        <div class="usp-icon">${svg("check", 20)}</div>
        <div><h3>Free, No-Obligation Quotes</h3><p>We visit, assess and give you a clear written quote. No pressure, no hidden costs.</p></div>
      </div>
      <div class="usp-item">
        <div class="usp-icon">${svg("shield", 20)}</div>
        <div><h3>Fully Insured &amp; Guaranteed</h3><p>All work is backed by public liability insurance and our workmanship guarantee.</p></div>
      </div>
      <div class="usp-item">
        <div class="usp-icon">${svg("clock", 20)}</div>
        <div><h3>${esc(c.YEARS_TRADING)} Years Local Experience</h3><p>Trusted by homeowners across ${esc(c.SERVICE_AREA)} for over ${esc(c.YEARS_TRADING)} years.</p></div>
      </div>
      <div class="usp-item">
        <div class="usp-icon">${svg("users", 20)}</div>
        <div><h3>No Subcontractors</h3><p>Your job is done by our own skilled team — same quality every time.</p></div>
      </div>
      <div class="usp-item">
        <div class="usp-icon">${svg("dollar", 20)}</div>
        <div><h3>Clear, Honest Pricing</h3><p>The price we quote is the price you pay. Every cost explained upfront.</p></div>
      </div>
      <div class="usp-item">
        <div class="usp-icon">${svg("msg", 20)}</div>
        <div><h3>Easy to Reach</h3><p>We answer calls and messages quickly. You'll always know where you stand.</p></div>
      </div>
    </div>
  </div>
</section>`;
}

function buildProcess() {
  const steps = [
    { title: "Free Consultation", body: "We visit your property, listen to what you want and assess the job — no obligation." },
    { title: "Clear Quote",       body: "You receive a detailed written quote within 24–48 hours. No surprises, no hidden fees." },
    { title: "Quality Build",     body: "Our team gets to work. We keep the area tidy and update you throughout the project." },
    { title: "Your Approval",     body: "We walk you round the finished job. If you're not happy, we sort it — simple as that." },
  ];
  return `
<section id="process" aria-labelledby="process-heading">
  <div class="container">
    <span class="section-label">How It Works</span>
    <h2 class="section-title" id="process-heading">From Quote to Completion</h2>
    <p class="section-intro">A straightforward process designed around you — no jargon, no drama.</p>
    <div class="steps-grid">
      ${steps.map((s, i) => `
      <div class="step-item">
        <div class="step-num">0${i + 1}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.body)}</p>
      </div>`).join("")}
    </div>
  </div>
</section>`;
}

function buildTestimonialsSection(items, limit = 3) {
  const shown = items.slice(0, limit);
  const ratingBand = (c.RATING_TEXT || c.CUSTOMER_COUNT) ? `
  <div class="rating-band">
    ${c.RATING_TEXT ? `<div class="rating-band-score">
      <div class="big-score">5.0</div>
      <div class="score-stars">★★★★★</div>
      <div class="score-label">${esc(c.RATING_TEXT)}</div>
    </div>` : ""}
    ${c.RATING_TEXT && c.CUSTOMER_COUNT ? `<div class="rating-band-sep"></div>` : ""}
    ${c.CUSTOMER_COUNT ? `<div class="rating-band-score">
      <div class="big-score">${esc(c.CUSTOMER_COUNT.replace(/[^\d+]/g, ""))}+</div>
      <div class="score-label">Happy Customers</div>
    </div>` : ""}
    ${c.GOOGLE_MAPS_URL ? `<div class="rating-band-sep"></div>
    <div class="rating-band-score">
      <a href="${esc(c.GOOGLE_MAPS_URL)}" target="_blank" rel="noopener" class="btn btn-ghost" style="font-size:.88rem;padding:.5rem 1rem;">View on Google ${svg("arrow", 14)}</a>
    </div>` : ""}
  </div>` : "";

  return `
<section id="testimonials" aria-labelledby="testimonials-heading">
  <div class="container">
    <span class="section-label">What Customers Say</span>
    <h2 class="section-title" id="testimonials-heading">Real Reviews</h2>
    <p class="section-intro">Don't just take our word for it — here's what our customers say.</p>
    <div class="testimonials-grid">
      ${shown.map(t => `
      <div class="testimonial-card">
        <div class="stars">${stars(t.stars)}</div>
        <blockquote>${esc(t.text)}</blockquote>
        <div class="testimonial-author">${esc(t.name)}</div>
        <div class="testimonial-location">${esc(t.location)}</div>
      </div>`).join("")}
    </div>
    ${ratingBand}
  </div>
</section>`;
}

function buildAreasSection() {
  const areas = c.SERVICE_AREAS || [c.SERVICE_AREA];
  return `
<section id="areas" aria-labelledby="areas-heading">
  <div class="container">
    <span class="section-label">Coverage</span>
    <h2 class="section-title" id="areas-heading">Areas We Cover</h2>
    <p class="section-intro">We serve homeowners across ${esc(c.SERVICE_AREA)} and beyond.</p>
    <div class="areas-chips">
      ${areas.map(a => `<span class="area-chip">${svg("pin", 14)} ${esc(a)}</span>`).join("")}
    </div>
  </div>
</section>`;
}

function buildFaqSection(faqList) {
  return `
<section id="faq" aria-labelledby="faq-heading">
  <div class="container">
    <span class="section-label">FAQ</span>
    <h2 class="section-title" id="faq-heading">Frequently Asked Questions</h2>
    <div class="faq-list">
      ${faqList.map(f => `
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          ${esc(f.q)}
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer">${esc(f.a)}</div>
      </div>`).join("")}
    </div>
  </div>
</section>`;
}

// ── Portfolio page ────────────────────────────────────────

function buildProjectCard(p, hidden = false) {
  const cat = p.category || p.tag || "";
  return `
  <div class="project-card${hidden ? " js-hidden" : ""}"
    data-category="${esc(cat)}"
    data-before="${esc(p.beforeImage || "/images/placeholder.svg")}"
    data-after="${esc(p.afterImage  || "/images/placeholder.svg")}"
    data-title="${esc(p.title || "")}"
    data-location="${esc(p.location || "")}"
    data-duration="${esc(p.duration || "")}"
    data-price="${esc(p.priceBand || "")}"
    data-desc="${esc(p.description || "")}"
    tabindex="0"
    role="button"
    aria-label="View ${esc(p.title || "project")} details"
  >
    <div class="ba-slider" data-ba>
      <div class="ba-before">
        <img src="${esc(p.beforeImage || "/images/placeholder.svg")}" alt="Before — ${esc(p.title || "")}" loading="lazy" />
        <span class="ba-label">Before</span>
      </div>
      <div class="ba-after">
        <img src="${esc(p.afterImage || "/images/placeholder.svg")}" alt="After — ${esc(p.title || "")}" loading="lazy" />
        <span class="ba-label">After</span>
      </div>
      <div class="ba-handle" style="left:50%">
        <div class="ba-handle-line"></div>
        <button class="ba-handle-btn" aria-label="Drag to compare">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/><polyline points="9 18 3 12 9 6" transform="translate(6,0)"/></svg>
        </button>
      </div>
    </div>
    <div class="project-card-body">
      ${cat ? `<span class="project-tag">${esc(cat)}</span>` : ""}
      <h3>${esc(p.title || "Project")}</h3>
      <div class="project-meta">
        ${p.location ? `<span>${svg("pin", 13)} ${esc(p.location)}</span>` : ""}
        ${p.duration  ? `<span>${svg("clock", 13)} ${esc(p.duration)}</span>` : ""}
        ${p.priceBand ? `<span>${svg("dollar", 13)} ${esc(p.priceBand)}</span>` : ""}
      </div>
      ${p.description ? `<p class="project-desc">${esc(p.description)}</p>` : ""}
    </div>
  </div>`;
}

// ── Page builders ─────────────────────────────────────────

function buildHomePage() {
  const schema = `
    <script type="application/ld+json">${buildSchema()}</script>
    <script type="application/ld+json">${buildFaqSchema(faqs)}</script>`;
  return buildHead({
    title: c.META_TITLE,
    description: c.META_DESCRIPTION,
    canonical: "/",
    extraSchema: schema,
  }) + `

${buildHeader()}

<main>
  <section id="hero" role="main">
    ${buildHeroSlider()}
    <div class="hero-inner">
      <div class="hero-content">
        <span class="hero-badge">${esc(c.SERVICE_AREA)}</span>
        <h1>${esc(heroHeadline)}</h1>
        <p class="hero-sub">${esc(heroSubline)}</p>
        <div class="hero-actions">
          <a href="/contact/" class="btn btn-primary">Get a Free Quote</a>
          <a href="tel:${esc(c.PHONE_HREF)}" class="btn btn-outline">${svg("phone", 16)} ${esc(c.PHONE)}</a>
        </div>
        <div class="hero-trust">
          ${buildHeroTrustChips()}
        </div>
      </div>
      ${buildHeroMiniForm()}
    </div>
  </section>

  ${buildBaTeaser()}
  ${buildServicesSection()}
  ${buildWhyUs()}
  ${buildProcess()}
  ${buildTestimonialsSection(testimonials)}
  ${buildAreasSection()}
  ${buildFaqSection(faqs)}
  ${buildCtaBand()}
</main>

${buildFooter()}
${buildScripts()}`;
}

function buildPortfolioPage() {
  const cats   = [...new Set(portfolio.map(p => p.category || p.tag).filter(Boolean))];
  const shown  = portfolio.slice(0, 12);
  const more   = portfolio.slice(12);
  const pCount = c.PROJECT_COUNT || portfolio.length || "";

  const filterBtns = [
    `<button class="filter-btn active" data-filter="all">All Projects</button>`,
    ...cats.map(cat => `<button class="filter-btn" data-filter="${esc(cat)}">${esc(cat)}</button>`),
  ].join("\n");

  const schema = `<script type="application/ld+json">${buildSchema()}</script>`;
  return buildHead({
    title: `Portfolio — ${c.BUSINESS_NAME}`,
    description: `Browse our portfolio of ${c.TRADE.toLowerCase()} projects across ${c.SERVICE_AREA}. Before and after photos of real completed jobs.`,
    canonical: "/portfolio/",
    extraSchema: schema,
  }) + `

${buildHeader()}

<main>
  <div class="portfolio-hero">
    <div class="container">
      <span class="section-label">Our Work</span>
      <h1>Project Portfolio</h1>
      <p>Real transformations across ${esc(c.SERVICE_AREA)}. Drag the sliders to see before &amp; after.</p>
      <div class="portfolio-stats">
        ${pCount ? `<div class="portfolio-stat"><div class="pstat-num">${esc(String(pCount))}+</div><div class="pstat-label">Projects Completed</div></div>` : ""}
        ${c.RATING_TEXT ? `<div class="portfolio-stat"><div class="pstat-num">5.0★</div><div class="pstat-label">${esc(c.RATING_TEXT)}</div></div>` : ""}
        <div class="portfolio-stat"><div class="pstat-num">${esc(c.YEARS_TRADING)}+</div><div class="pstat-label">Years Experience</div></div>
      </div>
    </div>
  </div>

  <section style="background:var(--surface);">
    <div class="container">
      ${cats.length > 0 ? `<div class="filter-bar" role="group" aria-label="Filter projects">${filterBtns}</div>` : ""}
      <div class="project-grid" id="project-grid">
        ${shown.map(p => buildProjectCard(p)).join("")}
        ${more.map(p => buildProjectCard(p, true)).join("")}
      </div>
      ${more.length > 0 ? `<div class="load-more-wrap"><button id="load-more" class="btn btn-ghost">Load More Projects</button></div>` : ""}
    </div>
  </section>

  ${testimonials.length > 0 ? `
  <section style="background:var(--card);">
    <div class="container">
      <div class="testimonial-card" style="max-width:680px;margin:0 auto;text-align:center;">
        <div class="stars">${stars(testimonials[0].stars)}</div>
        <blockquote style="font-size:1.15rem;">${esc(testimonials[0].text)}</blockquote>
        <div class="testimonial-author">${esc(testimonials[0].name)}</div>
        <div class="testimonial-location">${esc(testimonials[0].location)}</div>
      </div>
    </div>
  </section>` : ""}

  ${buildCtaBand()}
</main>

${buildFooter()}
${buildScripts()}`;
}

function buildServicePage(service) {
  const serviceFaqs = service.faqs && service.faqs.length ? service.faqs : faqs.slice(0, 4);
  const schema = `
    <script type="application/ld+json">${buildSchema()}</script>
    ${serviceFaqs.length ? `<script type="application/ld+json">${buildFaqSchema(serviceFaqs)}</script>` : ""}`;
  const metaTitle = `${service.name} in ${c.SERVICE_AREA} — ${c.BUSINESS_NAME}`;
  const metaDesc  = service.longDescription
    ? service.longDescription.slice(0, 155) + "…"
    : `Expert ${service.name.toLowerCase()} services in ${c.SERVICE_AREA}. Free quotes, fully insured. Call ${c.PHONE}.`;

  return buildHead({
    title: metaTitle,
    description: metaDesc,
    canonical: `/services/${service.slug}/`,
    extraSchema: schema,
  }) + `

${buildHeader()}

<main>
  <div class="service-page-hero">
    <div class="container">
      <div class="breadcrumb">
        <a href="/">Home</a> / <a href="/services/${esc(service.slug)}/">${esc(service.name)}</a>
      </div>
      <h1>${esc(service.name)} in ${esc(c.SERVICE_AREA)}</h1>
      <p>${esc(service.description || `Professional ${service.name.toLowerCase()} services across ${c.SERVICE_AREA}.`)}</p>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;">
        <a href="/contact/" class="btn btn-primary">Get a Free Quote</a>
        <a href="tel:${esc(c.PHONE_HREF)}" class="btn btn-outline">${svg("phone", 16)} ${esc(c.PHONE)}</a>
      </div>
    </div>
  </div>

  <div class="service-page-body">
    <div class="container">
      <div class="service-page-grid">
        <div class="service-page-content">
          ${service.heroImage ? `<img src="${esc(service.heroImage)}" alt="${esc(service.name)} — ${esc(c.SERVICE_AREA)}" loading="lazy" style="width:100%;border-radius:var(--radius-lg);margin-bottom:2rem;aspect-ratio:16/9;object-fit:cover;" />` : ""}
          <h2>About Our ${esc(service.name)} Service</h2>
          <p>${esc(service.longDescription || service.description || `We provide expert ${service.name.toLowerCase()} services across ${c.SERVICE_AREA}. With over ${c.YEARS_TRADING} years of experience and a track record of ${c.CUSTOMER_COUNT || "hundreds of"} satisfied customers, we deliver outstanding results every time.`)}</p>
          ${serviceFaqs.length ? buildFaqSection(serviceFaqs) : ""}
        </div>
        <div class="service-page-sidebar">
          <h3>Get a Free Quote</h3>
          <a href="/contact/" class="btn btn-primary">Request a Quote</a>
          <a href="tel:${esc(c.PHONE_HREF)}" class="btn btn-ghost">${svg("phone", 16)} ${esc(c.PHONE)}</a>
          <div class="sidebar-trust">
            <div class="sidebar-trust-item">${svg("check", 16)} Free, no-obligation quote</div>
            <div class="sidebar-trust-item">${svg("shield", 16)} Fully insured</div>
            <div class="sidebar-trust-item">${svg("clock", 16)} ${esc(c.YEARS_TRADING)} years experience</div>
            <div class="sidebar-trust-item">${svg("users", 16)} No subcontractors</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  ${buildCtaBand()}
</main>

${buildFooter()}
${buildScripts()}`;
}

function buildAboutPage() {
  const schema = `<script type="application/ld+json">${buildSchema()}</script>`;
  return buildHead({
    title: `About Us — ${c.BUSINESS_NAME}`,
    description: `Learn about ${c.BUSINESS_NAME}, ${c.TRADE.toLowerCase()} specialists serving ${c.SERVICE_AREA} for over ${c.YEARS_TRADING} years.`,
    canonical: "/about/",
    extraSchema: schema,
  }) + `

${buildHeader()}

<main>
  <div class="about-hero">
    <div class="container">
      <span class="section-label">Our Story</span>
      <h1>About ${esc(c.BUSINESS_NAME)}</h1>
      <p>Serving ${esc(c.SERVICE_AREA)} with pride for over ${esc(c.YEARS_TRADING)} years.</p>
    </div>
  </div>

  <section class="about-body">
    <div class="container">
      <div class="about-grid">
        <div class="about-img">
          <img src="/images/about.jpg" alt="${esc(c.BUSINESS_NAME)} team" loading="lazy"
            onerror="this.src='/images/about-placeholder.svg'" />
        </div>
        <div class="about-text">
          <span class="section-label">Who We Are</span>
          <h2>${esc(c.BUSINESS_NAME)}</h2>
          <p>${esc(c.ABOUT_TEXT)}</p>
          <div class="about-stats">
            <div class="stat-item">
              <div class="stat-num">${esc(c.YEARS_TRADING)}+</div>
              <div class="stat-label">Years Experience</div>
            </div>
            ${c.CUSTOMER_COUNT ? `<div class="stat-item">
              <div class="stat-num">${esc(c.CUSTOMER_COUNT.replace(/[^\d+]/g, ""))}+</div>
              <div class="stat-label">Happy Customers</div>
            </div>` : ""}
            ${c.RATING_TEXT ? `<div class="stat-item">
              <div class="stat-num">5★</div>
              <div class="stat-label">Average Rating</div>
            </div>` : ""}
          </div>
          <a href="/contact/" class="btn btn-dark" style="margin-top:1.5rem;">Get a Free Quote</a>
        </div>
      </div>
    </div>
  </section>

  ${buildWhyUs()}
  ${buildCtaBand()}
</main>

${buildFooter()}
${buildScripts()}`;
}

function buildReviewsPage() {
  const schema = `<script type="application/ld+json">${buildSchema()}</script>`;
  return buildHead({
    title: `Customer Reviews — ${c.BUSINESS_NAME}`,
    description: `Read genuine customer reviews for ${c.BUSINESS_NAME}. ${c.RATING_TEXT || "5-star rated"} ${c.TRADE.toLowerCase()} specialists in ${c.SERVICE_AREA}.`,
    canonical: "/reviews/",
    extraSchema: schema,
  }) + `

${buildHeader()}

<main>
  <div class="reviews-hero">
    <div class="container">
      <span class="section-label">What Customers Say</span>
      <h1>Customer Reviews</h1>
      <p>Don't just take our word for it — read what homeowners across ${esc(c.SERVICE_AREA)} say about our work.</p>
      ${c.RATING_TEXT ? `<div class="rating-band" style="max-width:500px;margin:0 auto;">
        <div class="rating-band-score">
          <div class="big-score" style="color:var(--brand-2)">5.0</div>
          <div class="score-stars">★★★★★</div>
          <div class="score-label" style="color:rgba(255,255,255,.6)">${esc(c.RATING_TEXT)}</div>
        </div>
        ${c.CUSTOMER_COUNT ? `<div class="rating-band-sep" style="background:rgba(255,255,255,.2)"></div>
        <div class="rating-band-score">
          <div class="big-score" style="color:var(--brand-2)">${esc(c.CUSTOMER_COUNT.replace(/[^\d+]/g, ""))}+</div>
          <div class="score-label" style="color:rgba(255,255,255,.6)">Happy Customers</div>
        </div>` : ""}
      </div>` : ""}
    </div>
  </div>

  <section class="reviews-body">
    <div class="container">
      <div class="reviews-grid">
        ${testimonials.map(t => `
        <div class="testimonial-card">
          <div class="stars">${stars(t.stars)}</div>
          <blockquote>${esc(t.text)}</blockquote>
          <div class="testimonial-author">${esc(t.name)}</div>
          <div class="testimonial-location">${esc(t.location)}</div>
        </div>`).join("")}
      </div>
      ${c.GOOGLE_MAPS_URL ? `
      <div style="text-align:center;margin-top:1rem;">
        <a href="${esc(c.GOOGLE_MAPS_URL)}" target="_blank" rel="noopener" class="btn btn-dark">
          View All Reviews on Google ${svg("arrow", 16)}
        </a>
      </div>` : ""}
    </div>
  </section>

  ${buildCtaBand()}
</main>

${buildFooter()}
${buildScripts()}`;
}

function buildContactPage() {
  const serviceOpts = services.map(s =>
    `<option value="${esc(s.name)}">${esc(s.name)}</option>`
  ).concat([`<option value="Other / Not sure">Other / Not sure</option>`]).join("\n");

  const hoursRows = (c.HOURS || []).map(h =>
    `<li><span>${esc(h.day)}</span><span>${esc(h.hours)}</span></li>`
  ).join("");

  const schema = `<script type="application/ld+json">${buildSchema()}</script>`;
  return buildHead({
    title: `Contact Us — ${c.BUSINESS_NAME}`,
    description: `Get a free quote from ${c.BUSINESS_NAME}. Call ${c.PHONE} or fill in our quick form. ${c.TRADE} specialists in ${c.SERVICE_AREA}.`,
    canonical: "/contact/",
    extraSchema: schema,
  }) + `

${buildHeader()}

<main>
  <div class="contact-hero">
    <div class="container">
      <span class="section-label">Get in Touch</span>
      <h1>Request a Free Quote</h1>
      <p>Tell us about your project and we'll get back to you within 24 hours — usually much sooner.</p>
    </div>
  </div>

  <section class="contact-body">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-form-wrap">
          <h2>Tell Us About Your Project</h2>
          <p>Complete the form below and we'll prepare a tailored quote.</p>
          <div class="contact-reassurances">
            <div class="reassurance-item">${svg("check", 16)} No-obligation — free site visit included</div>
            <div class="reassurance-item">${svg("check", 16)} Respond within 24 hours</div>
            <div class="reassurance-item">${svg("check", 16)} Fully insured &amp; guaranteed work</div>
          </div>
          <form id="contact-form" novalidate>
            <input type="hidden" name="access_key"  value="${esc(c.WEB3FORMS_KEY)}" />
            <input type="hidden" name="subject"     value="New enquiry from ${esc(c.BUSINESS_NAME)} website" />
            <input type="hidden" name="from_name"   value="${esc(c.BUSINESS_NAME)} Website" />
            <input type="checkbox" name="botcheck" style="display:none" />
            <div class="form-group">
              <label for="f-name">Your Name *</label>
              <input type="text" id="f-name" name="name" required placeholder="John Smith" />
            </div>
            <div class="form-group">
              <label for="f-phone">Phone Number *</label>
              <input type="tel" id="f-phone" name="phone" required placeholder="07700 900000" />
            </div>
            <div class="form-group">
              <label for="f-email">Email Address</label>
              <input type="email" id="f-email" name="email" placeholder="john@example.com" />
            </div>
            <div class="form-group">
              <label for="f-service">Service Required *</label>
              <select id="f-service" name="service" required>
                <option value="" disabled selected>Select a service…</option>
                ${serviceOpts}
              </select>
            </div>
            <div class="form-group">
              <label for="f-message">Tell us about your project</label>
              <textarea id="f-message" name="message" placeholder="e.g. Double driveway, approx 50m²…"></textarea>
            </div>
            <button type="submit" class="btn btn-primary form-submit">Send Enquiry</button>
            <p class="form-status" id="contact-form-status" aria-live="polite"></p>
          </form>
        </div>

        <div class="contact-info-wrap">
          <div class="contact-info-card">
            <h3>Contact Details</h3>
            <div class="contact-detail">
              <div class="contact-detail-icon">${svg("phone", 20)}</div>
              <div><h4>Phone</h4><a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a></div>
            </div>
            <div class="contact-detail">
              <div class="contact-detail-icon">${svg("mail", 20)}</div>
              <div><h4>Email</h4><a href="mailto:${esc(c.EMAIL)}">${esc(c.EMAIL)}</a></div>
            </div>
            ${c.WHATSAPP_ENABLED && c.WHATSAPP_NUMBER ? `<div class="contact-detail">
              <div class="contact-detail-icon" style="background:#25D366;color:#fff;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </div>
              <div><h4>WhatsApp</h4><a href="https://wa.me/${esc(c.WHATSAPP_NUMBER)}">Message Us</a></div>
            </div>` : ""}
            <div class="contact-detail">
              <div class="contact-detail-icon">${svg("pin", 20)}</div>
              <div><h4>Service Area</h4><p style="margin:0;color:var(--ink)">${esc(c.SERVICE_AREA)}</p></div>
            </div>
          </div>

          ${hoursRows ? `<div class="contact-info-card">
            <h3>Opening Hours</h3>
            <ul class="hours-list">${hoursRows}</ul>
          </div>` : ""}

          ${c.GOOGLE_MAPS_EMBED_URL ? `<div class="contact-info-card" style="padding:0;overflow:hidden;">
            <div class="map-embed">
              <iframe src="${esc(c.GOOGLE_MAPS_EMBED_URL)}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>` : ""}
        </div>
      </div>
    </div>
  </section>

  ${buildCtaBand()}
</main>

${buildFooter()}
${buildScripts()}`;
}

function buildSitemap() {
  const pages = [
    { loc: `https://${domain}/`, priority: "1.0" },
    { loc: `https://${domain}/portfolio/`, priority: "0.9" },
    { loc: `https://${domain}/about/`, priority: "0.8" },
    { loc: `https://${domain}/reviews/`, priority: "0.8" },
    { loc: `https://${domain}/contact/`, priority: "0.9" },
    ...services.map(s => ({ loc: `https://${domain}/services/${s.slug}/`, priority: "0.85" })),
  ];
  const today = new Date().toISOString().split("T")[0];
  const urls  = pages.map(p =>
    `  <url><loc>${p.loc}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

// ── Main build ────────────────────────────────────────────

fs.mkdirSync(DIST, { recursive: true });

writeFile(path.join(DIST, "index.html"), buildHomePage());
writeFile(path.join(DIST, "portfolio/index.html"), buildPortfolioPage());
writeFile(path.join(DIST, "about/index.html"), buildAboutPage());
writeFile(path.join(DIST, "reviews/index.html"), buildReviewsPage());
writeFile(path.join(DIST, "contact/index.html"), buildContactPage());

services.forEach(service => {
  writeFile(path.join(DIST, `services/${service.slug}/index.html`), buildServicePage(service));
});

writeFile(path.join(DIST, "sitemap.xml"), buildSitemap());

copyDir(path.join(ROOT, "src"),    path.join(DIST, "src"));
copyDir(path.join(ROOT, "images"), path.join(DIST, "images"));
copyDir(path.join(ROOT, "admin"),  path.join(DIST, "admin"));

if (fs.existsSync(path.join(ROOT, "_redirects"))) {
  fs.copyFileSync(path.join(ROOT, "_redirects"), path.join(DIST, "_redirects"));
}

console.log("✅ Build complete →");
console.log(`   Home:      dist/index.html`);
console.log(`   Portfolio: dist/portfolio/`);
console.log(`   Pages:     about, reviews, contact`);
console.log(`   Services:  ${services.map(s => s.slug).join(", ")}`);
console.log(`   Sitemap:   dist/sitemap.xml`);

#!/usr/bin/env node
// ============================================================
// GROUNDWORK STUDIOS — STATIC BUILD SCRIPT
// Usage: node build.js
// Reads site.config.js, writes fully-resolved HTML to dist/
// No browser-side token replacement. All values baked in.
// ============================================================

const fs   = require("fs");
const path = require("path");

const base = require("./site.config.js");

const ROOT = __dirname;

// ---- merge _data/ overrides (written by Decap CMS) on top of config ----
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

const dataContact     = readJson(path.join(ROOT, "_data/contact.json"))   || {};
const dataAbout       = readJson(path.join(ROOT, "_data/about.json"))     || {};
const dataServices    = readJson(path.join(ROOT, "_data/services.json"))  || {};
const dataTestimonials = readDataDir("testimonials");
const dataGallery      = readDataDir("gallery");
const dataFaqs         = readDataDir("faqs");

const c = {
  ...base,
  // contact overrides
  ...(dataContact.phone        ? { PHONE: dataContact.phone }               : {}),
  ...(dataContact.phone_href   ? { PHONE_HREF: dataContact.phone_href }     : {}),
  ...(dataContact.email        ? { EMAIL: dataContact.email }               : {}),
  ...(dataContact.whatsapp_number ? { WHATSAPP_NUMBER: dataContact.whatsapp_number } : {}),
  ...(dataContact.hours?.length   ? { HOURS: dataContact.hours }            : {}),
  // about overrides
  ...(dataAbout.about_text     ? { ABOUT_TEXT: dataAbout.about_text }       : {}),
  ...(dataAbout.years_trading  ? { YEARS_TRADING: dataAbout.years_trading } : {}),
  // services override (Decap stores as { services: ["name",...] })
  ...(dataServices.services?.length
    ? { SERVICES: dataServices.services.map(s => typeof s === "string" ? { name: s, description: "" } : s) }
    : {}),
  // CMS collections override base arrays when present
  ...(dataTestimonials.length  ? { TESTIMONIALS: dataTestimonials }         : {}),
  ...(dataGallery.length       ? { GALLERY: dataGallery }                   : {}),
  ...(dataFaqs.length          ? { FAQS: dataFaqs.map(f => ({ q: f.question, a: f.answer })) } : {}),
};
const DIST = path.join(ROOT, "dist");

// ---- helpers ----
function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stars(n) { return "★".repeat(Math.min(5, Math.max(1, n || 5))); }

const iconPaths = [
  '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
];

// ---- derived values ----
const businessShort = c.BUSINESS_NAME.split(" ")[0];
const heroHeadline  = c.HERO_HEADLINE    || `Expert ${c.TRADE} in ${c.SERVICE_AREA}`;
const heroSubline   = c.HERO_SUBHEADLINE || `Quality work, honest prices. Serving ${c.SERVICE_AREA} for over ${c.YEARS_TRADING} years.`;
const waMsg         = encodeURIComponent(c.WHATSAPP_MESSAGE || "Hi, I'd like a free quote please");
const domain        = c.DOMAIN || "example.co.uk";

// ---- build sections ----

function buildServicesGrid() {
  return c.SERVICES.map((s, i) => {
    const name = typeof s === "string" ? s : s.name;
    const desc = typeof s === "string"
      ? `Professional ${esc(name.toLowerCase())} service delivered to the highest standard across ${esc(c.SERVICE_AREA)}.`
      : esc(s.description);
    return `
      <div class="service-card">
        <div class="service-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${iconPaths[i % iconPaths.length]}</svg>
        </div>
        <h3>${esc(name)}</h3>
        <p>${desc}</p>
      </div>`;
  }).join("\n");
}

function buildServiceOptions() {
  const opts = c.SERVICES.map((s) => {
    const name = typeof s === "string" ? s : s.name;
    return `<option value="${esc(name)}">${esc(name)}</option>`;
  });
  opts.push(`<option value="Other / Not sure">Other / Not sure</option>`);
  return opts.join("\n");
}

function buildFooterServices() {
  return c.SERVICES.map((s) => {
    const name = typeof s === "string" ? s : s.name;
    return `<li><a href="#services">${esc(name)}</a></li>`;
  }).join("\n");
}

function buildTestimonials() {
  return c.TESTIMONIALS.map((t) => `
    <div class="testimonial-card">
      <div class="stars">${stars(t.stars)}</div>
      <blockquote>"${esc(t.text)}"</blockquote>
      <div class="testimonial-author">${esc(t.name)}</div>
      <div class="testimonial-location">${esc(t.location)}</div>
    </div>`).join("\n");
}

function buildGallery() {
  if (!c.GALLERY || c.GALLERY.length === 0) {
    const placeholders = [
      `${c.TRADE} — ${c.SERVICE_AREA}`,
      `Recent project — ${c.SERVICE_AREA}`,
      `Completed job — ${c.SERVICE_AREA}`,
    ];
    return placeholders.map((cap) => `
      <div class="gallery-pair">
        <div class="gallery-pair-images">
          <div class="gallery-img-wrap">
            <img src="images/placeholder.svg" alt="Before — ${esc(cap)}" width="400" height="300" loading="lazy" />
            <span class="gallery-label">Before</span>
          </div>
          <div class="gallery-img-wrap">
            <img src="images/placeholder.svg" alt="After — ${esc(cap)}" width="400" height="300" loading="lazy" />
            <span class="gallery-label after">After</span>
          </div>
        </div>
        <p class="gallery-caption">${esc(cap)}</p>
      </div>`).join("\n");
  }
  return c.GALLERY.map((g) => `
    <div class="gallery-pair">
      <div class="gallery-pair-images">
        <div class="gallery-img-wrap">
          <img src="${esc(g.before)}" alt="Before — ${esc(g.caption)}" width="400" height="300" loading="lazy" />
          <span class="gallery-label">Before</span>
        </div>
        <div class="gallery-img-wrap">
          <img src="${esc(g.after)}" alt="After — ${esc(g.caption)}" width="400" height="300" loading="lazy" />
          <span class="gallery-label after">After</span>
        </div>
      </div>
      <p class="gallery-caption">${esc(g.caption)}</p>
    </div>`).join("\n");
}

function buildFaqs() {
  return c.FAQS.map((f) => `
    <div class="faq-item">
      <button class="faq-question" aria-expanded="false">
        ${esc(f.q)}
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-answer">${esc(f.a)}</div>
    </div>`).join("\n");
}

function buildHours() {
  return c.HOURS.map((h) =>
    `<li><span>${esc(h.day)}</span><span>${esc(h.hours)}</span></li>`
  ).join("\n");
}

function buildHeroTrust() {
  const items = [];
  if (c.RATING_TEXT) {
    items.push(`<span class="hero-trust-item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      ${esc(c.RATING_TEXT)}</span>`);
  }
  items.push(`<span class="hero-trust-item">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    Fully Insured</span>`);
  items.push(`<span class="hero-trust-item">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ${esc(c.YEARS_TRADING)} Years Experience</span>`);
  items.push(`<span class="hero-trust-item">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    ${esc(c.SERVICE_AREA)}</span>`);
  return items.join("\n");
}

function buildAboutStats() {
  const stats = [];
  stats.push(`<div><div class="stat-num">${esc(c.YEARS_TRADING)}+</div><div class="stat-label">Years in business</div></div>`);
  if (c.CUSTOMER_COUNT) {
    stats.push(`<div><div class="stat-num">${esc(c.CUSTOMER_COUNT)}</div><div class="stat-label">Happy customers</div></div>`);
  }
  if (c.RATING_TEXT) {
    stats.push(`<div><div class="stat-num">5★</div><div class="stat-label">Average rating</div></div>`);
  }
  return stats.join("\n");
}

function buildSchema() {
  const sameAs = [c.FACEBOOK_URL, c.INSTAGRAM_URL, c.GOOGLE_MAPS_URL].filter(Boolean);

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": c.BUSINESS_NAME,
    "description": c.META_DESCRIPTION,
    "url": `https://${domain}/`,
    "telephone": c.PHONE,
    "email": c.EMAIL,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": c.ADDRESS_STREET,
      "addressLocality": c.ADDRESS_CITY,
      "postalCode": c.ADDRESS_POSTCODE,
      "addressCountry": "GB"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": c.OPENS_WEEKDAY || "08:00",
        "closes": c.CLOSES_WEEKDAY || "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": c.OPENS_SAT || "09:00",
        "closes": c.CLOSES_SAT || "13:00"
      }
    ],
    ...(sameAs.length ? { "sameAs": sameAs } : {})
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": c.FAQS.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return { localBusiness, faqSchema };
}

function buildCfAnalytics() {
  if (!c.CF_ANALYTICS_TOKEN) return "";
  return `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${c.CF_ANALYTICS_TOKEN}"}'></script>`;
}

function buildWhatsApp() {
  if (!c.WHATSAPP_ENABLED || !c.WHATSAPP_NUMBER) return "";
  return `<a id="whatsapp-btn"
   href="https://wa.me/${esc(c.WHATSAPP_NUMBER)}?text=${waMsg}"
   aria-label="Chat on WhatsApp"
   target="_blank"
   rel="noopener">
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
</a>`;
}

function buildSocialLinks() {
  const links = [];
  if (c.FACEBOOK_URL) links.push(`<a href="${esc(c.FACEBOOK_URL)}" aria-label="Facebook" rel="noopener" target="_blank">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>`);
  if (c.INSTAGRAM_URL) links.push(`<a href="${esc(c.INSTAGRAM_URL)}" aria-label="Instagram" rel="noopener" target="_blank">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>`);
  return links.join("\n");
}

// ---- assemble HTML ----
function buildHtml() {
  const schema = buildSchema();
  const year   = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(c.META_TITLE)}</title>
  <meta name="description" content="${esc(c.META_DESCRIPTION)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://${esc(domain)}/" />

  <meta property="og:title"       content="${esc(c.META_TITLE)}" />
  <meta property="og:description" content="${esc(c.META_DESCRIPTION)}" />
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="https://${esc(domain)}/" />
  <meta property="og:image"       content="https://${esc(domain)}/images/og-image.jpg" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="src/css/style.css" />

  <script type="application/ld+json">${JSON.stringify(schema.localBusiness, null, 2)}</script>
  <script type="application/ld+json">${JSON.stringify(schema.faqSchema, null, 2)}</script>
  ${buildCfAnalytics()}
</head>
<body>

<header id="site-header" role="banner">
  <div class="header-inner">
    <a href="#hero" class="site-logo">${esc(businessShort)}<span>.</span></a>
    <nav class="nav-links" aria-label="Primary navigation">
      <a href="#services">Services</a>
      <a href="#gallery">Gallery</a>
      <a href="#about">About</a>
      <a href="#testimonials">Reviews</a>
      <a href="#faq">FAQ</a>
      <a href="#contact">Contact</a>
    </nav>
    <a href="tel:${esc(c.PHONE_HREF)}" class="btn btn-primary nav-cta">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      Call Now
    </a>
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
    <a href="#services">Services</a>
    <a href="#gallery">Gallery</a>
    <a href="#about">About</a>
    <a href="#testimonials">Reviews</a>
    <a href="#faq">FAQ</a>
    <a href="#contact">Contact</a>
    <a href="tel:${esc(c.PHONE_HREF)}" class="btn btn-primary" style="text-align:center;">📞 ${esc(c.PHONE)}</a>
  </nav>
</header>

<section id="hero" role="main">
  <div class="hero-inner">
    <span class="hero-badge">${esc(c.SERVICE_AREA)}</span>
    <h1>${esc(heroHeadline)}</h1>
    <p class="hero-sub">${esc(heroSubline)}</p>
    <div class="hero-actions">
      <a href="#contact" class="btn btn-primary">Get a Free Quote</a>
      <a href="tel:${esc(c.PHONE_HREF)}" class="btn btn-outline">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        ${esc(c.PHONE)}
      </a>
    </div>
    <div class="hero-trust">
      ${buildHeroTrust()}
    </div>
  </div>
</section>

<section id="services" aria-labelledby="services-heading">
  <div class="container">
    <span class="section-label">What We Do</span>
    <h2 class="section-title" id="services-heading">Our Services</h2>
    <p class="section-intro">Professional ${esc(c.TRADE)} services delivered to the highest standard across ${esc(c.SERVICE_AREA)}.</p>
    <div class="services-grid">
      ${buildServicesGrid()}
    </div>
  </div>
</section>

<section id="why-us" aria-labelledby="why-heading">
  <div class="container">
    <span class="section-label">Why Choose Us</span>
    <h2 class="section-title" id="why-heading">The ${esc(businessShort)} Difference</h2>
    <div class="usps-grid">
      <div class="usp-item">
        <div class="usp-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
        <div><h3>Free, No-Obligation Quotes</h3><p>We visit your property, assess the job and give you a clear written quote — no pressure, no hidden costs.</p></div>
      </div>
      <div class="usp-item">
        <div class="usp-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
        <div><h3>Fully Insured &amp; Guaranteed</h3><p>All work is covered by public liability insurance and backed by our workmanship guarantee.</p></div>
      </div>
      <div class="usp-item">
        <div class="usp-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <div><h3>${esc(c.YEARS_TRADING)} Years Local Experience</h3><p>Trusted by homeowners across ${esc(c.SERVICE_AREA)} for over ${esc(c.YEARS_TRADING)} years. Our reputation is everything.</p></div>
      </div>
      <div class="usp-item">
        <div class="usp-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <div><h3>No Subcontractors</h3><p>Your job is done by our own skilled team, not passed off to third parties. Same quality every time.</p></div>
      </div>
      <div class="usp-item">
        <div class="usp-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
        <div><h3>Clear, Honest Pricing</h3><p>The price we quote is the price you pay. We explain every cost upfront before any work begins.</p></div>
      </div>
      <div class="usp-item">
        <div class="usp-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
        <div><h3>Responsive &amp; Easy to Reach</h3><p>We answer calls and messages quickly. You'll always know where you stand on your project.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="gallery" aria-labelledby="gallery-heading">
  <div class="container">
    <span class="section-label">Our Work</span>
    <h2 class="section-title" id="gallery-heading">Before &amp; After</h2>
    <p class="section-intro">Real jobs, real results. Scroll through our recent work across ${esc(c.SERVICE_AREA)}.</p>
    <div class="gallery-grid">
      ${buildGallery()}
    </div>
  </div>
</section>

<section id="testimonials" aria-labelledby="testimonials-heading">
  <div class="container">
    <span class="section-label">What Customers Say</span>
    <h2 class="section-title" id="testimonials-heading">Real Reviews</h2>
    <p class="section-intro">Don't just take our word for it.</p>
    <div class="testimonials-grid">
      ${buildTestimonials()}
    </div>
  </div>
</section>

<section id="about" aria-labelledby="about-heading">
  <div class="container">
    <div class="about-inner">
      <div class="about-img">
        <img src="images/about.jpg" alt="${esc(c.BUSINESS_NAME)} team" loading="lazy" width="600" height="400" onerror="this.src='images/about-placeholder.svg'" />
      </div>
      <div class="about-content">
        <span class="section-label">About Us</span>
        <h2 class="section-title" id="about-heading">About ${esc(c.BUSINESS_NAME)}</h2>
        <p>${esc(c.ABOUT_TEXT)}</p>
        <a href="#contact" class="btn btn-dark">Get a Free Quote</a>
        <div class="about-stats">
          ${buildAboutStats()}
        </div>
      </div>
    </div>
  </div>
</section>

<section id="faq" aria-labelledby="faq-heading">
  <div class="container">
    <span class="section-label">FAQ</span>
    <h2 class="section-title" id="faq-heading">Frequently Asked Questions</h2>
    <div class="faq-list">
      ${buildFaqs()}
    </div>
  </div>
</section>

<section id="contact" aria-labelledby="contact-heading">
  <div class="container">
    <span class="section-label">Get in Touch</span>
    <h2 class="section-title" id="contact-heading">Request a Free Quote</h2>
    <div class="contact-inner">
      <div class="contact-details">
        <div class="contact-detail">
          <div class="contact-detail-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
          <div><h4>Phone</h4><a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a></div>
        </div>
        <div class="contact-detail">
          <div class="contact-detail-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
          <div><h4>Email</h4><a href="mailto:${esc(c.EMAIL)}">${esc(c.EMAIL)}</a></div>
        </div>
        <div class="contact-detail">
          <div class="contact-detail-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div><h4>Opening Hours</h4><ul class="hours-list">${buildHours()}</ul></div>
        </div>
        <div class="contact-detail">
          <div class="contact-detail-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
          <div><h4>Service Area</h4><p>${esc(c.SERVICE_AREA)}</p></div>
        </div>
      </div>

      <div class="contact-form">
        <form id="contact-form" novalidate>
          <input type="hidden" name="access_key" value="${esc(c.WEB3FORMS_KEY)}" />
          <input type="hidden" name="subject" value="New enquiry from ${esc(c.BUSINESS_NAME)} website" />
          <input type="hidden" name="from_name" value="${esc(c.BUSINESS_NAME)} Website" />
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
              ${buildServiceOptions()}
            </select>
          </div>
          <div class="form-group">
            <label for="f-message">Tell us about your project</label>
            <textarea id="f-message" name="message" placeholder="e.g. Double driveway, block paving, approx 50m²…"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">Send Enquiry</button>
          <p class="form-status" id="form-status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  </div>
</section>

<footer id="site-footer" role="contentinfo">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="#hero" class="site-logo">${esc(businessShort)}<span>.</span></a>
        <p>Professional ${esc(c.TRADE)} serving ${esc(c.SERVICE_AREA)}. Quality work, honest prices.</p>
      </div>
      <div class="footer-links">
        <h4>Services</h4>
        <ul>${buildFooterServices()}</ul>
      </div>
      <div class="footer-links">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a></li>
          <li><a href="mailto:${esc(c.EMAIL)}">${esc(c.EMAIL)}</a></li>
          <li>${esc(c.SERVICE_AREA)}</li>
        </ul>
        <div style="display:flex;gap:.75rem;margin-top:1rem;">
          ${buildSocialLinks()}
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${year} ${esc(c.BUSINESS_NAME)}. All rights reserved.</span>
      <span>Website by <a href="https://groundworkstudios.co.uk" rel="noopener" target="_blank">Groundwork Studios</a></span>
    </div>
  </div>
</footer>

${buildWhatsApp()}

<script src="src/js/main.js"></script>
</body>
</html>`;
}

// ---- copy assets ----
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

// ---- main ----
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, "index.html"), buildHtml(), "utf8");
copyDir(path.join(ROOT, "src"),    path.join(DIST, "src"));
copyDir(path.join(ROOT, "images"), path.join(DIST, "images"));
copyDir(path.join(ROOT, "admin"),  path.join(DIST, "admin"));
if (fs.existsSync(path.join(ROOT, "_redirects"))) {
  fs.copyFileSync(path.join(ROOT, "_redirects"), path.join(DIST, "_redirects"));
}

console.log("✅ Build complete → dist/index.html");
console.log(`   Business: ${c.BUSINESS_NAME}`);
console.log(`   Services: ${c.SERVICES.length}`);
console.log(`   FAQs:     ${c.FAQS.length}`);
console.log(`   Gallery:  ${c.GALLERY.length} pairs`);
console.log(`   WhatsApp: ${c.WHATSAPP_ENABLED ? "ON (Tier 2)" : "OFF (Tier 1)"}`);

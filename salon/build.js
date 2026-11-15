// ============================================================
// GROUNDWORK STUDIOS — SALON TEMPLATE BUILD
// Config-driven static site for hair & beauty salons.
// Called from the root build.js. `base` is the URL prefix the
// site is served under: "" on its own domain, "/salon" when it
// sits inside the driveways demo.
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
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name), d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

function duration(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

function price(s) {
  if (!s.price) return "Free";
  return `${s.from ? "from " : ""}£${s.price}`;
}

function time12(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${String(m).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
}

const ICONS = {
  phone:    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  clock:    '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  pin:      '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  mail:     '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  check:    '<path d="M20 6 9 17l-5-5"/>',
  arrow:    '<path d="M5 12h14M13 6l6 6-6 6"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  menu:     '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close:    '<path d="M18 6 6 18M6 6l12 12"/>',
  insta:    '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  user:     '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
};

function icon(name, size = 20) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

const STAR = '<svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>';
const STARS = `<span class="stars" aria-label="5 out of 5 stars">${STAR.repeat(5)}</span>`;

function build({ dist, base = "" }) {
  const c = require("./site.config.js");
  const year = new Date().getFullYear();
  const u = (p) => base + p;                    // base-aware internal URL
  const allServices = c.CATEGORIES.flatMap(cat => cat.services.map(s => ({ ...s, cat: cat.id })));
  const fromPrice = (cat) => Math.min(...cat.services.filter(s => s.price).map(s => s.price));

  // Data the front-end needs (booking flow, open-now pill)
  const hoursByDay = {};
  c.HOURS.forEach(h => { hoursByDay[h.day] = h.closed ? null : [h.open, h.close]; });
  const clientData = {
    base,
    business: c.LOGO_NAME,
    phone: c.PHONE,
    hours: hoursByDay,
    categories: c.CATEGORIES.map(cat => ({
      id: cat.id, name: cat.name, note: cat.note || "",
      services: cat.services.map(s => ({ id: s.id, name: s.name, mins: s.mins, price: s.price, from: !!s.from, note: s.note || "" })),
    })),
    team: c.TEAM.map(t => ({ id: t.id, name: t.name, role: t.role, does: t.does })),
  };
  const dataScript = `<script id="salon-data" type="application/json">${JSON.stringify(clientData).replace(/</g, "\\u003c")}</script>`;

  // ── shared partials ─────────────────────────────────────

  function head({ title, description, canonical, bodyClass = "" }) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "HairSalon",
      name: c.BUSINESS_NAME,
      telephone: c.PHONE,
      email: c.EMAIL,
      image: `https://${c.DOMAIN}/images/og-image.jpg`,
      priceRange: "££",
      address: { "@type": "PostalAddress", streetAddress: c.ADDRESS_STREET, addressLocality: c.ADDRESS_CITY, postalCode: c.ADDRESS_POSTCODE, addressCountry: "GB" },
      openingHoursSpecification: c.HOURS.filter(h => !h.closed).map(h => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.label, opens: h.open, closes: h.close })),
    };
    return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  ${c.DEMO_NOTICE ? '<meta name="robots" content="noindex" />' : ""}
  <link rel="canonical" href="https://${esc(c.DOMAIN)}${esc(canonical)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="https://${esc(c.DOMAIN)}/images/og-image.jpg" />
  <meta property="og:type" content="website" />
  <meta name="theme-color" content="#7b4257" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${u("/css/salon.css")}" />
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
<a class="skip-link" href="#main">Skip to content</a>`;
  }

  function demoBar() {
    if (!c.DEMO_NOTICE) return "";
    return `<div class="demo-bar"><span>${esc(c.DEMO_NOTICE)}</span> <a href="${esc(c.STUDIO_URL)}" target="_blank" rel="noopener">Want one like this?</a></div>`;
  }

  const NAV = [
    ["/services/", "Services & Prices"],
    ["/gallery/",  "Gallery"],
    ["/about/",    "About"],
    ["/contact/",  "Contact"],
  ];

  function header(current) {
    const links = NAV.map(([href, label]) =>
      `<li><a href="${u(href)}"${href === current ? ' aria-current="page"' : ""}>${label}</a></li>`).join("");
    return `${demoBar()}
<header class="site-header">
  <div class="container header-inner">
    <a href="${u("/")}" class="logo" aria-label="${esc(c.BUSINESS_NAME)} home">
      <span class="logo-name">${esc(c.LOGO_NAME)}</span>
      <span class="logo-tag">${esc(c.LOGO_TAG)}</span>
    </a>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul>${links}</ul>
      <a href="tel:${esc(c.PHONE_HREF)}" class="nav-phone">${icon("phone", 16)} ${esc(c.PHONE)}</a>
    </nav>
    <div class="header-actions">
      <span class="open-pill" data-open-pill hidden></span>
      <a href="${u("/book/")}" class="btn btn-primary btn-sm">Book online</a>
      <button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">${icon("menu", 22)}</button>
    </div>
  </div>
</header>`;
  }

  function hoursTable() {
    return `<table class="hours-table">
      <tbody>
        ${c.HOURS.map(h => `<tr data-day="${h.day}"><th scope="row">${h.label}</th><td>${h.closed ? "Closed" : `${time12(h.open)} to ${time12(h.close)}`}</td></tr>`).join("\n        ")}
      </tbody>
    </table>`;
  }

  function ctaBand() {
    return `<section class="cta-band">
  <div class="container cta-inner">
    <div>
      <h2>Ready when you are</h2>
      <p>Pick your service, your stylist and a time that suits. It takes about a minute.</p>
    </div>
    <div class="cta-actions">
      <a href="${u("/book/")}" class="btn btn-light">Book online ${icon("arrow", 18)}</a>
      <a href="tel:${esc(c.PHONE_HREF)}" class="btn btn-ghost-light">${icon("phone", 18)} ${esc(c.PHONE)}</a>
    </div>
  </div>
</section>`;
  }

  function footer() {
    return `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <a href="${u("/")}" class="logo logo-footer"><span class="logo-name">${esc(c.LOGO_NAME)}</span><span class="logo-tag">${esc(c.LOGO_TAG)}</span></a>
      <p class="footer-about">Independent hair and beauty salon in ${esc(c.AREA)}.</p>
      <p class="footer-insta">${icon("insta", 18)} @${esc(c.INSTAGRAM_HANDLE)}</p>
    </div>
    <div>
      <h3>Visit</h3>
      <p>${esc(c.ADDRESS_STREET)}<br />${esc(c.ADDRESS_AREA)}, ${esc(c.ADDRESS_CITY)}<br />${esc(c.ADDRESS_POSTCODE)}</p>
      <p><a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a><br /><a href="mailto:${esc(c.EMAIL)}">${esc(c.EMAIL)}</a></p>
    </div>
    <div>
      <h3>Opening hours</h3>
      ${hoursTable()}
    </div>
    <div>
      <h3>Explore</h3>
      <ul class="footer-links">
        ${NAV.map(([href, label]) => `<li><a href="${u(href)}">${label}</a></li>`).join("")}
        <li><a href="${u("/book/")}">Book online</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>&copy; ${year} ${esc(c.BUSINESS_NAME)}${c.DEMO_NOTICE ? " (demo site, sample content)" : ""}</span>
    <span>Website by <a href="${esc(c.STUDIO_URL)}" rel="noopener" target="_blank">Groundwork Studios</a></span>
  </div>
</footer>
<div class="mobile-bar">
  <a href="tel:${esc(c.PHONE_HREF)}" class="mobile-bar-call">${icon("phone", 18)} Call</a>
  <a href="${u("/book/")}" class="mobile-bar-book">${icon("calendar", 18)} Book online</a>
</div>
${dataScript}
<script src="${u("/js/salon.js")}" defer></script>
</body>
</html>`;
  }

  function pageHero(eyebrow, title, text) {
    return `<section class="page-hero">
  <div class="container">
    <span class="eyebrow">${eyebrow}</span>
    <h1>${title}</h1>
    ${text ? `<p>${text}</p>` : ""}
  </div>
</section>`;
  }

  function reviewCard(r) {
    return `<figure class="review-card">
      ${STARS}
      <blockquote>${esc(r.text)}</blockquote>
      <figcaption><strong>${esc(r.name)}</strong><span>${esc(r.service)}</span></figcaption>
    </figure>`;
  }

  function teamCard(t) {
    const cats = t.does.map(id => c.CATEGORIES.find(k => k.id === id).name).join(" · ");
    return `<article class="team-card">
      <div class="avatar" aria-hidden="true">${esc(t.name[0])}</div>
      <h3>${esc(t.name)}</h3>
      <p class="team-role">${esc(t.role)}</p>
      <p>${esc(t.bio)}</p>
      <p class="team-does">${esc(cats)}</p>
      <a class="text-link" href="${u("/book/")}?stylist=${t.id}">Book with ${esc(t.name)} ${icon("arrow", 16)}</a>
    </article>`;
  }

  function faqList() {
    return `<div class="faq-list">
      ${c.FAQS.map(f => `<details class="faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("\n      ")}
    </div>`;
  }

  function mapEmbed() {
    const d = 0.006, lat = c.MAP_LAT, lon = c.MAP_LON;
    const bbox = [lon - d * 1.6, lat - d, lon + d * 1.6, lat + d].map(n => n.toFixed(5)).join("%2C");
    return `<div class="map-wrap"><iframe title="Map showing ${esc(c.AREA)}" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&amp;layer=mapnik&amp;marker=${lat}%2C${lon}"></iframe></div>`;
  }

  // ── pages ───────────────────────────────────────────────

  function homePage() {
    const popular = ["cut-finish", "blowdry", "balayage", "gel-mani", "brow-tint", "lash-lift"]
      .map(id => allServices.find(s => s.id === id)).filter(Boolean);
    return head({ title: c.META_TITLE, description: c.META_DESCRIPTION, canonical: "/" }) + `
${header("/")}
<main id="main">
  <section class="hero">
    <img class="hero-img" src="${u(c.HERO_IMAGE)}" alt="" fetchpriority="high" />
    <div class="hero-shade"></div>
    <div class="container hero-inner">
      <span class="eyebrow eyebrow-light">${esc(c.HERO_EYEBROW)}</span>
      <h1>${esc(c.HERO_HEADLINE)}</h1>
      <p class="hero-sub">${esc(c.HERO_SUBHEADLINE)}</p>
      <form class="quick-book" action="${u("/book/")}" method="get">
        <label class="sr-only" for="qb-cat">What would you like?</label>
        <div class="quick-book-field">
          ${icon("calendar", 18)}
          <select id="qb-cat" name="cat">
            ${c.CATEGORIES.map(cat => `<option value="${cat.id}">${esc(cat.name)}</option>`).join("")}
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Find a time ${icon("arrow", 18)}</button>
      </form>
      <div class="hero-trust">
        <span class="hero-rating">${STARS} <strong>${esc(c.RATING_SCORE)}</strong> from ${esc(c.RATING_COUNT)} reviews</span>
        ${c.TRUST_CHIPS.map(t => `<span class="chip">${icon("check", 14)} ${esc(t)}</span>`).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">What we do</span>
        <h2>Everything in one visit</h2>
        <p>Clear prices, no surprises. Tap a service to see the full list and book.</p>
      </div>
      <div class="svc-grid">
        ${c.CATEGORIES.map(cat => `<a class="svc-card" href="${u("/services/")}#${cat.id}">
          <img src="${u(cat.image)}" alt="" loading="lazy" width="900" height="680" />
          <div class="svc-card-body">
            <h3>${esc(cat.name)}</h3>
            <p>${esc(cat.blurb)}</p>
            <span class="svc-from">from £${fromPrice(cat)}</span>
          </div>
        </a>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="section section-tint">
    <div class="container split">
      <div class="split-media">
        <img src="${u(c.ABOUT_IMAGE)}" alt="A stylist finishing a client's hair in the salon" loading="lazy" width="1200" height="900" />
      </div>
      <div class="split-body">
        <span class="eyebrow">Why people stay with us</span>
        <h2>A small team that takes its time</h2>
        <p class="lead">${esc(c.ABOUT_INTRO)}</p>
        <ul class="promise-list">
          ${c.PROMISES.map(p => `<li>${icon("check", 18)}<div><strong>${esc(p.title)}</strong><span>${esc(p.text)}</span></div></li>`).join("\n          ")}
        </ul>
        <a class="text-link" href="${u("/about/")}">Meet the team ${icon("arrow", 16)}</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container price-teaser">
      <div class="section-head section-head-left">
        <span class="eyebrow">Popular right now</span>
        <h2>Prices up front</h2>
        <p>The full list is one tap away. If your hair needs more time or product, we tell you before we start.</p>
        <a class="btn btn-outline" href="${u("/services/")}">See the full price list</a>
      </div>
      <ul class="price-list">
        ${popular.map(s => `<li>
          <div><strong>${esc(s.name)}</strong><span>${duration(s.mins)}</span></div>
          <span class="price">${price(s)}</span>
          <a class="btn btn-primary btn-sm" href="${u("/book/")}?s=${s.id}">Book</a>
        </li>`).join("\n        ")}
      </ul>
    </div>
  </section>

  <section class="section section-tint">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Kind words</span>
        <h2>${esc(c.RATING_SCORE)} stars from ${esc(c.RATING_COUNT)} clients</h2>
      </div>
      <div class="review-grid">
        ${c.REVIEWS.slice(0, 3).map(reviewCard).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Fresh from the chair</span>
        <h2>Recent work</h2>
      </div>
      <div class="gallery-strip">
        ${c.GALLERY.slice(0, 4).map(g => `<img src="${u(g.src)}" alt="${esc(g.alt)}" loading="lazy" />`).join("\n        ")}
      </div>
      <p class="center"><a class="text-link" href="${u("/gallery/")}">See the gallery ${icon("arrow", 16)}</a></p>
    </div>
  </section>

  <section class="section section-tint">
    <div class="container visit">
      <div>
        <span class="eyebrow">Find us</span>
        <h2>In the middle of ${esc(c.ADDRESS_AREA)}</h2>
        <p class="visit-line">${icon("pin", 18)} ${esc(c.ADDRESS_STREET)}, ${esc(c.ADDRESS_AREA)}, ${esc(c.ADDRESS_CITY)} ${esc(c.ADDRESS_POSTCODE)}</p>
        <p class="visit-line">${icon("phone", 18)} <a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a></p>
        ${hoursTable()}
      </div>
      ${mapEmbed()}
    </div>
  </section>

  ${ctaBand()}
</main>
${footer()}`;
  }

  function servicesPage() {
    return head({
      title: `Services & Prices | ${c.BUSINESS_NAME}`,
      description: `Full price list for ${c.BUSINESS_NAME} in ${c.AREA}: cuts, colour, nails, brows and bridal. Book any service online.`,
      canonical: "/services/",
    }) + `
${header("/services/")}
<main id="main">
  ${pageHero("Services & Prices", "Our full price list", "Every price is here. Tap Book next to any service to choose your stylist and time.")}
  <nav class="cat-nav" aria-label="Service categories">
    <div class="container cat-nav-inner">
      ${c.CATEGORIES.map(cat => `<a href="#${cat.id}">${esc(cat.name)}</a>`).join("")}
    </div>
  </nav>
  <section class="section section-tight">
    <div class="container narrow">
      ${c.CATEGORIES.map(cat => `<section class="price-cat" id="${cat.id}">
        <header class="price-cat-head">
          <img src="${u(cat.image)}" alt="" loading="lazy" width="900" height="680" />
          <div>
            <h2>${esc(cat.name)}</h2>
            <p>${esc(cat.blurb)}</p>
          </div>
        </header>
        <ul class="price-list price-list-full">
          ${cat.services.map(s => `<li>
            <div><strong>${esc(s.name)}</strong><span>${duration(s.mins)}${s.note ? ` · ${esc(s.note)}` : ""}</span></div>
            <span class="price">${price(s)}</span>
            <a class="btn btn-primary btn-sm" href="${u("/book/")}?s=${s.id}" aria-label="Book ${esc(s.name)}">Book</a>
          </li>`).join("\n          ")}
        </ul>
        ${cat.note ? `<p class="cat-note">${icon("clock", 16)} ${esc(cat.note)}</p>` : ""}
      </section>`).join("\n      ")}
    </div>
  </section>
  <section class="section section-tint">
    <div class="container narrow">
      <div class="section-head"><span class="eyebrow">Good to know</span><h2>Common questions</h2></div>
      ${faqList()}
    </div>
  </section>
  ${ctaBand()}
</main>
${footer()}`;
  }

  function bookPage() {
    return head({
      title: `Book Online | ${c.BUSINESS_NAME}`,
      description: `Book your appointment at ${c.BUSINESS_NAME} online. Choose a service, a stylist and a time in about a minute.`,
      canonical: "/book/",
      bodyClass: "page-book",
    }) + `
${header("/book/")}
<main id="main" class="book-main">
  <div class="container book-layout">
    <div class="book-panel" id="book-app">
      <span class="eyebrow">Book online</span>
      <h1>Book your appointment</h1>
      <ol class="steps" id="book-steps" aria-label="Booking steps">
        <li data-step="1" class="active"><span>1</span> Service</li>
        <li data-step="2"><span>2</span> Stylist</li>
        <li data-step="3"><span>3</span> Time</li>
        <li data-step="4"><span>4</span> Details</li>
      </ol>

      <section class="book-step" data-step="1">
        <h2>What would you like?</h2>
        <div class="tabs" id="cat-tabs" role="tablist" aria-label="Service categories"></div>
        <p class="cat-note" id="cat-note" hidden></p>
        <div class="option-list" id="service-list" role="radiogroup" aria-label="Services"></div>
      </section>

      <section class="book-step" data-step="2" hidden>
        <h2>Who would you like to see?</h2>
        <div class="option-list option-grid" id="stylist-list" role="radiogroup" aria-label="Stylists"></div>
      </section>

      <section class="book-step" data-step="3" hidden>
        <h2>Pick a day and time</h2>
        <div class="date-strip" id="date-strip" role="radiogroup" aria-label="Dates"></div>
        <p class="slot-heading" id="slot-heading"></p>
        <div class="slot-grid" id="slot-grid" role="radiogroup" aria-label="Available times"></div>
      </section>

      <section class="book-step" data-step="4" hidden>
        <h2>Your details</h2>
        <form id="book-form" novalidate>
          <div class="field">
            <label for="bk-name">Full name</label>
            <input type="text" id="bk-name" name="name" autocomplete="name" required />
          </div>
          <div class="field">
            <label for="bk-phone">Mobile number</label>
            <input type="tel" id="bk-phone" name="phone" autocomplete="tel" inputmode="tel" required />
            <small>We'll text your confirmation and a reminder the day before.</small>
          </div>
          <div class="field">
            <label for="bk-email">Email <span class="optional">(optional)</span></label>
            <input type="email" id="bk-email" name="email" autocomplete="email" />
          </div>
          <div class="field">
            <label for="bk-notes">Anything we should know? <span class="optional">(optional)</span></label>
            <textarea id="bk-notes" name="notes" rows="3" placeholder="e.g. first visit, very thick hair, running late from work"></textarea>
          </div>
          <label class="checkbox"><input type="checkbox" id="bk-first" name="first" /> <span>This is my first visit</span></label>
          <p class="form-error" id="book-error" role="alert" hidden></p>
        </form>
      </section>

      <div class="book-nav">
        <button type="button" class="btn btn-outline" id="book-back" hidden>Back</button>
        <button type="button" class="btn btn-primary" id="book-next" disabled>Continue</button>
      </div>

      <section class="book-done" id="book-done" hidden tabindex="-1">
        <div class="done-tick">${icon("check", 30)}</div>
        <h2>Request sent</h2>
        <p class="done-summary" id="done-summary"></p>
        <p>We'll text you shortly to confirm. If anything needs changing, just reply to that text.</p>
        <div class="done-actions">
          <button type="button" class="btn btn-primary" id="done-ics">${icon("calendar", 18)} Add to calendar</button>
          <button type="button" class="btn btn-outline" id="done-again">Book another</button>
        </div>
        ${c.DEMO_NOTICE ? '<p class="demo-note">This is a demo site, so no real booking was made.</p>' : ""}
      </section>
    </div>

    <aside class="book-summary" id="book-summary" aria-label="Your booking">
      <h2>Your booking</h2>
      <dl>
        <div><dt>Service</dt><dd id="sum-service">Not chosen yet</dd></div>
        <div><dt>Stylist</dt><dd id="sum-stylist">Not chosen yet</dd></div>
        <div><dt>When</dt><dd id="sum-when">Not chosen yet</dd></div>
        <div><dt>Length</dt><dd id="sum-mins">-</dd></div>
      </dl>
      <p class="sum-total"><span>Price</span><strong id="sum-price">-</strong></p>
      <ul class="sum-points">
        <li>${icon("check", 16)} No payment needed to book</li>
        <li>${icon("check", 16)} Free cancellation up to 24 hours before</li>
        <li>${icon("check", 16)} Text reminder the day before</li>
      </ul>
      <p class="sum-call">Prefer to talk? <a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a></p>
    </aside>
  </div>
</main>
${footer()}`;
  }

  function galleryPage() {
    return head({
      title: `Gallery | ${c.BUSINESS_NAME}`,
      description: `Recent cuts, colour, nails and bridal work from ${c.BUSINESS_NAME} in ${c.AREA}.`,
      canonical: "/gallery/",
    }) + `
${header("/gallery/")}
<main id="main">
  ${pageHero("Gallery", "Recent work", "A few favourites from the last few months. Tap any photo to see it larger.")}
  <section class="section section-tight">
    <div class="container">
      <div class="gallery-grid" id="gallery-grid">
        ${c.GALLERY.map((g, i) => `<button type="button" class="gallery-item${g.tall ? " tall" : ""}" data-index="${i}" aria-label="View larger: ${esc(g.alt)}">
          <img src="${u(g.src)}" alt="${esc(g.alt)}" loading="lazy" />
        </button>`).join("\n        ")}
      </div>
    </div>
  </section>
  <dialog class="lightbox" id="lightbox" aria-label="Photo viewer">
    <button type="button" class="lightbox-close" id="lightbox-close" aria-label="Close">${icon("close", 24)}</button>
    <img id="lightbox-img" src="" alt="" />
    <p id="lightbox-cap"></p>
  </dialog>
  ${ctaBand()}
</main>
${footer()}`;
  }

  function aboutPage() {
    return head({
      title: `About | ${c.BUSINESS_NAME}`,
      description: `${c.ABOUT_INTRO} Meet the team and book online.`,
      canonical: "/about/",
    }) + `
${header("/about/")}
<main id="main">
  ${pageHero("About us", "Four of us, one room, no rushing", esc(c.ABOUT_INTRO))}
  <section class="section section-tight">
    <div class="container split">
      <div class="split-media">
        <img src="${u(c.ABOUT_IMAGE)}" alt="A stylist finishing a client's hair in the salon" loading="lazy" width="1200" height="900" />
      </div>
      <div class="split-body">
        <h2>How we work</h2>
        ${c.ABOUT_TEXT.map(p => `<p>${esc(p)}</p>`).join("\n        ")}
        <ul class="promise-list">
          ${c.PROMISES.map(p => `<li>${icon("check", 18)}<div><strong>${esc(p.title)}</strong><span>${esc(p.text)}</span></div></li>`).join("\n          ")}
        </ul>
      </div>
    </div>
  </section>
  <section class="section section-tint">
    <div class="container">
      <div class="section-head"><span class="eyebrow">The team</span><h2>Who you'll meet</h2></div>
      <div class="team-grid">
        ${c.TEAM.map(teamCard).join("\n        ")}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-head"><span class="eyebrow">Kind words</span><h2>What clients say</h2></div>
      <div class="review-grid">
        ${c.REVIEWS.map(reviewCard).join("\n        ")}
      </div>
    </div>
  </section>
  ${ctaBand()}
</main>
${footer()}`;
  }

  function contactPage() {
    return head({
      title: `Contact & Opening Hours | ${c.BUSINESS_NAME}`,
      description: `Find ${c.BUSINESS_NAME} at ${c.ADDRESS_STREET}, ${c.ADDRESS_AREA}, ${c.ADDRESS_CITY}. Opening hours, phone and online booking.`,
      canonical: "/contact/",
    }) + `
${header("/contact/")}
<main id="main">
  ${pageHero("Contact", "Come and say hello", "The quickest way to get an appointment is to book online. For anything else, call or send us a message.")}
  <section class="section section-tight">
    <div class="container contact-grid">
      <div class="contact-cards">
        <div class="info-card">
          <h2>${icon("pin", 20)} Where we are</h2>
          <p>${esc(c.ADDRESS_STREET)}<br />${esc(c.ADDRESS_AREA)}, ${esc(c.ADDRESS_CITY)}<br />${esc(c.ADDRESS_POSTCODE)}</p>
        </div>
        <div class="info-card">
          <h2>${icon("phone", 20)} Talk to us</h2>
          <p><a href="tel:${esc(c.PHONE_HREF)}">${esc(c.PHONE)}</a><br /><a href="mailto:${esc(c.EMAIL)}">${esc(c.EMAIL)}</a></p>
        </div>
        <div class="info-card">
          <h2>${icon("clock", 20)} Opening hours</h2>
          ${hoursTable()}
        </div>
      </div>
      <div class="contact-side">
        ${mapEmbed()}
        <form class="message-form" id="message-form" novalidate>
          <h2>Send a message</h2>
          <div class="field"><label for="m-name">Name</label><input type="text" id="m-name" name="name" autocomplete="name" required /></div>
          <div class="field"><label for="m-contact">Phone or email</label><input type="text" id="m-contact" name="contact" required /></div>
          <div class="field"><label for="m-msg">Message</label><textarea id="m-msg" name="message" rows="4" required></textarea></div>
          <button type="submit" class="btn btn-primary">Send message</button>
          <p class="form-status" id="message-status" role="status" hidden></p>
        </form>
      </div>
    </div>
  </section>
  ${ctaBand()}
</main>
${footer()}`;
  }

  // ── write ───────────────────────────────────────────────

  writeFile(path.join(dist, "index.html"),          homePage());
  writeFile(path.join(dist, "services/index.html"), servicesPage());
  writeFile(path.join(dist, "book/index.html"),     bookPage());
  writeFile(path.join(dist, "gallery/index.html"),  galleryPage());
  writeFile(path.join(dist, "about/index.html"),    aboutPage());
  writeFile(path.join(dist, "contact/index.html"),  contactPage());

  copyDir(path.join(SRC, "css"),    path.join(dist, "css"));
  copyDir(path.join(SRC, "js"),     path.join(dist, "js"));
  copyDir(path.join(SRC, "images"), path.join(dist, "images"));

  console.log(`✅ Salon build complete → ${path.relative(process.cwd(), dist) || "."}${base ? ` (served at ${base}/)` : ""}`);
}

module.exports = { build };

// ============================================================
// GROUNDWORK STUDIOS — SHOWCASE SECTIONS
// Every interactive module the demo site uses to demonstrate
// what we can build. Exported as a factory so it shares the
// escaping/icon helpers and config with build.js.
// ============================================================

module.exports = function showcase(H) {
  const { c, esc, svg, svgFilled, services, portfolio, stars } = H;

  const money = n => "£" + Math.round(n).toLocaleString("en-GB");

  // ── Before/after drag slider ───────────────────────────────
  // Same geometry in both frames, so the reveal line reads as one
  // photograph changing rather than two photographs crossfading.
  function baSlider(before, after, label, opts = {}) {
    const { start = 50, tall = false } = opts;
    return `
    <div class="ba-slider${tall ? " ba-slider--tall" : ""}" data-ba style="--pos:${start}%">
      <img class="ba-slider-after"  src="${esc(after)}"  alt="${esc(label)} — after"  loading="lazy" />
      <img class="ba-slider-before" src="${esc(before)}" alt="${esc(label)} — before" loading="lazy" />
      <div class="ba-slider-handle" aria-hidden="true"><span>${svg("arrow", 15)}</span></div>
      <span class="ba-tag ba-tag--b">Before</span>
      <span class="ba-tag ba-tag--a">After</span>
      <input class="ba-range" type="range" min="0" max="100" value="${start}"
        aria-label="Reveal ${esc(label)} before and after" />
    </div>`;
  }

  // ── Availability strip ─────────────────────────────────────
  function buildAvailability() {
    const a = c.AVAILABILITY || {};
    const pct = Math.round((a.bookedThisMonth / a.capacity) * 100);
    return `
<div id="availability" class="avail-strip">
  <div class="container avail-inner">
    <span class="avail-live"><i></i> Live availability</span>
    <span class="avail-item">${svg("clock", 14)} Next free survey: <b>${esc(a.nextSurvey)}</b></span>
    <span class="avail-item">${svg("tool", 14)} Next install slot: <b>${esc(a.nextInstall)}</b></span>
    <span class="avail-meter" title="${a.bookedThisMonth} of ${a.capacity} slots booked">
      <span class="avail-bar"><span style="width:${pct}%"></span></span>
      ${a.bookedThisMonth}/${a.capacity} slots booked this month
    </span>
  </div>
</div>`;
  }

  // ── Trust / accreditation bar ──────────────────────────────
  function buildTrustBar() {
    return `
<section id="trustbar" class="trustbar" aria-label="Accreditations">
  <div class="container">
    <div class="trustbar-grid">
      ${(c.ACCREDITATIONS || []).map(a => `
      <div class="trust-badge">
        <div class="trust-badge-icon">${svg(a.icon || "shield", 20)}</div>
        <div><strong>${esc(a.name)}</strong><span>${esc(a.detail)}</span></div>
      </div>`).join("")}
    </div>
  </div>
</section>`;
  }

  // ── Instant quote calculator ───────────────────────────────
  function buildQuoteCalc() {
    const mats = (c.MATERIALS || []).map((m, i) => {
      const lo = parseInt(String(m.price).replace(/[^\d–-]/g, "").split(/[–-]/)[0], 10);
      const hi = parseInt(String(m.price).replace(/[^\d–-]/g, "").split(/[–-]/)[1], 10);
      return `<option value="${lo}|${hi}" data-name="${esc(m.name)}"${i === 1 ? " selected" : ""}>${esc(m.name)} — ${esc(m.price)}</option>`;
    }).join("");

    return `
<section id="quote-calc" class="qc" aria-labelledby="qc-heading">
  <div class="container">
    <div class="qc-grid">
      <div class="qc-intro">
        <span class="section-label">Instant Estimate</span>
        <h2 class="section-title" id="qc-heading">What Will Mine Cost?</h2>
        <p class="section-intro qc-intro-p">Move the slider to roughly the size of your drive and pick a finish.
        You'll get the same ballpark we'd give you on the phone — before anyone has to ring anyone.</p>
        <ul class="qc-points">
          <li>${svg("check", 15)} Includes excavation, sub-base and disposal</li>
          <li>${svg("check", 15)} Based on our real 2026 Rugby pricing</li>
          <li>${svg("check", 15)} No email address required to see it</li>
        </ul>
      </div>

      <div class="qc-card">
        <div class="qc-field">
          <label for="qc-area">Approximate driveway size</label>
          <output class="qc-area-out" id="qc-area-out">50 m²</output>
          <input type="range" id="qc-area" min="15" max="140" step="5" value="50" class="qc-slider" />
          <div class="qc-scale"><span>Single car</span><span>Double</span><span>Large / sweep</span></div>
        </div>

        <div class="qc-field">
          <label for="qc-material">Finish</label>
          <select id="qc-material" class="qc-select">${mats}</select>
        </div>

        <fieldset class="qc-field qc-extras">
          <legend>Anything else?</legend>
          <label><input type="checkbox" value="900" /> Dropped kerb needed <span>+ £900–£1,500</span></label>
          <label><input type="checkbox" value="480" /> Remove old concrete <span>+ £480</span></label>
          <label><input type="checkbox" value="320" /> New drainage channel <span>+ £320</span></label>
        </fieldset>

        <div class="qc-result" aria-live="polite">
          <span class="qc-result-label">Estimated range</span>
          <div class="qc-result-fig" id="qc-figure">£3,500 – £4,750</div>
          <p class="qc-result-note" id="qc-note">Herringbone Block · 50 m²</p>
        </div>

        <a href="/contact/" class="btn btn-primary qc-cta">Get this confirmed — free visit ${svg("arrow", 15)}</a>
        <p class="qc-disclaimer">Guide only. Final price always follows a site visit and comes in writing.</p>
      </div>
    </div>
  </div>
</section>`;
  }

  // ── Driveway visualiser ────────────────────────────────────
  // Swaps between the rendered scenes, which share a camera, so the
  // house stays put and only the surface changes.
  function buildVisualiser() {
    const mats = c.MATERIALS || [];
    return `
<section id="visualiser" class="vis" aria-labelledby="vis-heading">
  <div class="container">
    <span class="section-label">Try Before You Buy</span>
    <h2 class="section-title" id="vis-heading">See It On a Real Driveway</h2>
    <p class="section-intro">Pick a finish and watch the same driveway change. This is the single most-used
    feature on every trade site we build — people stay on it for minutes.</p>

    <div class="vis-stage">
      <div class="vis-frame">
        ${mats.map((m, i) => `
        <img class="vis-img${i === 0 ? " is-active" : ""}" data-vis="${i}"
          src="${esc(m.scene || m.swatch)}"
          alt="Driveway finished in ${esc(m.name)}" loading="lazy" />`).join("")}
        <div class="vis-caption">
          <strong id="vis-name">${esc(mats[0] ? mats[0].name : "")}</strong>
          <span id="vis-price">${esc(mats[0] ? mats[0].price : "")}</span>
        </div>
      </div>

      <div class="vis-picker">
        <h3>Choose your finish</h3>
        ${mats.map((m, i) => `
        <button class="vis-swatch${i === 0 ? " is-active" : ""}" data-vis-btn="${i}"
          data-name="${esc(m.name)}" data-price="${esc(m.price)}" data-note="${esc(m.note)}"
          data-traits="${esc((m.traits || []).join("|"))}" data-service="${esc(m.service)}">
          <span class="vis-swatch-img" style="background-image:url('${esc(m.swatch)}')"></span>
          <span class="vis-swatch-text">
            <strong>${esc(m.name)}</strong>
            <span>${esc(m.price)}</span>
          </span>
        </button>`).join("")}
        <div class="vis-detail">
          <p id="vis-note">${esc(mats[0] ? mats[0].note : "")}</p>
          <div class="vis-traits" id="vis-traits">
            ${(mats[0] && mats[0].traits ? mats[0].traits : []).map(t => `<span>${svg("check", 12)} ${esc(t)}</span>`).join("")}
          </div>
          <a href="/services/" id="vis-link" class="vis-link">Read about this surface ${svg("arrow", 14)}</a>
        </div>
      </div>
    </div>
  </div>
</section>`;
  }

  // ── Finance calculator ─────────────────────────────────────
  function buildFinance() {
    const f = c.FINANCE || { apr: 9.9, terms: [24, 36, 48, 60], minSpend: 1500 };
    return `
<section id="finance" class="fin" aria-labelledby="fin-heading">
  <div class="container">
    <div class="fin-grid">
      <div class="fin-card">
        <div class="fin-field">
          <label for="fin-amount">Project cost</label>
          <output class="fin-amount-out" id="fin-amount-out">£4,200</output>
          <input type="range" id="fin-amount" min="${f.minSpend}" max="12000" step="100" value="4200" class="qc-slider" />
        </div>
        <div class="fin-field">
          <label for="fin-term">Repayment term</label>
          <div class="fin-terms" id="fin-terms">
            ${f.terms.map((t, i) => `<button type="button" data-term="${t}"${i === 2 ? ` class="is-active"` : ""}>${t} mo</button>`).join("")}
          </div>
        </div>
        <div class="fin-out">
          <div class="fin-monthly"><span>Approx. monthly</span><strong id="fin-monthly">£106</strong></div>
          <div class="fin-split">
            <span>Total repayable <b id="fin-total">£5,088</b></span>
            <span>Representative APR <b>${f.apr}%</b></span>
          </div>
        </div>
        <p class="qc-disclaimer">${esc(f.note || "")}</p>
      </div>
      <div class="fin-intro">
        <span class="section-label">Spread the Cost</span>
        <h2 class="section-title" id="fin-heading">£4,200 Or £106 a Month</h2>
        <p class="section-intro qc-intro-p">Most people don't have four thousand pounds sitting spare — but almost
        everyone can find a hundred a month. Offering finance is the quickest way we know to stop a
        customer choosing the cheaper surface they didn't really want.</p>
        <ul class="qc-points">
          <li>${svg("check", 15)} Soft search — no impact on credit score to check</li>
          <li>${svg("check", 15)} Decision in minutes, work booked the same week</li>
          <li>${svg("check", 15)} Settle early at any point with no penalty</li>
        </ul>
      </div>
    </div>
  </div>
</section>`;
  }

  // ── Choose-your-finish material strip ──────────────────────
  function buildMaterials() {
    return `
<section id="materials" class="mat" aria-labelledby="mat-heading">
  <div class="container">
    <span class="section-label">Materials</span>
    <h2 class="section-title" id="mat-heading">Every Finish We Lay</h2>
    <p class="section-intro">Real close-ups of the surfaces themselves, with honest per-square-metre pricing.</p>
    <div class="mat-grid">
      ${(c.MATERIALS || []).map(m => `
      <article class="mat-card">
        <span class="mat-swatch" style="background-image:url('${esc(m.swatch)}')" role="img" aria-label="${esc(m.name)} texture"></span>
        <div class="mat-body">
          <h3>${esc(m.name)}</h3>
          <p class="mat-price">${esc(m.price)}</p>
          <p class="mat-note">${esc(m.note)}</p>
          <ul class="mat-traits">${(m.traits || []).map(t => `<li>${svg("check", 12)} ${esc(t)}</li>`).join("")}</ul>
        </div>
      </article>`).join("")}
    </div>
  </div>
</section>`;
  }

  // ── Coverage map ───────────────────────────────────────────
  const MAP_POS = {
    "Rugby": [50, 48], "Hillmorton": [60, 62], "Bilton": [38, 58], "Dunchurch": [33, 71],
    "Brownsover": [53, 30], "Newbold": [39, 33], "Long Lawford": [27, 44], "Cawston": [30, 63],
    "Barby": [70, 75], "Clifton upon Dunsmore": [65, 35], "Kilsby": [75, 85],
  };

  function buildCoverage() {
    const areas = c.AREA_PAGES || [];
    const dots = areas.map(a => {
      const pos = MAP_POS[a.name] || [50, 50];
      return `<button class="map-dot" style="left:${pos[0]}%;top:${pos[1]}%"
        data-area="${esc(a.slug)}" data-name="${esc(a.name)}" data-jobs="${a.jobs}"
        data-drive="${esc(a.drive)}" data-note="${esc(a.note)}" aria-label="${esc(a.name)}">
        <span></span><b>${esc(a.name)}</b></button>`;
    }).join("");

    const first = areas[0] || {};
    return `
<section id="coverage" class="cov" aria-labelledby="cov-heading">
  <div class="container">
    <span class="section-label">Coverage</span>
    <h2 class="section-title" id="cov-heading">Do We Cover You?</h2>
    <p class="section-intro">Tap a village to see how much work we've done there. If you're not on the map, ask — we usually are.</p>
    <div class="cov-grid">
      <div class="cov-map">
        <div class="cov-map-inner">
          <span class="map-hub" style="left:50%;top:48%"></span>
          ${dots}
        </div>
      </div>
      <aside class="cov-panel" aria-live="polite">
        <span class="cov-panel-label">Selected area</span>
        <h3 id="cov-name">${esc(first.name || "")}</h3>
        <div class="cov-stats">
          <div><strong id="cov-jobs">${first.jobs || 0}</strong><span>jobs completed</span></div>
          <div><strong id="cov-drive">${esc(first.drive || "")}</strong><span>from our yard</span></div>
        </div>
        <p id="cov-note">${esc(first.note || "")}</p>
        <a href="/areas/${esc(first.slug || "")}/" id="cov-link" class="btn btn-dark">See work in this area ${svg("arrow", 15)}</a>
      </aside>
    </div>
  </div>
</section>`;
  }

  // ── Video hero background ──────────────────────────────────
  function buildVideoHero() {
    const v = (c.VIDEOS || {}).hero;
    if (!v) return "";
    return `<div class="hero-bg hero-bg--video">
    <video autoplay muted loop playsinline poster="${esc(v.poster)}" aria-hidden="true">
      <source src="${esc(v.src)}" type="video/webm" />
    </video>
  </div>
  <div class="hero-overlay"></div>`;
  }

  // ── Transformation reel ────────────────────────────────────
  function buildVideoReel() {
    const v = (c.VIDEOS || {}).reel;
    if (!v) return "";
    return `
<section id="reel" class="reel" aria-labelledby="reel-heading">
  <div class="container">
    <div class="reel-grid">
      <div class="reel-text">
        <span class="section-label">Watch</span>
        <h2 class="section-title" id="reel-heading">${esc(v.title)}</h2>
        <p class="section-intro qc-intro-p">${esc(v.blurb)}</p>
        <ul class="qc-points">
          <li>${svg("check", 15)} Filmed on every job as standard</li>
          <li>${svg("check", 15)} Cut for Instagram, Facebook and your site</li>
          <li>${svg("check", 15)} Shows the groundwork most firms hide</li>
        </ul>
      </div>
      <figure class="reel-player">
        <video id="reel-video" poster="${esc(v.poster)}" playsinline preload="none" muted loop>
          <source src="${esc(v.src)}" type="video/webm" />
        </video>
        <button class="reel-play" id="reel-play" aria-label="Play the transformation film">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <figcaption>Brownsover · 58m² herringbone block · 3 days</figcaption>
      </figure>
    </div>
  </div>
</section>`;
  }

  // ── Social wall ────────────────────────────────────────────
  function buildSocialWall(limit = 6) {
    const posts = (c.SOCIAL_POSTS || []).slice(0, limit);
    return `
<section id="social-wall" class="social" aria-labelledby="social-heading">
  <div class="container">
    <span class="section-label">Follow the Work</span>
    <h2 class="section-title" id="social-heading">Fresh Off the Van</h2>
    <p class="section-intro">Every job photographed and posted. Proof you're busy is proof you're good.</p>
    <div class="social-grid">
      ${posts.map(p => `
      <article class="social-card" data-platform="${esc(p.platform)}">
        <div class="social-media">
          <img src="${esc(p.image)}" alt="${esc(p.caption.slice(0, 80))}" loading="lazy" />
          <span class="social-plat">${p.platform === "facebook" ? svgFilled("fb", 14) : svg("ig", 14)}</span>
        </div>
        <div class="social-body">
          <p class="social-caption">${esc(p.caption)}</p>
          <p class="social-tags">${(p.tags || []).map(t => `<span>#${esc(t)}</span>`).join(" ")}</p>
          <div class="social-meta">
            <span>${svgFilled("star", 13)} ${p.likes}</span>
            <span>${svg("msg", 13)} ${p.comments}</span>
            <span class="social-age">${p.days}d ago</span>
          </div>
        </div>
      </article>`).join("")}
    </div>
    <div class="teaser-cta"><a href="/social/" class="btn btn-dark">See the full feed ${svg("arrow", 16)}</a></div>
  </div>
</section>`;
  }

  // ── Case study teaser ──────────────────────────────────────
  function buildCaseStudyTeaser() {
    const cs = (c.CASE_STUDIES || []).slice(0, 3);
    return `
<section id="case-studies" class="cs-teaser" aria-labelledby="cs-heading">
  <div class="container">
    <span class="section-label">In Detail</span>
    <h2 class="section-title" id="cs-heading">Three Jobs, Start to Finish</h2>
    <p class="section-intro">The brief, what we found when we dug, what we did about it, and what it cost.</p>
    <div class="cs-grid">
      ${cs.map(s => `
      <a class="cs-card" href="/case-studies/${esc(s.slug)}/">
        <div class="cs-card-img">
          <img src="${esc(s.after)}" alt="${esc(s.title)}" loading="lazy" />
          <span class="cs-card-cost">${esc(s.cost)}</span>
        </div>
        <div class="cs-card-body">
          <span class="project-tag">${esc(s.surface)}</span>
          <h3>${esc(s.title)}</h3>
          <div class="project-meta">
            <span>${svg("pin", 13)} ${esc(s.location)}</span>
            <span>${svg("clock", 13)} ${esc(s.duration)}</span>
          </div>
          <span class="cs-card-link">Read the full job ${svg("arrow", 14)}</span>
        </div>
      </a>`).join("")}
    </div>
  </div>
</section>`;
  }

  // ── Advice teaser ──────────────────────────────────────────
  function buildAdviceTeaser() {
    const posts = (c.BLOG_POSTS || []).slice(0, 3);
    return `
<section id="advice-teaser" class="advice" aria-labelledby="advice-heading">
  <div class="container">
    <span class="section-label">Advice</span>
    <h2 class="section-title" id="advice-heading">Straight Answers, No Sales Pitch</h2>
    <p class="section-intro">The questions we get asked every week, answered properly. This is what wins Google searches months before anyone rings.</p>
    <div class="advice-grid">
      ${posts.map(p => `
      <a class="advice-card" href="/advice/${esc(p.slug)}/">
        <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" />
        <div class="advice-card-body">
          <span class="advice-cat">${esc(p.category)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.excerpt)}</p>
          <span class="advice-meta">${p.readMins} min read</span>
        </div>
      </a>`).join("")}
    </div>
  </div>
</section>`;
  }

  // ── WhatsApp chat widget ───────────────────────────────────
  function buildWhatsApp() {
    if (!c.WHATSAPP_ENABLED) return "";
    const waMsg = encodeURIComponent(c.WHATSAPP_MESSAGE || "Hi, I'd like a free quote please");
    const href = `https://wa.me/${esc(c.WHATSAPP_NUMBER)}?text=${waMsg}`;
    return `
<div id="wa-widget">
  <button id="whatsapp-btn" aria-label="Chat with us on WhatsApp" aria-expanded="false" aria-controls="wa-panel">
    <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
    <span class="wa-dot" aria-hidden="true">1</span>
  </button>

  <div id="wa-panel" hidden role="dialog" aria-label="WhatsApp chat">
    <header class="wa-head">
      <div class="wa-avatar">${esc((c.LOGO_NAME || "R")[0])}</div>
      <div class="wa-who">
        <strong>${esc(c.BUSINESS_NAME)}</strong>
        <span><i class="wa-online"></i> Typically replies in a few minutes</span>
      </div>
      <button class="wa-close" aria-label="Close chat">${svg("x", 16)}</button>
    </header>

    <div class="wa-body" id="wa-body">
      <div class="wa-day">Today</div>
      <div class="wa-msg wa-msg--in">
        <p>Hi 👋 Thanks for getting in touch with ${esc(c.BUSINESS_NAME)}.</p>
        <time>09:14</time>
      </div>
      <div class="wa-msg wa-msg--in">
        <p>Pick one of the common questions below, or start a real chat and Nathan will come back to you personally.</p>
        <time>09:14</time>
      </div>
    </div>

    <div class="wa-questions" id="wa-questions">
      ${(c.WHATSAPP_FAQS || []).map((f, i) => `
      <button class="wa-q" data-q="${i}" data-answer="${esc(f.a)}">${esc(f.q)}</button>`).join("")}
    </div>

    <footer class="wa-foot">
      <a href="${href}" target="_blank" rel="noopener" class="wa-cta">
        Continue on WhatsApp ${svg("arrow", 15)}
      </a>
      <p class="wa-demo-note">Demo widget — no message is actually sent.</p>
    </footer>
  </div>
</div>`;
  }

  // ── The Design Menu ────────────────────────────────────────
  // The spine of the pitch: the prospect ticks what they want and
  // walks away with their own spec.
  function buildDesignMenu() {
    const items = (c.SHOWCASE || []).map(s => `
      <li class="dm-item">
        <label>
          <input type="checkbox" value="${esc(s.id)}" data-name="${esc(s.name)}" />
          <span class="dm-check" aria-hidden="true">${svg("check", 12)}</span>
          <span class="dm-text">
            <strong>${esc(s.name)}</strong>
            <span>${esc(s.blurb)}</span>
          </span>
        </label>
        <button class="dm-show" data-target="${esc(s.target)}" title="Show me this on the page">
          ${svg("arrow", 14)}<span class="sr-only">Show ${esc(s.name)}</span>
        </button>
      </li>`).join("");

    return `
<div id="design-menu">
  <button id="dm-toggle" aria-expanded="false" aria-controls="dm-panel">
    ${svg("layers", 18)}
    <span>Design Menu</span>
    <span class="dm-count" id="dm-count" hidden>0</span>
  </button>

  <aside id="dm-panel" hidden aria-label="Design menu — choose the features you want">
    <header class="dm-head">
      <div>
        <span class="dm-brand">Groundwork Studios</span>
        <h2>Build your site</h2>
        <p>Tick anything you'd want on your own site. Hit the arrow to jump straight to it.</p>
      </div>
      <button class="dm-close" aria-label="Close design menu">${svg("x", 16)}</button>
    </header>

    <ul class="dm-list">${items}</ul>

    <footer class="dm-foot">
      <div class="dm-summary" id="dm-summary">Nothing picked yet — start ticking.</div>
      <div class="dm-actions">
        <button class="btn btn-primary" id="dm-copy">Copy my shortlist</button>
        <button class="btn btn-ghost" id="dm-clear">Clear</button>
      </div>
    </footer>
  </aside>
</div>`;
  }

  // ── Exit intent ────────────────────────────────────────────
  function buildExitIntent() {
    return `
<div id="exit-intent" hidden role="dialog" aria-modal="true" aria-labelledby="ei-title">
  <div class="ei-card">
    <button class="ei-close" aria-label="Close">${svg("x", 18)}</button>
    <span class="section-label">Before you go</span>
    <h2 id="ei-title">Grab our 2026 price guide</h2>
    <p>Real per-square-metre costs for every surface we lay, plus the five questions worth asking any driveway company before you sign.</p>
    <form class="ei-form" id="ei-form" novalidate>
      <input type="email" placeholder="you@example.com" aria-label="Your email address" required />
      <button type="submit" class="btn btn-primary">Send it over</button>
    </form>
    <p class="ei-note">Demo only — nothing is sent and no address is stored.</p>
  </div>
</div>`;
  }

  // ── Multi-step quote wizard ────────────────────────────────
  function buildWizard() {
    const serviceOpts = services.map(s => `
      <label class="wz-tile">
        <input type="radio" name="wz-service" value="${esc(s.name)}" />
        <span class="wz-tile-img" style="background-image:url('${esc(s.image || "/images/placeholder.svg")}')"></span>
        <span class="wz-tile-name">${esc(s.name)}</span>
      </label>`).join("");

    return `
<div class="wizard" id="wizard">
  <ol class="wz-steps" aria-label="Quote steps">
    <li class="is-active"><span>1</span>Surface</li>
    <li><span>2</span>Size</li>
    <li><span>3</span>Timing</li>
    <li><span>4</span>Details</li>
  </ol>

  <div class="wz-panels">
    <fieldset class="wz-panel is-active" data-step="1">
      <legend>What are you thinking of having done?</legend>
      <div class="wz-tiles">${serviceOpts}</div>
    </fieldset>

    <fieldset class="wz-panel" data-step="2">
      <legend>Roughly how big is the area?</legend>
      <div class="wz-tiles wz-tiles--text">
        <label class="wz-tile"><input type="radio" name="wz-size" value="Single (up to 30m²)" /><span class="wz-tile-name">Single<small>up to 30m²</small></span></label>
        <label class="wz-tile"><input type="radio" name="wz-size" value="Double (30–60m²)" /><span class="wz-tile-name">Double<small>30–60m²</small></span></label>
        <label class="wz-tile"><input type="radio" name="wz-size" value="Large (60m²+)" /><span class="wz-tile-name">Large<small>60m²+</small></span></label>
        <label class="wz-tile"><input type="radio" name="wz-size" value="Not sure" /><span class="wz-tile-name">Not sure<small>we'll measure</small></span></label>
      </div>
    </fieldset>

    <fieldset class="wz-panel" data-step="3">
      <legend>When would you like it done?</legend>
      <div class="wz-tiles wz-tiles--text">
        <label class="wz-tile"><input type="radio" name="wz-when" value="As soon as possible" /><span class="wz-tile-name">ASAP<small>next slot</small></span></label>
        <label class="wz-tile"><input type="radio" name="wz-when" value="Next 1-3 months" /><span class="wz-tile-name">1–3 months<small>planning ahead</small></span></label>
        <label class="wz-tile"><input type="radio" name="wz-when" value="Just getting prices" /><span class="wz-tile-name">Just pricing<small>no rush</small></span></label>
      </div>
    </fieldset>

    <fieldset class="wz-panel" data-step="4">
      <legend>How do we reach you?</legend>
      <div class="form-group"><label for="wz-name">Your name *</label><input type="text" id="wz-name" required placeholder="John Smith" /></div>
      <div class="form-group"><label for="wz-phone">Phone *</label><input type="tel" id="wz-phone" required placeholder="07700 900000" /></div>
      <div class="form-group"><label for="wz-postcode">Postcode</label><input type="text" id="wz-postcode" placeholder="CV21 0AA" /></div>
      <div class="wz-recap" id="wz-recap"></div>
    </fieldset>
  </div>

  <div class="wz-nav">
    <button type="button" class="btn btn-ghost" id="wz-back" disabled>Back</button>
    <button type="button" class="btn btn-primary" id="wz-next">Next ${svg("arrow", 15)}</button>
  </div>
  <p class="wz-done" id="wz-done" hidden>${svg("check", 18)} That's everything — in a live build this lands in your inbox and your phone straight away.</p>
</div>`;
  }

  // ── Animated stat counters ─────────────────────────────────
  function buildStats() {
    const demo = c.DEMO_MODE ? ` <span class="demo-flag" title="Illustrative figure in this demo build">demo</span>` : "";
    const items = [
      { n: c.PROJECT_COUNT || "80", suffix: "+", label: "Driveways laid" },
      { n: c.YEARS_TRADING || "5",  suffix: "",  label: "Years trading" },
      { n: "10",                     suffix: "yr", label: "Workmanship guarantee" },
      { n: (c.CUSTOMER_COUNT || "65").replace(/\D/g, ""), suffix: "", label: "Five-star reviews" },
    ];
    return `
<section id="stats" class="stats" aria-labelledby="stats-heading">
  <div class="container">
    <h2 class="sr-only" id="stats-heading">By the numbers</h2>
    <div class="stats-grid">
      ${items.map(i => `
      <div class="stat-tile">
        <div class="stat-tile-num" data-count="${esc(i.n)}" data-suffix="${esc(i.suffix)}">0${esc(i.suffix)}</div>
        <div class="stat-tile-label">${esc(i.label)}${demo}</div>
      </div>`).join("")}
    </div>
  </div>
</section>`;
  }

  return {
    baSlider, buildAvailability, buildTrustBar, buildQuoteCalc, buildVisualiser,
    buildFinance, buildMaterials, buildCoverage, buildVideoHero, buildVideoReel,
    buildSocialWall, buildCaseStudyTeaser, buildAdviceTeaser, buildWhatsApp,
    buildDesignMenu, buildExitIntent, buildWizard, buildStats, money,
  };
};

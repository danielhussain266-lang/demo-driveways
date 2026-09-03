// ============================================================
// GROUNDWORK STUDIOS — SHOWCASE PAGES
// Team, advice hub, case studies, village landing pages,
// guarantee, finance and the social feed.
// ============================================================

module.exports = function pages(H, S) {
  const {
    c, esc, svg, svgFilled, stars, domain,
    buildHead, buildHeader, buildFooter, buildScripts, buildCtaBand, buildSchema,
  } = H;

  const dateLong = iso => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

  function pageHero({ label, title, intro, extra = "" }) {
    return `
  <div class="page-hero">
    <div class="container">
      <span class="section-label">${esc(label)}</span>
      <h1>${esc(title)}</h1>
      ${intro ? `<p>${esc(intro)}</p>` : ""}
      ${extra}
    </div>
  </div>`;
  }

  const shell = (meta, body) =>
    buildHead(meta) + `\n${buildHeader()}\n<main>\n${body}\n${buildCtaBand()}\n</main>\n${buildFooter()}\n${buildScripts()}`;

  // ── Team ───────────────────────────────────────────────────
  function buildTeamPage() {
    const team = c.TEAM || [];
    return shell({
      title: `Meet the Team — ${c.BUSINESS_NAME}`,
      description: `The people who'll actually be on your driveway. Meet the ${c.BUSINESS_NAME} crew serving ${c.SERVICE_AREA}.`,
      canonical: "/team/",
      extraSchema: `<script type="application/ld+json">${buildSchema()}</script>`,
    }, `
  ${pageHero({
      label: "Who You're Hiring",
      title: "Meet the Team",
      intro: "No call centre, no subcontractors, no strangers on your drive. These five people are the whole company.",
    })}

  <section class="team-body">
    <div class="container">
      <div class="team-grid">
        ${team.map(m => `
        <article class="team-card">
          <div class="team-portrait" style="--tone:${esc(m.tone)}">
            <span class="team-initials">${esc(m.initials)}</span>
            <span class="team-years">${m.years} yrs</span>
          </div>
          <div class="team-body-text">
            <h2>${esc(m.name)}</h2>
            <p class="team-role">${esc(m.role)}</p>
            <p class="team-bio">${esc(m.bio)}</p>
            <p class="team-fact">${svg("check", 14)} ${esc(m.fact)}</p>
          </div>
        </article>`).join("")}
      </div>
    </div>
  </section>

  ${S.buildTrustBar()}`);
  }

  // ── Advice hub ─────────────────────────────────────────────
  function buildAdviceIndex() {
    const posts = c.BLOG_POSTS || [];
    return shell({
      title: `Driveway Advice & Guides — ${c.BUSINESS_NAME}`,
      description: `Honest guides to driveway costs, materials, drainage rules and choosing an installer in ${c.SERVICE_AREA}.`,
      canonical: "/advice/",
    }, `
  ${pageHero({
      label: "Advice Hub",
      title: "Driveway Advice, Written by People Who Lay Them",
      intro: "No fluff and no sales pitch — the same answers we'd give you standing on your driveway.",
    })}

  <section class="advice-body">
    <div class="container">
      <div class="advice-list">
        ${posts.map((p, i) => `
        <a class="advice-row${i === 0 ? " advice-row--lead" : ""}" href="/advice/${esc(p.slug)}/">
          <div class="advice-row-img"><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" /></div>
          <div class="advice-row-text">
            <span class="advice-cat">${esc(p.category)}</span>
            <h2>${esc(p.title)}</h2>
            <p>${esc(p.excerpt)}</p>
            <span class="advice-meta">${dateLong(p.date)} · ${p.readMins} min read</span>
          </div>
        </a>`).join("")}
      </div>
    </div>
  </section>`);
  }

  function buildAdvicePost(p) {
    const others = (c.BLOG_POSTS || []).filter(x => x.slug !== p.slug).slice(0, 2);
    const schema = `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org", "@type": "Article",
      headline: p.title, datePublished: p.date,
      image: `https://${domain}${p.image}`,
      author: { "@type": "Organization", name: c.BUSINESS_NAME },
      publisher: { "@type": "Organization", name: c.BUSINESS_NAME },
    }, null, 2)}</script>`;

    return shell({
      title: `${p.title} — ${c.BUSINESS_NAME}`,
      description: p.excerpt,
      canonical: `/advice/${p.slug}/`,
      extraSchema: schema,
    }, `
  <article class="post">
    <div class="post-hero">
      <div class="container">
        <div class="breadcrumb"><a href="/">Home</a> / <a href="/advice/">Advice</a> / <span>${esc(p.category)}</span></div>
        <h1>${esc(p.title)}</h1>
        <p class="post-meta">${dateLong(p.date)} · ${p.readMins} min read · by Nathan Reeve</p>
      </div>
    </div>

    <div class="container post-shell">
      <div class="post-body">
        <img class="post-lead-img" src="${esc(p.image)}" alt="${esc(p.title)}" />
        <p class="post-standfirst">${esc(p.excerpt)}</p>
        ${(p.body || []).map(([h, t]) => `<h2>${esc(h)}</h2>\n<p>${esc(t)}</p>`).join("\n")}

        <aside class="post-cta">
          <h3>Want this answered for your driveway specifically?</h3>
          <p>We'll come out, measure up and give you a written quote. No deposit, no pressure, no follow-up calls.</p>
          <a href="/contact/" class="btn btn-primary">Book a free visit ${svg("arrow", 15)}</a>
        </aside>
      </div>

      <aside class="post-side">
        <div class="post-side-card">
          <h3>Written by</h3>
          <div class="post-author">
            <span class="team-initials team-initials--sm" style="--tone:#2f4739">NR</span>
            <div><strong>Nathan Reeve</strong><span>Owner, 14 years on the tools</span></div>
          </div>
        </div>
        ${others.length ? `<div class="post-side-card">
          <h3>Also worth reading</h3>
          <ul class="post-related">
            ${others.map(o => `<li><a href="/advice/${esc(o.slug)}/">${esc(o.title)}</a><span>${o.readMins} min</span></li>`).join("")}
          </ul>
        </div>` : ""}
        <div class="post-side-card post-side-card--cta">
          <h3>Free 2026 price guide</h3>
          <p>Per-m² costs for every surface we lay.</p>
          <a href="/contact/" class="btn btn-dark">Get the guide</a>
        </div>
      </aside>
    </div>
  </article>`);
  }

  // ── Case studies ───────────────────────────────────────────
  function buildCaseStudyIndex() {
    const cs = c.CASE_STUDIES || [];
    return shell({
      title: `Project Case Studies — ${c.BUSINESS_NAME}`,
      description: `Detailed write-ups of real driveway and patio projects across ${c.SERVICE_AREA} — brief, groundwork, timeline and cost.`,
      canonical: "/case-studies/",
    }, `
  ${pageHero({
      label: "In Detail",
      title: "Case Studies",
      intro: "Every job written up properly: what the customer wanted, what we found when we dug, and exactly what it cost.",
    })}

  <section class="cs-index">
    <div class="container">
      ${cs.map(s => `
      <a class="cs-row" href="/case-studies/${esc(s.slug)}/">
        <div class="cs-row-media">${S.baSlider(s.before, s.after, s.title, { start: 55 })}</div>
        <div class="cs-row-text">
          <span class="project-tag">${esc(s.surface)}</span>
          <h2>${esc(s.title)}</h2>
          <p>${esc(s.brief)}</p>
          <div class="cs-row-facts">
            <div><strong>${esc(s.cost)}</strong><span>final cost</span></div>
            <div><strong>${esc(s.area)}</strong><span>area</span></div>
            <div><strong>${esc(s.duration)}</strong><span>on site</span></div>
          </div>
          <span class="cs-card-link">Read the full write-up ${svg("arrow", 14)}</span>
        </div>
      </a>`).join("")}
    </div>
  </section>`);
  }

  function buildCaseStudyPage(s) {
    return shell({
      title: `${s.title} — ${c.BUSINESS_NAME}`,
      description: s.brief.slice(0, 155),
      canonical: `/case-studies/${s.slug}/`,
      extraSchema: `<script type="application/ld+json">${buildSchema()}</script>`,
    }, `
  <article class="cs-page">
    <div class="post-hero">
      <div class="container">
        <div class="breadcrumb"><a href="/">Home</a> / <a href="/case-studies/">Case Studies</a> / <span>${esc(s.location)}</span></div>
        <h1>${esc(s.title)}</h1>
        <p class="post-meta">${esc(s.location)} · ${esc(s.surface)} · completed ${esc(s.completed)}</p>
      </div>
    </div>

    <div class="container">
      <div class="cs-hero-media">
        ${S.baSlider(s.before, s.after, s.title, { start: 50, tall: true })}
        <p class="cs-hero-hint">${svg("arrow", 14)} Drag to reveal the transformation</p>
      </div>

      <div class="cs-facts">
        <div><strong>${esc(s.cost)}</strong><span>Final cost</span></div>
        <div><strong>${esc(s.area)}</strong><span>Area covered</span></div>
        <div><strong>${esc(s.duration)}</strong><span>Time on site</span></div>
        <div><strong>${esc(s.surface)}</strong><span>Surface</span></div>
      </div>

      <div class="post-shell">
        <div class="post-body">
          <h2>The brief</h2><p>${esc(s.brief)}</p>
          <h2>What we found</h2><p>${esc(s.problem)}</p>
          <h2>What we did</h2><p>${esc(s.solution)}</p>

          <h2>Day by day</h2>
          <ol class="cs-days">
            ${(s.days || []).map(d => `<li><strong>${esc(d.day)}</strong><p>${esc(d.body)}</p></li>`).join("")}
          </ol>

          <blockquote class="cs-quote">
            <div class="stars">${stars(5)}</div>
            <p>${esc(s.quote)}</p>
            <cite>${esc(s.client)} — ${esc(s.location)}</cite>
          </blockquote>

          <h2>The result</h2><p>${esc(s.result)}</p>
        </div>

        <aside class="post-side">
          <div class="post-side-card post-side-card--cta">
            <h3>Similar job in mind?</h3>
            <p>We'll quote yours the same way — measured, itemised and in writing.</p>
            <a href="/contact/" class="btn btn-primary">Get a free quote</a>
            <a href="tel:${esc(c.PHONE_HREF)}" class="btn btn-ghost">${svg("phone", 15)} ${esc(c.PHONE)}</a>
          </div>
        </aside>
      </div>
    </div>
  </article>`);
  }

  // ── Village landing pages ──────────────────────────────────
  function buildAreaIndex() {
    const areas = c.AREA_PAGES || [];
    return shell({
      title: `Areas We Cover — ${c.BUSINESS_NAME}`,
      description: `Driveway and patio installation across Rugby and the surrounding villages. Find your area.`,
      canonical: "/areas/",
    }, `
  ${pageHero({
      label: "Coverage",
      title: "Areas We Cover",
      intro: "Rugby town and every village around it. Pick yours to see the work we've done nearby.",
    })}
  ${S.buildCoverage()}

  <section class="area-index">
    <div class="container">
      <div class="area-grid">
        ${areas.map(a => `
        <a class="area-card" href="/areas/${esc(a.slug)}/">
          <h2>${svg("pin", 16)} ${esc(a.name)}</h2>
          <p>${esc(a.note)}</p>
          <span class="area-card-meta">${a.jobs} jobs · ${esc(a.drive)} away</span>
        </a>`).join("")}
      </div>
    </div>
  </section>`);
  }

  function buildAreaPage(a) {
    const localJobs = (H.portfolio || []).filter(p =>
      (p.location || "").toLowerCase().includes(a.name.toLowerCase())).slice(0, 3);
    const shown = localJobs.length ? localJobs : (H.portfolio || []).slice(0, 3);

    return shell({
      title: `Driveways in ${a.name} — ${c.BUSINESS_NAME}`,
      description: `Driveway and patio specialists working in ${a.name}. ${a.jobs} local projects completed. Free quotes, no deposit.`,
      canonical: `/areas/${a.slug}/`,
      extraSchema: `<script type="application/ld+json">${buildSchema()}</script>`,
    }, `
  <div class="page-hero">
    <div class="container">
      <div class="breadcrumb"><a href="/">Home</a> / <a href="/areas/">Areas</a> / <span>${esc(a.name)}</span></div>
      <span class="section-label">${esc(a.drive)} from our yard</span>
      <h1>Driveways &amp; Patios in ${esc(a.name)}</h1>
      <p>${esc(a.note)}</p>
      <div class="area-hero-stats">
        <div><strong>${a.jobs}</strong><span>jobs completed here</span></div>
        <div><strong>${esc(a.drive)}</strong><span>travel time</span></div>
        <div><strong>Free</strong><span>site visit &amp; quote</span></div>
      </div>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.5rem;">
        <a href="/contact/" class="btn btn-primary">Get a quote for ${esc(a.name)}</a>
        <a href="tel:${esc(c.PHONE_HREF)}" class="btn btn-outline">${svg("phone", 16)} ${esc(c.PHONE)}</a>
      </div>
    </div>
  </div>

  <section>
    <div class="container">
      <span class="section-label">Nearby Work</span>
      <h2 class="section-title">Recent Projects Near ${esc(a.name)}</h2>
      <div class="teaser-grid">
        ${shown.map(p => `
        <div class="teaser-card">
          ${S.baSlider(p.beforeImage, p.afterImage, p.title || "Project", { start: 50 })}
          <div class="teaser-caption">
            <span>${esc(p.title || "")}</span>
            <span class="teaser-meta">${esc([p.location, p.duration].filter(Boolean).join(" · "))}</span>
          </div>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <section style="background:var(--card)">
    <div class="container">
      <span class="section-label">Services in ${esc(a.name)}</span>
      <h2 class="section-title">What We Install Locally</h2>
      <div class="area-services">
        ${(c.SERVICES || []).map(s => `
        <a href="/services/${esc(s.slug)}/" class="area-service">
          ${svg("layers", 16)} ${esc(s.name)} in ${esc(a.name)}
        </a>`).join("")}
      </div>
    </div>
  </section>`);
  }

  // ── Guarantee ──────────────────────────────────────────────
  function buildGuaranteePage() {
    const g = c.GUARANTEE || {};
    return shell({
      title: `${g.headline || "Our Guarantee"} — ${c.BUSINESS_NAME}`,
      description: (g.body || "").slice(0, 155),
      canonical: "/guarantee/",
    }, `
  ${pageHero({
      label: "Peace of Mind",
      title: g.headline || "Our Guarantee",
      intro: g.body || "",
      extra: `<div class="guar-badge"><strong>${g.years || 10}</strong><span>year<br/>guarantee</span></div>`,
    })}

  <section class="guar-body">
    <div class="container">
      <div class="guar-grid">
        ${(g.points || []).map((p, i) => `
        <article class="guar-point">
          <div class="guar-point-num">${String(i + 1).padStart(2, "0")}</div>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.body)}</p>
        </article>`).join("")}
      </div>
    </div>
  </section>

  ${S.buildTrustBar()}

  <section>
    <div class="container">
      <span class="section-label">The Paperwork</span>
      <h2 class="section-title">What You Actually Receive</h2>
      <ul class="guar-list">
        <li>${svg("check", 16)} A written, itemised quote before any work starts — including sub-base depth in millimetres.</li>
        <li>${svg("check", 16)} A signed guarantee certificate on completion, transferable if you sell.</li>
        <li>${svg("check", 16)} Photographs of the excavation and sub-base before the surface goes down.</li>
        <li>${svg("check", 16)} Waste transfer notes proving your old driveway was disposed of legally.</li>
        <li>${svg("check", 16)} A named contact — Nathan — with a direct mobile number for ten years.</li>
      </ul>
    </div>
  </section>`);
  }

  // ── Finance ────────────────────────────────────────────────
  function buildFinancePage() {
    return shell({
      title: `Driveway Finance — ${c.BUSINESS_NAME}`,
      description: `Spread the cost of your driveway. Representative ${(c.FINANCE || {}).apr || 9.9}% APR, decision in minutes, settle early with no penalty.`,
      canonical: "/finance/",
    }, `
  ${pageHero({
      label: "Payment Options",
      title: "Spread the Cost",
      intro: "Have the driveway you actually want, not the one that happens to fit this month's budget.",
    })}
  ${S.buildFinance()}

  <section style="background:var(--card)">
    <div class="container">
      <span class="section-label">How It Works</span>
      <h2 class="section-title">Four Steps, No Paperwork Mountain</h2>
      <div class="steps-grid">
        <div class="step-item"><div class="step-num">01</div><h3>Get your quote</h3><p>Free site visit and a written price. Nothing to sign, nothing to pay.</p></div>
        <div class="step-item"><div class="step-num">02</div><h3>Soft credit check</h3><p>Takes two minutes and leaves no mark on your credit file.</p></div>
        <div class="step-item"><div class="step-num">03</div><h3>Decision in minutes</h3><p>Approved applications are usually confirmed the same day.</p></div>
        <div class="step-item"><div class="step-num">04</div><h3>We book you in</h3><p>Work starts on the agreed date. First payment isn't taken until it's finished.</p></div>
      </div>
    </div>
  </section>`);
  }

  // ── Social feed ────────────────────────────────────────────
  function buildSocialPage() {
    const posts = c.SOCIAL_POSTS || [];
    const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
    return shell({
      title: `Our Latest Work on Social — ${c.BUSINESS_NAME}`,
      description: `Recent driveway and patio jobs across ${c.SERVICE_AREA}, straight from our Instagram and Facebook.`,
      canonical: "/social/",
    }, `
  ${pageHero({
      label: "Social",
      title: "Fresh Off the Van",
      intro: "Every job gets photographed and posted the day it finishes. Here's the last few weeks.",
      extra: `<div class="social-stats">
        <div><strong>${posts.length}</strong><span>recent posts</span></div>
        <div><strong>${totalLikes.toLocaleString("en-GB")}</strong><span>likes</span></div>
        <div><strong>2.4k</strong><span>followers</span></div>
      </div>`,
    })}

  <section class="social-page">
    <div class="container">
      <div class="social-grid social-grid--full">
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
      ${c.DEMO_MODE ? `<p class="demo-note">${svg("layers", 14)} Demo content — in a live build this pulls automatically from your real Instagram and Facebook feeds.</p>` : ""}
    </div>
  </section>`);
  }

  return {
    buildTeamPage, buildAdviceIndex, buildAdvicePost,
    buildCaseStudyIndex, buildCaseStudyPage,
    buildAreaIndex, buildAreaPage,
    buildGuaranteePage, buildFinancePage, buildSocialPage,
  };
};

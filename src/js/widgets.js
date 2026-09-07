/* =====================================================
   GROUNDWORK STUDIOS — SHOWCASE WIDGETS
   Before/after sliders, calculators, visualiser, chat
   widget, coverage map, design menu, wizard.
   Vanilla, no dependencies, no build step.
   ===================================================== */
(function () {
  "use strict";

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const money = n => "£" + Math.round(n).toLocaleString("en-GB");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Before / after sliders ───────────────────────── */
  function initBaSliders() {
    $$("[data-ba]").forEach(el => {
      if (el.dataset.baReady) return;
      el.dataset.baReady = "1";

      const range = $(".ba-range", el);
      const set = v => {
        const pct = Math.max(0, Math.min(100, v));
        el.style.setProperty("--pos", pct + "%");
        if (range && Number(range.value) !== pct) range.value = pct;
      };

      if (range) range.addEventListener("input", () => set(Number(range.value)));

      // pointer dragging anywhere on the image
      let dragging = false;
      const fromEvent = e => {
        const rect = el.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        return (x / rect.width) * 100;
      };
      const start = e => { dragging = true; set(fromEvent(e)); };
      const move  = e => { if (dragging) { set(fromEvent(e)); if (e.cancelable) e.preventDefault(); } };
      const end   = () => { dragging = false; };

      el.addEventListener("pointerdown", start);
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", end);

      // a gentle nudge on first scroll-into-view so it reads as interactive
      if (!reduceMotion && !el.dataset.baNudged) {
        const io = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting || el.dataset.baNudged) return;
            el.dataset.baNudged = "1";
            const from = 50, to = 62;
            const t0 = performance.now();
            const step = now => {
              const k = Math.min(1, (now - t0) / 900);
              const eased = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
              set(from + (to - from) * Math.sin(eased * Math.PI));
              if (k < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.disconnect();
          });
        }, { threshold: 0.45 });
        io.observe(el);
      }
    });
  }

  /* ── Instant quote calculator ─────────────────────── */
  function initQuoteCalc() {
    const area = $("#qc-area"); if (!area) return;
    const mat = $("#qc-material"), out = $("#qc-area-out");
    const fig = $("#qc-figure"), note = $("#qc-note");
    const extras = $$(".qc-extras input");

    function update() {
      const m2 = Number(area.value);
      const [lo, hi] = mat.value.split("|").map(Number);
      const add = extras.filter(x => x.checked).reduce((s, x) => s + Number(x.value), 0);
      out.textContent = m2 + " m²";
      fig.textContent = money(m2 * lo + add) + " – " + money(m2 * hi + add);
      const name = mat.options[mat.selectedIndex].dataset.name;
      note.textContent = name + " · " + m2 + " m²" + (add ? " · extras included" : "");
    }
    [area, mat].forEach(el => el.addEventListener("input", update));
    extras.forEach(el => el.addEventListener("change", update));
    update();
  }

  /* ── Driveway visualiser ──────────────────────────── */
  function initVisualiser() {
    const btns = $$("[data-vis-btn]"); if (!btns.length) return;
    const imgs = $$("[data-vis]");
    const name = $("#vis-name"), price = $("#vis-price");
    const noteEl = $("#vis-note"), traits = $("#vis-traits"), link = $("#vis-link");

    const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    btns.forEach(btn => btn.addEventListener("click", () => {
      const i = btn.dataset.visBtn;
      btns.forEach(b => b.classList.toggle("is-active", b === btn));
      imgs.forEach(im => im.classList.toggle("is-active", im.dataset.vis === i));
      name.textContent = btn.dataset.name;
      price.textContent = btn.dataset.price;
      noteEl.textContent = btn.dataset.note;
      traits.innerHTML = (btn.dataset.traits || "").split("|").filter(Boolean)
        .map(t => '<span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> ' + t + "</span>").join("");
      if (btn.dataset.service) link.href = "/services/" + slugify(btn.dataset.service) + "/";
    }));
  }

  /* ── Finance calculator ───────────────────────────── */
  function initFinance() {
    const amount = $("#fin-amount"); if (!amount) return;
    const out = $("#fin-amount-out"), monthly = $("#fin-monthly"), total = $("#fin-total");
    const termBtns = $$("#fin-terms button");
    const apr = 9.9;
    let term = 48;

    function update() {
      const p = Number(amount.value);
      const r = apr / 100 / 12;
      const m = (p * r) / (1 - Math.pow(1 + r, -term));
      out.textContent = money(p);
      monthly.textContent = money(m);
      total.textContent = money(m * term);
    }
    amount.addEventListener("input", update);
    termBtns.forEach(b => b.addEventListener("click", () => {
      term = Number(b.dataset.term);
      termBtns.forEach(x => x.classList.toggle("is-active", x === b));
      update();
    }));
    update();
  }

  /* ── Coverage map ─────────────────────────────────── */
  function initCoverage() {
    const dots = $$(".map-dot"); if (!dots.length) return;
    const name = $("#cov-name"), jobs = $("#cov-jobs"), drive = $("#cov-drive");
    const note = $("#cov-note"), link = $("#cov-link");

    function select(d) {
      dots.forEach(x => x.classList.toggle("is-active", x === d));
      name.textContent = d.dataset.name;
      jobs.textContent = d.dataset.jobs;
      drive.textContent = d.dataset.drive;
      note.textContent = d.dataset.note;
      link.href = "/areas/" + d.dataset.area + "/";
    }
    dots.forEach(d => {
      d.addEventListener("click", () => select(d));
      d.addEventListener("mouseenter", () => select(d));
    });
    if (dots[0]) dots[0].classList.add("is-active");
  }

  /* ── WhatsApp chat widget ─────────────────────────── */
  function initWhatsApp() {
    const btn = $("#whatsapp-btn"), panel = $("#wa-panel"); if (!btn || !panel) return;
    const body = $("#wa-body"), close = $(".wa-close", panel);

    const open = () => {
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      document.body.classList.add("wa-open");
      const dot = $(".wa-dot", btn); if (dot) dot.style.display = "none";
    };
    const shut = () => {
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("wa-open");
    };

    btn.addEventListener("click", () => (panel.hidden ? open() : shut()));
    if (close) close.addEventListener("click", shut);
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) shut(); });

    const time = () => {
      const d = new Date();
      return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    };

    $$(".wa-q").forEach(q => q.addEventListener("click", () => {
      // the visitor's question
      const outMsg = document.createElement("div");
      outMsg.className = "wa-msg wa-msg--out";
      outMsg.innerHTML = "<p></p><time>" + time() + "</time>";
      $("p", outMsg).textContent = q.textContent;
      body.appendChild(outMsg);
      body.scrollTop = body.scrollHeight;
      q.remove();

      // typing indicator, then the reply
      const typing = document.createElement("div");
      typing.className = "wa-msg wa-msg--in wa-typing";
      typing.innerHTML = "<p><i></i><i></i><i></i></p>";
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;

      setTimeout(() => {
        typing.remove();
        const reply = document.createElement("div");
        reply.className = "wa-msg wa-msg--in";
        reply.innerHTML = "<p></p><time>" + time() + "</time>";
        $("p", reply).textContent = q.dataset.answer;
        body.appendChild(reply);
        body.scrollTop = body.scrollHeight;
      }, reduceMotion ? 120 : 900);
    }));
  }

  /* ── The Design Menu ──────────────────────────────── */
  function initDesignMenu() {
    const toggle = $("#dm-toggle"), panel = $("#dm-panel"); if (!toggle || !panel) return;
    const count = $("#dm-count"), summary = $("#dm-summary");
    const boxes = $$('#dm-panel input[type="checkbox"]');
    const STORE = "gw-design-menu";

    const openPanel = () => { panel.hidden = false; toggle.setAttribute("aria-expanded", "true"); };
    const shutPanel = () => { panel.hidden = true; toggle.setAttribute("aria-expanded", "false"); };

    toggle.addEventListener("click", () => (panel.hidden ? openPanel() : shutPanel()));
    const closeBtn = $(".dm-close", panel);
    if (closeBtn) closeBtn.addEventListener("click", shutPanel);
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) shutPanel(); });

    function picked() { return boxes.filter(b => b.checked); }

    function render() {
      const sel = picked();
      count.textContent = sel.length;
      count.hidden = sel.length === 0;
      summary.textContent = sel.length
        ? sel.length + " feature" + (sel.length === 1 ? "" : "s") + " shortlisted: " +
          sel.map(b => b.dataset.name).join(", ")
        : "Nothing picked yet — start ticking.";
      try { localStorage.setItem(STORE, JSON.stringify(sel.map(b => b.value))); } catch (e) {}
    }

    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "[]");
      boxes.forEach(b => { if (saved.indexOf(b.value) > -1) b.checked = true; });
    } catch (e) {}

    boxes.forEach(b => b.addEventListener("change", render));
    render();

    // "show me this" — jump to the feature and flash it
    $$(".dm-show").forEach(btn => btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      if (target.charAt(0) === "/") { window.location.href = target; return; }
      const el = $(target);
      if (!el) { window.location.href = "/"; return; }
      shutPanel();
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      el.classList.add("dm-flash");
      setTimeout(() => el.classList.remove("dm-flash"), 2400);
    }));

    const copyBtn = $("#dm-copy");
    if (copyBtn) copyBtn.addEventListener("click", () => {
      const sel = picked();
      if (!sel.length) { copyBtn.textContent = "Pick something first"; setTimeout(() => copyBtn.textContent = "Copy my shortlist", 1600); return; }
      const text = "My site shortlist — Groundwork Studios\n\n" +
        sel.map((b, i) => (i + 1) + ". " + b.dataset.name).join("\n") +
        "\n\n(" + sel.length + " features)";
      const done = () => { copyBtn.textContent = "Copied ✓"; setTimeout(() => copyBtn.textContent = "Copy my shortlist", 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done);
      else done();
    });

    const clearBtn = $("#dm-clear");
    if (clearBtn) clearBtn.addEventListener("click", () => {
      boxes.forEach(b => b.checked = false);
      render();
    });
  }

  /* ── Multi-step quote wizard ──────────────────────── */
  function initWizard() {
    const wiz = $("#wizard"); if (!wiz) return;
    const panels = $$(".wz-panel", wiz), steps = $$(".wz-steps li", wiz);
    const back = $("#wz-back"), next = $("#wz-next"), done = $("#wz-done"), recap = $("#wz-recap");
    let step = 0;

    function show() {
      panels.forEach((p, i) => p.classList.toggle("is-active", i === step));
      steps.forEach((s, i) => s.classList.toggle("is-active", i <= step));
      back.disabled = step === 0;
      next.textContent = step === panels.length - 1 ? "Send my enquiry" : "Next";
      if (step === panels.length - 1) {
        const get = n => { const el = $('input[name="' + n + '"]:checked', wiz); return el ? el.value : "—"; };
        recap.innerHTML =
          "<strong>Your enquiry so far</strong>" +
          "<span>Surface: " + get("wz-service") + "</span>" +
          "<span>Size: " + get("wz-size") + "</span>" +
          "<span>Timing: " + get("wz-when") + "</span>";
      }
    }
    next.addEventListener("click", () => {
      if (step < panels.length - 1) { step++; show(); }
      else { wiz.classList.add("is-done"); done.hidden = false; done.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" }); }
    });
    back.addEventListener("click", () => { if (step > 0) { step--; show(); } });

    // picking a tile advances automatically — feels much quicker
    $$('.wz-tile input', wiz).forEach(input => input.addEventListener("change", () => {
      if (step < panels.length - 1) setTimeout(() => { step++; show(); }, 220);
    }));
    show();
  }

  /* ── Animated counters ────────────────────────────── */
  function initCounters() {
    const nums = $$("[data-count]"); if (!nums.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const suffix = el.dataset.suffix || "";
        if (reduceMotion) { el.textContent = target + suffix; io.unobserve(el); return; }
        const t0 = performance.now(), dur = 1300;
        const tick = now => {
          const k = Math.min(1, (now - t0) / dur);
          el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))) + suffix;
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  }

  /* ── Scroll reveal ────────────────────────────────── */
  function initReveal() {
    if (reduceMotion) return;
    const targets = $$("section > .container > *, .teaser-card, .project-card, .social-card, .team-card");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-revealed"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(t => { t.classList.add("reveal"); io.observe(t); });
  }

  /* ── Transformation reel ──────────────────────────── */
  function initReel() {
    const btn = $("#reel-play"), vid = $("#reel-video"); if (!btn || !vid) return;
    btn.addEventListener("click", () => {
      if (vid.paused) { vid.play(); btn.classList.add("is-playing"); }
      else { vid.pause(); btn.classList.remove("is-playing"); }
    });
    vid.addEventListener("ended", () => btn.classList.remove("is-playing"));
  }

  /* ── Exit intent ──────────────────────────────────── */
  function initExitIntent() {
    const modal = $("#exit-intent"); if (!modal) return;
    const KEY = "gw-exit-seen";
    let shown = false;
    try { if (sessionStorage.getItem(KEY)) shown = true; } catch (e) {}

    const show = () => {
      if (shown) return;
      shown = true;
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      modal.hidden = false;
    };
    const hide = () => { modal.hidden = true; };

    document.addEventListener("mouseout", e => {
      if (!e.relatedTarget && e.clientY <= 0) show();
    });
    $(".ei-close", modal).addEventListener("click", hide);
    modal.addEventListener("click", e => { if (e.target === modal) hide(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) hide(); });
    const form = $("#ei-form", modal);
    if (form) form.addEventListener("submit", e => {
      e.preventDefault();
      form.innerHTML = '<p class="ei-sent">Thanks — in a live build the guide would be on its way. ✓</p>';
    });
  }

  /* ── Dark mode ────────────────────────────────────── */
  function initTheme() {
    const KEY = "gw-theme";
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved) document.documentElement.setAttribute("data-theme", saved);

    const btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.innerHTML = '<span class="tt-sun">☀</span><span class="tt-moon">☾</span>';
    btn.addEventListener("click", () => {
      const now = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", now);
      try { localStorage.setItem(KEY, now); } catch (e) {}
    });
    const header = $(".header-inner");
    if (header) header.appendChild(btn);
  }

  /* ── boot ─────────────────────────────────────────── */
  function boot() {
    initBaSliders(); initQuoteCalc(); initVisualiser(); initFinance();
    initCoverage(); initWhatsApp(); initDesignMenu(); initWizard();
    initCounters(); initReveal(); initReel(); initExitIntent(); initTheme();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.GWWidgets = { initBaSliders };
})();

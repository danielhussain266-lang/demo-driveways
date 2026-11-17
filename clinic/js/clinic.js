/* =====================================================
   GROUNDWORK STUDIOS — CLINIC DRAFT TEMPLATE
   Front-end behaviour. No dependencies.
   ===================================================== */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  /* ── Navigation ─────────────────────────────────── */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle'), nav = $('site-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  /* ── Colour toggle (draft only) ─────────────────── */
  function initTheme() {
    var box = $('theme-toggle');
    if (!box) return;
    var buttons = box.querySelectorAll('button[data-theme]');
    function mark(id) {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-theme') === id)); });
    }
    mark(document.documentElement.getAttribute('data-theme'));
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-theme]');
      if (!b) return;
      var id = b.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', id);
      try { localStorage.setItem('clinic-theme', id); } catch (err) { /* private window: fine */ }
      mark(id);
    });
  }

  /* ── WhatsApp menu ──────────────────────────────── */
  function initWhatsApp() {
    var fab = $('wa-fab'), panel = $('wa-panel'), close = $('wa-close');
    if (!fab || !panel) return;
    function set(open) {
      panel.hidden = !open;
      fab.setAttribute('aria-expanded', String(open));
      if (open) { var first = panel.querySelector('a'); if (first) first.focus(); } else { fab.focus(); }
    }
    fab.addEventListener('click', function () { set(panel.hidden); });
    close.addEventListener('click', function () { set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) set(false); });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !$('wa').contains(e.target)) { panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ── Treatment search ───────────────────────────── */
  function initSearch() {
    var input = $('tr-search'), status = $('tr-status'), tabs = $('cat-tabs');
    if (!input) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll('.tr-card'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('[data-group]'));
    var buttons = tabs ? Array.prototype.slice.call(tabs.querySelectorAll('button[data-cat]')) : [];
    var cat = 'all';

    function run() {
      var q = input.value.trim().toLowerCase(), shown = 0;
      groups.forEach(function (g) {
        var inArea = cat === 'all' || g.getAttribute('data-cat') === cat;
        var any = false;
        g.querySelectorAll('.tr-card').forEach(function (card) {
          var hit = inArea && (!q || (card.getAttribute('data-name') || '').toLowerCase().indexOf(q) !== -1);
          card.hidden = !hit;
          if (hit) { any = true; shown++; }
        });
        g.classList.toggle('is-empty', !any);
      });
      if (q) {
        status.textContent = shown
          ? shown + (shown === 1 ? ' treatment found' : ' treatments found') + (cat === 'all' ? '' : ' in this area')
          : (cat === 'all' ? 'Nothing found. Try a shorter word, or call us on the number below.' : 'Nothing found in this area. Choose "All" to search every treatment, or call us on the number below.');
      } else {
        status.textContent = '';
      }
    }

    function choose(id, updateHash) {
      cat = buttons.some(function (b) { return b.getAttribute('data-cat') === id; }) ? id : 'all';
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === cat)); });
      run();
      var on = buttons.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0];
      if (on && tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: on.offsetLeft - (tabs.clientWidth - on.offsetWidth) / 2, behavior: 'auto' });
      if (updateHash && window.history && history.replaceState) {
        history.replaceState(null, '', cat === 'all' ? location.pathname + location.search : '#' + cat);
      }
    }

    if (tabs) {
      tabs.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-cat]');
        if (b) choose(b.getAttribute('data-cat'), true);
      });
      window.addEventListener('hashchange', function () { choose(location.hash.slice(1), false); });
    }
    input.addEventListener('input', run);
    choose(location.hash.slice(1), false);
  }

  /* ── Call-back form (draft: nothing is sent) ────── */
  function initCallback() {
    var form = $('callback');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('callback-status');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.reset();
      status.textContent = 'Thanks, we have your details. A member of the team will call you back.';
      status.hidden = false;
    });
  }

  /* ── Email sign-up (draft: nothing is sent unless an action is set) ── */
  function initSignup() {
    var form = $('signup-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      var status = $('signup-status');
      if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); return; }
      if (form.getAttribute('action')) return; // live: let the email tool take it
      e.preventDefault();
      form.reset();
      status.textContent = 'Thanks, you\'re on the list.';
      status.hidden = false;
    });
  }

  /* ── Cliniko iframe height ──────────────────────── */
  // Cliniko tells the parent page how tall its content is.
  function initBookingFrame() {
    var frame = $('book-iframe');
    if (!frame) return;
    window.addEventListener('message', function (e) {
      if (e.origin !== 'https://ihealthcare-solutions.uk1.cliniko.com') return;
      var m = typeof e.data === 'string' && e.data.match(/^cliniko-bookings-resize:(\d+)/);
      if (!m) return;
      var h = Math.max(520, parseInt(m[1], 10) + 24);
      frame.style.height = h + 'px';
    });
  }

  initNav();
  initTheme();
  initWhatsApp();
  initSearch();
  initCallback();
  initSignup();
  initBookingFrame();
})();

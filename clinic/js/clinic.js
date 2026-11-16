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
    var input = $('tr-search'), status = $('tr-status');
    if (!input) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll('.tr-card'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('[data-group]'));
    function run() {
      var q = input.value.trim().toLowerCase(), shown = 0;
      cards.forEach(function (card) {
        var hit = !q || (card.getAttribute('data-name') || '').toLowerCase().indexOf(q) !== -1;
        card.hidden = !hit;
        if (hit) shown++;
      });
      groups.forEach(function (g) {
        var any = g.querySelector('.tr-card:not([hidden])');
        g.classList.toggle('is-empty', !any);
      });
      status.textContent = !q ? '' : shown ? shown + (shown === 1 ? ' treatment found' : ' treatments found') : 'Nothing found. Try a shorter word, or call us on the number below.';
    }
    input.addEventListener('input', run);
    run();
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
  initBookingFrame();
})();

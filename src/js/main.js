/* =====================================================
   GROUNDWORK STUDIOS — MAIN JS v2
   Before/after sliders, portfolio filter, lightbox,
   mobile nav, FAQ accordion, forms, announcement bar.
   ===================================================== */

/* ── Before / After Slider ────────────────────────── */
class BASlider {
  constructor(el) {
    this.el      = el;
    this.after   = el.querySelector('.ba-after');
    this.handle  = el.querySelector('.ba-handle');
    this.dragging = false;
    this.pct     = 50;
    if (!this.after || !this.handle) return;
    this._bind();
    this._setPos(50);
  }

  _setPos(pct) {
    this.pct = Math.max(2, Math.min(98, pct));
    this.after.style.clipPath = `inset(0 ${100 - this.pct}% 0 0)`;
    this.handle.style.left    = `${this.pct}%`;
  }

  _pctFromEvent(e) {
    const rect = this.el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  _bind() {
    const start = () => { this.dragging = true; };
    const stop  = () => { this.dragging = false; };
    const move  = (e) => { if (this.dragging) this._setPos(this._pctFromEvent(e)); };

    this.handle.addEventListener('mousedown',  start);
    this.el.addEventListener('mousedown',      (e) => { start(); this._setPos(this._pctFromEvent(e)); });
    document.addEventListener('mouseup',       stop);
    document.addEventListener('mousemove',     move);

    this.handle.addEventListener('touchstart', (e) => { start(); e.stopPropagation(); }, { passive: true });
    this.el.addEventListener('touchstart',     (e) => { start(); this._setPos(this._pctFromEvent(e)); }, { passive: true });
    document.addEventListener('touchend',      stop);
    document.addEventListener('touchmove',     move, { passive: true });

    const btn = this.el.querySelector('.ba-handle-btn');
    if (btn) {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  { this._setPos(this.pct - 5); e.preventDefault(); }
        if (e.key === 'ArrowRight') { this._setPos(this.pct + 5); e.preventDefault(); }
      });
    }
  }
}

function initSliders(root) {
  (root || document).querySelectorAll('[data-ba]').forEach((el) => new BASlider(el));
}

/* ── Mobile Nav ───────────────────────────────────── */
function initNav() {
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!ham || !menu) return;

  ham.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open);
  });

  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      ham.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!ham.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      ham.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    }
  });

  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href === path || (path !== '/' && href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });
}

/* ── FAQ Accordion ────────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((i) => i.classList.remove('open'));
      if (!open) item.classList.add('open');
      btn.setAttribute('aria-expanded', !open);
    });
  });
}

/* ── Announcement Bar Dismiss ─────────────────────── */
function initAnnouncement() {
  const bar = document.getElementById('announcement-bar');
  if (!bar) return;
  const close = bar.querySelector('.ann-close');
  if (close) close.addEventListener('click', () => bar.classList.add('hidden'));
}

/* ── Form Submit (Web3Forms) ──────────────────────── */
function initForm(formId) {
  const form   = document.getElementById(formId);
  const status = form && form.querySelector('.form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn  = form.querySelector('[type=submit]');
    const orig = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    if (status) { status.className = 'form-status'; status.textContent = ''; }

    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
      const json = await res.json();
      if (json.success) {
        if (status) { status.className = 'form-status success'; status.textContent = '✓ Thanks! We'll be in touch within 24 hours.'; }
        form.reset();
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch {
      if (status) { status.className = 'form-status error'; status.textContent = 'Something went wrong. Please call us directly.'; }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = orig; }
    }
  });
}

/* ── Portfolio Filter ─────────────────────────────── */
function initPortfolioFilter() {
  const bar  = document.querySelector('.filter-bar');
  const grid = document.getElementById('project-grid');
  if (!bar || !grid) return;

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    bar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    grid.querySelectorAll('.project-card').forEach((card) => {
      const matches = cat === 'all' || (card.dataset.category || '').toLowerCase() === cat.toLowerCase();
      card.style.display = matches ? '' : 'none';
    });
  });
}

/* ── Load More ────────────────────────────────────── */
function initLoadMore() {
  const btn  = document.getElementById('load-more');
  const grid = document.getElementById('project-grid');
  if (!btn || !grid) return;
  const hidden = Array.from(grid.querySelectorAll('.project-card.js-hidden'));
  if (hidden.length === 0) { btn.closest('.load-more-wrap').style.display = 'none'; return; }
  btn.addEventListener('click', () => {
    hidden.forEach((c) => c.classList.remove('js-hidden'));
    btn.closest('.load-more-wrap').style.display = 'none';
  });
}

/* ── Lightbox ─────────────────────────────────────── */
let _lbSlider = null;

function openLightbox(card) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const set = (sel, val) => { const el = lb.querySelector(sel); if (el) el.textContent = val; };
  const show = (sel, val) => { const el = lb.querySelector(sel); if (el) el.closest('[data-lb-row]').style.display = val ? '' : 'none'; };

  lb.querySelector('.lb-before-img').src = card.dataset.before || '';
  lb.querySelector('.lb-before-img').alt = `Before — ${card.dataset.title || ''}`;
  lb.querySelector('.lb-after-img').src  = card.dataset.after  || '';
  lb.querySelector('.lb-after-img').alt  = `After — ${card.dataset.title || ''}`;
  set('.lb-title',    card.dataset.title    || '');
  set('.lb-tag',      card.dataset.category || '');
  set('.lb-desc',     card.dataset.desc     || '');
  show('.lb-location', card.dataset.location); set('.lb-location', card.dataset.location || '');
  show('.lb-duration', card.dataset.duration); set('.lb-duration', card.dataset.duration || '');
  show('.lb-price',    card.dataset.price);    set('.lb-price',    card.dataset.price    || '');

  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  const sliderEl = lb.querySelector('[data-ba]');
  if (sliderEl) {
    if (_lbSlider) { _lbSlider._setPos(50); }
    else { _lbSlider = new BASlider(sliderEl); }
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  document.querySelectorAll('.project-card[data-before]').forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
  });
  lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

/* ── Init ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSliders();
  initNav();
  initFaq();
  initAnnouncement();
  initForm('contact-form');
  initForm('hero-form');
  initPortfolioFilter();
  initLoadMore();
  initLightbox();
});

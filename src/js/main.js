/* =====================================================
   GROUNDWORK STUDIOS — MAIN JS v2
   Before/after sliders, portfolio filter, lightbox,
   mobile nav, FAQ accordion, forms, announcement bar.
   ===================================================== */

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
        if (status) { status.className = 'form-status success'; status.textContent = "✓ Thanks! We'll be in touch within 24 hours."; }
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

/* ── Booking Demo (front-end only — stops at "enquiry sent") ── */
const BOOKING_SLOTS = ['9:00 am', '10:30 am', '12:00 pm', '1:30 pm', '3:00 pm', '4:30 pm'];

function slotsForDate(dateStr) {
  // Deterministic "unavailable" pick per date, so reloading the same date
  // doesn't shuffle availability — this is a demo, not a live calendar.
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  const unavailableIdx = hash % BOOKING_SLOTS.length;
  return BOOKING_SLOTS.map((time, i) => ({ time, available: i !== unavailableIdx }));
}

function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const dateInput  = document.getElementById('b-date');
  const slotGroup  = document.getElementById('slot-group');
  const slotGrid   = document.getElementById('slot-grid');
  const slotInput  = document.getElementById('b-slot');
  const status     = document.getElementById('booking-form-status');
  const formWrap   = document.getElementById('booking-form-wrap');
  const successBox = document.getElementById('booking-success');
  const summary    = document.getElementById('booking-success-summary');
  const resetBtn   = document.getElementById('booking-reset');

  // Can't pick a date in the past.
  const today = new Date();
  dateInput.min = today.toISOString().split('T')[0];

  dateInput.addEventListener('change', () => {
    slotInput.value = '';
    if (!dateInput.value) { slotGroup.hidden = true; return; }

    const slots = slotsForDate(dateInput.value);
    slotGrid.innerHTML = slots.map(s =>
      `<button type="button" class="slot-btn${s.available ? '' : ' unavailable'}" ${s.available ? '' : 'disabled'} data-time="${s.time}">${s.time}</button>`
    ).join('');
    slotGroup.hidden = false;

    slotGrid.querySelectorAll('.slot-btn:not(.unavailable)').forEach(btn => {
      btn.addEventListener('click', () => {
        slotGrid.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        slotInput.value = btn.dataset.time;
      });
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.className = 'form-status'; status.textContent = '';

    if (!slotInput.value) {
      status.className = 'form-status error';
      status.textContent = 'Please choose an available time slot.';
      return;
    }

    const btn  = form.querySelector('[type=submit]');
    const orig = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending…';

    const service = form.service.value;
    const date = new Date(dateInput.value + 'T00:00:00');
    const dateLabel = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

    // This is a front-end demo: it stops here, at the enquiry being sent —
    // there's no live calendar behind it, matching the real Tier 2 flow
    // where a request is confirmed by the business, not auto-booked.
    setTimeout(() => {
      summary.textContent = `${service} — ${dateLabel} at ${slotInput.value}, for ${form.name.value}.`;
      formWrap.querySelector('h2').hidden = true;
      formWrap.querySelector('p').hidden = true;
      formWrap.querySelector('.contact-reassurances').hidden = true;
      form.hidden = true;
      successBox.hidden = false;
      btn.disabled = false; btn.textContent = orig;
    }, 600);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      slotGroup.hidden = true;
      slotInput.value = '';
      status.className = 'form-status'; status.textContent = '';
      formWrap.querySelector('h2').hidden = false;
      formWrap.querySelector('p').hidden = false;
      formWrap.querySelector('.contact-reassurances').hidden = false;
      form.hidden = false;
      successBox.hidden = true;
    });
  }
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

  lb.removeAttribute('hidden');
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  lb.setAttribute('hidden', '');
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
  initNav();
  initFaq();
  initAnnouncement();
  initForm('contact-form');
  initForm('hero-form');
  initBookingForm();
  initPortfolioFilter();
  initLoadMore();
  initLightbox();
});

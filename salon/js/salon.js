/* =====================================================
   GROUNDWORK STUDIOS — SALON TEMPLATE
   Front-end behaviour. No dependencies.
   ===================================================== */
(function () {
  'use strict';

  var dataEl = document.getElementById('salon-data');
  var DATA = dataEl ? JSON.parse(dataEl.textContent) : { hours: {}, categories: [], team: [] };

  var $ = function (id) { return document.getElementById(id); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var toMins = function (hhmm) { var p = hhmm.split(':'); return +p[0] * 60 + +p[1]; };
  var fromMins = function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };

  function time12(hhmm) {
    var p = hhmm.split(':'), h = +p[0], m = +p[1];
    return (h % 12 || 12) + (m ? ':' + pad(m) : '') + (h >= 12 ? 'pm' : 'am');
  }
  function duration(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    if (!h) return m + ' min';
    return m ? h + ' hr ' + m + ' min' : h + ' hr';
  }
  function priceText(s) { return s.price ? (s.from ? 'from ' : '') + '£' + s.price : 'Free'; }
  function isoDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  // The salon keeps UK time, wherever the visitor is.
  function ukNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[get('weekday')], mins: (+get('hour') % 24) * 60 + +get('minute') };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }

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

  /* ── Open-now pill and today's row ──────────────── */
  function initHours() {
    var now = ukNow(), today = DATA.hours[now.day];
    document.querySelectorAll('.hours-table tr[data-day="' + now.day + '"]').forEach(function (tr) { tr.classList.add('today'); });
    var pill = document.querySelector('[data-open-pill]');
    if (!pill) return;
    var open = today && now.mins >= toMins(today[0]) && now.mins < toMins(today[1]);
    if (open) {
      pill.textContent = 'Open until ' + time12(today[1]);
    } else {
      pill.classList.add('closed');
      var label = 'Closed now';
      for (var i = (today && now.mins < toMins(today[0])) ? 0 : 1; i <= 7; i++) {
        var d = (now.day + i) % 7, h = DATA.hours[d];
        if (h) {
          var names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          label = 'Opens ' + (i === 0 ? 'today' : i === 1 ? 'tomorrow' : names[d]) + ' ' + time12(h[0]);
          break;
        }
      }
      pill.textContent = label;
    }
    pill.hidden = false;
  }

  /* ── Gallery lightbox ───────────────────────────── */
  function initGallery() {
    var grid = $('gallery-grid'), box = $('lightbox');
    if (!grid || !box || !box.showModal) return;
    grid.addEventListener('click', function (e) {
      var item = e.target.closest('.gallery-item');
      if (!item) return;
      var img = item.querySelector('img');
      $('lightbox-img').src = img.src;
      $('lightbox-img').alt = img.alt;
      $('lightbox-cap').textContent = img.alt;
      box.showModal();
    });
    $('lightbox-close').addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  }

  /* ── Contact message form (demo: nothing is sent) ─ */
  function initMessageForm() {
    var form = $('message-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('message-status');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.reset();
      status.textContent = 'Thanks, your message is on its way. We reply within one working day.';
      status.hidden = false;
    });
  }

  /* ── Booking ────────────────────────────────────── */
  function initBooking() {
    var app = $('book-app');
    if (!app) return;

    var params = new URLSearchParams(location.search);
    var state = { step: 1, cat: null, service: null, stylist: null, date: null, time: null };
    var wantedStylist = params.get('stylist');

    var allServices = [];
    DATA.categories.forEach(function (c) { c.services.forEach(function (s) { allServices.push({ s: s, cat: c.id }); }); });

    var pre = allServices.filter(function (x) { return x.s.id === params.get('s'); })[0];
    if (pre) { state.cat = pre.cat; state.service = pre.s; }
    else if (DATA.categories.some(function (c) { return c.id === params.get('cat'); })) state.cat = params.get('cat');
    else state.cat = DATA.categories[0].id;

    var stepsEl = $('book-steps'), nextBtn = $('book-next'), backBtn = $('book-back');
    var sections = app.querySelectorAll('.book-step');
    var catById = function (id) { return DATA.categories.filter(function (c) { return c.id === id; })[0]; };
    var stylistById = function (id) { return DATA.team.filter(function (t) { return t.id === id; })[0]; };
    var eligible = function () { return DATA.team.filter(function (t) { return t.does.indexOf(state.cat) !== -1; }); };

    // Stable pretend availability: the same slot always shows the same way.
    // This is a demo, not a live diary.
    function hash(str) { var h = 7; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
    function stylistFree(id, date, t) { return hash(id + date + t) % 100 >= 38; }

    function slotsFor(date) {
      var d = new Date(date + 'T12:00:00'), h = DATA.hours[d.getDay()];
      if (!h || !state.service) return [];
      var now = ukNow(), todayIso = isoDate(new Date());
      var start = toMins(h[0]), last = toMins(h[1]) - state.service.mins;
      var who = state.stylist === 'any' ? eligible().map(function (t) { return t.id; }) : [state.stylist];
      var out = [];
      for (var m = start; m <= last; m += 30) {
        if (date === todayIso && m < now.mins + 60) continue;
        var t = fromMins(m);
        if (who.some(function (id) { return stylistFree(id, date, t); })) out.push(t);
      }
      return out;
    }

    function renderTabs() {
      $('cat-tabs').innerHTML = DATA.categories.map(function (c) {
        return '<button type="button" class="tab" role="tab" aria-selected="' + (c.id === state.cat) + '" data-cat="' + c.id + '">' + c.name + '</button>';
      }).join('');
    }
    function renderServices() {
      var cat = catById(state.cat), note = $('cat-note');
      note.textContent = cat.note; note.hidden = !cat.note;
      $('service-list').innerHTML = cat.services.map(function (s) {
        var on = state.service && state.service.id === s.id;
        return '<button type="button" class="option" role="radio" aria-checked="' + !!on + '" data-service="' + s.id + '">' +
          '<strong>' + s.name + '</strong><span class="price">' + priceText(s) + '</span>' +
          '<span class="meta">' + duration(s.mins) + (s.note ? ' · ' + s.note : '') + '</span></button>';
      }).join('');
    }
    function renderStylists() {
      var list = [{ id: 'any', name: 'No preference', role: 'First available stylist' }].concat(eligible());
      $('stylist-list').innerHTML = list.map(function (t) {
        return '<button type="button" class="option option-person" role="radio" aria-checked="' + (state.stylist === t.id) + '" data-stylist="' + t.id + '">' +
          '<span class="avatar" aria-hidden="true">' + (t.id === 'any' ? '★' : t.name[0]) + '</span>' +
          '<strong>' + t.name + '</strong><span class="meta">' + t.role + '</span></button>';
      }).join('');
    }
    function renderDates() {
      var html = '', d = new Date(); d.setHours(12, 0, 0, 0);
      var firstOpen = null;
      for (var i = 0; i < 21; i++) {
        var iso = isoDate(d), has = slotsFor(iso).length > 0;
        if (has && !firstOpen) firstOpen = iso;
        html += '<button type="button" class="date-btn" role="radio" data-date="' + iso + '" aria-checked="false"' + (has ? '' : ' disabled') +
          ' aria-label="' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + (has ? '' : ', no times') + '">' +
          '<span class="dow">' + d.toLocaleDateString('en-GB', { weekday: 'short' }) + '</span>' +
          '<span class="dom">' + d.getDate() + '</span>' +
          '<span class="mon">' + d.toLocaleDateString('en-GB', { month: 'short' }) + '</span></button>';
        d.setDate(d.getDate() + 1);
      }
      $('date-strip').innerHTML = html;
      if (!state.date || !slotsFor(state.date).length) { state.date = firstOpen; state.time = null; }
      markDate();
      renderSlots();
    }
    function markDate() {
      $('date-strip').querySelectorAll('.date-btn').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.date === state.date)); });
    }
    function renderSlots() {
      var grid = $('slot-grid'), heading = $('slot-heading');
      if (!state.date) { heading.textContent = ''; grid.innerHTML = '<p class="slot-empty">No times in the next three weeks. Please call us and we will fit you in.</p>'; return; }
      var slots = slotsFor(state.date);
      heading.textContent = new Date(state.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ': ' + slots.length + ' times free';
      grid.innerHTML = slots.map(function (t) {
        return '<button type="button" class="slot" role="radio" aria-checked="' + (state.time === t) + '" data-time="' + t + '">' + time12(t) + '</button>';
      }).join('');
    }

    function whenText() {
      if (!state.date || !state.time) return '';
      return new Date(state.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' at ' + time12(state.time);
    }
    function stylistText() {
      if (!state.stylist) return '';
      return state.stylist === 'any' ? 'First available' : stylistById(state.stylist).name;
    }
    function setSum(id, text, fallback) {
      var el = $(id); el.textContent = text || fallback; el.classList.toggle('empty', !text);
    }
    function renderSummary() {
      setSum('sum-service', state.service && state.service.name, 'Not chosen yet');
      setSum('sum-stylist', stylistText(), 'Not chosen yet');
      setSum('sum-when', whenText(), 'Not chosen yet');
      $('sum-mins').textContent = state.service ? duration(state.service.mins) : '-';
      $('sum-price').textContent = state.service ? priceText(state.service) : '-';
    }

    function canContinue() {
      if (state.step === 1) return !!state.service;
      if (state.step === 2) return !!state.stylist;
      if (state.step === 3) return !!(state.date && state.time);
      return true;
    }
    function render(scroll) {
      sections.forEach(function (s) { s.hidden = +s.dataset.step !== state.step; });
      stepsEl.querySelectorAll('li').forEach(function (li) {
        var n = +li.dataset.step;
        li.classList.toggle('active', n === state.step);
        li.classList.toggle('done', n < state.step);
        if (n === state.step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      if (state.step === 1) { renderTabs(); renderServices(); }
      if (state.step === 2) renderStylists();
      if (state.step === 3) renderDates();
      backBtn.hidden = state.step === 1;
      nextBtn.textContent = state.step === 4 ? 'Confirm booking' : 'Continue';
      nextBtn.disabled = !canContinue();
      renderSummary();
      if (scroll) app.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    $('cat-tabs').addEventListener('click', function (e) {
      var b = e.target.closest('.tab'); if (!b) return;
      state.cat = b.dataset.cat; state.service = null; state.stylist = null; state.time = null;
      render(false);
    });
    $('service-list').addEventListener('click', function (e) {
      var b = e.target.closest('.option'); if (!b) return;
      state.service = catById(state.cat).services.filter(function (s) { return s.id === b.dataset.service; })[0];
      state.time = null;
      if (state.stylist && state.stylist !== 'any' && stylistById(state.stylist).does.indexOf(state.cat) === -1) state.stylist = null;
      render(false);
    });
    $('stylist-list').addEventListener('click', function (e) {
      var b = e.target.closest('.option'); if (!b) return;
      state.stylist = b.dataset.stylist; state.time = null;
      render(false);
    });
    $('date-strip').addEventListener('click', function (e) {
      var b = e.target.closest('.date-btn'); if (!b || b.disabled) return;
      state.date = b.dataset.date; state.time = null;
      markDate(); renderSlots(); renderSummary(); nextBtn.disabled = true;
    });
    $('slot-grid').addEventListener('click', function (e) {
      var b = e.target.closest('.slot'); if (!b) return;
      state.time = b.dataset.time;
      renderSlots(); renderSummary(); nextBtn.disabled = false;
    });

    $('book-form').addEventListener('input', function (e) {
      if (e.target.classList) e.target.classList.remove('invalid');
      $('book-error').hidden = true;
    });

    backBtn.addEventListener('click', function () { if (state.step > 1) { state.step--; render(true); } });

    nextBtn.addEventListener('click', function () {
      if (!canContinue()) return;
      if (state.step === 1 && !state.stylist && wantedStylist) {
        var w = stylistById(wantedStylist);
        if (w && w.does.indexOf(state.cat) !== -1) state.stylist = w.id;
      }
      if (state.step < 4) { state.step++; render(true); return; }
      confirm();
    });

    function confirm() {
      var form = $('book-form'), err = $('book-error');
      var name = form.elements.name, phone = form.elements.phone, email = form.elements.email;
      var digits = phone.value.replace(/\D/g, '');
      var problems = [];
      name.classList.toggle('invalid', !name.value.trim());
      phone.classList.toggle('invalid', digits.length < 10);
      email.classList.toggle('invalid', !!email.value && !email.checkValidity());
      if (!name.value.trim()) problems.push('your name');
      if (digits.length < 10) problems.push('a mobile number we can text');
      if (email.value && !email.checkValidity()) problems.push('a valid email, or leave it blank');
      if (problems.length) {
        err.textContent = 'Please add ' + problems.join(' and ') + '.';
        err.hidden = false;
        (form.querySelector('.invalid') || name).focus();
        return;
      }
      err.hidden = true;
      nextBtn.disabled = true; nextBtn.textContent = 'Sending…';
      // Demo: stops here. On a live site this request goes to the salon's diary.
      setTimeout(function () {
        sections.forEach(function (s) { s.hidden = true; });
        stepsEl.hidden = true;
        app.querySelector('.book-nav').hidden = true;
        $('done-summary').textContent = state.service.name + ' with ' + (state.stylist === 'any' ? 'the first available stylist' : stylistById(state.stylist).name) +
          ', ' + new Date(state.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' at ' + time12(state.time) + '.';
        var done = $('book-done'); done.hidden = false; done.focus();
        app.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }

    $('done-ics').addEventListener('click', function () {
      var start = state.date.replace(/-/g, '') + 'T' + state.time.replace(':', '') + '00';
      var endM = toMins(state.time) + state.service.mins;
      var end = state.date.replace(/-/g, '') + 'T' + fromMins(endM).replace(':', '') + '00';
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Groundwork Studios//Salon Booking//EN', 'BEGIN:VEVENT',
        'UID:' + Date.now() + '@salon-demo', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        'DTSTART;TZID=Europe/London:' + start, 'DTEND;TZID=Europe/London:' + end,
        'SUMMARY:' + state.service.name + ' at ' + DATA.business, 'DESCRIPTION:Awaiting confirmation by text. Questions: ' + DATA.phone,
        'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      a.download = 'appointment.ics';
      document.body.appendChild(a); a.click(); a.remove();
    });

    $('done-again').addEventListener('click', function () {
      state = { step: 1, cat: DATA.categories[0].id, service: null, stylist: null, date: null, time: null };
      $('book-form').reset();
      stepsEl.hidden = false;
      app.querySelector('.book-nav').hidden = false;
      $('book-done').hidden = true;
      render(true);
    });

    render(false);
  }

  initNav();
  initHours();
  initGallery();
  initMessageForm();
  initBooking();
})();

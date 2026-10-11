/* 1daily AG – Website-Logik: Menü, Sprache, Formulare, Globus */
(function () {
  var cfg = window.SITE_CONFIG || {};
  var lang = document.documentElement.lang === 'en' ? 'en' : 'de';
  var T = {
    de: { more: 'Mehr lesen ↓', less: 'Weniger anzeigen ↑', sending: 'Wird gesendet …',
          err: 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder schreiben Sie uns per E-Mail.',
          notcfg: 'Das Formular ist noch nicht aktiviert. Bitte versuchen Sie es später erneut.' },
    en: { more: 'Read more ↓', less: 'Show less ↑', sending: 'Sending …',
          err: 'Sending failed. Please try again or contact us by e-mail.',
          notcfg: 'This form is not yet active. Please try again later.' }
  }[lang];

  /* Mobile Menü */
  var body = document.body;
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    var b = document.querySelector('.burger');
    if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var c = document.querySelector('.mmenu .close'); if (c) c.focus(); }
  }
  document.querySelectorAll('[data-menu="open"]').forEach(function (el) { el.addEventListener('click', function () { setMenu(true); }); });
  document.querySelectorAll('[data-menu="close"], .mmenu nav a').forEach(function (el) { el.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });

  /* Kurzbeschreibung auf-/zuklappen (mobil) */
  document.querySelectorAll('[data-more]').forEach(function (btn) {
    var p = document.getElementById(btn.getAttribute('data-more'));
    if (!p) return;
    btn.textContent = T.more;
    btn.addEventListener('click', function () {
      var open = p.classList.toggle('open');
      btn.textContent = open ? T.less : T.more;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* Sprachwahl merken */
  document.querySelectorAll('[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () { try { localStorage.setItem('lang', a.getAttribute('data-lang')); } catch (e) {} });
  });

  /* E-Mail-Adressen einsetzen */
  document.querySelectorAll('[data-email]').forEach(function (el) {
    var v = cfg[el.getAttribute('data-email')];
    if (!v) { var w = el.closest('[data-email-wrap]'); if (w) w.style.display = 'none'; return; }
    el.textContent = v; el.setAttribute('href', 'mailto:' + v);
  });

  /* Formulare via Formspree */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var id = cfg[form.getAttribute('data-form')];
      if (!id) { status.textContent = T.notcfg; status.className = 'form-status err'; return; }
      var btn = form.querySelector('button[type="submit"]'); var label = btn.textContent;
      btn.disabled = true; btn.textContent = T.sending; status.textContent = ''; status.className = 'form-status';
      fetch('https://formspree.io/f/' + encodeURIComponent(id), { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); form.closest('.form-card').classList.add('sent'); form.closest('.form-card').scrollIntoView({ behavior: 'smooth', block: 'center' }); })
        .catch(function () { status.textContent = T.err; status.className = 'form-status err'; })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  });

  /* Globus */
  var cv = document.getElementById('globe');
  if (cv && window.startGlobe) {
    try { window.startGlobe(cv, JSON.parse(cv.getAttribute('data-cfg') || '{}')); } catch (e) {}
  }
})();

/* Farbschema: hell / dunkel */
(function () {
  var d = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var meta = document.querySelector('meta[name="theme-color"]');
  function stored() { try { return localStorage.getItem('theme'); } catch (e) { return null; } }
  function sync() {
    var dark = d.getAttribute('data-theme') === 'dark';
    if (meta) meta.setAttribute('content', dark ? '#0A0A0A' : '#FFFFFF');
    document.querySelectorAll('[data-theme-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', (b.getAttribute('data-theme-set') === 'dark') === dark ? 'true' : 'false');
    });
  }
  function apply(t, save) {
    d.classList.add('theme-anim');
    if (t === 'dark') d.setAttribute('data-theme', 'dark'); else d.removeAttribute('data-theme');
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
    sync();
    setTimeout(function () { d.classList.remove('theme-anim'); }, 500);
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { apply(d.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); });
  });
  document.querySelectorAll('[data-theme-set]').forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-theme-set'), true); });
  });
  if (mq) {
    var onChange = function (e) { if (!stored()) apply(e.matches ? 'dark' : 'light', false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }
  sync();
})();

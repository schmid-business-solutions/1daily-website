/* 1daily AG – Interaktive Animationen
   1) Hero-Titel Wort für Wort  2) Gold-Wörter leuchten beim Scrollen auf
   3) Kennzahlen zählen hoch    4) Ablauf-Linie füllt sich beim Scrollen
   5) Karten neigen sich zur Maus (nur Desktop)
   Alles respektiert «Bewegung reduzieren». */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  root.classList.add('js-anim');
  if (reduce) { root.classList.add('no-motion'); return; }

  /* 1) Hero-Titel ------------------------------------------------------ */
  var h1 = document.querySelector('.hero h1, .page-hero h1');
  if (h1) {
    var n = 0, base = 0.15, step = 0.075;
    h1.classList.remove('up', 'u1');
    var wrapWords = function (node, gold) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var parts = c.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var i = document.createElement('span'); i.className = 'wi' + (gold ? ' gold' : '');
            i.textContent = p; i.style.animationDelay = (base + n++ * step).toFixed(3) + 's';
            w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') {
          var isGold = c.classList.contains('gold');
          if (isGold) c.classList.remove('gold');
          wrapWords(c, gold || isGold);
          if (isGold) c.classList.add('gold-words');
        }
      });
    };
    wrapWords(h1, false);
    h1.classList.add('wsplit');
    var after = base + n * step;
    // Nachfolgende Elemente erst nach dem Titel einblenden
    var sib = h1.nextElementSibling, k = 0;
    while (sib && k < 4) {
      if (sib.classList.contains('up')) sib.style.animationDelay = (after + 0.1 + k * 0.12).toFixed(2) + 's';
      sib = sib.nextElementSibling; k++;
    }
  }

  var io = function (els, cb, opts) {
    if (!('IntersectionObserver' in window)) { els.forEach(cb); return; }
    var o = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { cb(e.target); o.unobserve(e.target); } });
    }, opts || { threshold: 0.6 });
    els.forEach(function (el) { o.observe(el); });
  };

  /* 2) Gold-Wörter in Abschnittstiteln -------------------------------- */
  var golds = Array.prototype.slice.call(document.querySelectorAll('main h2 .gold'));
  golds.forEach(function (g) { g.classList.add('gold-lit-pending'); });
  io(golds, function (g) { setTimeout(function () { g.classList.add('gold-lit'); }, 150); }, { threshold: 0.9, rootMargin: '0px 0px -12% 0px' });

  /* 3) Kennzahlen zählen hoch ------------------------------------------ */
  var nums = Array.prototype.slice.call(document.querySelectorAll('.rules .big, .funds .gold, .count'));
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  nums.forEach(function (el) {
    var m = el.textContent.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
    if (!m) return;
    el.dataset.target = m[1]; el.dataset.suffix = m[2];
    el.textContent = '0' + m[2];
  });
  io(nums.filter(function (el) { return el.dataset.target; }), function (el) {
    var target = parseFloat(el.dataset.target.replace(',', '.')), suf = el.dataset.suffix;
    var dec = (el.dataset.target.split(/[.,]/)[1] || '').length, dur = 1400, t0 = null;
    var tick = function (ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), v = target * easeOut(p);
      el.textContent = (dec ? v.toFixed(dec).replace('.', ',') : Math.round(v)) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.5 });

  /* In-View-Klasse für Grafiken */
  io(Array.prototype.slice.call(document.querySelectorAll('[data-inview]')), function (el) { el.classList.add('in'); }, { threshold: 0.35 });

  /* 4) Ablauf-Linie über den drei Schritten ---------------------------- */
  Array.prototype.slice.call(document.querySelectorAll('[data-flow]')).forEach(function (grid) {
    var cards = Array.prototype.slice.call(grid.children);
    var track = document.createElement('div');
    track.className = 'flow-track'; track.setAttribute('aria-hidden', 'true');
    track.innerHTML = '<div class="flow-fill"></div>' + cards.map(function (_, i) {
      return '<span class="flow-dot" style="left:' + ((i + 0.5) / cards.length * 100) + '%"></span>';
    }).join('');
    grid.parentNode.insertBefore(track, grid);
    var fill = track.querySelector('.flow-fill'), dots = track.querySelectorAll('.flow-dot');
    var ticking = false;
    var update = function () {
      ticking = false;
      var r = grid.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh * 0.85 - r.top) / (r.height * 0.9 + vh * 0.25);
      p = Math.max(0, Math.min(1, p));
      fill.style.transform = 'scaleX(' + p + ')';
      cards.forEach(function (c, i) {
        var on = p >= (i + 0.35) / cards.length;
        c.classList.toggle('flow-on', on);
        if (dots[i]) dots[i].classList.toggle('on', on);
      });
    };
    var req = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    update();
  });

  /* 5) Karten mit Tiefe (nur mit Maus) --------------------------------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    Array.prototype.slice.call(document.querySelectorAll('.card')).forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        var dx = x - 0.5, dy = y - 0.5, mag = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        card.style.rotate = (-dy / mag).toFixed(3) + ' ' + (dx / mag).toFixed(3) + ' 0 ' + (mag * 9).toFixed(2) + 'deg';
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        card.classList.add('tilt');
      });
      card.addEventListener('pointerleave', function () {
        card.style.rotate = ''; card.classList.remove('tilt');
      });
    });
  }
})();

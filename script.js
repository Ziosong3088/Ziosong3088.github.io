/* ============================================================
   Zio Song — portfolio interactions
   1) Sketchbook carousel (one drawing at a time)
   2) Full-screen lightbox viewer for the Original art work grid
   Note: the "See more" buttons are plain anchor links
   (#original-art / #sketchbook) — the smooth glide comes from
   `scroll-behavior: smooth` in style.css, no JS needed.
   ============================================================ */

/* ---------- 1) Sketchbook carousel ---------- */
(function () {
  var track = document.getElementById('carousel-track');
  if (!track) return;
  var slides = track.children.length;
  var dotsWrap = document.getElementById('car-dots');
  var idx = 0;

  // Build the navigation dots (one per slide)
  for (var i = 0; i < slides; i++) {
    var d = document.createElement('button');
    d.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    d.dataset.i = i;
    d.addEventListener('click', function () { goTo(+this.dataset.i); });
    dotsWrap.appendChild(d);
  }
  var dots = dotsWrap.children;

  function render() {
    track.style.transform = 'translateX(' + (-idx * 100) + '%)';
    for (var j = 0; j < slides; j++) {
      dots[j].classList.toggle('active', j === idx);
    }
  }
  function goTo(i) { idx = (i + slides) % slides; render(); }
  function prev() { goTo(idx - 1); }
  function next() { goTo(idx + 1); }

  // Arrow buttons at the bottom
  document.getElementById('car-prev').addEventListener('click', prev);
  document.getElementById('car-next').addEventListener('click', next);

  // Click zones: left half of the stage = previous, right half = next
  document.getElementById('zone-prev').addEventListener('click', prev);
  document.getElementById('zone-next').addEventListener('click', next);

  // Touch swipe (mobile)
  var startX = null;
  var stage = document.getElementById('carousel');
  stage.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    startX = null;
  }, { passive: true });

  // Arrow keys drive the carousel when the lightbox is closed
  document.addEventListener('keydown', function (e) {
    var box = document.getElementById('lightbox');
    if (box && box.classList.contains('open')) return; // lightbox owns the keys then
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  render();
})();

/* ---------- 2) Full-screen lightbox (Original art work grid) ---------- */
(function () {
  var box = document.getElementById('lightbox'),
      img = document.getElementById('lightbox-img'),
      cap = document.getElementById('lightbox-cap'),
      items = [], idx = 0;

  function captionFor(el) {
    var fig = el.closest('figure'); if (!fig) return '';
    var fc = fig.querySelector('figcaption'); if (!fc) return '';
    var title = fc.childNodes[0].textContent.trim(),
        sub = fc.querySelector('span');
    return sub ? title + ' — ' + sub.textContent.trim() : title;
  }

  document.querySelectorAll('.gallery-grid figure img').forEach(function (el) { items.push(el); });

  function show(i) {
    idx = (i + items.length) % items.length;
    var el = items[idx];
    img.src = el.src; img.alt = el.alt || ''; cap.textContent = captionFor(el);
  }
  function open(i) {
    show(i);
    box.classList.add('open'); box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('open'); box.setAttribute('aria-hidden', 'true');
    img.src = ''; document.body.style.overflow = '';
  }

  items.forEach(function (el, i) { el.addEventListener('click', function () { open(i); }); });
  document.getElementById('lightbox-close').addEventListener('click', close);
  document.getElementById('lightbox-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  document.getElementById('lightbox-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();

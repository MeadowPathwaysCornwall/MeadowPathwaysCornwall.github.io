// Active tab, staff unlock, smooth anchors, and reliable transform-based auto-carousel
document.addEventListener('DOMContentLoaded', function () {

  // Active tab highlight
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    const href = tab.getAttribute('href') || '';
    if (href && (window.location.pathname === href || window.location.pathname.endsWith('/' + href))) {
      tab.style.opacity = '0.95';
      tab.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
      tab.setAttribute('aria-current', 'page');
    }
  });

  // Staff unlock
  const PASSWORD = 'MPWEC!';
  const lockedEl = document.getElementById('locked');
  const staffPanel = document.getElementById('staffPanel');
  const unlockBtn = document.getElementById('unlockBtn');
  const pwdInput = document.getElementById('staffPassword');

  if (unlockBtn && lockedEl && staffPanel && pwdInput) {
    unlockBtn.addEventListener('click', function () {
      const val = (pwdInput.value || '').trim();
      if (val === PASSWORD) {
        lockedEl.style.display = 'none';
        staffPanel.style.display = 'block';
        lockedEl.setAttribute('aria-hidden', 'true');
        staffPanel.setAttribute('aria-hidden', 'false');
        const staffNameInput = document.getElementById('staff-name');
        if (staffNameInput) staffNameInput.focus();
      } else {
        pwdInput.value = '';
        pwdInput.focus();
        alert('Incorrect password. If you need access, please contact Michelle or Zoe.');
      }
    });
  }

  // Smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const sel = this.getAttribute('href');
      const target = document.querySelector(sel);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Carousel (transform-based)
  (function initCarousel() {
    const slidesContainer = document.querySelector('.carousel-slides');
    if (!slidesContainer) return;
    const items = Array.from(slidesContainer.querySelectorAll('.carousel-item'));
    if (items.length === 0) return;

    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const dotsEl = document.getElementById('dots');

    let current = 0;
    const total = items.length;
    const intervalMs = 3500;
    let timer = null;
    let autoplay = true;

    // set sizes so items fill viewport
    function size() {
      const viewport = slidesContainer.parentElement || slidesContainer;
      const w = Math.floor(viewport.clientWidth);
      items.forEach(it => { it.style.minWidth = w + 'px'; });
      // reposition without animation
      goTo(current, false);
    }

    // transform to slide index
    function goTo(index, smooth = true) {
      current = ((index % total) + total) % total;
      const w = items[0].clientWidth || slidesContainer.clientWidth;
      const x = -current * w;
      if (smooth) {
        slidesContainer.style.transition = 'transform .45s ease';
      } else {
        slidesContainer.style.transition = 'none';
      }
      slidesContainer.style.transform = 'translateX(' + x + 'px)';
      updateDots();
    }

    function next() { goTo(current + 1, true); }
    function prev() { goTo(current - 1, true); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

    // build dots
    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'dot';
        b.setAttribute('aria-label', 'Slide ' + (i + 1));
        b.addEventListener('click', () => { goTo(i, true); resetTimer(); });
        dotsEl.appendChild(b);
      }
    }

    function updateDots() {
      if (!dotsEl) return;
      Array.from(dotsEl.children).forEach((d, i) => {
        d.style.opacity = i === current ? '1' : '0.45';
        d.style.transform = i === current ? 'scale(1.05)' : 'scale(1)';
      });
    }

    function start() { stop(); if (!autoplay) return; timer = setInterval(next, intervalMs); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function resetTimer() { stop(); start(); }

    // pause on hover/focus
    const parent = slidesContainer.parentElement;
    if (parent) {
      parent.addEventListener('mouseenter', stop);
      parent.addEventListener('mouseleave', () => { if (autoplay) start(); });
    }

    [prevBtn, nextBtn, dotsEl].forEach(el => {
      if (!el) return;
      el.addEventListener('focusin', stop);
      el.addEventListener('focusout', () => { if (autoplay) start(); });
    });

    window.addEventListener('resize', debounce(size, 120));

    // init
    size();
    updateDots();
    if (autoplay) start();

    function debounce(fn, wait) { let t; return function () { clearTimeout(t); t = setTimeout(() => fn.apply(this, arguments), wait); }; }

    // expose for debugging
    slidesContainer.__carousel = { goTo, next, prev, start, stop };
  })();

});

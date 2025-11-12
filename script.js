// script.js - active tab, staff unlock, smooth anchors, single-slide auto carousel
document.addEventListener('DOMContentLoaded', function () {

  // Active Tab Highlight
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    const href = tab.getAttribute('href') || '';
    if (href && (window.location.pathname === href || window.location.pathname.endsWith('/' + href))) {
      tab.style.opacity = '0.95';
      tab.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
      tab.setAttribute('aria-current', 'page');
    }
  });

  // Staff Panel Unlock
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

  // Carousel
  (function initCarousel() {
    const carousel = document.querySelector('.carousel-slides');
    if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('li'));
    if (!slides.length) return;

    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const dotsEl = document.getElementById('dots');

    let current = 0;
    const total = slides.length;
    const intervalMs = 3000;
    let timer = null;
    let autoplay = true;

    function sizeSlides() {
      const viewport = carousel.parentElement || carousel;
      const w = Math.floor(viewport.clientWidth);
      slides.forEach(li => { li.style.minWidth = w + 'px'; });
      scrollTo(current, false);
    }

    function scrollTo(index, smooth = true) {
      current = ((index % total) + total) % total;
      const slideWidth = slides[0].clientWidth || carousel.clientWidth;
      const left = current * slideWidth;
      if (smooth) carousel.scrollTo({ left, behavior: 'smooth' });
      else carousel.scrollTo({ left });
      updateDots();
    }

    function next() { scrollTo(current + 1, true); }
    function prev() { scrollTo(current - 1, true); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Slide ' + (i + 1));
        b.addEventListener('click', () => { scrollTo(i, true); resetTimer(); });
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

    function startTimer() { stopTimer(); if (!autoplay) return; timer = setInterval(() => next(), intervalMs); }
    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
    function resetTimer() { stopTimer(); startTimer(); }

    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', () => { if (autoplay) startTimer(); });

    window.addEventListener('resize', debounce(sizeSlides, 120));
    function debounce(fn, t) { let x; return function () { clearTimeout(x); x = setTimeout(fn, t); }; }

    sizeSlides();
    updateDots();
    if (autoplay) startTimer();
  })();

});

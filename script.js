// script.js - active tab, staff unlock, smooth anchors, improved carousel
document.addEventListener('DOMContentLoaded', function () {

  // --- Sidebar Active Tab Highlight (more robust)
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    try {
      const href = tab.getAttribute('href') || '';
      // handle relative hrefs reliably
      if (href && (window.location.pathname === href || window.location.pathname.endsWith('/' + href))) {
        tab.style.opacity = '0.95';
        tab.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        tab.setAttribute('aria-current', 'page');
      }
    } catch (e) { /* ignore */ }
  });

  // --- Staff Panel Unlock (unchanged behaviour but safe)
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

  // --- Auto-scroll Smooth for Anchors (safe guard: only scroll to existing targets)
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

  // --- Carousel: single-slide viewport, auto-scroll, controls, dots, responsive
  (function initCarousel() {
    const carousel = document.querySelector('.carousel-slides');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('li'));
    if (slides.length === 0) return;

    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const dotsEl = document.getElementById('dots');

    let current = 0;
    const total = slides.length;
    const intervalMs = 3000;
    let timer = null;
    let autoplay = true;

    // Make each slide fill the visible container width so only one is visible
    function sizeSlides() {
      const container = carousel.parentElement || carousel;
      const viewportWidth = Math.floor(container.clientWidth);
      slides.forEach(li => {
        li.style.minWidth = viewportWidth + 'px';
        li.style.boxSizing = 'border-box';
      });
      // Reposition to current slide without smooth animation
      scrollToIndex(current, false);
    }

    function scrollToIndex(index, smooth = true) {
      current = ((index % total) + total) % total;
      const slideWidth = slides[0].clientWidth || carousel.clientWidth;
      const left = current * slideWidth;
      if (smooth) {
        carousel.scrollTo({ left, behavior: 'smooth' });
      } else {
        carousel.scrollTo({ left });
      }
      updateDots();
    }

    function next() { scrollToIndex(current + 1, true); }
    function prev() { scrollToIndex(current - 1, true); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

    // create dots
    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dot';
        btn.setAttribute('aria-label', `Slide ${i + 1}`);
        btn.addEventListener('click', () => { scrollToIndex(i, true); resetTimer(); });
        dotsEl.appendChild(btn);
      }
    }

    function updateDots() {
      if (!dotsEl) return;
      Array.from(dotsEl.children).forEach((d, i) => {
        d.style.opacity = i === current ? '1' : '0.45';
        d.style.transform = i === current ? 'scale(1.05)' : 'scale(1)';
      });
    }

    function startTimer() {
      stopTimer();
      if (!autoplay) return;
      timer = setInterval(() => { next(); }, intervalMs);
    }
    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
    function resetTimer() { stopTimer(); startTimer(); }

    // Pause on hover/focus
    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', () => { if (autoplay) startTimer(); });

    [nextBtn, prevBtn, dotsEl].forEach(el => {
      if (!el) return;
      el.addEventListener('focusin', stopTimer);
      el.addEventListener('focusout', () => { if (autoplay) startTimer(); });
    });

    // Recompute sizes on resize
    window.addEventListener('resize', debounce(sizeSlides, 120));

    // Debounce helper
    function debounce(fn, wait) {
      let t;
      return function () { clearTimeout(t); t = setTimeout(() => fn.apply(this, arguments), wait); };
    }

    // initialize
    sizeSlides();
    updateDots();
    if (autoplay) startTimer();

    // expose controls for debug if needed
    carousel.__carousel = { goTo: scrollToIndex, next, prev, startTimer, stopTimer };

  })();

});

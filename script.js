// site script: nav toggle, carousel controller, back-to-top
(function () {
  "use strict";

  /* NAV TOGGLE */
  (function navToggleInit() {
    const navToggle = document.getElementById('navToggle');
    const primaryNav = document.getElementById('primaryNav');
    if (!navToggle || !primaryNav) return;
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      primaryNav.style.display = expanded ? '' : 'block';
    });
  })();

  /* CAROUSEL CONTROLLER (robust) */
  (function carouselInit() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const dotsWrap = carousel.querySelector('#dots');
    const nextBtn = carousel.querySelector('#next') || carousel.querySelector('#next'); // in-page uses id="next" in controls
    const prevBtn = carousel.querySelector('#prev') || carousel.querySelector('#prev');
    let current = 0;
    let timer = null;
    const autoDelay = 5000;

    function show(index) {
      if (!slides.length) return;
      index = (index + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
        s.style.zIndex = i === index ? 2 : 1;
        s.setAttribute('aria-hidden', String(i !== index));
        s.tabIndex = i === index ? 0 : -1;
      });
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
      }
      current = index;
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dot';
        btn.setAttribute('aria-selected', String(i === 0));
        btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        btn.addEventListener('click', function () { pauseAuto(); show(i); });
        btn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
        });
        dotsWrap.appendChild(btn);
      });
    }

    function next() { if (slides.length) show((current + 1) % slides.length); }
    function prev() { if (slides.length) show((current - 1 + slides.length) % slides.length); }

    if (nextBtn) nextBtn.addEventListener('click', () => { pauseAuto(); next(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { pauseAuto(); prev(); });

    function startAuto() { if (!timer) timer = setInterval(next, autoDelay); }
    function pauseAuto() { clearInterval(timer); timer = null; }

    carousel.addEventListener('mouseenter', pauseAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('touchstart', pauseAuto, { passive: true });
    carousel.addEventListener('touchend', startAuto, { passive: true });

    // keyboard navigation
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { pauseAuto(); next(); }
      if (e.key === 'ArrowLeft') { pauseAuto(); prev(); }
    });

    if (slides.length) {
      buildDots();
      show(0);
      startAuto();
    } else {
      console.warn('Carousel: no slides found');
    }
  })();

  /* BACK TO TOP */
  (function backToTopInit() {
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    function showHide() {
      if (window.scrollY > 300) btn.classList.add('visible'); else btn.classList.remove('visible');
    }
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', showHide);
    document.addEventListener('DOMContentLoaded', showHide);
    showHide();
  })();

})();

// Meadow Pathways — shared interactions (nav, carousel, back-to-top)
(function(){
  "use strict";

  // NAV TOGGLE
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      primaryNav.classList.toggle('open');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // ACTIVE NAV ITEM
  (function setActive(){
    if (!primaryNav) return;
    const links = primaryNav.querySelectorAll('a');
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    links.forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === current) a.classList.add('active');
    });
  })();

  // CAROUSEL (flicker-free, accessible, resilient)
  (function initCarousel(){
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const dotsWrap = document.getElementById('dots');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    let current = 0, timer = null;

    // Ensure ARIA baseline
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-label', carousel.getAttribute('aria-label') || 'Image carousel');

    // Build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.className = 'dot';
        b.type = 'button';
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-selected', 'false');
        b.addEventListener('click', () => { stop(); show(i); });
        dotsWrap.appendChild(b);
      });
    }

    function updateDots(i){
      if (!dotsWrap) return;
      const dots = Array.from(dotsWrap.children);
      dots.forEach((d, idx) => {
        const isActive = idx === i;
        d.classList.toggle('active', isActive);
        d.setAttribute('aria-selected', String(isActive));
      });
    }

    function show(i){
      if (!slides.length) return;
      i = (i + slides.length) % slides.length;

      // Toggle only via classes — CSS handles fade (no display:none thrash)
      slides.forEach((s, idx) => {
        const active = idx === i;
        s.classList.toggle('active', active);
        s.setAttribute('aria-hidden', String(!active));
      });

      updateDots(i);
      current = i;
    }

    function next(){ show(current + 1); }
    function prev(){ show(current - 1); }

    function start(){
      if (!timer) timer = setInterval(next, 6000);
    }
    function stop(){
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Controls
    if (nextBtn) nextBtn.addEventListener('click', () => { stop(); next(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { stop(); prev(); });

    // Pause on hover/touch
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('touchstart', stop, { passive: true });
    carousel.addEventListener('touchend', start, { passive: true });

    // Keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { stop(); next(); }
      if (e.key === 'ArrowLeft')  { stop(); prev(); }
    });

    // Initialize: mark first slide active ASAP to avoid blank flash
    if (slides.length) {
      slides[0].classList.add('active');
      slides.forEach((s, idx) => s.setAttribute('aria-hidden', String(idx !== 0)));
      updateDots(0);
      start();
    } else {
      console.warn('Carousel: no slides.');
    }
  })();

  // BACK TO TOP
  (function backToTop(){
    const back = document.getElementById('backToTop');
    if (!back) return;
    function update(){ back.classList.toggle('show', window.scrollY > 240); }
    window.addEventListener('scroll', update, { passive: true });
    back.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    update();
  })();

})();

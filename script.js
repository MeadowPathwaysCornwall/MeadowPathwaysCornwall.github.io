// Meadow Pathways — shared interactions (nav toggle, carousel, back-to-top, accessible focus, logo reveal)
(function () {
  "use strict";

  // Helper: closest matching parent
  function closest(el, selector) {
    while (el && el !== document) {
      if (el.matches && el.matches(selector)) return el;
      el = el.parentNode;
    }
    return null;
  }

  // NAV TOGGLE (small screens) — robust, uses class toggling not inline styles
  (function navToggleInit() {
    const navToggle = document.getElementById('navToggle');
    const primaryNav = document.getElementById('primaryNav');
    if (!primaryNav) return;

    // Ensure aria attributes exist
    if (navToggle) {
      if (!navToggle.hasAttribute('aria-expanded')) navToggle.setAttribute('aria-expanded', 'false');
      navToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        primaryNav.classList.toggle('open');
      });
    }

    // Close when a nav link is clicked (mobile)
    primaryNav.addEventListener('click', function (e) {
      const a = closest(e.target, 'a');
      if (!a) return;
      if (primaryNav.classList.contains('open')) {
        primaryNav.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on outside click when open
    document.addEventListener('click', function (e) {
      if (!primaryNav.classList.contains('open')) return;
      if (navToggle && (e.target === navToggle || navToggle.contains(e.target))) return;
      if (primaryNav.contains(e.target)) return;
      primaryNav.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
        primaryNav.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        if (navToggle) navToggle.focus();
      }
    });

    // Ensure nav is visible on larger viewports if CSS left it hidden
    function restoreNavOnResize() {
      if (window.innerWidth > 880) {
        primaryNav.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    }
    window.addEventListener('resize', restoreNavOnResize, { passive: true });

    // Set active nav item by URL (works for index.html and other pages)
    const links = Array.from(primaryNav.querySelectorAll('a'));
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    links.forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === current || (current === '' && href === 'index.html')) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  })();

  // BACK TO TOP BUTTON (enhanced)
  (function backToTopInit() {
    const backBtn = document.getElementById('backToTop') || document.querySelector('.back-to-top');
    if (!backBtn) return;
    const revealClass = 'show';
    const showAt = 240; // pixels scrolled before showing

    function update() {
      const y = window.scrollY || window.pageYOffset;
      if (y > showAt) {
        backBtn.classList.add(revealClass);
      } else {
        backBtn.classList.remove(revealClass);
      }
    }

    // initial state
    update();

    // performant scroll listener
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      backBtn.blur();
    });

    backBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        backBtn.click();
      }
    });
  })();

  // CAROUSEL INIT (robust)
  (function initCarousel() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const dotsWrap = carousel.querySelector('#dots');
    const nextBtn = carousel.querySelector('#next');
    const prevBtn = carousel.querySelector('#prev');
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
        btn.addEventListener('keydown', (e) => {
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

    if (slides.length) {
      buildDots();
      show(0);
      startAuto();
    } else {
      console.warn('Carousel: no slides found');
    }
  })();

  // LOGO REVEAL (subtle)
  (function logoReveal() {
    const brand = document.querySelector('.brand');
    if (!brand) return;
    brand.style.opacity = 0;
    brand.style.transform = 'translateY(6px) scale(.98)';
    brand.style.transition = 'opacity .55s ease, transform .55s cubic-bezier(.2,.9,.2,1)';
    requestAnimationFrame(() => {
      brand.style.opacity = 1;
      brand.style.transform = 'translateY(0) scale(1)';
    });
  })();

  // ACCESSIBLE LINK FOCUS RING POLISH
  (function focusRingPolish() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
    });
    document.addEventListener('mousedown', function () {
      document.body.classList.remove('user-is-tabbing');
    });
  })();

})();

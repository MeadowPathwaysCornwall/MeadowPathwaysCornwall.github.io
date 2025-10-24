// Meadow Pathways — shared interactions (nav toggle, carousel, back-to-top, accessible focus, logo reveal)
(function () {
  // NAV TOGGLE (small screens)
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      primaryNav.style.display = expanded ? '' : 'block';
    });
  }

  // BACK TO TOP BUTTON (enhanced)
  (function backToTopInit() {
    const backBtn = document.getElementById('backToTop');
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
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
        s.style.zIndex = i === index ? 2 : 1;
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
        btn.addEventListener('click', () => { pauseAuto(); show(i); });
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
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
  });
  document.addEventListener('mousedown', function () {
    document.body.classList.remove('user-is-tabbing');
  });

})();

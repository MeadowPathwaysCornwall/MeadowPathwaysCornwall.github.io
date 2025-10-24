// Shared interactions for Meadow Pathways site
// Handles: nav toggle, simple carousel, back to top visibility, and accessible focus management

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

  // BACK TO TOP BUTTON
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    function checkBack() { backBtn.hidden = window.scrollY < 300; }
    window.addEventListener('scroll', checkBack);
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    checkBack();
  }

  // SIMPLE CAROUSEL (uses structure with .slide, #dots, #next, #prev)
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const dotsWrap = carousel.querySelector('#dots');
    const nextBtn = carousel.querySelector('#next');
    const prevBtn = carousel.querySelector('#prev');
    let current = 0;
    let interval;

    function setActive(index) {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      if (dotsWrap) {
        const dots = Array.from(dotsWrap.querySelectorAll('button'));
        dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
      }
      current = index;
    }
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
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    if (dotsWrap) Array.from(dotsWrap.children).forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
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
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
      dotsWrap.appendChild(btn);
    });
  }

  function next() { show((current + 1) % slides.length); }
  function prev() { show((current - 1 + slides.length) % slides.length); }

  if (nextBtn) nextBtn.addEventListener('click', () => { pauseAuto(); next(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { pauseAuto(); prev(); });

  function startAuto() { if (!timer) timer = setInterval(next, autoDelay); }
  function pauseAuto() { clearInterval(timer); timer = null; }

  carousel.addEventListener('mouseenter', pauseAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('touchstart', pauseAuto, { passive: true });
  carousel.addEventListener('touchend', startAuto, { passive: true });

  if (slides.length) { buildDots(); show(0); startAuto(); } else { console.warn('Carousel: no slides found'); }
})();
  // ensure dots respond to keyboard activation (Enter and Space)
if (dotsWrap) {
  dotsWrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

  // SIMPLE FORM SUBMISSION HANDLER (graceful fallback)
  // If pages include forms using the inline fetch approach, this helps prevent duplicate handlers.
  // Individual pages already attach their own submit handlers; this is a no-op safeguard.
  // No global form binding here to avoid interfering with page specific logic.

  // ACCESSIBLE LINK FOCUS RING POLISH
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
  });
  document.addEventListener('mousedown', function () {
    document.body.classList.remove('user-is-tabbing');
  });
})();

/* script.js - Carousel auto-rotate, dot navigation, and Back to Top */

/* Carousel setup and auto-rotate */
(function () {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  // Create slides wrapper if not present
  let slidesWrap = carousel.querySelector('.slides');
  if (!slidesWrap) {
    slidesWrap = document.createElement('div');
    slidesWrap.className = 'slides';
    const imgs = Array.from(carousel.querySelectorAll('img'));
    imgs.forEach(img => slidesWrap.appendChild(img));
    carousel.appendChild(slidesWrap);
  }

  const imgs = Array.from(slidesWrap.querySelectorAll('img'));
  if (imgs.length === 0) return;

  // Create dots
  let dotsWrap = carousel.querySelector('.dots');
  if (!dotsWrap) {
    dotsWrap = document.createElement('div');
    dotsWrap.className = 'dots';
    imgs.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.dataset.index = i;
      if (i === 0) dot.classList.add('active');
      dotsWrap.appendChild(dot);
    });
    carousel.appendChild(dotsWrap);
  }

  const dots = Array.from(dotsWrap.children);
  let index = 0;
  const total = imgs.length;
  const interval = 4000;
  let timer = null;

  function show(i) {
    index = (i + total) % total;
    slidesWrap.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
  }

  function start() {
    if (timer) return;
    timer = setInterval(() => show(index + 1), interval);
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  dotsWrap.addEventListener('click', e => {
    const dot = e.target.closest('.dot');
    if (!dot) return;
    stop();
    show(Number(dot.dataset.index));
    start();
  });

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  // Initialize
  show(0);
  start();
})();

/* Back to top functionality */
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  function toggle() {
    if (window.scrollY > 300) btn.removeAttribute('hidden');
    else btn.setAttribute('hidden', 'true');
  }

  toggle();
  window.addEventListener('scroll', toggle);
})();

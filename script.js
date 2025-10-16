// Carousel fade effect
(function () {
  const images = document.querySelectorAll('.carousel-image');
  if (!images.length) return;

  let current = 0;
  function showNextImage() {
    images[current].classList.remove('active');
    current = (current + 1) % images.length;
    images[current].classList.add('active');
  }
  setInterval(showNextImage, 3000);
})();

// Back to top button toggle
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
})();

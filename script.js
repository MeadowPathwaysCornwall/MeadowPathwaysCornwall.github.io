// Carousel controls with fade effect and manual buttons
(function () {
  const slides = document.querySelectorAll('.carousel-image');
  if (!slides.length) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      slide.style.opacity = i === index ? '1' : '0';
      slide.style.transition = 'opacity 0.8s ease';
    });
    slides[index].classList.add('active');
  }

  window.moveSlide = function (step) {
    currentSlide = (currentSlide + step + slides.length) % slides.length;
    showSlide(currentSlide);
  };

  // Auto-advance every 5 seconds
  setInterval(() => window.moveSlide(1), 5000);

  // Ensure first image is visible
  showSlide(currentSlide);
})();

// Back to top button toggle and smooth scroll
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Wrap everything in an IIFE to avoid global variable conflicts
(function() {
  "use strict";

  // ----------- CAROUSEL SETUP -----------
  const carouselContainer = document.querySelector('.carousel');
  if (carouselContainer) {
    const slides = carouselContainer.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const dotsContainer = document.getElementById('dots');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    // Initialize carousel
    function initCarousel() {
      showSlide(currentSlide);
      createDots();
      autoSlideInterval = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
      });
      updateDots(index);
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    }

    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => {
          currentSlide = i;
          showSlide(currentSlide);
        });
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots(index) {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(nextSlide, 5000);
    }

    initCarousel();
  }

  // ----------- SIDEBAR TOGGLE (if needed) -----------
  const menuTrigger = document.querySelector('.menu-trigger');
  const sidebar = document.querySelector('.sidebar');
  if (menuTrigger && sidebar) {
    menuTrigger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // ----------- ADDITIONAL SITE INTERACTIONS (Optional) -----------
  // Example: Smooth scrolling for internal links
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();

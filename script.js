/* ===========================
   Meadow Pathways Custom JS
   =========================== */

// NAV TOGGLE (for mobile menu)
(function() {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }
})();

// BACK TO TOP BUTTON
(function() {
  const backBtn = document.getElementById('backToTop');
  if (!backBtn) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  });

  backBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// BOOTSTRAP CAROUSEL AUTOPLAY (optional)
(function() {
  const carousel = document.querySelector('#carouselExample');
  if (carousel) {
    const bsCarousel = new bootstrap.Carousel(carousel, {
      interval: 5000, // 5 seconds
      ride: 'carousel'
    });
  }
})();

// FORM VALIDATION (basic)
(function() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        alert("Please fill in all required fields before submitting.");
      }
    });
  });
})();

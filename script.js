// ===== script.js: Functionality for Carousel, Nav Toggle, Back-to-Top =====

// NAV TOGGLE (Hamburger for mobile)
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('nav-toggle');
  const navbar = document.getElementById('navbar');
  navToggle.addEventListener('click', function () {
    const expanded = navbar.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });
});

// CAROUSEL LOGIC
(function(){
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach((carousel) => {
    const items = carousel.querySelectorAll('.carousel-item');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    let current = 0;

    function goTo(idx) {
      items.forEach((item, i) => {
        item.style.display = i === idx ? 'block' : 'none';
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
        dot.setAttribute('aria-current', i === idx ? 'true' : 'false');
      });
      // control buttons ARIA
      prevBtn.disabled = (idx === 0);
      nextBtn.disabled = (idx === items.length - 1);
      current = idx;
    }

    // Init
    goTo(current);

    // Button controls
    prevBtn.addEventListener('click', () => {
      if(current > 0) goTo(current-1);
    });
    nextBtn.addEventListener('click', () => {
      if(current < items.length-1) goTo(current+1);
    });

    // Dots
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => goTo(idx));
      dot.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goTo(idx);
        }
      });
    });

    // Keyboard left/right on carousel container
    carousel.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowLeft' && current > 0) {
        goTo(current-1);
      } else if(e.key === 'ArrowRight' && current < items.length-1) {
        goTo(current+1);
      }
    });

    // Optional: auto-advance or loop? Not implemented for accessibility stability (user control is preferred).
  });
})();

// BACK TO TOP BUTTON
(function() {
  // Insert button if not present
  if(!document.getElementById('backToTop')) {
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.title = 'Back to top';
    btn.setAttribute('aria-label','Back to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
  }
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    const show = window.scrollY > 260;
    btn.style.display = show ? 'flex' : 'none';
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    btn.blur();
  });
})();

// END script.js

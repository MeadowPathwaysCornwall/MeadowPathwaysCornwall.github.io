/* Meadow Pathways — site scripts
   No jQuery required. Depends on Bootstrap 5 bundle (bootstrap.bundle.min.js).
*/

(function () {
  'use strict';

  // Helper: safe query
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // Initialize after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Navbar: nothing custom needed; Bootstrap handles toggler via data attributes.

    // Tabs: Bootstrap 5 handles via data-bs-toggle="tab".
    // If you want to programmatically activate a tab on load, you can uncomment:
    // const firstTabTrigger = document.querySelector('#text-tab');
    // if (firstTabTrigger) new bootstrap.Tab(firstTabTrigger).show();

    // Carousel: optional programmatic init to ensure consistent timing
    const carouselEl = $('#carouselExample');
    if (carouselEl && window.bootstrap && bootstrap.Carousel) {
      // You can tweak interval or wrap according to preference
      const carousel = new bootstrap.Carousel(carouselEl, {
        interval: 5000,
        ride: 'carousel',
        pause: 'hover',
        wrap: true
      });

      // Example: keyboard left/right navigation for accessibility
      carouselEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          carousel.prev();
        } else if (e.key === 'ArrowRight') {
          carousel.next();
        }
      });
    }

    // Focus ring visibility on keyboard nav
    const handleFirstTab = (e) => {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('user-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
        window.addEventListener('mousedown', handleMouseDownOnce);
      }
    };
    const handleMouseDownOnce = () => {
      document.documentElement.classList.remove('user-tabbing');
      window.removeEventListener('mousedown', handleMouseDownOnce);
      window.addEventListener('keydown', handleFirstTab);
    };
    window.addEventListener('keydown', handleFirstTab);

    // Warn if assets with spaces might cause issues
    const imagesWithSpaces = $$('.carousel-item img, header img, .hero, #flyerValues img')
      .map((el) => (el.tagName === 'IMG' ? el.getAttribute('src') : el.style.backgroundImage))
      .filter(Boolean)
      .filter((srcOrBg) => /%20|\s/.test(srcOrBg));
    if (imagesWithSpaces.length) {
      console.warn('Consider renaming image files to remove spaces (e.g., "hand meadow.jpg" -> "hand-meadow.jpg").', imagesWithSpaces);
    }
  });
})();

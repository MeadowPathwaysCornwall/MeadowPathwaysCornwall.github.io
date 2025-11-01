/* script.js — site-safe initialisation and custom .slides slider
   Replace your existing script.js with this file content.
   It initialises features only if the relevant elements exist,
   and it fails silently so no other page behaviour breaks.
*/
(function () {
  'use strict';

  // Helper: single element
  function $ (selector) { return document.querySelector(selector); }

  // DOM ready
  document.addEventListener('DOMContentLoaded', function () {

    // ---------- 1. Custom .slides slider initialiser (safe) ----------
    (function initCustomSlides() {
      try {
        var slidesRoot = document.querySelector('.slides');
        if (!slidesRoot) return;

        var slides = Array.prototype.slice.call(slidesRoot.querySelectorAll('.slide'));
        if (!slides.length) return;

        // Ensure container styles that the CSS may rely on
        slidesRoot.style.position = slidesRoot.style.position || 'relative';
        slidesRoot.style.overflow = slidesRoot.style.overflow || 'hidden';
        slidesRoot.style.display = slidesRoot.style.display || 'block';

        slides.forEach(function (s, i) {
          s.style.position = s.style.position || 'absolute';
          s.style.top = '0';
          s.style.left = '0';
          s.style.width = '100%';
          s.style.height = 'auto';
          s.style.opacity = (i === 0 ? '1' : '0');
          s.style.transition = s.style.transition || 'opacity 600ms ease-in-out';
          s.setAttribute('data-slide-index', i);
          s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
          // Ensure images scale nicely
          if (s.tagName.toLowerCase() === 'img') {
            s.style.display = 'block';
            s.style.objectFit = s.style.objectFit || 'cover';
            s.style.maxWidth = '100%';
            s.style.height = 'auto';
          }
        });

        var current = 0;
        var interval = 4000; // ms
        var timerId = null;

        function showSlide(next) {
          if (next === current) return;
          var prevEl = slides[current];
          var nextEl = slides[next];
          if (prevEl) { prevEl.style.opacity = '0'; prevEl.setAttribute('aria-hidden', 'true'); }
          if (nextEl) { nextEl.style.opacity = '1'; nextEl.setAttribute('aria-hidden', 'false'); }
          current = next;
        }

        function nextSlide() { showSlide((current + 1) % slides.length); }

        function start() { if (!timerId) timerId = setInterval(nextSlide, interval); }

        function stop() { if (timerId) { clearInterval(timerId); timerId = null; } }

        // Pause on hover and focus
        slidesRoot.addEventListener('mouseenter', stop);
        slidesRoot.addEventListener('mouseleave', start);
        slides.forEach(function (s) { s.addEventListener('focus', stop); s.addEventListener('blur', start); });

        // Start autoplay after a short delay so layout settles
        setTimeout(start, 250);
      } catch (err) {
        // Do not throw; log for debugging only
        console.error('Custom slides init error:', err);
      }
    })();

    // ---------- 2. Nav toggle (safe) ----------
    try {
      var navToggle = $('.nav-toggle');
      var navMenu = $('.nav-menu');
      if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () { navMenu.classList.toggle('is-open'); });
      }
    } catch (err) { console.error('Nav toggle error:', err); }

    // ---------- 3. Smooth scroll for internal anchors ----------
    try {
      var anchorLinks = document.querySelectorAll('a[href^="#"]');
      anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
          var href = this.getAttribute('href');
          if (!href || href === '#' || href === '#0') return;
          var targetId = href.slice(1);
          var target = document.getElementById(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    } catch (err) { console.error('Smooth scroll error:', err); }

    // ---------- 4. Accessible keyboard focus detection ----------
    try {
      function handleFirstTab(e) {
        if (e.key === 'Tab') {
          document.documentElement.classList.add('user-is-tabbing');
          window.removeEventListener('keydown', handleFirstTab);
        }
      }
      window.addEventListener('keydown', handleFirstTab);
    } catch (err) { console.error('Focus setup error:', err); }

  }); // end DOMContentLoaded

  // Window load fallback (no forced behaviour here, kept for future safe toggles)
  window.addEventListener('load', function () {
    // Placeholder: start functions that must wait for images if needed
  });

})();

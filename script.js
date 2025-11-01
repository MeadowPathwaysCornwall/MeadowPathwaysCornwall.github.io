// script.js — safe initialization for carousel and common UI behaviours
// Replace the entire existing script.js with this file content
(function () {
  'use strict';

  // Small helper: query single element
  function $ (selector) {
    return document.querySelector(selector);
  }

  // Safe DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    // ---------- Carousel initialization (safe) ----------
    try {
      var carouselEl = document.querySelector('.carousel');
      if (carouselEl && typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
        // Use getOrCreateInstance to avoid double-initialisation
        var carouselInstance = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
          interval: 5000,
          ride: false,
          pause: 'hover',
          wrap: true
        });

        // If you want autoplay after DOM load, uncomment the next line
        // carouselInstance.cycle();
      }
    } catch (err) {
      // Fail silently so the rest of the page keeps working
      console.error('Carousel init error:', err);
    }

    // ---------- Nav toggle (if present) ----------
    try {
      var navToggle = $('.nav-toggle');
      var navMenu = $('.nav-menu');
      if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
          navMenu.classList.toggle('is-open');
        });
      }
    } catch (err) {
      console.error('Nav toggle error:', err);
    }

    // ---------- Smooth scroll for internal anchors ----------
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
    } catch (err) {
      console.error('Smooth scroll error:', err);
    }

    // ---------- Accessible focus outlines for keyboard users ----------
    try {
      function handleFirstTab(e) {
        if (e.key === 'Tab') {
          document.documentElement.classList.add('user-is-tabbing');
          window.removeEventListener('keydown', handleFirstTab);
        }
      }
      window.addEventListener('keydown', handleFirstTab);
    } catch (err) {
      console.error('Focus outline setup error:', err);
    }
  });

  // Optional: window load fallback (images/assets loaded)
  window.addEventListener('load', function () {
    try {
      var carouselEl = document.querySelector('.carousel');
      if (carouselEl && typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
        // If you prefer to start the carousel only after full load, enable below
        // var inst = bootstrap.Carousel.getOrCreateInstance(carouselEl);
        // inst.cycle();
      }
    } catch (err) {
      console.error('Carousel start on load error:', err);
    }
  });
})();

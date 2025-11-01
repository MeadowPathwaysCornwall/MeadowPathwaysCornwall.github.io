// script.js — safe initialization for carousel and related UI behavior
// Place this entire file content in your script.js (replace existing carousel init only)
// It waits for DOMContentLoaded, checks for elements and Bootstrap, and fails silently.

(function () {
  'use strict';

  // Helper: safe querySelector
  function $(selector) {
    return document.querySelector(selector);
  }

  // Safe DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    // ---------- Carousel initialization (safe) ----------
    try {
      var carouselEl = document.querySelector('.carousel');
      if (carouselEl && typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
        // If you already have markup using data-bs-ride="carousel" you may want ride: false
        new bootstrap.Carousel(carouselEl, {
          interval: 5000,
          ride: false,
          pause: 'hover',
          wrap: true
        });
      }
    } catch (err) {
      // Do not let carousel errors break the rest of the page
      console.error('Carousel init error:', err);
    }

    // ---------- Example: safe handling for any other JS behaviour you use ----------
    // Toggle mobile nav (if you have one)
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

    // Example: smooth scroll for internal anchor links
    try {
      var anchorLinks = document.querySelectorAll('a[href^="#"]');
      anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
          var targetId = this.getAttribute('href').slice(1);
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

    // Any additional initialisation you need can be added here following the same pattern.
  });

  // Optional: window load fallback (if you need to wait for images/assets)
  window.addEventListener('load', function () {
    // If you want the carousel to start automatically after full load, uncomment below:
    try {
      var carouselEl = document.querySelector('.carousel');
      if (carouselEl && typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
        // Start the carousel after full load (uncomment if desired)
        // var inst = bootstrap.Carousel.getOrCreateInstance(carouselEl);
        // inst.cycle();
      }
    } catch (err) {
      console.error('Carousel start on load error:', err);
    }
  });
})();

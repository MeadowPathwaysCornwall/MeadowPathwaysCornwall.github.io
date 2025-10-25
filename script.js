/* script.js — Meadow Pathways
   - Nav toggle (accessible, responsive, outside-click + Escape)
   - Carousel controller (dots, next/prev, auto-rotate, pause on hover/touch, keyboard)
   - Back-to-top button
   Place in site root and include <script src="script.js"></script> at end of pages that need it.
*/

(function () {
  "use strict";

  /* NAV TOGGLE */
  (function navToggleInit() {
    const navToggle = document.getElementById('navToggle');
    const primaryNav = document.getElementById('primaryNav');
    if (!navToggle || !primaryNav) return;

    function closeNav() {
      navToggle.setAttribute('aria-expanded', 'false');
      primaryNav.style.display = '';
    }
    function openNav() {
      navToggle.setAttribute('aria-expanded', 'true');
      primaryNav.style.display = 'block';
    }

    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      if (expanded) closeNav(); else openNav();
    });

    // Close/open responsively on resize so desktop always shows nav
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720) {
        primaryNav.style.display = '';
        navToggle.setAttribute('aria-expanded', 'false');
      } else {
        // keep mobile state as-is; if expanded show block
        if (navToggle.getAttribute('aria-expanded') === 'true') primaryNav.style.display = 'block';
      }
    });

    // Close when clicking outside (mobile)
    document.addEventListener('click', function (e) {
      if (window.innerWidth > 720) return;
      const isToggle = e.target === navToggle || navToggle.contains(e.target);
      const insideNav = e.target.closest && e.target.closest('#primaryNav');
      if (!isToggle && !insideNav && navToggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
      }
    });
  })();


  /* CAROUSEL CONTROLLER */
  (function carouselInit() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const dotsWrap = carousel.querySelector('#dots');
    const prevBtn = carousel.querySelector('#prev');
    const nextBtn = carousel.querySelector('#next');

    let current = 0;
    let timer = null;
    const autoDelay = 5000;

    // Ensure slides have sensible tabIndex for accessibility
    slides.forEach((s, i) => s.tabIndex = i === 0 ? 0 : -1);

    function show(index) {
      if (!slides.length) return;
      index = (index + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
        s.style.zIndex = i === index ? 2 : 1;
        s.setAttribute('aria-hidden', String(i !== index));
        s.tabIndex = i === index ? 0 : -1;
      });
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
      }
      current = index;
      // For small screens, ensure the active slide is visible by scrolling the slides container
      const track = carousel.querySelector('.slides');
      if (track && slides[index]) {
        const slideEl = slides[index];
        const left = slideEl.offsetLeft - 12;
        if (typeof track.scrollTo === 'function') track.scrollTo({ left, behavior: 'smooth' });
      }
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dot';
        btn.setAttribute('aria-selected', String(i === 0));
        btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        btn.addEventListener('click', function () { pauseAuto(); show(i); });
        btn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
        });
        dotsWrap.appendChild(btn);
      });
    }

    function next() { if (slides.length) show((current + 1) % slides.length); }
    function prev() { if (slides.length) show((current - 1 + slides.length) % slides.length); }

    if (nextBtn) nextBtn.addEventListener('click', () => { pauseAuto(); next(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { pauseAuto(); prev(); });

    function startAuto() { if (!timer) timer = setInterval(next, autoDelay); }
    function pauseAuto() { clearInterval(timer); timer = null; }

    carousel.addEventListener('mouseenter', pauseAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('touchstart', pauseAuto, { passive: true });
    carousel.addEventListener('touchend', startAuto, { passive: true });

    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { pauseAuto(); next(); }
      if (e.key === 'ArrowLeft') { pauseAuto(); prev(); }
    });

    // Initialize
    if (slides.length) {
      buildDots();
      show(0);
      startAuto();
    } else {
      console.warn('Carousel: no slides found');
    }
  })();


  /* BACK TO TOP */
  (function backToTopInit() {
    // Expect button to exist in page with id="backToTop"
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    function showHide() {
      if (window.scrollY > 300) {
        btn.style.display = 'inline-flex';
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
        btn.style.display = 'none';
      }
    }

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      btn.blur();
    });

    window.addEventListener('scroll', showHide);
    window.addEventListener('resize', showHide);
    document.addEventListener('DOMContentLoaded', showHide);
    showHide();
  })();

})();

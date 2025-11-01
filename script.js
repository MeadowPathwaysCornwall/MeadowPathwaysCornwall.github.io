/* script.js
   Shared site behaviours for Meadow Pathways (Blugoon theme)
   - Nav toggle (mobile)
   - Back-to-top button
   - Lightweight carousel enhancement (if #carousel present)
   - Generic Formspree / form feedback handling
   - No client-side password checks or secrets
*/

(function () {
  'use strict';

  /* ---------- NAV TOGGLE (mobile) ---------- */
  (function navToggle() {
    var navToggleBtn = document.getElementById('navToggle');
    var primaryNav = document.getElementById('primaryNav');
    if (!navToggleBtn || !primaryNav) return;

    navToggleBtn.addEventListener('click', function () {
      var isOpen = primaryNav.classList.toggle('open');
      navToggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav when a nav link is clicked (helpful for single page navs)
    primaryNav.addEventListener('click', function (e) {
      var target = e.target;
      if (target && target.tagName === 'A' && primaryNav.classList.contains('open')) {
        primaryNav.classList.remove('open');
        navToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* ---------- BACK TO TOP ---------- */
  (function backToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    var showAt = 320;

    function onScroll() {
      if (window.scrollY > showAt) btn.classList.add('show'); else btn.classList.remove('show');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      btn.blur();
    });
  })();

  /* ---------- CAROUSEL ENHANCEMENT (optional) ----------
     Expects markup like:
     <div id="carousel">
       <div class="slides"><img class="slide" ... /></div>
       <button id="prev">‹</button> <div id="dots"></div> <button id="next">›</button>
     */
  (function carouselInit() {
    var carousel = document.getElementById('carousel');
    if (!carousel) return;

    var slidesWrap = carousel.querySelector('.slides');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.slide'));
    var prevBtn = carousel.querySelector('#prev') || carousel.querySelector('.carousel-prev');
    var nextBtn = carousel.querySelector('#next') || carousel.querySelector('.carousel-next');
    var dotsContainer = carousel.querySelector('#dots') || carousel.querySelector('.dots');

    if (!slides.length || !slidesWrap) return;

    // ensure image sizing is safe
    slides.forEach(function (s) {
      s.style.maxWidth = '100%';
      s.style.maxHeight = '100%';
      s.style.objectFit = s.style.objectFit || 'cover';
      s.style.display = 'none';
    });

    var current = 0;
    slides[current].style.display = '';
    slides[current].classList.add('active');

    // build dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'dot' + (i === 0 ? ' active' : '');
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.setAttribute('data-index', String(i));
        b.addEventListener('click', function () { goTo(i); resetAutoplay(); });
        dotsContainer.appendChild(b);
      });
    }

    function goTo(i) {
      i = ((i % slides.length) + slides.length) % slides.length;
      if (i === current) return;
      slides[current].style.display = 'none';
      slides[current].classList.remove('active');
      var prevDot = dotsContainer && dotsContainer.querySelector('.dot[data-index="' + current + '"]');
      if (prevDot) prevDot.classList.remove('active');

      current = i;
      slides[current].style.display = '';
      slides[current].classList.add('active');
      var nextDot = dotsContainer && dotsContainer.querySelector('.dot[data-index="' + current + '"]');
      if (nextDot) nextDot.classList.add('active');
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAutoplay(); });

    // keyboard nav
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goTo(current - 1); resetAutoplay(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); resetAutoplay(); }
    });
    carousel.setAttribute('tabindex', '0');

    // autoplay with pause on hover/focus
    var autoplayInterval = 6000, autoplayId = null;
    function startAutoplay() {
      if (autoplayId) return;
      autoplayId = setInterval(function () { goTo(current + 1); }, autoplayInterval);
    }
    function stopAutoplay() {
      if (!autoplayId) return;
      clearInterval(autoplayId);
      autoplayId = null;
    }
    function resetAutoplay() { stopAutoplay(); startAutoplay(); }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    // small responsive safeguard: ensure slides wrap height when viewport changes
    window.addEventListener('resize', function () {
      // ensure active stays visible
      slides.forEach(function (s, idx) { s.style.display = (idx === current ? '' : 'none'); });
    }, { passive: true });

    // start
    startAutoplay();
  })();

  /* ---------- GENERIC FORMSPREE + FORM FEEDBACK HANDLER ----------
     Enhances forms that post to Formspree (or any external action) to provide
     consistent UI feedback without changing HTML form markup.
     Requirements: forms may include a hidden input named _redirect for redirect behavior.
  */
  (function formsHandler() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('form'));
    if (!forms.length) return;

    forms.forEach(function (form) {
      // Skip forms that specify data-skip-enhance
      if (form.hasAttribute('data-skip-enhance')) return;

      // Only enhance if action exists (we still allow server default)
      var action = form.getAttribute('action') || '';
      var isFormspree = action.indexOf('formspree.io') !== -1;

      // Create a lightweight status element if none exists
      var status = form.querySelector('[role="status"]') || document.createElement('div');
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.className = status.className || 'form-status';
      if (!form.contains(status)) form.appendChild(status);

      form.addEventListener('submit', function (e) {
        // Let default submit proceed if form uses normal server flow and not Formspree
        if (!isFormspree) {
          status.textContent = 'Submitting...';
          return;
        }
        e.preventDefault();
        status.textContent = 'Submitting...';
        var data = new FormData(form);

        // If form has a _redirect and the endpoint will redirect, we still POST then redirect client-side for reliable UX
        var redirect = form.querySelector('input[name="_redirect"]') ? form.querySelector('input[name="_redirect"]').value : null;

        fetch(action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        }).then(function (res) {
          if (res.ok) {
            // success: clear form (but keep values if form is hours logging? default is to reset)
            try { form.reset(); } catch (err) { /* ignore */ }
            status.textContent = 'Submitted. Thank you.';
            if (redirect) {
              // small delay for better UX
              setTimeout(function () { window.location.href = redirect; }, 700);
            }
          } else {
            return res.json().then(function (json) {
              var msg = 'Submission error';
              if (json && json.errors && json.errors.length) msg = json.errors.map(function (x) { return x.message; }).join('; ');
              status.textContent = msg;
            }).catch(function () {
              status.textContent = 'Submission error — please try again later.';
            });
          }
        }).catch(function () {
          status.textContent = 'Network error — please check your connection and try again.';
        });
      });
    });
  })();

  /* ---------- CLEANUP: remove any accidental client-side password references ----------
     Defensive step: remove any global variables named PASSWORD, PW or similar
     from window to avoid accidental exposure. This does not affect server-side auth.
  */
  (function removeGlobals() {
    try {
      if (window.PASSWORD) { try { delete window.PASSWORD; } catch (e) { window.PASSWORD = undefined; } }
      if (window.PW) { try { delete window.PW; } catch (e) { window.PW = undefined; } }
    } catch (e) { /* silent */ }
  })();

  /* ---------- SIMPLE A11Y: focus outlines for clicked elements (visual) ---------- */
  (function focusVisibleFallback() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
    });
    document.addEventListener('mousedown', function () {
      document.documentElement.classList.remove('user-is-tabbing');
    });
  })();

})();

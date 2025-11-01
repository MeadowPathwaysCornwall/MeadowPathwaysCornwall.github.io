/* script.js
   Meadow Pathways — shared site behaviours (consolidated)
   - Nav toggle (mobile)
   - Back-to-top button
   - Lightweight carousel enhancement (if #carousel present)
   - Generic Formspree / form feedback handling
   - Defensive removal of client-side secrets
   - A11y helpers
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

    // Close mobile nav when a nav link is clicked
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
     Expects markup:
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

    if (!slidesWrap || !slides.length) return;

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

    // build dots if container exists
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
      if (dotsContainer) {
        var prevDot = dotsContainer.querySelector('.dot[data-index="' + current + '"]');
        if (prevDot) prevDot.classList.remove('active');
      }

      current = i;
      slides[current].style.display = '';
      slides[current].classList.add('active');
      if (dotsContainer) {
        var nextDot = dotsContainer.querySelector('.dot[data-index="' + current + '"]');
        if (nextDot) nextDot.classList.add('active');
      }
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

    // responsive safeguard
    window.addEventListener('resize', function () {
      slides.forEach(function (s, idx) { s.style.display = (idx === current ? '' : 'none'); });
    }, { passive: true });

    // start autoplay
    startAutoplay();
  })();

  /* ---------- GENERIC FORMSPREE + FORM FEEDBACK HANDLER ----------
     Adds client-side UX for forms that post to Formspree; leaves non-Formspree forms to normal submit.
     Forms can include <input name="_redirect" value="..."> to redirect on success.
  */
  (function formsHandler() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('form'));
    if (!forms.length) return;

    forms.forEach(function (form) {
      if (form.hasAttribute('data-skip-enhance')) return;
      var action = form.getAttribute('action') || '';
      var isFormspree = action.indexOf('formspree.io') !== -1;

      var status = form.querySelector('[role="status"]') || document.createElement('div');
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.className = status.className || 'form-status';
      if (!form.contains(status)) form.appendChild(status);

      form.addEventListener('submit', function (e) {
        if (!isFormspree) {
          status.textContent = 'Submitting...';
          return;
        }
        e.preventDefault();
        status.textContent = 'Submitting...';
        var data = new FormData(form);
        var redirectEl = form.querySelector('input[name="_redirect"]');
        var redirect = redirectEl ? redirectEl.value : null;

        fetch(action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        }).then(function (res) {
          if (res.ok) {
            try { form.reset(); } catch (err) { /* ignore */ }
            status.textContent = 'Submitted. Thank you.';
            if (redirect) setTimeout(function () { window.location.href = redirect; }, 700);
            return;
          }
          return res.json().then(function (json) {
            var msg = 'Submission error';
            if (json && json.errors && json.errors.length) msg = json.errors.map(function (x) { return x.message; }).join('; ');
            status.textContent = msg;
          }).catch(function () {
            status.textContent = 'Submission error — please try again later.';
          });
        }).catch(function () {
          status.textContent = 'Network error — please check your connection and try again.';
        });
      });
    });
  })();

  /* ---------- DEFENSIVE: remove accidental client-side password references ---------- */
  (function removeGlobals() {
    try {
      if (window.PASSWORD) { try { delete window.PASSWORD; } catch (e) { window.PASSWORD = undefined; } }
      if (window.PW) { try { delete window.PW; } catch (e) { window.PW = undefined; } }
    } catch (e) { /* silent */ }
  })();

  /* ---------- A11Y: focus-visible fallback ---------- */
  (function focusVisibleFallback() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
    });
    document.addEventListener('mousedown', function () {
      document.documentElement.classList.remove('user-is-tabbing');
    });
  })();

})();

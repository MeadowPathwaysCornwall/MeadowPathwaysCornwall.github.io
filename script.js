/* script.js
   Meadow Pathways — Blugoon theme scripts
   - Mobile nav toggle (ARIA)
   - Accessible carousel with auto-rotate, controls and dots
   - Netlify Identity init + staff role gating
   - Small Netlify Forms UX helper
*/

/* Utility: DOM ready */
function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

/* NAV TOGGLE - accessible */
function initNavToggles() {
  document.querySelectorAll('.nav-toggle').forEach(btn => {
    btn.addEventListener('click', function () {
      const header = btn.closest('header');
      if (!header) return;
      const navList = header.querySelector('.nav-list');
      if (!navList) return;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', (!expanded).toString());
      navList.classList.toggle('open');
    });
  });
}

/* CAROUSEL - accessible, auto-rotate */
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    if (!slides.length) return;

    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let dotsContainer = carousel.querySelector('.carousel-dots');

    // If no dots container, create it
    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-dots';
      carousel.appendChild(dotsContainer);
    }

    // Create dots
    dotsContainer.innerHTML = '';
    slides.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot';
      btn.setAttribute('aria-label', 'Slide ' + (i + 1));
      btn.dataset.index = i;
      dotsContainer.appendChild(btn);
    });

    const dots = Array.from(dotsContainer.children);

    let index = slides.findIndex(s => s.classList.contains('active'));
    if (index === -1) index = 0;

    const AUTO_MS = 6000; // auto-rotate every 6s
    let autoTimer = null;
    let isPaused = false;

    function showSlide(i) {
      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === i);
        s.setAttribute('aria-hidden', idx === i ? 'false' : 'true');
      });
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
      index = i;
    }

    function next() {
      showSlide((index + 1) % slides.length);
    }
    function prev() {
      showSlide((index - 1 + slides.length) % slides.length);
    }

    // Controls
    if (nextBtn) nextBtn.addEventListener('click', () => { pauseAuto(); next(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { pauseAuto(); prev(); });

    // Dots
    dots.forEach(d => {
      d.addEventListener('click', (e) => {
        const i = parseInt(e.currentTarget.dataset.index, 10);
        if (!Number.isNaN(i)) { pauseAuto(); showSlide(i); }
      });
    });

    // Keyboard support
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { pauseAuto(); prev(); }
      if (e.key === 'ArrowRight') { pauseAuto(); next(); }
    });

    // Pause on hover/focus (accessibility)
    carousel.addEventListener('mouseenter', () => pauseAuto());
    carousel.addEventListener('mouseleave', () => resumeAuto());
    carousel.addEventListener('focusin', () => pauseAuto());
    carousel.addEventListener('focusout', () => resumeAuto());

    function startAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (!isPaused) next();
      }, AUTO_MS);
    }
    function pauseAuto() { isPaused = true; }
    function resumeAuto() { isPaused = false; }

    // Start
    showSlide(index);
    startAuto();

    // expose for debugging
    carousel._mp = { showSlide, next, prev, pauseAuto, resumeAuto };
  });
}

/* Netlify Identity + staff gating */
function initNetlifyIdentity() {
  // If identity widget script not loaded, nothing to do
  if (!window.netlifyIdentity) return;

  try {
    window.netlifyIdentity.on('init', function (user) {
      applyIdentity(user);
    });
    window.netlifyIdentity.on('login', function (user) {
      applyIdentity(user);
    });
    window.netlifyIdentity.on('logout', function () {
      applyIdentity(null);
    });

    // Show the widget menu (for sign-in) where [data-netlify-identity-menu] present
    // Netlify widget will attach to that attribute automatically if included.
  } catch (err) {
    console.warn('Netlify Identity init error:', err);
  }

  function applyIdentity(user) {
    const staffContent = document.getElementById('staffContent') || document.getElementById('staffPanel') || document.getElementById('staffOnly');
    const notAllowed = document.getElementById('notAllowed');
    const userEmailSpan = document.getElementById('userEmail');

    if (user && staffContent) {
      const roles = (user.app_metadata && user.app_metadata.roles) || [];
      if (roles.indexOf('staff') !== -1) {
        staffContent.classList.remove('hidden');
        if (notAllowed) notAllowed.classList.add('hidden');
        if (userEmailSpan) userEmailSpan.textContent = user.email || '';
      } else {
        // Logged in but not staff
        staffContent.classList.add('hidden');
        if (notAllowed) notAllowed.classList.remove('hidden');
        if (userEmailSpan) userEmailSpan.textContent = user.email || '';
      }
    } else {
      // not logged in
      if (staffContent) staffContent.classList.add('hidden');
      if (notAllowed) notAllowed.classList.add('hidden');
      if (userEmailSpan) userEmailSpan.textContent = '';
    }
  }
}

/* Netlify Forms UX helper (AJAX fallback friendly) */
function initFormHelpers() {
  document.querySelectorAll('form[data-netlify="true"]').forEach(form => {
    const name = form.getAttribute('name') || form.querySelector('input[name="form-name"]') && form.querySelector('input[name="form-name"]').value;
    // If form already uses AJAX elsewhere, skip
    form.addEventListener('submit', function (e) {
      // We'll let Netlify handle the form by default (server-side). For a better UX we
      // can use fetch to submit and then redirect to thankyou.html if action set.
      // But we must gracefully degrade to normal POST if fetch fails.
      e.preventDefault();

      const formData = new FormData(form);
      const action = form.getAttribute('action') || window.location.pathname;
      const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      // Construct POST to Netlify (root /) to let Netlify capture the form
      fetch('/', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      }).then(response => {
        if (response.ok) {
          // success
          if (form.getAttribute('data-redirect')) {
            window.location.href = form.getAttribute('data-redirect');
          } else if (action && action !== '') {
            // If a static thankyou action is provided, go there
            if (action.endsWith('.html')) window.location.href = action;
            else showFormMessage(form, 'Thanks — your submission has been received.');
          }
        } else {
          // server returned an error; fallback to normal POST submit (will cause page reload)
          form.submit();
        }
      }).catch(err => {
        // network error; fallback to normal submit
        console.warn('Form submit fetch error; falling back to normal submit', err);
        form.submit();
      }).finally(() => {
        if (submitButton) submitButton.disabled = false;
      });
    });
  });

  function showFormMessage(form, message) {
    let el = form.querySelector('.form-status');
    if (!el) {
      el = document.createElement('div');
      el.className = 'form-status';
      form.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('auto-hide');
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 6000);
  }
}

/* Initialize everything */
ready(function () {
  initNavToggles();
  initCarousels();
  initNetlifyIdentity();
  initFormHelpers();

  // Minor accessibility: make carousel focusable so keyboard users can use arrows
  document.querySelectorAll('.carousel').forEach(c => { c.setAttribute('tabindex', '0'); });
});

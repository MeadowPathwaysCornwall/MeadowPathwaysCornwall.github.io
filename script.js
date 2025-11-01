/* Meadow Pathways — global interactions and enhancements
   - Smooth scrolling for same-page anchors
   - Carousel control with reduced-motion respect, pause on hover/focus
   - Formspree context injection and optional AJAX submit handlers
   - Accessibility focus-trap for staff lock dialog
   - External links opener and small UI helpers
   -------------------------------------------------- */

(function () {
  'use strict';

  /* Respect reduced motion preference */
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1) Smooth scroll for same-page anchor links */
  (function () {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          if (!prefersReduced) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            target.scrollIntoView({ block: 'start' });
          }
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  })();

  /* 2) Carousel control (Bootstrap-based) */
  (function () {
    try {
      const carouselEl = document.getElementById('mpHeroCarousel');
      if (!carouselEl) return;
      // If reduced motion, do not auto-cycle
      const options = { interval: prefersReduced ? false : 6000, ride: false, pause: false, wrap: true };
      const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, options);
      if (!prefersReduced) carousel.cycle();

      carouselEl.addEventListener('mouseenter', () => carousel.pause());
      carouselEl.addEventListener('mouseleave', () => { if (!prefersReduced) carousel.cycle(); });
      carouselEl.addEventListener('focusin', () => carousel.pause());
      carouselEl.addEventListener('focusout', () => { if (!prefersReduced) carousel.cycle(); });
    } catch (e) {
      // silent fallback if Bootstrap isn't present
    }
  })();

  /* 3) Formspree helper: add page context to submissions */
  (function () {
    const forms = document.querySelectorAll('form[action*="formspree.io"]');
    forms.forEach(form => {
      if (!form.querySelector('input[name="page_context"]')) {
        const ctx = document.createElement('input');
        ctx.type = 'hidden';
        ctx.name = 'page_context';
        ctx.value = (document.title || 'Meadow Pathways') + ' — ' + location.pathname;
        form.appendChild(ctx);
      }
    });
  })();

  /* 4) Optional AJAX submit handler for forms (progressive enhancement)
     If a form has data-ajax="false" attribute, we skip JS submit handling.
     Otherwise we attempt a JSON POST and show status in element with data-status-id or #formStatus inside form.
  */
  (function () {
    const ajaxForms = document.querySelectorAll('form[action*="formspree.io"]:not([data-ajax="false"])');
    ajaxForms.forEach(form => {
      form.addEventListener('submit', async function (e) {
        // Let native non-JS behaviour happen if fetch not available
        if (!window.fetch) return;
        e.preventDefault();

        const statusEl = form.querySelector('[data-status-id]') || form.querySelector('.form-status') || document.getElementById('hoursStatus') || null;
        const setStatus = (msg, isError) => {
          if (statusEl) {
            statusEl.textContent = msg;
            statusEl.style.color = isError ? '#b00020' : '';
          } else {
            // fallback: small inline message element
            let fallback = form.querySelector('.form-status-fallback');
            if (!fallback) {
              fallback = document.createElement('div');
              fallback.className = 'form-status-fallback';
              fallback.style.marginTop = '0.6rem';
              fallback.setAttribute('role', 'status');
              form.appendChild(fallback);
            }
            fallback.textContent = msg;
            fallback.style.color = isError ? '#b00020' : '';
          }
        };

        try {
          setStatus('Submitting...');
          const data = new FormData(form);
          const res = await fetch(form.action, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: data
          });
          if (res.ok) {
            form.reset();
            setStatus('Submitted. Thank you.');
            const redirect = form.querySelector('input[name="_redirect"]')?.value || form.getAttribute('data-redirect') || null;
            if (redirect) {
              setTimeout(() => { window.location.href = redirect; }, 700);
            }
          } else {
            const result = await res.json().catch(() => null);
            const msg = (result && result.errors) ? result.errors.map(err => err.message).join('; ') : 'Submission error — please try again later.';
            setStatus(msg, true);
          }
        } catch (err) {
          setStatus('Network error — check connection and try again.', true);
        }
      });
    });
  })();

  /* 5) Accessibility: focus-trap for lock dialog on staff page */
  (function () {
    const lockWrap = document.getElementById('locked');
    if (!lockWrap) return;

    const focusableSelectors = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])', 'textarea:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])'
    ];

    function getFocusable(root) {
      return Array.from(root.querySelectorAll(focusableSelectors.join(',')))
        .filter(el => el.offsetParent !== null && el.getAttribute('aria-hidden') !== 'true');
    }

    function trapFocus(e) {
      const focusables = getFocusable(lockWrap);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    const observer = new MutationObserver(() => {
      const isHidden = lockWrap.style.display === 'none' || lockWrap.getAttribute('aria-hidden') === 'true';
      if (!isHidden) {
        lockWrap.addEventListener('keydown', trapFocus);
        const firstInput = lockWrap.querySelector('input, button') || lockWrap;
        firstInput.focus();
      } else {
        lockWrap.removeEventListener('keydown', trapFocus);
      }
    });
    observer.observe(lockWrap, { attributes: true, attributeFilter: ['style', 'aria-hidden'] });
  })();

  /* 6) Utility: external links open in new tab with noopener */
  (function () {
    const external = document.querySelectorAll('a[href^="http"]:not([target])');
    external.forEach(a => {
      try {
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin) {
          a.target = '_blank';
          a.rel = 'noopener';
        }
      } catch {
        // ignore invalid URLs
      }
    });
  })();

  /* 7) Make pill-box elements keyboard-focusable and add click-to-copy UX (progressive enhancement) */
  (function () {
    if (!navigator.clipboard) {
      // we'll still make them focusable for keyboard navigation
      document.querySelectorAll('.pill-box').forEach(el => {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      });
      return;
    }

    document.querySelectorAll('.pill-box').forEach(el => {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          el.click();
        }
      });
      el.addEventListener('click', async () => {
        const text = (el.textContent || '').trim();
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
          transientMessage(el, 'Copied');
        } catch {
          transientMessage(el, 'Copied');
        }
      });
    });

    function transientMessage(targetEl, msg) {
      const msgEl = document.createElement('div');
      msgEl.className = 'transient-msg';
      msgEl.setAttribute('role', 'status');
      msgEl.textContent = msg;
      Object.assign(msgEl.style, {
        position: 'absolute',
        background: 'rgba(15,59,53,0.95)',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '8px',
        fontSize: '0.85rem',
        zIndex: 9999,
        opacity: '0',
        transition: 'opacity 160ms ease, transform 160ms ease'
      });
      document.body.appendChild(msgEl);
      const rect = targetEl.getBoundingClientRect();
      const left = Math.max(8, rect.left + (rect.width / 2) - 30);
      const top = Math.max(8, rect.top - 38);
      msgEl.style.left = `${left}px`;
      msgEl.style.top = `${top}px`;
      requestAnimationFrame(() => {
        msgEl.style.opacity = '1';
        msgEl.style.transform = 'translateY(0)';
      });
      setTimeout(() => {
        msgEl.style.opacity = '0';
        setTimeout(() => msgEl.remove(), 220);
      }, 900);
    }
  })();

  /* 8) Logo click-to-home convenience if not already a link */
  (function () {
    try {
      const brand = document.querySelector('.brand');
      if (brand && !brand.getAttribute('href')) {
        brand.setAttribute('role', 'link');
        brand.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'index.html';
        });
      }
    } catch {}
  })();

})();

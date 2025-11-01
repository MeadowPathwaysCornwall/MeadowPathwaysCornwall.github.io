/* Meadow Pathways — global interactions
   -------------------------------------------------- */

// Smooth scroll for same-page anchor links (if any)
(function () {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
})();

// Bootstrap Carousel auto-pause on hover (if present)
(function () {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(c => {
    c.addEventListener('mouseenter', () => {
      const carousel = bootstrap.Carousel.getOrCreateInstance(c);
      carousel.pause();
    });
    c.addEventListener('mouseleave', () => {
      const carousel = bootstrap.Carousel.getOrCreateInstance(c);
      carousel.cycle();
    });
  });
})();

// Formspree helper: add page context to submissions
(function () {
  const forms = document.querySelectorAll('form[action*="formspree.io"]');
  forms.forEach(form => {
    // Add simple context field (hidden)
    if (!form.querySelector('input[name="page_context"]')) {
      const ctx = document.createElement('input');
      ctx.type = 'hidden';
      ctx.name = 'page_context';
      ctx.value = (document.title || 'Meadow Pathways') + ' — ' + location.pathname;
      form.appendChild(ctx);
    }
  });
})();

// Accessibility: focus trap for lock dialog on staff page (if present)
(function () {
  const lockWrap = document.getElementById('locked');
  const staffPanel = document.getElementById('staffPanel');
  if (!lockWrap || !staffPanel) return;

  const focusableSelectors = [
    'a[href]', 'button', 'input', 'textarea', 'select', '[tabindex]:not([tabindex="-1"])'
  ];

  function getFocusable(root) {
    return Array.from(root.querySelectorAll(focusableSelectors.join(',')))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
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

  // Activate trap when lock visible
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

// Utility: external links open in new tab when target=_blank missing (optional)
(function () {
  const external = document.querySelectorAll('a[href^="http"]:not([target])');
  external.forEach(a => {
    try {
      const url = new URL(a.href);
      if (url.origin !== location.origin) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
    } catch {
      // ignore invalid URLs
    }
  });
})();

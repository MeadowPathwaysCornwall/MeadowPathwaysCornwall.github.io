// navigation, carousel reel, back-to-top, staff gate (MPWEC!), Formspree handlers

document.addEventListener('DOMContentLoaded', function () {
  // Nav toggle for mobile
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.querySelector('.primary-nav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      primaryNav.classList.toggle('open');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Carousel behaviour (contained reel)
  document.querySelectorAll('.carousel').forEach(carousel => {
    let auto;
    const start = () => {
      stop();
      auto = setInterval(() => {
        try {
          if (carousel.scrollWidth - carousel.scrollLeft - carousel.clientWidth <= 2) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            carousel.scrollBy({ left: carousel.clientWidth * 0.8, behavior: 'smooth' });
          }
        } catch (e) {}
      }, 4500);
    };
    const stop = () => { if (auto) clearInterval(auto); };
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') carousel.scrollBy({ left: 320, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') carousel.scrollBy({ left: -320, behavior: 'smooth' });
    });
    start();
  });

  // Carousel controls
  document.querySelectorAll('.carousel-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.closest('.carousel-card')?.querySelector('.carousel');
      if (c) c.scrollBy({ left: -320, behavior: 'smooth' });
    });
  });
  document.querySelectorAll('.carousel-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.closest('.carousel-card')?.querySelector('.carousel');
      if (c) c.scrollBy({ left: 320, behavior: 'smooth' });
    });
  });

  // Back to top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggle = () => {
      if (window.scrollY > 300) backToTop.classList.add('visible'); else backToTop.classList.remove('visible');
    };
    window.addEventListener('scroll', toggle);
    toggle();
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Staff gate - password is MPWEC!
  const staffGate = document.getElementById('staffGate');
  if (staffGate) {
    staffGate.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input[name="staffPassword"]');
      const pw = input ? input.value : '';
      if (pw === 'MPWEC!') {
        document.getElementById('staffContent')?.classList.remove('hidden');
        document.getElementById('staffGateWrap')?.classList.add('hidden');
        history.replaceState(null, '', '#staff');
      } else {
        let err = this.querySelector('.staff-error');
        if (!err) {
          err = document.createElement('div');
          err.className = 'staff-error';
          this.appendChild(err);
        }
        err.textContent = 'Incorrect password';
        err.style.color = 'var(--danger)';
        input && (input.value = '');
      }
    });
  }

  // Formspree handlers: all forms marked with data-formspree="true"
  document.querySelectorAll('form[data-formspree="true"]').forEach(form => {
    const endpoint = form.getAttribute('action');
    const successRegion = form.querySelector('.form-success');
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!endpoint) return alert('Form endpoint not configured.');
      submitBtn && (submitBtn.disabled = true);
      const formData = new FormData(this);
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
      .then(response => {
        if (response.ok) return response.json().catch(()=>({ ok:true }));
        return response.json().then(data => Promise.reject(data));
      })
      .then(() => {
        if (successRegion) {
          successRegion.textContent = 'Thank you — your form has been sent. We will be in touch shortly.';
          successRegion.style.display = 'block';
          successRegion.setAttribute('aria-hidden','false');
        } else {
          alert('Thank you — your form has been sent.');
        }
        form.reset();
        submitBtn && (submitBtn.disabled = false);
        setTimeout(() => { if (successRegion) successRegion.style.display = 'none'; }, 8000);
      })
      .catch(() => {
        if (successRegion) {
          successRegion.textContent = 'Sorry, there was a problem sending your form. Please try again or email us directly.';
          successRegion.style.display = 'block';
          successRegion.setAttribute('aria-hidden','false');
        } else {
          alert('Form error — please try again.');
        }
        submitBtn && (submitBtn.disabled = false);
      });
    });
  });

  // Make keyboard focus rings visible after first tab press
  document.addEventListener('keydown', function onFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', onFirstTab);
    }
  });
});

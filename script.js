// Site scripts: nav toggle, carousel, staff gate (MPWEC!), Formspree handlers, back-to-top
document.addEventListener('DOMContentLoaded', function () {
  // Nav toggle
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.querySelector('.primary-nav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      primaryNav.classList.toggle('open');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Carousel init (expects .carousel > .slides > .slide)
  document.querySelectorAll('.carousel').forEach(carousel => {
    const slidesWrap = carousel.querySelector('.slides');
    if (!slidesWrap) return;
    const slides = Array.from(slidesWrap.children);
    let index = 0;
    let interval = null;

    // find controls adjacent to carousel
    const controls = carousel.parentElement.querySelector('.carousel-controls');
    const prevBtn = controls ? controls.querySelector('#prev') : null;
    const nextBtn = controls ? controls.querySelector('#next') : null;
    const dotsContainer = controls ? controls.querySelector('#dots') : null;

    function renderDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      slides.forEach((s, i) => {
        const d = document.createElement('button');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(d);
      });
    }
    function updateDots() { if (!dotsContainer) return; Array.from(dotsContainer.children).forEach((d,i) => d.classList.toggle('active', i === index)); }
    function show() { slidesWrap.style.transform = `translateX(-${index * 100}%)`; updateDots(); }
    function prevSlide(){ index = (index - 1 + slides.length) % slides.length; show(); }
    function nextSlide(){ index = (index + 1) % slides.length; show(); }
    function goTo(i){ index = i % slides.length; show(); }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    renderDots();
    interval = setInterval(nextSlide, 4500);
    carousel.addEventListener('mouseenter', () => clearInterval(interval));
    carousel.addEventListener('mouseleave', () => { interval = setInterval(nextSlide, 4500); });
    carousel.addEventListener('focusin', () => clearInterval(interval));
    carousel.addEventListener('focusout', () => { interval = setInterval(nextSlide, 4500); });
    carousel.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') prevSlide(); if (e.key === 'ArrowRight') nextSlide(); });
    show();
  });

  // Back to top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggle = () => { if (window.scrollY > 300) backToTop.classList.add('visible'); else backToTop.classList.remove('visible'); };
    window.addEventListener('scroll', toggle);
    toggle();
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Staff gate - password MPWEC!
  (function staffGateInit(){
    const staffGateForm = document.getElementById('staffGate');
    if (!staffGateForm) return;
    const staffContent = document.getElementById('staffContent');
    const gateWrap = document.getElementById('staffGateWrap');
    const errorBox = staffGateForm.querySelector('.form-error');

    staffGateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input[name="staffPassword"]');
      const pw = input ? input.value : '';
      if (pw === 'MPWEC!') {
        if (staffContent) {
          staffContent.classList.remove('hidden');
          staffContent.style.display = '';
          staffContent.setAttribute('aria-hidden', 'false');
        }
        if (gateWrap) gateWrap.style.display = 'none';
        if (errorBox) { errorBox.style.display = 'none'; errorBox.textContent = ''; }
        input.value = '';
        input.blur();
        history.replaceState(null, '', '#staff');
      } else {
        if (errorBox) {
          errorBox.textContent = 'Incorrect password';
          errorBox.style.display = 'block';
        } else {
          alert('Incorrect password');
        }
        if (input) { input.value = ''; input.focus(); }
      }
    });
  })();

  // Formspree handlers: forms with data-formspree="true"
  document.querySelectorAll('form[data-formspree="true"]').forEach(form => {
    const endpoint = form.getAttribute('action');
    const successRegion = form.closest('section') ? form.closest('section').querySelector('.form-success') : form.querySelector('.form-success');
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
        } else { alert('Thank you — your form has been sent.'); }
        form.reset();
        submitBtn && (submitBtn.disabled = false);
        setTimeout(() => { if (successRegion) successRegion.style.display = 'none'; }, 8000);
      })
      .catch(() => {
        if (successRegion) {
          successRegion.textContent = 'Sorry, there was a problem sending your form. Please try again or email us directly.';
          successRegion.style.display = 'block';
          successRegion.setAttribute('aria-hidden','false');
        } else { alert('Form error — please try again.'); }
        submitBtn && (submitBtn.disabled = false);
      });
    });
  });

  // show focus rings after tab
  document.addEventListener('keydown', function onFirstTab(e) {
    if (e.key === 'Tab') { document.documentElement.classList.add('user-is-tabbing'); window.removeEventListener('keydown', onFirstTab); }
  });
});

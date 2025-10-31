(function () {
  // NAVIGATION TOGGLE
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // BACK TO TOP
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // CAROUSEL
  const carousel = document.getElementById('carousel');
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.slides img'));
    const dots = document.getElementById('dots');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    let current = 0;
    let timer = null;

    function show(i) {
      slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
      if (dots) {
        const btns = dots.querySelectorAll('button');
        btns.forEach((b, idx) => b.classList.toggle('active', idx === i));
      }
      current = i;
    }

    function auto() {
      timer = setInterval(() => {
        show((current + 1) % slides.length);
      }, 6000);
    }

    function reset() {
      clearInterval(timer);
      auto();
    }

    // Build dots
    if (dots) {
      slides.forEach((_, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = idx === 0 ? 'dot active' : 'dot';
        b.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
        b.addEventListener('click', () => {
          show(idx);
          reset();
        });
        dots.appendChild(b);
      });
    }

    if (prev) prev.addEventListener('click', () => { show((current - 1 + slides.length) % slides.length); reset(); });
    if (next) next.addEventListener('click', () => { show((current + 1) % slides.length); reset(); });

    show(0);
    auto();

    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => reset());
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { show((current - 1 + slides.length) % slides.length); reset(); }
      if (e.key === 'ArrowRight') { show((current + 1) % slides.length); reset(); }
    });
  }

  // STAFF PASSWORD UNLOCK
  const loginForm = document.getElementById('staffLogin');
  const passwordInput = document.getElementById('staffPassword');
  const staffPanel = document.getElementById('staffPanel');
  const loginMessage = document.getElementById('loginMessage');

  if (loginForm && passwordInput && staffPanel) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pw = passwordInput.value.trim();
      if (pw === 'MPWEC!') {
        staffPanel.style.display = 'block';
        loginForm.style.display = 'none';
        if (loginMessage) loginMessage.textContent = '';
      } else {
        if (loginMessage) loginMessage.textContent = 'Incorrect password. Please try again or contact the team.';
        passwordInput.focus();
      }
    });
  }
})();

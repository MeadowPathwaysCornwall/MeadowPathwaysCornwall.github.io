// ===============================
// Carousel
// ===============================
(function () {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('img.slide')).filter(Boolean);
  if (!slides.length) return;

  const dots = document.getElementById('dots');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  let current = 0;

  function show(i) {
    i = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => {
      s.style.display = idx === i ? '' : 'none';
      s.classList.toggle('active', idx === i);
    });
    if (dots) {
      Array.from(dots.children).forEach((b, idx) => {
        b.classList.toggle('active', idx === i);
      });
    }
    current = i;
  }

  if (dots) {
    dots.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = i === 0 ? 'dot active' : 'dot';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.dataset.index = i;
      b.addEventListener('click', () => {
        show(i);
        reset();
      });
      dots.appendChild(b);
    });
  }

  show(0);
  prev?.addEventListener('click', () => { show(current - 1); reset(); });
  next?.addEventListener('click', () => { show(current + 1); reset(); });

  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  carousel.setAttribute('tabindex', '0');

  let autoplayId = null;
  function start() {
    if (!autoplayId) autoplayId = setInterval(() => show(current + 1), 6000);
  }
  function stop() {
    clearInterval(autoplayId);
    autoplayId = null;
  }
  function reset() {
    stop();
    start();
  }

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  start();
})();

// ===============================
// Referral Modal (used on homepage)
// ===============================
(function () {
  const modal = document.getElementById('referralModal');
  const openBtns = [document.getElementById('referralOpen'), document.getElementById('referralInline')];
  const closeBtns = modal ? modal.querySelectorAll('.modal-close, .modal-cancel') : [];

  function openModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    const first = modal.querySelector('input,textarea,button');
    if (first) first.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
  }

  openBtns.forEach(b => b?.addEventListener('click', openModal));
  closeBtns.forEach(b => b.addEventListener('click', closeModal));
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
})();

// ===============================
// Back to Top Button
// ===============================
(function () {
  const backBtn = document.getElementById('backToTop');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('show', window.scrollY > 300);
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===============================
// Staff Page Password Unlock
// ===============================
(function () {
  const PASSWORD = 'MPWEC!'; // Update this if you want a different password
  const pwdInput = document.getElementById('staffPassword');
  const unlockBtn = document.getElementById('unlockBtn');
  const lockedEl = document.getElementById('locked');
  const staffPanel = document.getElementById('staffPanel');

  if (!pwdInput || !unlockBtn || !lockedEl || !staffPanel) return;

  function unlock() {
    const val = (pwdInput.value || '').trim();
    if (!val) {
      pwdInput.focus();
      return;
    }
    if (val === PASSWORD) {
      lockedEl.style.display = 'none';
      staffPanel.style.display = 'block';
      lockedEl.setAttribute('aria-hidden', 'true');
      staffPanel.setAttribute('aria-hidden', 'false');
      const first = staffPanel.querySelector('input,button,textarea,select');
      if (first) first.focus();
    } else {
      pwdInput.value = '';
      pwdInput.focus();
      pwdInput.classList.add('shake');
      setTimeout(() => pwdInput.classList.remove('shake'), 500);
    }
  }

  unlockBtn.addEventListener('click', unlock);
  pwdInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') unlock();
  });
})();

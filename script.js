/* ===========================
   Global JS for Meadow Pathways
=========================== */

/* ===========================
   Carousel Functionality
=========================== */
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
  const slides = carouselContainer.querySelectorAll('.slide');
  const prevBtn = carouselContainer.querySelector('#prev');
  const nextBtn = carouselContainer.querySelector('#next');
  const dotsContainer = carouselContainer.querySelector('#dots');
  let currentIndex = 0;

  // Create dots
  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.classList.add(index === 0 ? 'active' : '');
    dot.setAttribute('aria-label', `Slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('button');

  function goToSlide(index) {
    currentIndex = index;
    const offset = -index * 100;
    carouselContainer.querySelector('.carousel-slides').style.transform = `translateX(${offset}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      goToSlide(currentIndex);
    });
  }
}

/* ===========================
   Staff Page Password Unlock
=========================== */
const pwdInput = document.getElementById('staffPassword');
const unlockBtn = document.getElementById('unlockBtn');
const staffPanel = document.getElementById('staffPanel');
const lockedEl = document.getElementById('locked');

if (pwdInput && unlockBtn && staffPanel && lockedEl) {
  const PASSWORD = 'MPWEC!';
  function unlock() {
    const val = (pwdInput.value || '').trim();
    if (val === PASSWORD) {
      lockedEl.style.display = 'none';
      staffPanel.style.display = 'block';
      lockedEl.setAttribute('aria-hidden', 'true');
      staffPanel.setAttribute('aria-hidden', 'false');
      const firstInput = staffPanel.querySelector('input, textarea');
      if (firstInput) firstInput.focus();
    } else {
      pwdInput.value = '';
      pwdInput.focus();
      alert('Incorrect password. Contact Michelle or Zoe if you need access.');
    }
  }
  unlockBtn.addEventListener('click', unlock);
  pwdInput.addEventListener('keyup', e => { if (e.key === 'Enter') unlock(); });
}

/* ===========================
   Staff Hours & Expenses Form
=========================== */
const staffForm = document.getElementById('hoursForm');
if (staffForm) {
  const staffStatus = document.getElementById('hoursStatus');
  staffForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!staffStatus) return;
    staffStatus.textContent = 'Submitting...';
    const formData = new FormData(staffForm);
    try {
      const response = await fetch('https://formspree.io/f/movnvzqp', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      if (response.ok) {
        staffForm.reset();
        staffStatus.textContent = 'Hours/Expenses submitted successfully!';
        setTimeout(() => { window.location.href = 'thankyou.html'; }, 900);
      } else {
        const result = await response.json();
        staffStatus.textContent = (result && result.errors) ? result.errors.map(err => err.message).join('; ') : 'Submission error, try again later.';
      }
    } catch (err) {
      staffStatus.textContent = 'Network error — please check connection.';
    }
  });
}

/* ===========================
   Contact Form (Netlify)
=========================== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const contactStatus = document.getElementById('contactStatus');
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!contactStatus) return;
    contactStatus.textContent = 'Submitting...';
    const formData = new FormData(contactForm);
    try {
      const response = await fetch('https://formspree.io/f/movnvzqp', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      if (response.ok) {
        contactForm.reset();
        contactStatus.textContent = 'Message sent! Thank you.';
        setTimeout(() => { window.location.href = 'thankyou.html'; }, 900);
      } else {
        const result = await response.json();
        contactStatus.textContent = (result && result.errors) ? result.errors.map(err => err.message).join('; ') : 'Submission error, try again later.';
      }
    } catch (err) {
      contactStatus.textContent = 'Network error — please check connection.';
    }
  });
}

/* ===========================
   Optional QR Code Click Handling
=========================== */
const qrCodes = document.querySelectorAll('.qr');
qrCodes.forEach(qr => {
  qr.addEventListener('click', () => {
    const link = qr.getAttribute('data-link');
    if (link) window.open(link, '_blank');
  });
});

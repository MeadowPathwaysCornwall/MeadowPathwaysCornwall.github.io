/* ===========================
   Carousel
=========================== */
const slides = document.querySelectorAll('.carousel-slides img');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const dotsContainer = document.getElementById('dots');

let currentIndex = 0;

// Generate dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});
const dots = dotsContainer.querySelectorAll('button');
dots[0].classList.add('active');

function updateCarousel() {
  const offset = -currentIndex * 100;
  document.querySelector('.carousel-slides').style.transform = `translateX(${offset}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}

function goToSlide(i) {
  currentIndex = i;
  updateCarousel();
}

prev.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
});

next.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
});

/* ===========================
   Staff Password Protection
=========================== */
const PASSWORD = 'MPWEC!';
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');
const unlockBtn = document.getElementById('unlockBtn');
const pwdInput = document.getElementById('staffPassword');

if (unlockBtn && pwdInput) {
  function unlock() {
    const val = (pwdInput.value || '').trim();
    if (val === PASSWORD) {
      lockedEl.style.display = 'none';
      staffPanel.style.display = 'block';
      lockedEl.setAttribute('aria-hidden', 'true');
      staffPanel.setAttribute('aria-hidden', 'false');
      document.getElementById('staff-name').focus();
    } else {
      pwdInput.value = '';
      pwdInput.focus();
      alert('Incorrect password. If you need access, please contact Michelle or Zoe.');
    }
  }

  unlockBtn.addEventListener('click', unlock);
  pwdInput.addEventListener('keyup', function (e) { if (e.key === 'Enter') unlock(); });
}

/* ===========================
   Staff Hours Form
=========================== */
const hoursForm = document.getElementById('hoursForm');
const hoursStatus = document.getElementById('hoursStatus');

if (hoursForm) {
  hoursForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    hoursStatus.textContent = 'Submitting...';
    const data = new FormData(hoursForm);
    try {
      const res = await fetch('https://formspree.io/f/movnvzqp', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      if (res.ok) {
        hoursForm.reset();
        hoursStatus.textContent = 'Hours submitted. Thank you.';
        setTimeout(() => { window.location.href = 'thankyou.html'; }, 900);
      } else {
        const result = await res.json();
        hoursStatus.textContent = (result && result.errors) ? result.errors.map(err => err.message).join('; ') : 'Submission error — please try again later.';
      }
    } catch (err) {
      hoursStatus.textContent = 'Network error — check connection and try again.';
    }
  });
}

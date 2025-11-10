/* ===========================
   Carousel
=========================== */
const carouselContainer = document.querySelector('.carousel-container');
const slides = document.querySelectorAll('.carousel-slides img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const dotsContainer = document.getElementById('dots');

let currentIndex = 0;
const totalSlides = slides.length;

// Create dots
slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  if (index === 0) dot.classList.add('active');
  dot.setAttribute('aria-label', `Slide ${index + 1}`);
  dot.addEventListener('click', () => {
    goToSlide(index);
  });
  dotsContainer.appendChild(dot);
});

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function goToSlide(index) {
  const slidesWrapper = document.querySelector('.carousel-slides');
  slidesWrapper.style.transform = `translateX(-${index * 100}%)`;
  currentIndex = index;
  updateDots();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  goToSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  goToSlide(currentIndex);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto slide every 5 seconds
let autoSlide = setInterval(nextSlide, 5000);

carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
carouselContainer.addEventListener('mouseleave', () => autoSlide = setInterval(nextSlide, 5000));

/* ===========================
   Staff Page Unlock
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
  pwdInput.addEventListener('keyup', function(e) { if (e.key === 'Enter') unlock(); });
}

/* ===========================
   Staff Hours & Expenses Forms
=========================== */
function handleForm(formId, statusId, subjectLine) {
  const form = document.getElementById(formId);
  const statusEl = document.getElementById(statusId);

  if (!form || !statusEl) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    statusEl.textContent = 'Submitting...';

    const data = new FormData(form);
    data.append('_subject', subjectLine); // For email subject

    try {
      const res = await fetch('https://formspree.io/f/movnvzqp', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });

      if (res.ok) {
        form.reset();
        statusEl.textContent = 'Submitted successfully. Thank you.';
      } else {
        const result = await res.json();
        statusEl.textContent = (result && result.errors) ? result.errors.map(err => err.message).join('; ') : 'Submission error — please try again later.';
      }
    } catch (err) {
      statusEl.textContent = 'Network error — check connection and try again.';
    }
  });
}

// Hours form
handleForm('hoursForm', 'hoursStatus', 'Hours logged - Meadow Pathways Staff');
// Expenses form
handleForm('expensesForm', 'expensesStatus', 'Expenses submitted - Meadow Pathways Staff');


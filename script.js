/* ===========================
   Navigation Tab Highlighting
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const navTabs = document.querySelectorAll('.nav-tab');
  const currentPath = window.location.pathname.split("/").pop();
  navTabs.forEach(tab => {
    if (tab.getAttribute('href') === currentPath) {
      tab.classList.add('active');
      tab.setAttribute('aria-current', 'page');
    } else {
      tab.classList.remove('active');
      tab.removeAttribute('aria-current');
    }
  });
});

/* ===========================
   Carousel Functionality
=========================== */
const slidesContainer = document.querySelector('.carousel-slides');
const slides = document.querySelectorAll('.carousel-slides img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const dotsContainer = document.getElementById('dots');

let currentIndex = 0;
const totalSlides = slides.length;

// Create dots
slides.forEach((_, idx) => {
  const btn = document.createElement('button');
  btn.addEventListener('click', () => showSlide(idx));
  dotsContainer.appendChild(btn);
});
const dots = dotsContainer.querySelectorAll('button');

function showSlide(index) {
  currentIndex = index;
  slidesContainer.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[index]) dots[index].classList.add('active');
}

// Initial display
showSlide(currentIndex);

// Next/Prev buttons
if (nextBtn) nextBtn.addEventListener('click', () => showSlide((currentIndex + 1) % totalSlides));
if (prevBtn) prevBtn.addEventListener('click', () => showSlide((currentIndex - 1 + totalSlides) % totalSlides));

// Auto-scroll every 5 seconds
setInterval(() => showSlide((currentIndex + 1) % totalSlides), 5000);

/* ===========================
   Staff Page Password Protection
=========================== */
const PASSWORD = 'MPWEC!';
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');
const unlockBtn = document.getElementById('unlockBtn');
const pwdInput = document.getElementById('staffPassword');

if (unlockBtn && pwdInput && lockedEl && staffPanel) {
  const unlock = () => {
    const val = (pwdInput.value || '').trim();
    if (val === PASSWORD) {
      lockedEl.style.display = 'none';
      staffPanel.style.display = 'block';
      lockedEl.setAttribute('aria-hidden', 'true');
      staffPanel.setAttribute('aria-hidden', 'false');
      document.getElementById('staff-name')?.focus();
    } else {
      pwdInput.value = '';
      pwdInput.focus();
      alert('Incorrect password. If you need access, please contact Michelle or Zoe.');
    }
  };

  unlockBtn.addEventListener('click', unlock);
  pwdInput.addEventListener('keyup', e => { if (e.key === 'Enter') unlock(); });
}

/* ===========================
   Hours & Expenses Form Submission (Netlify / Email)
=========================== */
const forms = document.querySelectorAll('form[data-netlify="true"]');

forms.forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const statusEl = form.querySelector('[role="status"]');
    if (statusEl) statusEl.textContent = 'Submitting...';

    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      if (res.ok) {
        form.reset();
        if (statusEl) statusEl.textContent = 'Submitted. Thank you.';
        setTimeout(() => { window.location.href = 'thankyou.html'; }, 900);
      } else {
        const result = await res.json();
        if (statusEl) statusEl.textContent = (result && result.errors) ? result.errors.map(err => err.message).join('; ') : 'Submission error — please try again later.';
      }
    } catch (err) {
      if (statusEl) statusEl.textContent = 'Network error — check connection and try again.';
    }
  });
});

/* ===========================
   Tab Highlighting for Pill Links
=========================== */
document.querySelectorAll('.tab-links .tab').forEach(tab => {
  tab.addEventListener('click', e => {
    document.querySelectorAll('.tab-links .tab').forEach(t => t.classList.remove('active'));
    e.currentTarget.classList.add('active');
  });
});

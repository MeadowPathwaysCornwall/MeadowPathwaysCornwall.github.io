// ===========================
// Staff Page Password Protection
// ===========================
const PASSWORD = 'MPWEC!';
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');
const unlockBtn = document.getElementById('unlockBtn');
const pwdInput = document.getElementById('staffPassword');

function unlockStaffPage() {
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
}

unlockBtn?.addEventListener('click', unlockStaffPage);
pwdInput?.addEventListener('keyup', function (e) {
  if (e.key === 'Enter') unlockStaffPage();
});

// ===========================
// Helper: encode form data for Netlify
// ===========================
function encodeFormData(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

// ===========================
// Netlify Form Submission
// ===========================
async function handleNetlifyFormSubmit(form, successMsg = 'Form submitted successfully.') {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const statusEl = form.querySelector('.form-status');
    if (statusEl) statusEl.textContent = 'Submitting...';

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(data),
      });

      if (response.ok) {
        form.reset();
        if (statusEl) statusEl.textContent = successMsg;
        // Optional: auto-clear status after 5 seconds
        setTimeout(() => {
          if (statusEl) statusEl.textContent = '';
        }, 5000);
      } else {
        if (statusEl)
          statusEl.textContent =
            'Submission failed. Please try again later or contact the office.';
      }
    } catch (err) {
      if (statusEl)
        statusEl.textContent =
          'Network error — check your connection and try again.';
      console.error(err);
    }
  });
}

// ===========================
// Initialize all forms
// ===========================
document.addEventListener('DOMContentLoaded', function () {
  // Hours Form
  const hoursForm = document.getElementById('hoursForm');
  if (hoursForm) {
    // add a status element dynamically if not in HTML
    if (!hoursForm.querySelector('.form-status')) {
      const statusDiv = document.createElement('div');
      statusDiv.className = 'form-status';
      statusDiv.setAttribute('role', 'status');
      statusDiv.setAttribute('aria-live', 'polite');
      statusDiv.style.marginTop = '12px';
      hoursForm.appendChild(statusDiv);
    }
    handleNetlifyFormSubmit(hoursForm, 'Hours submitted successfully.');
  }

  // Expenses Form
  const expensesForm = document.getElementById('expensesForm');
  if (expensesForm) {
    if (!expensesForm.querySelector('.form-status')) {
      const statusDiv = document.createElement('div');
      statusDiv.className = 'form-status';
      statusDiv.setAttribute('role', 'status');
      statusDiv.setAttribute('aria-live', 'polite');
      statusDiv.style.marginTop = '12px';
      expensesForm.appendChild(statusDiv);
    }
    handleNetlifyFormSubmit(expensesForm, 'Expense submitted successfully.');
  }

  // Contact Form (if any)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    if (!contactForm.querySelector('.form-status')) {
      const statusDiv = document.createElement('div');
      statusDiv.className = 'form-status';
      statusDiv.setAttribute('role', 'status');
      statusDiv.setAttribute('aria-live', 'polite');
      statusDiv.style.marginTop = '12px';
      contactForm.appendChild(statusDiv);
    }
    handleNetlifyFormSubmit(contactForm, 'Thank you for contacting us. We will respond shortly.');
  }
});

// ===========================
// Optional: Initialize Carousel (Blugoon style)
// ===========================
document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const slideInterval = 5000; // 5 seconds

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });
  }

  if (slides.length > 0) {
    showSlide(currentSlide);
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, slideInterval);
  }
});

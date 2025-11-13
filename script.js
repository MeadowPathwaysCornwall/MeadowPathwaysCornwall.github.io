// script.js - full functionality
document.addEventListener('DOMContentLoaded', function () {

  // --- Sidebar Active Tab Highlight ---
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    try {
      const href = tab.getAttribute('href') || '';
      if (href && (window.location.pathname === href || window.location.pathname.endsWith('/' + href))) {
        tab.style.opacity = '0.95';
        tab.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        tab.setAttribute('aria-current', 'page');
      }
    } catch (e) {}
  });

  // --- Staff Panel Unlock ---
  const PASSWORD = 'MPWEC!';
  const lockedEl = document.getElementById('locked');
  const staffPanel = document.getElementById('staffPanel');
  const unlockBtn = document.getElementById('unlockBtn');
  const pwdInput = document.getElementById('staffPassword');

  if (unlockBtn && lockedEl && staffPanel && pwdInput) {
    unlockBtn.addEventListener('click', function () {
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
        alert('Incorrect password. If you need access, please contact Michelle or Zoe.');
      }
    });

    pwdInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') unlockBtn.click();
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Helper function to handle form submission via Formspree ---
  async function handleFormSubmission(form, statusEl) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (statusEl) statusEl.textContent = 'Submitting...';
      const data = new FormData(form);

      try {
        const res = await fetch('https://formspree.io/f/movnvzqp', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });

        if (res.ok) {
          form.reset(); // clear form after submission
          if (statusEl) statusEl.textContent = 'Submitted successfully. Thank you.';
          setTimeout(() => { window.location.href = 'Thankyou.html'; }, 900);
        } else {
          let msg = 'Submission error — please try again later.';
          try {
            const result = await res.json();
            if (result && result.errors) {
              msg = result.errors.map(err => err.message).join('; ');
            }
          } catch (err) {}
          if (statusEl) statusEl.textContent = msg;
        }
      } catch (err) {
        if (statusEl) statusEl.textContent = 'Network error — check connection and try again.';
      }
    });
  }

  // --- Hours Form ---
  const hoursForm = document.getElementById('hoursForm');
  const hoursStatus = document.getElementById('hoursStatus') || null;
  if (hoursForm) handleFormSubmission(hoursForm, hoursStatus);

  // --- Case Notes Form ---
  const caseForm = document.getElementById('caseForm');
  const caseStatus = document.getElementById('caseStatus') || null;
  if (caseForm) handleFormSubmission(caseForm, caseStatus);

  // --- Ensure external links open safely ---
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    try {
      const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('noreferrer')) rel.push('noreferrer');
      a.setAttribute('rel', rel.join(' ').trim());
    } catch (e) {}
  });

});

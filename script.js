// script.js
document.addEventListener('DOMContentLoaded', function () {

  // -------------------------
  // Sidebar Active Tab Highlight
  // -------------------------
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    try {
      const href = tab.getAttribute('href') || '';
      if (href && (window.location.pathname.endsWith('/' + href) || window.location.pathname === href)) {
        tab.style.opacity = '0.95';
        tab.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        tab.setAttribute('aria-current', 'page');
      }
    } catch (e) { /* ignore */ }
  });

  // -------------------------
  // Staff Panel Unlock
  // -------------------------
  const PASSWORD = 'MPWEC!';
  const lockedEl = document.getElementById('locked');
  const staffPanel = document.getElementById('staffPanel');
  const unlockBtn = document.getElementById('unlockBtn');
  const pwdInput = document.getElementById('staffPassword');
  const errorMsg = document.getElementById('errorMsg');

  if (unlockBtn && lockedEl && staffPanel && pwdInput) {
    unlockBtn.addEventListener('click', function () {
      const val = (pwdInput.value || '').trim();
      if (val === PASSWORD) {
        lockedEl.style.display = 'none';
        staffPanel.style.display = 'block';
        lockedEl.setAttribute('aria-hidden', 'true');
        staffPanel.setAttribute('aria-hidden', 'false');
        errorMsg.style.display = 'none';
        pwdInput.value = '';
        const firstInput = staffPanel.querySelector('input,textarea,select');
        if (firstInput) firstInput.focus();
      } else {
        errorMsg.style.display = 'block';
        pwdInput.value = '';
        pwdInput.focus();
      }
    });

    pwdInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') unlockBtn.click();
    });
  }

  // -------------------------
  // Smooth Scroll for Anchors
  // -------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // -------------------------
  // Form Submission via Formspree
  // -------------------------
  async function handleFormSubmission(formId, statusId) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form || !status) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      status.textContent = 'Submitting...';
      const data = new FormData(form);

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });

        if (res.ok) {
          form.reset();
          status.style.color = 'green';
          status.textContent = 'Submission successful. Redirecting...';
          setTimeout(() => { window.location.href = form.querySelector('input[name="_redirect"]').value; }, 1000);
        } else {
          const result = await res.json().catch(() => null);
          let msg = 'Submission failed. Please try again.';
          if (result && result.errors) msg = result.errors.map(err => err.message).join('; ');
          status.style.color = 'red';
          status.textContent = msg;
        }
      } catch (err) {
        status.style.color = 'red';
        status.textContent = 'Network error — check connection and try again.';
      }
    });
  }

  // Apply to both forms
  handleFormSubmission('hoursForm', 'hoursStatus');
  handleFormSubmission('caseForm', 'caseStatus');

  // -------------------------
  // External links safety
  // -------------------------
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    try {
      const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('noreferrer')) rel.push('noreferrer');
      a.setAttribute('rel', rel.join(' ').trim());
    } catch (e) { /* ignore */ }
  });

});

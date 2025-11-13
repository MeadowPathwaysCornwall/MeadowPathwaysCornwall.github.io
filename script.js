// script.js - keep active-tab highlight, staff unlock, smooth anchors, hours submit, add noopener to external links
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
        const staffNameInput = document.getElementById('staff-name');
        if (staffNameInput) staffNameInput.focus();
      } else {
        pwdInput.value = '';
        pwdInput.focus();
        alert('Incorrect password. If you need access, please contact Michelle or Zoe.');
      }
    });

    pwdInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') {
        unlockBtn.click();
      }
    });
  }

  // --- Auto-scroll Smooth for Anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const sel = this.getAttribute('href');
      const target = document.querySelector(sel);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Hours form submit (Formspree) ---
  const hoursForm = document.getElementById('hoursForm');
  const hoursStatus = document.getElementById('hoursStatus');
  const FORMSPREE = 'https://formspree.io/f/movnvzqp';

  if (hoursForm && hoursStatus) {
    hoursForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      hoursStatus.textContent = 'Submitting...';
      const data = new FormData(hoursForm);
      try {
        const res = await fetch(FORMSPREE, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });
        if (res.ok) {
          hoursForm.reset();
          hoursStatus.textContent = 'Hours submitted. Thank you.';
          setTimeout(() => { window.location.href = 'Thankyou.html'; }, 900);
        } else {
          let msg = 'Submission error — please try again later.';
          try {
            const result = await res.json();
            if (result && result.errors) {
              msg = result.errors.map(err => err.message).join('; ');
            }
          } catch (err) { /* ignore JSON parse errors */ }
          hoursStatus.textContent = msg;
        }
      } catch (err) {
        hoursStatus.textContent = 'Network error — check connection and try again.';
      }
    });
  }

  // --- Ensure external links use rel="noopener noreferrer" when opening in a new tab ---
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    try {
      const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
      if (!rel.includes('noopener')) rel.push('noopener');
      if (!rel.includes('noreferrer')) rel.push('noreferrer');
      a.setAttribute('rel', rel.join(' ').trim());
    } catch (e) { /* safe-fail */ }
  });

});

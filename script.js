// script.js - keep active-tab highlight, staff unlock, smooth anchors only
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

});

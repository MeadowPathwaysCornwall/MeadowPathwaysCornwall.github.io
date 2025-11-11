// --- Sidebar Active Tab Highlight ---
document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    if (tab.href === window.location.href) {
      tab.style.opacity = '0.9';
      tab.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    }
  });
});

// --- Staff Panel Unlock ---
const PASSWORD = 'MPWEC!';
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');
const unlockBtn = document.getElementById('unlockBtn');
const pwdInput = document.getElementById('staffPassword');

if (unlockBtn) {
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
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

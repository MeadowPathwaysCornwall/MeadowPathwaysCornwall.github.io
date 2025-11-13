// -------------------------
// Staff Panel Unlock (robust)
// -------------------------
const PASSWORD = 'MPWEC!';
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');
const unlockBtn = document.getElementById('unlockBtn');
const pwdInput = document.getElementById('staffPassword');
const errorMsg = document.getElementById('errorMsg');

function showError(msg) {
  if (errorMsg) {
    errorMsg.textContent = msg || 'Incorrect password. Please try again.';
    errorMsg.style.display = 'block';
  }
}

function hideError() {
  if (errorMsg) errorMsg.style.display = 'none';
}

function unlockPanel() {
  const val = (pwdInput?.value || '').trim();
  if (!pwdInput) return console.warn('Password input not found');
  if (val === PASSWORD) {
    // Reveal
    if (lockedEl) {
      lockedEl.style.display = 'none';
      lockedEl.setAttribute('aria-hidden', 'true');
    }
    if (staffPanel) {
      staffPanel.style.display = 'block';
      staffPanel.setAttribute('aria-hidden', 'false');
      // Focus first field inside panel
      const firstInput = staffPanel.querySelector('input,textarea,select,button');
      if (firstInput) firstInput.focus();
    }
    hideError();
    pwdInput.value = '';
  } else {
    showError('Incorrect password. Please try again.');
    pwdInput.value = '';
    pwdInput.focus();
  }
}

try {
  if (unlockBtn && lockedEl && staffPanel && pwdInput) {
    // Ensure button acts as a normal button, not submit (explicit)
    unlockBtn.setAttribute('type', 'button');

    unlockBtn.addEventListener('click', unlockPanel);
    pwdInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') unlockPanel();
    });

    // Optional: clear any autofill spaces
    pwdInput.addEventListener('input', () => hideError());
  } else {
    console.warn('Unlock setup missing elements', { unlockBtn, lockedEl, staffPanel, pwdInput });
  }
} catch (e) {
  console.error('Unlock setup error:', e);
}

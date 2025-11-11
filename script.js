// =========================
// Smooth Scroll for in-page links
// =========================
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// =========================
// Staff Password Unlock
// =========================
const PASSWORD = 'MPWEC!';
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');
const unlockBtn = document.getElementById('unlockBtn');
const pwdInput = document.getElementById('staffPassword');

if(unlockBtn) {
    unlockBtn.addEventListener('click', () => {
        const val = (pwdInput.value || '').trim();
        if (val === PASSWORD) {
            lockedEl.style.display = 'none';
            staffPanel.style.display = 'block';
            lockedEl.setAttribute('aria-hidden', 'true');
            staffPanel.setAttribute('aria-hidden', 'false');
            const firstInput = staffPanel.querySelector('input,textarea,select');
            if(firstInput) firstInput.focus();
        } else {
            pwdInput.value = '';
            pwdInput.focus();
            alert('Incorrect password. Contact Michelle or Zoe for access.');
        }
    });
}

// =========================
// Netlify Form Submission
// =========================
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[data-netlify]');
    forms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const statusEl = form.querySelector('[role="status"]');
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(new FormData(form)).toString()
            }).then(() => {
                if(statusEl) statusEl.textContent = "Form submitted successfully!";
                form.reset();
            }).catch(() => {
                if(statusEl) statusEl.textContent = "Form submission failed. Please try again.";
            });
        });
    });
});

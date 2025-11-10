/* ===========================
   Carousel
=========================== */
const slides = document.querySelectorAll('.carousel-slides img');
const dotsContainer = document.getElementById('dots');
let currentSlide = 0;

function showSlide(index) {
    if (!slides.length) return;
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    const offset = -currentSlide * 100;
    document.querySelector('.carousel-slides').style.transform = `translateX(${offset}%)`;

    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
}

function createDots() {
    if (!dotsContainer || !slides.length) return;
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => showSlide(i));
        dotsContainer.appendChild(dot);
    });
}

createDots();
showSlide(0);

const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');

if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));

/* ===========================
   Staff Page Password Protection
=========================== */
const PASSWORD = 'MPWEC!';
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');
const unlockBtn = document.getElementById('unlockBtn');
const pwdInput = document.getElementById('staffPassword');

if (unlockBtn && pwdInput && lockedEl && staffPanel) {
    function unlock() {
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
    unlockBtn.addEventListener('click', unlock);
    pwdInput.addEventListener('keyup', function (e) { if (e.key === 'Enter') unlock(); });
}

/* ===========================
   Hours & Expenses Form Submission (Netlify)
=========================== */
async function handleFormSubmission(formId, statusId) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form || !status) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        status.textContent = 'Submitting...';

        const data = new FormData(form);
        // Netlify forms: endpoint is form action in HTML, no fetch URL needed
        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                form.reset();
                status.textContent = 'Form submitted. Thank you.';
                setTimeout(() => {
                    window.location.href = 'thankyou.html';
                }, 900);
            } else {
                status.textContent = 'Submission error — please try again later.';
            }
        } catch (err) {
            status.textContent = 'Network error — check connection and try again.';
        }
    });
}

// Apply to forms
handleFormSubmission('hoursForm', 'hoursStatus');
handleFormSubmission('expensesForm', 'expensesStatus');

/* ===========================
   Optional: Enable keyboard navigation for carousel
=========================== */
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
});

/* ===========================
   Safe check for tab-links (colored tabs)
=========================== */
const tabLinks = document.querySelectorAll('.tab-links .tab');
tabLinks.forEach(tab => {
    if (!tab.textContent.trim()) return;
    tab.addEventListener('click', () => {
        tabLinks.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

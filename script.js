/* ===========================
   Carousel Functionality
=========================== */
const slidesContainer = document.querySelector('.carousel-slides');
if (slidesContainer) {
    const slides = slidesContainer.querySelectorAll('img');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const dotsContainer = document.getElementById('dots');
    let currentIndex = 0;
    let interval;

    function showSlide(index) {
        if (!slidesContainer) return;
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }
    }

    function createDots() {
        if (!dotsContainer) return;
        slides.forEach((_, idx) => {
            const btn = document.createElement('button');
            btn.addEventListener('click', () => {
                currentIndex = idx;
                showSlide(currentIndex);
            });
            dotsContainer.appendChild(btn);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    createDots();
    showSlide(currentIndex);
    interval = setInterval(nextSlide, 5000);
}

/* ===========================
   Staff Page Password Protection
=========================== */
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');
const unlockBtn = document.getElementById('unlockBtn');
const pwdInput = document.getElementById('staffPassword');

if (unlockBtn && pwdInput && lockedEl && staffPanel) {
    const PASSWORD = 'MPWEC!';

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
    pwdInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') unlock();
    });
}

/* ===========================
   Staff Forms (Hours & Expenses)
=========================== */
const hoursForm = document.getElementById('hoursForm');
const expensesForm = document.getElementById('expensesForm'); // for expenses if exists
const statusHours = document.getElementById('hoursStatus');
const statusExpenses = document.getElementById('expensesStatus');
const EMAIL_ENDPOINT = 'https://formspree.io/f/movnvzqp'; // replace if needed

async function submitForm(form, statusEl) {
    if (!form || !statusEl) return;
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        statusEl.textContent = 'Submitting...';
        const data = new FormData(form);
        try {
            const res = await fetch(EMAIL_ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data });
            if (res.ok) {
                form.reset();
                statusEl.textContent = 'Form submitted. Thank you.';
                setTimeout(() => { window.location.href = 'thankyou.html'; }, 900);
            } else {
                const result = await res.json();
                statusEl.textContent = (result && result.errors) ? result.errors.map(err => err.message).join('; ') : 'Submission error — please try again later.';
            }
        } catch (err) {
            statusEl.textContent = 'Network error — check connection and try again.';
        }
    });
}

submitForm(hoursForm, statusHours);
submitForm(expensesForm, statusExpenses);

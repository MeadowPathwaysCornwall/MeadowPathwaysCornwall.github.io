/* ===========================
   Carousel
=========================== */
const slidesContainer = document.querySelector('.carousel-slides');
const slides = document.querySelectorAll('.carousel-slides img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const dotsContainer = document.getElementById('dots');

let currentIndex = 0;

function updateCarousel() {
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    const dots = document.querySelectorAll('.dots button');
    dots.forEach(dot => dot.classList.remove('active'));
    if(dots[currentIndex]) dots[currentIndex].classList.add('active');
}

function createDots() {
    if(!dotsContainer) return;
    slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
        });
        if(i === 0) btn.classList.add('active');
        dotsContainer.appendChild(btn);
    });
}

if(prevBtn) prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
});

if(nextBtn) nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
});

createDots();

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
            const firstInput = staffPanel.querySelector('input, textarea');
            if(firstInput) firstInput.focus();
        } else {
            pwdInput.value = '';
            pwdInput.focus();
            alert('Incorrect password. If you need access, please contact Michelle or Zoe.');
        }
    }

    unlockBtn.addEventListener('click', unlock);
    pwdInput.addEventListener('keyup', function(e) {
        if(e.key === 'Enter') unlock();
    });
}

/* ===========================
   Hours & Expenses Form Submission
=========================== */
const forms = document.querySelectorAll('.staff-form'); // apply for both hours and expenses
forms.forEach(form => {
    const statusEl = form.querySelector('[role="status"]');
    form.addEventListener('submit', async function(e){
        e.preventDefault();
        if(!statusEl) return;

        statusEl.textContent = 'Submitting...';
        const data = new FormData(form);

        try {
            const res = await fetch('https://formspree.io/f/movnvzqp', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: data
            });
            if(res.ok) {
                form.reset();
                statusEl.textContent = 'Form submitted. Thank you.';
                setTimeout(() => { window.location.href = 'thankyou.html'; }, 900);
            } else {
                const result = await res.json();
                statusEl.textContent = (result && result.errors) ? result.errors.map(err => err.message).join('; ') : 'Submission error — please try again later.';
            }
        } catch(err) {
            statusEl.textContent = 'Network error — check connection and try again.';
        }
    });
});

/* ===========================
   Navigation Active Tab Highlight
=========================== */
const navTabs = document.querySelectorAll('.nav-tab');
const currentPage = location.pathname.split("/").pop();
navTabs.forEach(tab => {
    if(tab.getAttribute('href') === currentPage) {
        tab.classList.add('active');
    } else {
        tab.classList.remove('active');
    }
});

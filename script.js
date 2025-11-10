/* ===========================
   Carousel
=========================== */
const slides = document.querySelectorAll('.carousel-slides img');
const dots = document.getElementById('dots');
let currentIndex = 0;

// Create dots
slides.forEach((_, idx) => {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => {
        currentIndex = idx;
        updateCarousel();
    });
    dots.appendChild(btn);
});
dots.children[currentIndex].classList.add('active');

function updateCarousel() {
    const offset = -currentIndex * 100;
    document.querySelector('.carousel-slides').style.transform = `translateX(${offset}%)`;
    Array.from(dots.children).forEach(dot => dot.classList.remove('active'));
    dots.children[currentIndex].classList.add('active');
}

// Navigation
document.getElementById('prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
});

document.getElementById('next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
});

/* ===========================
   Password Protected Staff Page
=========================== */
const PASSWORD = 'MPWEC!';
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');
const unlockBtn = document.getElementById('unlockBtn');
const pwdInput = document.getElementById('staffPassword');

if (unlockBtn && pwdInput) {
    function unlock() {
        const val = (pwdInput.value || '').trim();
        if (val === PASSWORD) {
            lockedEl.style.display = 'none';
            staffPanel.style.display = 'block';
        } else {
            pwdInput.value = '';
            pwdInput.focus();
            alert('Incorrect password. Please contact Michelle or Zoe.');
        }
    }
    unlockBtn.addEventListener('click', unlock);
    pwdInput.addEventListener('keyup', function (e) { if (e.key === 'Enter') unlock(); });
}

/* ===========================
   Hours & Expenses Form (Netlify / Email)
=========================== */
const hoursForm = document.getElementById('hoursForm');
const hoursStatus = document.getElementById('hoursStatus');
const EMAIL_ENDPOINT = 'https://formspree.io/f/movnvzqp'; // Replace with Netlify if needed

if (hoursForm) {
    hoursForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hoursStatus.textContent = 'Submitting...';
        const data = new FormData(hoursForm);
        try {
            const res = await fetch(EMAIL_ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data });
            if (res.ok) {
                hoursForm.reset();
                hoursStatus.textContent = 'Submitted successfully.';
                setTimeout(() => { window.location.href = 'thankyou.html'; }, 800);
            } else {
                const result = await res.json();
                hoursStatus.textContent = result?.errors?.map(err => err.message).join('; ') || 'Submission error.';
            }
        } catch {
            hoursStatus.textContent = 'Network error, try again.';
        }
    });
}

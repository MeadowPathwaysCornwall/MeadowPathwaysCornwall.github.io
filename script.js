/* ===========================
   Meadow Pathways Website — Safe Universal Script
   Supports carousel, Netlify forms, and staff password access
=========================== */

// === Carousel Functionality ===
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    const slides = carouselContainer.querySelector('.carousel-slides');
    const prevBtn = carouselContainer.querySelector('.prev');
    const nextBtn = carouselContainer.querySelector('.next');
    const dots = carouselContainer.querySelectorAll('.dots button');
    let index = 0;

    function showSlide(i) {
        slides.style.transform = `translateX(-${i * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[i]) dots[i].classList.add('active');
    }

    if (prevBtn && nextBtn && dots.length) {
        prevBtn.addEventListener('click', () => {
            index = (index > 0) ? index - 1 : dots.length - 1;
            showSlide(index);
        });

        nextBtn.addEventListener('click', () => {
            index = (index < dots.length - 1) ? index + 1 : 0;
            showSlide(index);
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                index = i;
                showSlide(index);
            });
        });
    }
}

// === Staff Page Password Lock ===
const pwdInput = document.getElementById('staffPassword');
const unlockBtn = document.getElementById('unlockBtn');
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');

if (unlockBtn && pwdInput && lockedEl && staffPanel) {
    const PASSWORD = 'MPWEC!';
    function unlock() {
        const val = (pwdInput.value || '').trim();
        if (val === PASSWORD) {
            lockedEl.style.display = 'none';
            staffPanel.style.display = 'block';
            staffPanel.setAttribute('aria-hidden', 'false');
        } else {
            alert('Incorrect password. Please contact Michelle or Zoe for access.');
            pwdInput.value = '';
        }
    }

    unlockBtn.addEventListener('click', unlock);
    pwdInput.addEventListener('keyup', e => {
        if (e.key === 'Enter') unlock();
    });
}

// === Staff Forms (Hours / Expenses Log) ===
const staffForm = document.getElementById('hoursForm');
if (staffForm) {
    staffForm.addEventListener('submit', async e => {
        e.preventDefault();
        const status = document.getElementById('hoursStatus');
        status.textContent = 'Submitting...';
        const data = new FormData(staffForm);

        try {
            // Netlify form submission
            const res = await fetch('/', {
                method: 'POST',
                body: data
            });
            if (res.ok) {
                staffForm.reset();
                status.textContent = 'Submitted successfully. Thank you.';
            } else {
                status.textContent = 'Submission failed. Please try again later.';
            }
        } catch {
            status.textContent = 'Network error. Please check your connection.';
        }
    });
}

// === Contact Form (Netlify Protected) ===
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const status = document.getElementById('contactStatus');
        status.textContent = 'Sending...';
        const data = new FormData(contactForm);

        try {
            // Netlify automatically handles forms with data-netlify="true"
            const res = await fetch('/', {
                method: 'POST',
                body: data
            });

            if (res.ok) {
                contactForm.reset();
                status.textContent = 'Thank you for your message — we will respond soon.';
            } else {
                status.textContent = 'Submission failed. Please try again.';
            }
        } catch {
            status.textContent = 'Network error. Please check your connection.';
        }
    });
}

// === Smooth Scroll for Internal Links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});


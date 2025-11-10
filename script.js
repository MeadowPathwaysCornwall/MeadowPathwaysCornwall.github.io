/* =============================
   Carousel & Page Scripts
============================= */
document.addEventListener('DOMContentLoaded', function () {
    // Carousel
    const slidesContainer = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slides img');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const dotsContainer = document.getElementById('dots');
    let currentIndex = 0;
    let slideInterval;

    if (slidesContainer && slides.length > 0) {
        // Create dots
        slides.forEach((slide, idx) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                goToSlide(idx);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');
        function updateDots() {
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[currentIndex]) dots[currentIndex].classList.add('active');
        }

        function goToSlide(idx) {
            currentIndex = idx;
            slidesContainer.style.transform = `translateX(-${idx * 100}%)`;
            updateDots();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            goToSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(currentIndex);
        }

        nextBtn?.addEventListener('click', nextSlide);
        prevBtn?.addEventListener('click', prevSlide);

        // Auto slide
        slideInterval = setInterval(nextSlide, 5000);
        updateDots();
    }

    // Staff password unlock (existing)
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

    // Hours & expenses form (Netlify safe)
    const hoursForm = document.getElementById('hoursForm');
    const hoursStatus = document.getElementById('hoursStatus');
    const emailEndpoint = 'https://formspree.io/f/movnvzqp'; // replace with Netlify form action if needed

    if (hoursForm) {
        hoursForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            hoursStatus.textContent = 'Submitting...';
            const data = new FormData(hoursForm);
            try {
                const res = await fetch(emailEndpoint, { method: 'POST', body: data });
                if (res.ok) {
                    hoursForm.reset();
                    hoursStatus.textContent = 'Hours submitted. Thank you.';
                    setTimeout(() => { window.location.href = 'thankyou.html'; }, 900);
                } else {
                    hoursStatus.textContent = 'Submission error — please try again later.';
                }
            } catch (err) {
                hoursStatus.textContent = 'Network error — check connection and try again.';
            }
        });
    }
});

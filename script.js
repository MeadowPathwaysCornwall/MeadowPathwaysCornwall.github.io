/* ===========================
   Carousel functionality
=========================== */
const slides = document.querySelectorAll('.carousel-slides img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const dotsContainer = document.getElementById('dots');

let currentSlide = 0;

// Create dots
if (dotsContainer) {
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add(index === 0 ? 'active' : '');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });
}

const dots = dotsContainer ? dotsContainer.querySelectorAll('button') : [];

function goToSlide(index) {
    const slideWidth = slides[0].clientWidth;
    const carouselSlides = document.querySelector('.carousel-slides');
    if (carouselSlides) {
        carouselSlides.style.transform = `translateX(-${slideWidth * index}px)`;
        currentSlide = index;
        updateDots();
    }
}

function updateDots() {
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
}

if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

// Auto-play every 5s
setInterval(nextSlide, 5000);

/* ===========================
   Staff page password unlock
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
            lockedEl.setAttribute('aria-hidden', 'true');
            staffPanel.setAttribute('aria-hidden', 'false');
            document.getElementById('staff-name').focus();
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
   Hours & Expenses Form submission (Netlify friendly)
=========================== */
const hoursForm = document.getElementById('hoursForm');
const hoursStatus = document.getElementById('hoursStatus');

if (hoursForm) {
    hoursForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        hoursStatus.textContent = 'Submitting...';
        const data = new FormData(hoursForm);

        try {
            const res = await fetch('/', { 
                method: 'POST', 
                body: data,
                headers: { 'Accept': 'application/json' }
            });
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

/* ===========================
   Contact Form (Netlify)
=========================== */
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        contactStatus.textContent = 'Submitting...';
        const data = new FormData(contactForm);

        try {
            const res = await fetch('/', { 
                method: 'POST', 
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                contactForm.reset();
                contactStatus.textContent = 'Message sent. Thank you!';
                setTimeout(() => { window.location.href = 'thankyou.html'; }, 900);
            } else {
                contactStatus.textContent = 'Submission error — please try again later.';
            }
        } catch (err) {
            contactStatus.textContent = 'Network error — check connection and try again.';
        }
    });
}

/* ===========================
   TM.pdf embed resizing (Treverno page)
=========================== */
const tmEmbed = document.getElementById('tmEmbed');
if (tmEmbed) {
    tmEmbed.style.width = '100%';
    tmEmbed.style.height = '600px';
}

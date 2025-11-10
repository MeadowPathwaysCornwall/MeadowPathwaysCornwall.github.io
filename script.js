/* ===========================
   Carousel
=========================== */
const slides = document.querySelectorAll('.carousel-slides img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const dotsContainer = document.getElementById('dots');

let currentIndex = 0;

function showSlide(index) {
    const total = slides.length;
    if(index < 0) currentIndex = total - 1;
    else if(index >= total) currentIndex = 0;
    else currentIndex = index;

    const offset = -currentIndex * 100;
    document.querySelector('.carousel-slides').style.transform = `translateX(${offset}%)`;

    // Update dots
    dotsContainer.querySelectorAll('button').forEach((btn, i) => {
        btn.classList.toggle('active', i === currentIndex);
    });
}

prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

// Auto-slide
setInterval(() => showSlide(currentIndex + 1), 5000);

// Initialize dots
slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => showSlide(i));
    if(i===0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
});

/* ===========================
   Staff Password & Hours Form
=========================== */
const PASSWORD = 'MPWEC!';
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');
const unlockBtn = document.getElementById('unlockBtn');
const pwdInput = document.getElementById('staffPassword');

function unlock() {
    const val = (pwdInput.value || '').trim();
    if(val === PASSWORD){
        lockedEl.style.display = 'none';
        staffPanel.style.display = 'block';
        lockedEl.setAttribute('aria-hidden', 'true');
        staffPanel.setAttribute('aria-hidden', 'false');
        document.getElementById('staff-name').focus();
    } else {
        pwdInput.value = '';
        pwdInput.focus();
        alert('Incorrect password. Contact Michelle or Zoe.');
    }
}

unlockBtn.addEventListener('click', unlock);
pwdInput.addEventListener('keyup', e => { if(e.key==='Enter') unlock(); });

// Hours Form submission
const hoursForm = document.getElementById('hoursForm');
const hoursStatus = document.getElementById('hoursStatus');

hoursForm.addEventListener('submit', async function(e){
    e.preventDefault();
    hoursStatus.textContent = 'Submitting...';
    const data = new FormData(hoursForm);
    try {
        const res = await fetch('https://meadowpathwayscornwall@outlook.com', {
            method: 'POST',
            headers: {'Accept':'application/json'},
            body: data
        });
        if(res.ok){
            hoursForm.reset();
            hoursStatus.textContent = 'Hours submitted. Thank you.';
        } else {
            hoursStatus.textContent = 'Submission error. Try again later.';
        }
    } catch(err){
        hoursStatus.textContent = 'Network error. Check connection.';
    }
});

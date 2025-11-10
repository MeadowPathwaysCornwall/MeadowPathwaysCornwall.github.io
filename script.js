// Navigation toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
  navToggle.setAttribute('aria-expanded', !expanded);
  primaryNav.classList.toggle('show');
});

// Back to top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backToTop.style.display = 'block';
  else backToTop.style.display = 'none';
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Carousel
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dots');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

function showSlide(index) {
  slides.forEach((s, i) => { s.style.display = i === index ? 'block' : 'none'; });
  const dots = document.querySelectorAll('.dot');
  if(dots.length){
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }
  slideIndex = index;
}

function nextSlide(n) { showSlide((slideIndex + n + slides.length) % slides.length); }

if(prevBtn) prevBtn.addEventListener('click', () => nextSlide(-1));
if(nextBtn) nextBtn.addEventListener('click', () => nextSlide(1));

// Initialize dots
if(dotsContainer && slides.length){
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    dot.addEventListener('click', () => showSlide(i));
    dotsContainer.appendChild(dot);
  });
}
showSlide(0);

// Staff page password
const PASSWORD = 'MPWEC!';
const lockedEl = document.getElementById('locked');
const staffPanel = document.getElementById('staffPanel');
const unlockBtn = document.getElementById('unlockBtn');
const pwdInput = document.getElementById('staffPassword');

if(unlockBtn) unlockBtn.addEventListener('click', unlock);
if(pwdInput) pwdInput.addEventListener('keyup', e => { if(e.key === 'Enter') unlock(); });

function unlock() {
  if(!pwdInput) return;
  const val = pwdInput.value.trim();
  if(val === PASSWORD){
    lockedEl.style.display = 'none';
    staffPanel.style.display = 'block';
  } else {
    pwdInput.value = '';
    pwdInput.focus();
    alert('Incorrect password. If you need access, please contact Michelle or Zoe.');
  }
}

// Staff hours form
const hoursForm = document.getElementById('hoursForm');
const hoursStatus = document.getElementById('hoursStatus');
const FORMSPREE = 'https://formspree.io/f/movnvzqp';

if(hoursForm){
  hoursForm.addEventListener('submit', async function(e){
    e.preventDefault();
    if(hoursStatus) hoursStatus.textContent = 'Submitting...';
    const data = new FormData(hoursForm);
    try{
      const res = await fetch(FORMSPREE, { method:'POST', headers:{ 'Accept':'application/json' }, body: data });
      if(res.ok){
        hoursForm.reset();
        if(hoursStatus) hoursStatus.textContent = 'Hours submitted. Thank you.';
        setTimeout(()=>{ window.location.href='thankyou.html'; }, 900);
      } else {
        const result = await res.json();
        if(hoursStatus) hoursStatus.textContent = (result && result.errors) ? result.errors.map(err=>err.message).join('; ') : 'Submission error — please try again later.';
      }
    } catch(err){
      if(hoursStatus) hoursStatus.textContent = 'Network error — check connection and try again.';
    }
  });
}

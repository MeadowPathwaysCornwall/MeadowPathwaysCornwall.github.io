/* =============================
   Meadow Pathways — Script.js
   ============================= */

/* Smooth Scroll for Anchor Links */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* =============================
   Carousel Functionality
   ============================= */
const carousel = document.querySelector('.carousel');
if (carousel) {
  const slides = carousel.querySelectorAll('.carousel-slide');
  let index = 0;

  function showSlide(i) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === i);
    });
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  showSlide(index);
  setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

/* =============================
   News Reel Scroller
   ============================= */
const newsReel = document.querySelector('.news-reel');
if (newsReel) {
  let offset = 0;
  function scrollNews() {
    offset -= 1;
    if (offset <= -newsReel.scrollWidth) offset = window.innerWidth;
    newsReel.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(scrollNews);
  }
  scrollNews();
}

/* =============================
   Staff Page Password Lock
   ============================= */
const pwForm = document.getElementById('pwForm');
if (pwForm) {
  const pwInput = document.getElementById('staffPassword');
  const pwMessage = document.getElementById('pwMessage');
  const staffContent = document.getElementById('staffContent');
  const lockscreen = document.getElementById('lockscreen');

  // Set your password here (keep short term only; use Netlify Identity for permanent)
  const correctPassword = MPWEC2025!;

  pwForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = pwInput.value.trim();
    if (entered === correctPassword) {
      lockscreen.style.display = "none";
      staffContent.style.display = "block";
    } else {
      pwMessage.textContent = "❌ Incorrect password, please try again.";
      pwMessage.style.color = "#ffdddd";
    }
  });
}

/* =============================
   Contact Form Enhancement
   ============================= */
const contactForm = document.querySelector('form[name="contact"]');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = "Sending...";
    btn.disabled = true;
  });
}

/* =============================
   Referral Form Enhancement
   ============================= */
const referralForm = document.querySelector('form[name="referral"]');
if (referralForm) {
  referralForm.addEventListener('submit', function (e) {
    const btn = referralForm.querySelector('button[type="submit"]');
    btn.textContent = "Submitting...";
    btn.disabled = true;
  });
}

/* =============================
   Navbar Highlight (Active Page)
   ============================= */
const navLinks = document.querySelectorAll('.side-nav a');
navLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

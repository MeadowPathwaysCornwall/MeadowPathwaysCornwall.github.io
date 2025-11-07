// --- Carousel functionality ---
let currentSlide = 0;

const slides = document.querySelectorAll('.carousel-images img');
const totalSlides = slides.length;

const showSlide = (index) => {
  if (index >= totalSlides) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = totalSlides - 1;
  } else {
    currentSlide = index;
  }

  // Move the carousel images
  document.querySelector('.carousel-images').style.transform = `translateX(-${currentSlide * 100}%)`;
};

const nextSlide = () => showSlide(currentSlide + 1);
const prevSlide = () => showSlide(currentSlide - 1);

// Event listeners for carousel navigation
document.querySelector('.carousel-next').addEventListener('click', nextSlide);
document.querySelector('.carousel-prev').addEventListener('click', prevSlide);

// Automatic slide change every 5 seconds
setInterval(nextSlide, 5000);

// --- News Ticker functionality ---
const newsReel = document.querySelector('.news-reel');
if (newsReel) {
  newsReel.addEventListener('animationiteration', () => {
    newsReel.style.animation = 'none';
    setTimeout(() => {
      newsReel.style.animation = 'ticker 18s linear infinite';
    }, 100);
  });
}

// --- Back to Top Button functionality ---
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// --- Password Protection for Staff Page ---
function unlockStaff() {
  const passwordInput = document.getElementById('pwInput').value;
  const correctPassword = 'MPWEC2025!'; // Change this to a secure password

  if (passwordInput === correctPassword) {
    document.getElementById('lockscreen').style.display = 'none';
    document.getElementById('staffContent').style.display = 'block';
  } else {
    const msg = document.getElementById('pwMessage');
    msg.textContent = '❌ Incorrect password. Try again.';
    msg.style.color = 'yellow';
  }
}

// --- Mobile Navigation Toggle ---
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !isExpanded);
  primaryNav.style.display = isExpanded ? 'none' : 'flex';
});

// --- Form Validation (optional) ---
const forms = document.querySelectorAll('form');

forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.remove('error');
      }
    });

    if (!isValid) {
      e.preventDefault();
      alert('Please fill in all required fields.');
    }
  });
});

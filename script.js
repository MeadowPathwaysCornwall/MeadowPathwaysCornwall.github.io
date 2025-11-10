// ==== Carousel setup ====
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const dotsContainer = document.getElementById('dots');
let currentSlide = 0;

// Initialize dots
slides.forEach((_, idx) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  dot.setAttribute('aria-label', `Slide ${idx + 1}`);
  dot.addEventListener('click', () => goToSlide(idx));
  dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll('.dot');

// Show current slide
function showSlide(idx) {
  slides.forEach((slide, i) => {
    slide.style.display = i === idx ? 'block' : 'none';
    dots[i].classList.toggle('active', i === idx);
  });
}
showSlide(currentSlide);

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function goToSlide(idx) {
  currentSlide = idx;
  showSlide(currentSlide);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto-advance carousel every 6 seconds
setInterval(nextSlide, 6000);


// ==== Sidebar toggle for mobile ====
const menuTrigger = document.querySelector('.menu-trigger');
const sidebar = document.querySelector('.sidebar');
if (menuTrigger && sidebar) {
  menuTrigger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// ==== Optional: news ticker scroll ====
const ticker = document.querySelector('.news-ticker');
if (ticker) {
  let tickerPos = 0;
  setInterval(() => {
    tickerPos -= 1;
    if (Math.abs(tickerPos) > ticker.scrollWidth) tickerPos = ticker.offsetWidth;
    ticker.style.transform = `translateX(${tickerPos}px)`;
  }, 20);
}

// ==== QR image hover effect (optional) ====
const qrImages = document.querySelectorAll('.qr-img');
qrImages.forEach(img => {
  img.addEventListener('mouseenter', () => img.classList.add('hover'));
  img.addEventListener('mouseleave', () => img.classList.remove('hover'));
});

// ==== End of script.js ====

// Carousel functionality
let slideIndex = 0;
const slides = document.querySelectorAll(".carousel .slides img");
let dotsContainer = document.querySelector(".carousel-dots");
let dots = [];

// Create dots dynamically if container exists
if (dotsContainer && slides.length > 0) {
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });
}

function showSlide(n) {
  slides.forEach(slide => slide.classList.remove("active"));
  if (dots.length > 0) {
    dots.forEach(dot => dot.classList.remove("active"));
  }

  slideIndex = n;
  if (slideIndex >= slides.length) slideIndex = 0;
  if (slideIndex < 0) slideIndex = slides.length - 1;

  slides[slideIndex].classList.add("active");
  if (dots.length > 0) {
    dots[slideIndex].classList.add("active");
  }
}

function nextSlide() {
  showSlide(slideIndex + 1);
}

function startCarousel() {
  showSlide(slideIndex);
  setInterval(nextSlide, 4000); // Change every 4 seconds
}

// Start once DOM is ready
document.addEventListener("DOMContentLoaded", startCarousel);

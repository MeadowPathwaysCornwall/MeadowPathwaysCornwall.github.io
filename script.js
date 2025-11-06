// === Carousel Logic ===
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel-inner");
  const images = document.querySelectorAll(".carousel-inner img");
  const dotsContainer = document.querySelector(".carousel-dots");

  if (!carousel || images.length === 0) return;

  let currentIndex = 0;

  // Create dots
  images.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("span");

  function showSlide(index) {
    currentIndex = index;
    carousel.style.transform = `translateX(-${100 * index}%)`;
    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
  }

  // Auto cycle
  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    showSlide(currentIndex);
  }

  showSlide(currentIndex);
  setInterval(nextSlide, 4000);
});

// === Smooth Scroll for Internal Links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// === Form Validation Helper (Optional) ===
const forms = document.querySelectorAll("form");
forms.forEach(form => {
  form.addEventListener("submit", e => {
    const required = form.querySelectorAll("[required]");
    for (let field of required) {
      if (!field.value.trim()) {
        alert("Please complete all required fields.");
        e.preventDefault();
        field.focus();
        return;
      }
    }
  });
});

// script.js

document.addEventListener("DOMContentLoaded", function() {
  const carousel = document.querySelector(".carousel-slides");
  const slides = Array.from(carousel.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const dotsContainer = document.getElementById("dots");

  let currentIndex = 0;

  // Create dots for each slide
  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.classList.add("dot");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Slide ${index + 1}`);
    if (index === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);

    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  const dots = Array.from(dotsContainer.querySelectorAll(".dot"));

  // Update carousel to show current slide
  function updateCarousel() {
    const slideWidth = slides[0].offsetWidth + 20; // include gap
    carousel.scrollTo({
      left: slideWidth * currentIndex,
      behavior: "smooth"
    });

    dots.forEach(dot => dot.classList.remove("active"));
    dots[currentIndex].classList.add("active");
  }

  // Previous button
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  // Next button
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  // Optional: auto-play carousel every 5 seconds
  let autoPlay = setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }, 5000);

  // Pause on hover
  carousel.addEventListener("mouseenter", () => clearInterval(autoPlay));
  carousel.addEventListener("mouseleave", () => {
    autoPlay = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }, 5000);
  });

});

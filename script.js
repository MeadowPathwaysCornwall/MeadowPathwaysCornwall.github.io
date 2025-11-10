// ================================
// Meadow Pathways Carousel Script
// ================================

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-slides img");
  const dotsContainer = document.getElementById("dots");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  let currentIndex = 0;
  let slideInterval;

  // Initialize slides
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    // Update dots
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  // Create dots
  function createDots() {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.addEventListener("click", () => {
        currentIndex = i;
        showSlide(currentIndex);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });
  }

  // Previous / Next functions
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
    resetInterval();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
    resetInterval();
  }

  // Automatic slideshow
  function startInterval() {
    slideInterval = setInterval(() => {
      nextSlide();
    }, 4000); // Change every 4 seconds
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  // Event listeners
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // Initialize carousel
  createDots();
  showSlide(currentIndex);
  startInterval();
});

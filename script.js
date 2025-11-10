/* ==================================================
   Meadow Pathways 2025 - Carousel + Interactions
   ================================================== */

document.addEventListener("DOMContentLoaded", function () {

  // --- CAROUSEL ---
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const dotsContainer = document.getElementById("dots");

  let currentIndex = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "block" : "none";
    });
    updateDots(index);
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  function createDots() {
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.addEventListener("click", () => {
        currentIndex = i;
        showSlide(currentIndex);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots(index) {
    const dots = dotsContainer.children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === index);
    }
  }

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }

  // Initialize carousel
  if (slides.length > 0) {
    createDots();
    showSlide(currentIndex);
    slideInterval = setInterval(nextSlide, 5000);

    // Buttons
    if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetInterval(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetInterval(); });
  }

  // --- ADDITIONAL SCRIPTS ---
  // Placeholder for any future interactive JS (e.g., nav toggles, form enhancements)

});

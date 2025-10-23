// ===== Back to Top Button =====
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Carousel =====
// If you have multiple images inside .carousel, this will auto-cycle them
const carousel = document.querySelector(".carousel");
if (carousel) {
  const slides = carousel.querySelectorAll("img");
  let currentIndex = 0;

  // Hide all slides except the first
  slides.forEach((slide, index) => {
    slide.style.opacity = index === 0 ? "1" : "0";
    slide.style.position = "absolute";
    slide.style.top = "0";
    slide.style.left = "0";
    slide.style.width = "100%";
    slide.style.height = "100%";
    slide.style.objectFit = "cover";
    slide.style.transition = "opacity 1s ease-in-out";
  });

  // Cycle through slides
  setInterval(() => {
    slides[currentIndex].style.opacity = "0";
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].style.opacity = "1";
  }, 5000); // change every 5 seconds
}

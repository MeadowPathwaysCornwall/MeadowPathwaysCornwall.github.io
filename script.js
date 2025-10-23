// Back to Top
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Carousel fade
const carousel = document.querySelector(".carousel");
if (carousel) {
  const slides = carousel.querySelectorAll("img");
  let currentIndex = 0;

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

  setInterval(() => {
    slides[currentIndex].style.opacity = "0";
    currentIndex = (currentIndex + 1) % slides.length;

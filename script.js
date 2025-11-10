// ===============================
// Meadow Pathways — Script Logic
// ===============================

// --- Carousel Auto Scroll ---
let slideIndex = 0;
const slides = document.querySelectorAll(".carousel img");
if (slides.length > 0) {
  slides[slideIndex].classList.add("active");

  function showNextSlide() {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }

  setInterval(showNextSlide, 4000); // automatic every 4 seconds
}

// --- Accessibility Fixes for ARIA roles ---
document.querySelectorAll("button, a").forEach(el => {
  if (!el.textContent.trim() && !el.title) {
    el.title = "Button";
  }
});

// --- Mobile Sidebar Toggle (optional) ---
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

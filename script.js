/* =========================
   Meadow Pathways 2025 JS
   ========================= */

/* -------- Carousel -------- */
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel img");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Auto-rotate every 5 seconds
if (slides.length > 0) {
  showSlide(currentSlide);
  setInterval(nextSlide, 5000);
}

/* -------- Mobile Navigation Toggle -------- */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("nav ul");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

/* -------- Smooth Scroll for Anchor Links -------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* -------- Back to Top Button -------- */
const backToTop = document.createElement("button");
backToTop.innerText = "↑ Top";
backToTop.id = "backToTop";
document.body.appendChild(backToTop);

backToTop.style.position = "fixed";
backToTop.style.bottom = "20px";
backToTop.style.right = "20px";
backToTop.style.display = "none";
backToTop.style.padding = "0.5rem 1rem";
backToTop.style.background = "#006d77";
backToTop.style.color = "#fff";
backToTop.style.border = "none";
backToTop.style.borderRadius = "6px";
backToTop.style.cursor = "pointer";

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* -------- Formspree Confirmation -------- */
// Optional: show a quick alert after submission
const forms = document.querySelectorAll("form");
forms.forEach(form => {
  form.addEventListener("submit", () => {
    setTimeout(() => {
      alert("Thank you! Your form has been submitted.");
    }, 500);
  });
});

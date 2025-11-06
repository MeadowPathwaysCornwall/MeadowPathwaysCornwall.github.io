/* =========================================================
   Meadow Pathways 2025 – main JavaScript
   Handles: carousel, smooth scroll, mobile nav, staff login
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Mobile navigation toggle ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("open");
      navToggle.classList.toggle("active");
    });
  }

  /* ---------- 2. Smooth scrolling for anchor links ---------- */
  const links = document.querySelectorAll('a[href^="#"]');
  for (const link of links) {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: "smooth"
        });
      }
    });
  }

  /* ---------- 3. Carousel (Owl Carousel / Blugoon slider) ---------- */
  if (window.jQuery && $(".owl-carousel").length) {
    $(".owl-carousel").owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      autoplayTimeout: 4000,
      autoplayHoverPause: true,
      dots: true,
      nav: false,
      animateOut: "fadeOut",
      smartSpeed: 900
    });
  }

  /* ---------- 4. Header shadow on scroll ---------- */
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });

  /* ---------- 5. Staff-only password check ---------- */
  window.checkPassword = function () {
    const pwInput = document.getElementById("pw");
    const msg = document.getElementById("msg");
    const staffContent = document.getElementById("staff-content");
    const loginBox = document.getElementById("login");

    // Use a secure password string that you set
    const correctPassword = "YourSecurePasswordHere";

    if (!pwInput || !staffContent || !loginBox) return;

    const entered = pwInput.value.trim();
    if (entered === correctPassword) {
      staffContent.style.display = "block";
      loginBox.style.display = "none";
      msg.textContent = "";
    } else {
      msg.textContent = "❌ Incorrect password. Please try again.";
      msg.style.color = "red";
      pwInput.value = "";
      pwInput.focus();
    }
  };

  /* ---------- 6. Auto-close nav on link click (mobile) ---------- */
  if (navList) {
    navList.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navList.classList.remove("open");
        navToggle?.classList.remove("active");
      });
    });
  }

  /* ---------- 7. Simple fade-in for cards ---------- */
  const cards = document.querySelectorAll(".card");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );
  cards.forEach(card => observer.observe(card));
});

/* =========================================================
   End of Meadow Pathways main script
   ========================================================= */

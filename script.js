/* =========================
   Meadow Pathways Script.js
   ========================= */

/* ---- Carousel ---- */
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    const slides = carousel.querySelectorAll("img");
    const dotsContainer = carousel.querySelector(".carousel-dots");
    let current = 0;

    // create dots
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add(i === 0 ? "active" : "");
      dotsContainer.appendChild(dot);
      dot.addEventListener("click", () => showSlide(i));
    });

    const dots = dotsContainer.querySelectorAll("button");

    function showSlide(index) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    let autoPlay = setInterval(nextSlide, 5000);

    // Pause on hover
    carousel.addEventListener("mouseenter", () => clearInterval(autoPlay));
    carousel.addEventListener("mouseleave", () => autoPlay = setInterval(nextSlide, 5000));
  }

  /* ---- Mobile Sidebar Toggle (optional future use) ---- */
  const navToggle = document.querySelector(".nav-toggle");
  const sideNav = document.querySelector(".side-nav");
  if (navToggle && sideNav) {
    navToggle.addEventListener("click", () => {
      sideNav.classList.toggle("open");
    });
  }

  /* ---- News Reel (optional animation reset) ---- */
  const news = document.querySelector(".news-reel");
  if (news) {
    // restart animation every loop
    news.addEventListener("animationiteration", () => {
      news.style.animation = "none";
      news.offsetHeight; // trigger reflow
      news.style.animation = null;
    });
  }

  /* ---- Staff Page Security ---- */
  const pwInput = document.getElementById("pw");
  const msg = document.getElementById("msg");
  if (pwInput) {
    window.checkPassword = function () {
      const correct = "Meadow2025"; // ⚠️ Change this to your secure password
      if (pwInput.value === correct) {
        msg.textContent = "Access granted.";
        msg.style.color = "green";
        revealStaffContent();
      } else {
        msg.textContent = "Incorrect password.";
        msg.style.color = "red";
      }
    };
  }

  /* ---- Netlify Identity integration ---- */
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (user) {
        revealStaffContent();
      }
    });
    window.netlifyIdentity.on("login", user => {
      revealStaffContent();
      window.netlifyIdentity.close();
    });
  }
});

/* ---- Reveal protected staff content ---- */
function revealStaffContent() {
  const tpl = document.getElementById("staff-content-template");
  if (!tpl) return;
  const node = tpl.content.cloneNode(true);
  const login = document.getElementById("login");
  if (login && login.parentNode) login.parentNode.insertBefore(node, login.nextSibling);
}

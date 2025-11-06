/* =========================================================
   Meadow Pathways — Final JS (2025)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* --- Mobile Navigation Toggle --- */
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  navToggle?.addEventListener("click", () => {
    navList?.classList.toggle("open");
  });

  /* --- Simple Carousel --- */
  const slidesWrap = document.querySelector(".carousel-slides");
  if (slidesWrap) {
    const slides = Array.from(slidesWrap.children);
    let index = 0;
    const dotsContainer = document.querySelector(".carousel-dots");

    if (dotsContainer) {
      slides.forEach((_, i) => {
        const btn = document.createElement("button");
        btn.className = "carousel-dot";
        btn.addEventListener("click", () => { index = i; update(); });
        dotsContainer.appendChild(btn);
      });
    }

    const nextBtn = document.querySelector(".carousel-next");
    const prevBtn = document.querySelector(".carousel-prev");

    function update() {
      slidesWrap.style.transform = `translateX(-${index * 100}%)`;
      const dots = dotsContainer?.querySelectorAll(".carousel-dot") || [];
      dots.forEach((d, i) => d.classList.toggle("active-dot", i === index));
    }

    nextBtn?.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      update();
    });
    prevBtn?.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      update();
    });

    setInterval(() => {
      index = (index + 1) % slides.length;
      update();
    }, 7000);
    update();
  }

  /* --- Fade In Animation for Cards --- */
  const cards = document.querySelectorAll(".card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );
  cards.forEach((c) => observer.observe(c));

  /* --- Staff Page Authentication --- */
  function showStaffContent() {
    const loginBox = document.getElementById("login");
    const content = document.getElementById("staff-content");
    if (loginBox) loginBox.style.display = "none";
    if (content) content.style.display = "block";
  }

  // Netlify Identity handling (preferred)
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", (user) => {
      if (
        user &&
        user.app_metadata &&
        user.app_metadata.roles &&
        user.app_metadata.roles.includes("staff")
      ) {
        showStaffContent();
      }
    });

    const netBtn = document.getElementById("netlifyLoginBtn");
    if (netBtn) {
      netBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.netlifyIdentity.open();
      });
    }
  }

  // Password fallback (client-side)
  window.checkPassword = function () {
    const pw = document.getElementById("pw");
    const msg = document.getElementById("msg");
    const login = document.getElementById("login");
    const content = document.getElementById("staff-content");
    if (!pw) return;
    const entered = pw.value.trim();

    /* Replace below with your real password if using fallback */
    const PLACEHOLDER_PASSWORD = MPWEC2025!;

    if (entered === PLACEHOLDER_PASSWORD) {
      try { localStorage.setItem("mp_staff_auth", "1"); } catch (e) {}
      if (login) login.style.display = "none";
      if (content) content.style.display = "block";
      if (msg) msg.textContent = "";
    } else {
      if (msg) {
        msg.textContent = "Incorrect password — please try again.";
        msg.style.color = "#d9534f";
      }
      pw.value = "";
      pw.focus();
    }
  };

  // Persist login locally
  try {
    if (localStorage.getItem("mp_staff_auth") === "1") {
      showStaffContent();
    }
  } catch (e) {}
});

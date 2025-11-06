// ========== CAROUSEL ==========
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-inner img");
  const dotsContainer = document.querySelector(".carousel-dots");
  let currentSlide = 0;

  // Create dots dynamically
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
    dot.addEventListener("click", () => {
      showSlide(i);
      currentSlide = i;
    });
  });

  const dots = dotsContainer.querySelectorAll("span");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      dots[i].classList.remove("active");
    });

    slides[index].classList.add("active");
    dots[index].classList.add("active");

    // Transition effect (sliding images horizontally)
    document.querySelector(".carousel-inner").style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Initial setup
  showSlide(currentSlide);

  // Auto slide every 4 seconds
  setInterval(nextSlide, 4000);

  // ========== NAVIGATION ACTIVE LINK ==========
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // ========== FADE-IN ON SCROLL ==========
  const faders = document.querySelectorAll(".card, .bio-card, .values-section, .qr-section");
  const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(fader => appearOnScroll.observe(fader));

  // ========== NETLIFY FORM CONFIRMATION ==========
  const forms = document.querySelectorAll("form[data-netlify='true']");
  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      })
      .then(() => {
        alert("✅ Thank you! Your form has been submitted successfully.");
        form.reset();
      })
      .catch(() => {
        alert("⚠️ There was a problem submitting your form. Please try again later.");
      });
    });
  });

  // ========== QR CODE HOVER EFFECT ==========
  const qrImages = document.querySelectorAll(".qr-image");
  qrImages.forEach(img => {
    img.addEventListener("mouseover", () => {
      img.style.transform = "scale(1.05)";
      img.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
    });
    img.addEventListener("mouseout", () => {
      img.style.transform = "scale(1)";
      img.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
    });
  });

  // ========== PASSWORD PROTECTION (for staff page) ==========
  const passwordProtectedPage = '/staff.html'; // Define path for password protection

  if (window.location.pathname === passwordProtectedPage) {
    const password = prompt("Please enter the password to access this page:");

    if (password !== "yourPasswordHere") {
      alert("Incorrect password! You cannot access this page.");
      window.location.href = '/'; // Redirect to home page if password is incorrect
    }
  }
});

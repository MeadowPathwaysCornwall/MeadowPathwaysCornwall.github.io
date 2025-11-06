// Mobile navigation toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".nav-toggle");
  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const list = btn.nextElementSibling;
      list.classList.toggle("show");
    });
  });

  // Carousel logic
  const carousel = document.querySelector("#homeCarousel");
  if (carousel) {
    const slides = carousel.querySelector(".slides");
    const slideElems = carousel.querySelectorAll(".slide");
    let currentIndex = 0;

    const updateSlides = () => {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle("active-dot", i === currentIndex);
      });
    };

    const next = carousel.querySelector(".carousel-next");
    const prev = carousel.querySelector(".carousel-prev");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    // Create dots
    slideElems.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateSlides();
      });
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll(".carousel-dot");

    next.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slideElems.length;
      updateSlides();
    });
    prev.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slideElems.length) % slideElems.length;
      updateSlides();
    });

    // Auto rotate
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slideElems.length;
      updateSlides();
    }, 8000);

    updateSlides();
  }
});

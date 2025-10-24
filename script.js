document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel .slides img");
  const dotsContainer = document.querySelector(".carousel-dots");
  const dots = [];
  let index = 0;
  let intervalId = null;

  if (!slides.length) return;

  // create dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.setAttribute("role", "button");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", () => {
        show(i);
        restartInterval();
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  function show(n) {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    index = (n + slides.length) % slides.length;
    slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");
  }

  function next() {
    show(index + 1);
  }

  function startInterval() {
    intervalId = setInterval(next, 4200);
  }

  function restartInterval() {
    if (intervalId) clearInterval(intervalId);
    startInterval();
  }

  // initial show + start auto-slide
  show(0);
  startInterval();
});

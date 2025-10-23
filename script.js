const carousel = document.querySelector(".carousel");
if (carousel) {
  const slides = carousel.querySelectorAll("img");
  let currentIndex = 0;

  setInterval(() => {
    slides[currentIndex].style.opacity = "0";
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].style.opacity = "1";
  }, 5000);
}

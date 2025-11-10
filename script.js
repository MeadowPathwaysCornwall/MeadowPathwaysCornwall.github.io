// script.js
// Carousel + dots + prev/next + autoplay (works with <ul class="carousel-slides"><li><img class="slide" ...>)

document.addEventListener('DOMContentLoaded', () => {
  const carouselList = document.querySelector('.carousel-slides');
  if (!carouselList) return;

  const slideItems = Array.from(carouselList.querySelectorAll('li'));
  const images = slideItems.map(li => li.querySelector('img.slide')).filter(Boolean);
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const dotsContainer = document.getElementById('dots');

  let currentIndex = 0;
  let autoPlayTimer = null;
  const GAP = 18; // must match CSS gap

  // Build dots
  images.forEach((img, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dot';
    btn.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    btn.setAttribute('role', 'tab');
    if (idx === 0) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentIndex = idx;
      scrollToIndex(currentIndex);
      resetAutoPlay();
    });
    dotsContainer.appendChild(btn);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

  function scrollToIndex(index, smooth = true) {
    if (!images.length) return;
    const targetImg = images[index];
    // compute left offset relative to carouselList
    const li = slideItems[index];
    const left = li.offsetLeft - carouselList.offsetLeft;
    carouselList.scrollTo({
      left: left,
      behavior: smooth ? 'smooth' : 'auto'
    });
    updateDots(index);
  }

  function updateDots(index) {
    dots.forEach(d => d.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  }

  // Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      scrollToIndex(currentIndex);
      resetAutoPlay();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      scrollToIndex(currentIndex);
      resetAutoPlay();
    });
  }

  // Auto-play
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      scrollToIndex(currentIndex);
    }, 5000);
  }
  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }
  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Pause on hover/focus
  carouselList.addEventListener('mouseenter', stopAutoPlay);
  carouselList.addEventListener('mouseleave', startAutoPlay);
  carouselList.addEventListener('focusin', stopAutoPlay);
  carouselList.addEventListener('focusout', startAutoPlay);

  // Snap handling: update dots when user scrolls manually
  let scrollTimeout = null;
  carouselList.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // determine nearest slide
      let nearestIndex = 0;
      const scrollLeft = carouselList.scrollLeft;
      let minDist = Infinity;
      slideItems.forEach((li, idx) => {
        const liLeft = li.offsetLeft - carouselList.offsetLeft;
        const dist = Math.abs(liLeft - scrollLeft);
        if (dist < minDist) { minDist = dist; nearestIndex = idx; }
      });
      currentIndex = nearestIndex;
      updateDots(currentIndex);
    }, 120);
  });

  // Keyboard accessibility: left/right arrows
  document.addEventListener('keydown', (e) => {
    if (['ArrowLeft','ArrowRight'].includes(e.key)) {
      if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
      } else {
        currentIndex = (currentIndex + 1) % images.length;
      }
      scrollToIndex(currentIndex);
      resetAutoPlay();
    }
  });

  // Start
  startAutoPlay();

  // Ensure first slide visible on load
  scrollToIndex(0, false);
});

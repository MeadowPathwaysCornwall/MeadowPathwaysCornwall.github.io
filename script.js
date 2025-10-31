// Minimal nav toggle, carousel, modal, back-to-top, and staff unlock behaviours

(function () {
  // nav toggle for small screens (if you add a toggle button later)
  var navToggle = document.getElementById('navToggle'), nav = document.getElementById('primaryNav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // carousel controller (used on homepage)
  document.addEventListener('DOMContentLoaded', function () {
    var carousel = document.getElementById('carousel');
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('img.slide'));
      if (slides.length) {
        var dotsContainer = document.getElementById('dots');
        var prevBtn = document.getElementById('prev');
        var nextBtn = document.getElementById('next');
        var current = 0;

        slides.forEach(function (s, i) { s.style.display = 'none'; s.setAttribute('data-index', i); });
        slides[current].style.display = '';
        slides[current].classList.add('active');

        if (dotsContainer) {
          dotsContainer.innerHTML = '';
          slides.forEach(function (_, i) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'dot' + (i === 0 ? ' active' : '');
            b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            b.dataset.index = i;
            b.addEventListener('click', function () { goTo(i); resetAutoplay(); });
            dotsContainer.appendChild(b);
          });
        }

        function goTo(i) {
          i = (i + slides.length) % slides.length;
          if (i === current) return;
          slides[current].style.display = 'none';
          slides[current].classList.remove('active');
          var prevDot = dotsContainer && dotsContainer.querySelector('.dot[data-index="' + current + '"]');
          if (prevDot) prevDot.classList.remove('active');
          current = i;
          slides[current].style.display = '';
          slides[current].classList.add('active');
          var nextDot = dotsContainer && dotsContainer.querySelector('.dot[data-index="' + current + '"]');
          if (nextDot) nextDot.classList.add('active');
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAutoplay(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAutoplay(); });

        carousel.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowLeft') { goTo(current - 1); resetAutoplay(); }
          if (e.key === 'ArrowRight') { goTo(current + 1); resetAutoplay(); }
        });
        carousel.setAttribute('tabindex', '0');

        var autoplayInterval = 6000, autoplayId = null;
        function startAutoplay() { if (autoplayId) return; autoplayId = setInterval(function () { goTo

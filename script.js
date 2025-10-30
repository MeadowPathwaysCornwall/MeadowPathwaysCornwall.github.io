<script>
// Nav toggle + back-to-top + carousel enhancements
(function(){
  // Nav toggle
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function(){
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // Back to top
  var backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', function(){
      if (window.scrollY > 300) backBtn.classList.add('show'); else backBtn.classList.remove('show');
    });
    backBtn.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // Carousel controller (adds aria-current to active dot)
  document.addEventListener('DOMContentLoaded', function () {
    var carousel = document.getElementById('carousel');
    if (!carousel) return;
    var slidesContainer = carousel.querySelector('.slides');
    var slides = Array.prototype.slice.call(slidesContainer.querySelectorAll('img.slide'));
    if (!slides.length) return;

    var dotsContainer = document.getElementById('dots');
    var prevBtn = document.getElementById('prev');
    var nextBtn = document.getElementById('next');

    slides.forEach(function (s, i) {
      s.classList.remove('active');
      s.setAttribute('data-index', i);
      s.style.display = 'none';
    });

    var current = 0;
    slides[current].classList.add('active');
    slides[current].style.display = '';

    if (dotsContainer) {
      while (dotsContainer.firstChild) dotsContainer.removeChild(dotsContainer.firstChild);
      slides.forEach(function (_, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        btn.setAttribute('data-index', i);
        if (i === 0) btn.setAttribute('aria-current', 'true');
        btn.addEventListener('click', function () { goTo(i); resetAutoplay(); });
        dotsContainer.appendChild(btn);
      });
    }

    function syncDots(prevIndex, nextIndex) {
      if (!dotsContainer) return;
      var prevDot = dotsContainer.querySelector('.dot[data-index="' + prevIndex + '"]');
      var nextDot = dotsContainer.querySelector('.dot[data-index="' + nextIndex + '"]');
      if (prevDot) { prevDot.classList.remove('active'); prevDot.removeAttribute('aria-current'); }
      if (nextDot) { nextDot.classList.add('active'); nextDot.setAttribute('aria-current', 'true'); }
    }

    function goTo(index) {
      index = (index + slides.length) % slides.length;
      if (index === current) return;
      slides[current].classList.remove('active');
      slides[current].style.display = 'none';
      var prevIndex = current;
      current = index;
      slides[current].classList.add('active');
      slides[current].style.display = '';
      syncDots(prevIndex, current);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAutoplay(); });

    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goTo(current - 1); resetAutoplay(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); resetAutoplay(); }
    });
    carousel.setAttribute('tabindex', '0');

    var autoplayInterval = 6000, autoplayId = null;
    function startAutoplay() { if (autoplayId) return; autoplayId = setInterval(function () { goTo(current + 1); }, autoplayInterval); }
    function stopAutoplay() { if (!autoplayId) return; clearInterval(autoplayId); autoplayId = null; }
    function resetAutoplay() { stopAutoplay(); startAutoplay(); }
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);
    startAutoplay();
  });
})();
</script>

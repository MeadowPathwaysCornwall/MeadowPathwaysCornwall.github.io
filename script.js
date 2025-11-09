document.addEventListener('DOMContentLoaded', function () {
  // CAROUSEL
  (function carouselInit(){
    const slidesEl = document.getElementById('slides');
    if (!slidesEl) return;
    const slides = Array.from(slidesEl.querySelectorAll('.slide'));
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const dotsEl = document.getElementById('dots');

    let idx = 0, timer = null;
    const intervalMs = 4500;

    // create dots
    if (dotsEl) {
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Slide ' + (i+1));
        b.type = 'button';
        b.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(b);
      });
    }

    function update() {
      slidesEl.style.transform = `translateX(-${idx * 100}%)`;
      const ds = dotsEl ? Array.from(dotsEl.children) : [];
      ds.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function goTo(i) {
      idx = (i + slides.length) % slides.length;
      update();
    }
    function next(){ goTo(idx + 1); }
    function prev(){ goTo(idx - 1); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

    // keyboard
    document.addEventListener('keydown', (e)=> {
      if (e.key === 'ArrowLeft') { prev(); resetTimer(); }
      if (e.key === 'ArrowRight') { next(); resetTimer(); }
    });

    // touch support
    let startX = 0, currentX = 0, isTouching = false;
    slidesEl.addEventListener('touchstart', (e)=> {
      isTouching = true;
      startX = e.touches[0].clientX;
      stopTimer();
    }, {passive:true});
    slidesEl.addEventListener('touchmove', (e)=> {
      if (!isTouching) return;
      currentX = e.touches[0].clientX;
    }, {passive:true});
    slidesEl.addEventListener('touchend', ()=> {
      if (!isTouching) return;
      const dx = currentX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next(); else prev();
      }
      isTouching = false;
      startX = currentX = 0;
      resetTimer();
    });

    function startTimer(){ stopTimer(); timer = setInterval(next, intervalMs); }
    function stopTimer(){ if (timer) clearInterval(timer); timer = null; }
    function resetTimer(){ stopTimer(); startTimer(); }

    // init
    update();
    startTimer();

    // pause on hover
    slidesEl.addEventListener('mouseenter', stopTimer);
    slidesEl.addEventListener('mouseleave', startTimer);
  })();

  // small: show success message for Netlify fallback (if JS needed)
  (function formUX(){
    const forms = document.querySelectorAll('form[data-netlify="true"]');
    forms.forEach(f => {
      f.addEventListener('submit', function () {
        // Optional: disable submit to prevent double-click
        const btn = f.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      });
    });
  })();

});

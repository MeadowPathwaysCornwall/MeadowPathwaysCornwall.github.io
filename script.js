/* Meadow Pathways - script.js
   Carousel, news ticker, staff unlock, form UX, back-to-top
*/
document.addEventListener('DOMContentLoaded', function () {

  /* CAROUSEL - compact, stable, pause on hover/focus, keyboard, touch */
  (function () {
    const slidesEl = document.querySelector('.slides');
    if (!slidesEl) return;
    const slides = Array.from(slidesEl.querySelectorAll('.slide'));
    if (slides.length === 0) return;

    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const dotsContainer = document.getElementById('dots');

    let idx = 0;
    let timer = null;
    const INTERVAL = 4500;

    function setTransform() {
      slidesEl.style.transform = `translateX(-${idx * 100}%)`;
    }

    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Slide ' + (i + 1));
        b.addEventListener('click', () => { goTo(i); resetTimer(); });
        dotsContainer.appendChild(b);
      });
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      Array.from(dotsContainer.children).forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function goTo(i) {
      idx = (i + slides.length) % slides.length;
      setTransform();
      updateDots();
    }

    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { prev(); resetTimer(); }
      if (e.key === 'ArrowRight') { next(); resetTimer(); }
    });

    // touch/swipe support
    let startX = 0, moving = false;
    slidesEl.addEventListener('touchstart', (e) => { moving = true; startX = e.touches[0].clientX; stopTimer(); }, {passive:true});
    slidesEl.addEventListener('touchmove', (e) => { if (!moving) return; }, {passive:true});
    slidesEl.addEventListener('touchend', (e) => {
      moving = false;
      const endX = e.changedTouches[0].clientX;
      const dx = endX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      resetTimer();
    });

    function startTimer() { stopTimer(); timer = setInterval(next, INTERVAL); }
    function stopTimer() { if (timer) clearInterval(timer); timer = null; }
    function resetTimer() { stopTimer(); startTimer(); }

    slidesEl.addEventListener('mouseenter', stopTimer);
    slidesEl.addEventListener('mouseleave', startTimer);
    slidesEl.addEventListener('focusin', stopTimer);
    slidesEl.addEventListener('focusout', startTimer);

    let loaded = 0;
    slides.forEach(img => {
      if (img.complete) loaded++;
      else img.addEventListener('load', () => { loaded++; if (loaded === slides.length) setTransform(); });
    });

    createDots();
    setTransform();
    startTimer();
  })();

  /* NEWS TICKER */
  (function () {
    const ticker = document.querySelector('.news-ticker');
    if (!ticker) return;
    const raw = ticker.innerHTML;
    ticker.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = 'News: ';
    ticker.appendChild(strong);
    const wrap = document.createElement('span');
    wrap.className = 'ticker-wrap';
    wrap.innerHTML = raw;
    ticker.appendChild(wrap);
  })();

  /* FORM UX - disable submit button to prevent duplicates */
  (function () {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function () {
        const btn = form.querySelector('button[type="submit"], .pill');
        if (btn) {
          btn.disabled = true;
          if (btn.tagName.toLowerCase() === 'button') {
            btn.dataset.orig = btn.innerHTML;
            btn.innerHTML = 'Sending…';
          }
        }
      });
    });
  })();

  /* STAFF AREA - password unlock & Netlify hours form */
  (function () {
    const unlockBtn = document.getElementById('unlockBtn');
    const pwdInput = document.getElementById('staffPassword');
    const staffPanel = document.getElementById('staffPanel');
    const lockedArea = document.getElementById('locked');
    if (!unlockBtn || !pwdInput || !staffPanel || !lockedArea) return;
    const PASSWORD = 'MPWEC!';

    const protectedHTML = `...`; // keep full staff HTML from previous script

    function injectProtected() {
      staffPanel.innerHTML = protectedHTML;

      const hoursForm = document.getElementById('hoursForm');
      const hoursStatus = document.getElementById('hoursStatus');
      if (hoursForm) {
        hoursForm.addEventListener('submit', async function (e) {
          e.preventDefault();
          hoursStatus.textContent = 'Submitting...';
          try {
            const res = await fetch(hoursForm.action, { method: 'POST', body: new FormData(hoursForm), headers: { 'Accept': 'application/json' } });
            if (res.ok) { hoursForm.reset(); hoursStatus.textContent = 'Hours submitted. Thank you.'; setTimeout(()=>{ window.location.href='thankyou.html'; }, 900); }
            else { const json = await res.json(); hoursStatus.textContent = json && json.errors ? json.errors.map(x=>x.message).join('; ') : 'Submission error'; }
          } catch (err) { hoursStatus.textContent = 'Network error — check connection and try again.'; }
        });
      }
    }

    function unlock() {
      const val = (pwdInput.value || '').trim();
      if (val === PASSWORD) {
        lockedArea.style.display = 'none';
        injectProtected();
        staffPanel.style.display = 'block';
        pwdInput.value = '';
      } else {
        alert('Incorrect password. Contact Michelle or Zoe.');
        pwdInput.value = '';
        pwdInput.focus();
      }
    }

    unlockBtn.addEventListener('click', unlock);
    pwdInput.addEventListener('keyup', function (e) { if (e.key === 'Enter') unlock(); });
  })();

  /* BACK TO TOP */
  (function () {
    const btn = document.getElementById('backToTop') || document.querySelector('.back-to-top');
    if (!btn) return;
    function toggle() { btn.style.display = window.scrollY > 300 ? 'flex' : 'none'; }
    btn.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll', toggle);
    toggle();
  })();

});

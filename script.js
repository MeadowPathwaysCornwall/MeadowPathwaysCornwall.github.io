/* ---------------------------
  Meadow Pathways - script.js
  Robust carousel, news ticker, form UX, staff unlock, small helpers
----------------------------*/
document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------------
     Carousel: autoplay, dots, nav, keyboard, swipe
     Matches markup: .slides, .slide, #prev, #next, #dots
  ------------------------------*/
  (function initCarousel() {
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

    // ensure correct transform on load (after images loaded)
    function refreshPosition() {
      slidesEl.style.transform = `translateX(-${idx * 100}%)`;
    }

    // create dots
    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Slide ' + (i + 1));
        btn.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(btn);
      });
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      const ds = Array.from(dotsContainer.children);
      ds.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function goTo(i) {
      idx = (i + slides.length) % slides.length;
      refreshPosition();
      updateDots();
    }
    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }

    // hook buttons
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); reset(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); reset(); });

    // keyboard nav
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { prev(); reset(); }
      if (e.key === 'ArrowRight') { next(); reset(); }
    });

    // touch swipe
    let startX = 0, currentX = 0, isTouch = false;
    slidesEl.addEventListener('touchstart', (e) => {
      isTouch = true;
      startX = e.touches[0].clientX;
      stop();
    }, {passive:true});
    slidesEl.addEventListener('touchmove', (e) => {
      if (!isTouch) return;
      currentX = e.touches[0].clientX;
    }, {passive:true});
    slidesEl.addEventListener('touchend', () => {
      if (!isTouch) return;
      const dx = currentX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next(); else prev();
      }
      isTouch = false; startX = currentX = 0;
      reset();
    });

    // autoplay timer
    function start() { stop(); timer = setInterval(next, INTERVAL); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    function reset() { stop(); start(); }

    // pause on hover/focus
    slidesEl.addEventListener('mouseenter', stop);
    slidesEl.addEventListener('mouseleave', start);
    slidesEl.addEventListener('focusin', stop);
    slidesEl.addEventListener('focusout', start);

    // ensure images loaded to avoid jump
    let imagesLoaded = 0;
    slides.forEach(img => {
      if (img.complete) imagesLoaded++;
      else img.addEventListener('load', () => {
        imagesLoaded++;
        if (imagesLoaded === slides.length) refreshPosition();
      });
    });
    // init
    createDots();
    refreshPosition();
    start();
  })();


  /* -----------------------------
     News ticker: if present wrap the content and clone for seamless scroll
  ------------------------------*/
  (function initNewsTicker(){
    const ticker = document.querySelector('.news-ticker');
    if (!ticker) return;
    // create wrapper
    const txt = ticker.innerHTML;
    ticker.innerHTML = '';
    const label = document.createElement('strong');
    label.textContent = 'News: ';
    ticker.appendChild(label);
    const wrap = document.createElement('span');
    wrap.className = 'ticker-wrap';
    wrap.innerHTML = txt;
    ticker.appendChild(wrap);
  })();


  /* -----------------------------
     Form UX improvements
     - disable submit button after submit to avoid dups
     - small visual feedback
  ------------------------------*/
  (function initFormUX(){
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', function (e) {
        const btn = form.querySelector('button[type="submit"], .pill');
        if (btn) {
          btn.disabled = true;
          // if button is <button>, change text
          if (btn.tagName.toLowerCase() === 'button') {
            btn.dataset.orig = btn.innerHTML;
            btn.innerHTML = 'Sending…';
          }
        }
      });
    });
  })();


  /* -----------------------------
     Staff unlock helper (client-side)
     Looks for #unlockBtn, #staffPassword, #locked, #staffPanel
  ------------------------------*/
  (function initStaffUnlock() {
    const unlockBtn = document.getElementById('unlockBtn');
    const pwdInput = document.getElementById('staffPassword');
    if (!unlockBtn || !pwdInput) return;
    const lockedEl = document.getElementById('locked');
    const staffPanel = document.getElementById('staffPanel');
    const PASSWORD = 'MPWEC!';

    function unlock() {
      if ((pwdInput.value || '').trim() === PASSWORD) {
        if (lockedEl) lockedEl.style.display = 'none';
        if (staffPanel) staffPanel.style.display = 'block';
        pwdInput.value = '';
        // focus first input in staff panel if available
        const firstInput = staffPanel && staffPanel.querySelector('input, textarea, a, button');
        if (firstInput) firstInput.focus();
      } else {
        alert('Incorrect password — contact Michelle or Zoe for access.');
        pwdInput.value = '';
        pwdInput.focus();
      }
    }

    unlockBtn.addEventListener('click', unlock);
    pwdInput.addEventListener('keyup', function (e) { if (e.key === 'Enter') unlock(); });
  })();


  /* -----------------------------
     Back to top button
  ------------------------------*/
  (function backToTop(){
    const btn = document.getElementById('backToTop') || document.querySelector('.back-to-top');
    if (!btn) return;
    function evaluate() {
      if (window.scrollY > 300) btn.style.display = 'block';
      else btn.style.display = 'none';
    }
    btn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll', evaluate);
    evaluate();
  })();


  /* -----------------------------
     Small helper: open external sharepoint link in staff page if present
  ------------------------------*/
  (function sharepointHelper(){
    const sp = document.querySelector('a[href="#"][data-sharepoint]');
    if (!sp) return;
    sp.addEventListener('click', (e) => { e.preventDefault(); window.open(sp.dataset.href || '#', '_blank'); });
  })();

});

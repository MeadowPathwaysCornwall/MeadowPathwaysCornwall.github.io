document.addEventListener('DOMContentLoaded', function () {
  // Carousel
  const slidesEl = document.querySelector('.slides');
  if (slidesEl) {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const dotsEl = document.getElementById('dots');
    let idx = 0;

    function createDots() {
      slides.forEach((s, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label','Slide '+(i+1));
        if(i===0) b.classList.add('active');
        b.addEventListener('click', ()=> { goTo(i); });
        dotsEl.appendChild(b);
      });
    }

    function goTo(i){
      idx = i;
      slidesEl.style.transform = `translateX(-${idx * 100}%)`;
      const ds = dotsEl.querySelectorAll('button');
      ds.forEach((d,ii)=> d.classList.toggle('active', ii===idx));
    }

    if (prevBtn && nextBtn && dotsEl) {
      prevBtn.addEventListener('click', ()=> goTo((idx-1+slides.length)%slides.length));
      nextBtn.addEventListener('click', ()=> goTo((idx+1)%slides.length));
      createDots();
      let timer = setInterval(()=> goTo((idx+1)%slides.length), 5000);
      ['mouseover','focusin'].forEach(e => slidesEl.addEventListener(e, ()=> clearInterval(timer)));
      ['mouseout','focusout'].forEach(e => slidesEl.addEventListener(e, ()=> timer = setInterval(()=> goTo((idx+1)%slides.length), 5000)));
    }
  }

  // back to top (if included)
  const btt = document.getElementById('backToTop');
  if (btt) btt.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
});

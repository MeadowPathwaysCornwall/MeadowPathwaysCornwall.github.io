// Meadow Pathways — shared interactions (nav, carousel, back-to-top)
(function(){
  "use strict";

  // NAV TOGGLE
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if(navToggle && primaryNav){
    navToggle.addEventListener('click', ()=>{
      primaryNav.classList.toggle('open');
      const expanded = navToggle.getAttribute('aria-expanded')==='true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // ACTIVE NAV ITEM
  (function setActive(){
    if(!primaryNav) return;
    const links = primaryNav.querySelectorAll('a');
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    links.forEach(a=>{
      const href = (a.getAttribute('href')||'').toLowerCase();
      if(href === current) a.classList.add('active');
    });
  })();

  // CAROUSEL
  (function initCarousel(){
    const carousel = document.getElementById('carousel');
    if(!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const dotsWrap = document.getElementById('dots');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    let current = 0, timer = null;

    function show(i){
      if(!slides.length) return;
      i = (i + slides.length) % slides.length;
      slides.forEach((s,idx)=>{
        s.classList.toggle('active', idx === i);
        s.setAttribute('aria-hidden', String(idx !== i));
      });
      if(dotsWrap){
        Array.from(dotsWrap.children).forEach((d,idx)=> d.setAttribute('aria-selected', String(idx === i)));
      }
      current = i;
    }
    function next(){ show(current + 1); }
    function prev(){ show(current - 1); }
    function start(){ if(!timer) timer = setInterval(next, 5000); }
    function stop(){ clearInterval(timer); timer = null; }

    if(dotsWrap){
      dotsWrap.innerHTML = '';
      slides.forEach((_,i)=>{
        const b = document.createElement('button');
        b.className = 'dot'; b.type='button';
        b.setAttribute('aria-label','Go to slide '+(i+1));
        b.addEventListener('click', ()=>{ stop(); show(i); });
        dotsWrap.appendChild(b);
      });
    }
    if(nextBtn) nextBtn.addEventListener('click', ()=>{ stop(); next(); });
    if(prevBtn) prevBtn.addEventListener('click', ()=>{ stop(); prev(); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('touchstart', stop, {passive:true});
    carousel.addEventListener('touchend', start, {passive:true});

    if(slides.length){ show(0); start(); } else console.warn('Carousel: no slides.');
  })();

  // BACK TO TOP
  (function backToTop(){
    const back = document.getElementById('backToTop');
    if(!back) return;
    function update(){ back.classList.toggle('show', window.scrollY > 240); }
    window.addEventListener('scroll', update, {passive:true});
    back.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
    update();
  })();

})();

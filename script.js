// Meadow Pathways — shared interactions
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
  if(primaryNav){
    const links = primaryNav.querySelectorAll('a');
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    links.forEach(a=>{
      const href = (a.getAttribute('href')||'').toLowerCase();
      if(href===current) a.classList.add('active');
    });
  }

  // CAROUSEL
  const carousel = document.getElementById('carousel');
  if(carousel){
    const slides = carousel.querySelectorAll('.slide');
    const dotsWrap = document.getElementById('dots');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    let current=0, timer=null;

    function show(i){
      slides.forEach((s,idx)=>{
        s.classList.toggle('active', idx===i);
        s.setAttribute('aria-hidden', String(idx!==i));
      });
      if(dotsWrap){
        dotsWrap.querySelectorAll('.dot').forEach((d,idx)=>d.setAttribute('aria-selected', String(idx===i)));
      }
      current=i;
    }
    function next(){ show((current+1)%slides.length); }
    function prev(){ show((current-1+slides.length)%slides.length); }
    function startAuto(){ if(!timer) timer=setInterval(next,5000); }
    function stopAuto(){ clearInterval(timer); timer=null; }

    if(dotsWrap){
      slides.forEach((_,i)=>{
        const b=document.createElement('button');
        b.className='dot'; b.setAttribute('aria-label','Go to slide '+(i+1));
        b.addEventListener('click',()=>{stopAuto();show(i);});
        dotsWrap.appendChild(b);
      });
    }
    if(nextBtn) nextBtn.addEventListener('click',()=>{stopAuto();next();});
    if(prevBtn) prevBtn.addEventListener('click',()=>{stopAuto();prev();});
    carousel.addEventListener('mouseenter',stopAuto);
    carousel.addEventListener('mouseleave',startAuto);

    if(slides.length){ show(0); startAuto(); }
  }

  // BACK TO TOP
  const backBtn=document.getElementById('backToTop');
  if(backBtn){
    function check(){ backBtn.classList.toggle('show', window.scrollY>240); }
    window.addEventListener('scroll',check,{passive:true});
    backBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    check();
  }
})();

/* Meadow Pathways — script.js
   Navigation, carousel, back-to-top, and Formspree form handling
*/

(function(){
  document.addEventListener('DOMContentLoaded', function(){

    /* ---------------------------
       MOBILE NAV TOGGLE
    --------------------------- */
    const navToggle = document.getElementById('navToggle');
    const primaryNav = document.getElementById('primaryNav');
    if(navToggle && primaryNav){
      navToggle.addEventListener('click', () => {
        const open = primaryNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(open));
      });
    }

    /* ---------------------------
       BACK TO TOP BUTTON
    --------------------------- */
    const backBtn = document.getElementById('backToTop');
    if(backBtn){
      window.addEventListener('scroll', () => {
        if(window.scrollY > 320) backBtn.classList.add('show');
        else backBtn.classList.remove('show');
      });
      backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ---------------------------
       IMAGE CAROUSEL
    --------------------------- */
    const carousel = document.getElementById('carousel');
    if(carousel){
      const slides = Array.from(carousel.querySelectorAll('.slides img'));
      const dotsContainer = document.getElementById('dots');
      const prevBtn = document.getElementById('prev');
      const nextBtn = document.getElementById('next');
      let current = 0;

      function showSlide(index){
        slides.forEach((slide,i)=>{
          slide.classList.toggle('active', i===index);
          slide.style.display = i===index ? '' : 'none';
        });
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        dots.forEach((d,i)=> d.classList.toggle('active', i===index));
      }

      function goTo(idx){
        current = (idx + slides.length) % slides.length;
        showSlide(current);
      }

      if(dotsContainer){
        dotsContainer.innerHTML = '';
        slides.forEach((_,i)=>{
          const dot = document.createElement('button');
          dot.type='button';
          dot.className='dot' + (i===0?' active':'');
          dot.setAttribute('aria-label','Go to slide '+(i+1));
          dot.addEventListener('click',()=>{goTo(i); resetAuto();});
          dotsContainer.appendChild(dot);
        });
      }

      prevBtn?.addEventListener('click',()=>{goTo(current-1); resetAuto();});
      nextBtn?.addEventListener('click',()=>{goTo(current+1); resetAuto();});
      carousel.setAttribute('tabindex','0');
      carousel.addEventListener('keydown',e=>{
        if(e.key==='ArrowLeft'){goTo(current-1); resetAuto();}
        if(e.key==='ArrowRight'){goTo(current+1); resetAuto();}
      });

      let autoPlay;
      function startAuto(){autoPlay = setInterval(()=>goTo(current+1),6000);}
      function stopAuto(){clearInterval(autoPlay);}
      function resetAuto(){stopAuto();startAuto();}
      carousel.addEventListener('mouseenter',stopAuto);
      carousel.addEventListener('mouseleave',startAuto);
      showSlide(current);
      startAuto();
    }

    /* ---------------------------
       FORMSPREE HANDLING
    --------------------------- */
    const forms = document.querySelectorAll('form[data-ajax="true"]');
    forms.forEach(form=>{
      form.addEventListener('submit',async e=>{
        e.preventDefault();
        const endpoint=form.getAttribute('action');
        const data=new FormData(form);
        try{
          const res=await fetch(endpoint,{method:'POST',body:data,headers:{'Accept':'application/json'}});
          if(res.ok){
            form.reset();
            const redirect=form.querySelector('input[name="_redirect"]');
            if(redirect) window.location=redirect.value;
            else alert('Thank you — your message has been sent.');
          }else{
            const json=await res.json();
            console.error(json);
            alert('Error sending form — please try again later.');
          }
        }catch(err){
          console.error(err);
          alert('Network error — please try again later.');
        }
      });
    });

  });
})();

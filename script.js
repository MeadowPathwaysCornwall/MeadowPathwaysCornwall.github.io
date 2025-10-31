// Meadow Pathways site scripts: carousel, modal, back-to-top, Formspree AJAX (no client passwords)
(function () {
  function $id(id){return document.getElementById(id)}

  /* Carousel module */
  (function carouselModule(){
    const carousel = $id('carousel');
    if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    if (!slides.length) return;
    const dotsWrap = $id('dots');
    const prev = $id('prev');
    const next = $id('next');
    let current = 0;
    let autoplayId = null;

    function show(i){
      i = (i + slides.length) % slides.length;
      slides.forEach((s,idx)=>{
        s.classList.toggle('active', idx === i);
        s.style.display = idx === i ? '' : 'none';
      });
      if (dotsWrap) Array.from(dotsWrap.children).forEach((b,idx)=> b.classList.toggle('active', idx === i));
      current = i;
    }

    if (dotsWrap){
      dotsWrap.innerHTML = '';
      slides.forEach((_,i)=>{
        const b = document.createElement('button');
        b.type = 'button';
        b.className = i === 0 ? 'dot active' : 'dot';
        b.setAttribute('aria-label','Go to slide '+(i+1));
        b.addEventListener('click', ()=> { show(i); resetAutoplay(); });
        dotsWrap.appendChild(b);
      });
    }

    prev?.addEventListener('click', ()=> { show(current-1); resetAutoplay(); });
    next?.addEventListener('click', ()=> { show(current+1); resetAutoplay(); });

    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') show(current-1);
      if (e.key === 'ArrowRight') show(current+1);
    });
    carousel.setAttribute('tabindex','0');

    function startAutoplay(){ if (!autoplayId) autoplayId = setInterval(()=> show(current+1),6000) }
    function stopAutoplay(){ clearInterval(autoplayId); autoplayId = null }
    function resetAutoplay(){ stopAutoplay(); startAutoplay() }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    show(0);
    startAutoplay();
  })();

  /* Modal module */
  (function modalModule(){
    const modal = $id('referralModal');
    if (!modal) return;
    const openBtns = [ $id('referralOpen'), $id('referralInline') ].filter(Boolean);
    const closeBtns = Array.from(modal.querySelectorAll('.modal-close, .modal-cancel'));

    function openModal(){
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      const first = modal.querySelector('input,textarea,button');
      if (first) first.focus();
      document.body.style.overflow = 'hidden';
    }
    function closeModal(){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      const opener = $id('referralOpen') || $id('referralInline');
      if (opener) opener.focus();
    }

    openBtns.forEach(b => b.addEventListener('click', openModal));
    closeBtns.forEach(b => b.addEventListener('click', closeModal));
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  })();

  /* Back to top */
  (function backToTop(){
    const btn = $id('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', ()=> btn.classList.toggle('show', window.scrollY > 300));
    btn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
  })();

  /* Formspree submit helpers (AJAX) */
  (function formspreeHelpers(){
    function ajaxForm(id, resultId, onSuccess){
      const form = document.getElementById(id);
      const result = document.getElementById(resultId);
      if (!form) return;
      form.addEventListener('submit', function(e){
        e.preventDefault();
        const data = new FormData(form);
        const action = form.getAttribute('action') || window.location.href;
        const consent = form.querySelector('input[name="consent"]');
        if (consent && !consent.checked) {
          consent.focus();
          return;
        }

        fetch(action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        }).then(resp => {
          if (resp.ok) return resp.json().catch(()=> ({}));
          return resp.json().then(err => Promise.reject(err));
        }).then(() => {
          if (result) {
            result.textContent = 'Thanks — your submission has been received.';
            result.style.display = '';
          } else {
            alert('Thanks — your submission has been received.');
          }
          form.reset();
          // close referral modal if open
          const modal = document.getElementById('referralModal');
          if (modal && modal.classList.contains('open')) {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden','true');
            document.body.style.overflow = '';
          }
          if (typeof onSuccess === 'function') onSuccess();
        }).catch(() => {
          if (result) {
            result.textContent = 'There was a problem submitting the form. Please try again.';
            result.style.display = '';
          } else {
            alert('Submission failed — please try again.');
          }
        });
      });
    }
    ajaxForm('referralForm', 'referralResult');
    ajaxForm('contactForm', 'contactResult');
  })();

})();

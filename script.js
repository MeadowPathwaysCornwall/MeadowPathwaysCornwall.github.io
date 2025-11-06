document.addEventListener("DOMContentLoaded", () => {
  /* Mobile nav toggle: show/hide side nav on small screens */
  const sideNav = document.querySelector('.side-nav');
  const sidebar = document.querySelector('.sidebar');
  if (window.innerWidth < 960 && sideNav) {
    // add a small toggle - clicking logo toggles nav
    const logo = document.querySelector('.sidebar-logo');
    logo?.addEventListener('click', () => {
      sideNav.style.display = sideNav.style.display === 'block' ? 'none' : 'block';
    });
  }

  /* Simple carousel */
  const slidesWrap = document.querySelector('.carousel-slides');
  if (slidesWrap) {
    const slides = Array.from(slidesWrap.children);
    let index = 0;
    const dotsContainer = document.querySelector('.carousel-dots');

    // create dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.className = 'carousel-dot';
        b.addEventListener('click', () => { index = i; update(); });
        dotsContainer.appendChild(b);
      });
    }

    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');

    function update() {
      slidesWrap.style.transform = `translateX(-${index * 100}%)`;
      const dots = dotsContainer?.querySelectorAll('.carousel-dot') || [];
      dots.forEach((d, i) => d.classList.toggle('active-dot', i === index));
    }

    nextBtn?.addEventListener('click', () => { index = (index+1) % slides.length; update(); });
    prevBtn?.addEventListener('click', () => { index = (index-1 + slides.length) % slides.length; update(); });

    setInterval(() => { index = (index+1) % slides.length; update(); }, 7000);
    update();
  }

  /* Fade-in cards on scroll */
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, {threshold: 0.08});
  cards.forEach(c => observer.observe(c));

  /* Staff auth: reveal template after Netlify Identity login OR password fallback */
  function revealStaffContent() {
    const tpl = document.getElementById('staff-content-template');
    if (!tpl) return;
    const node = tpl.content.cloneNode(true);
    // insert after login block
    const login = document.getElementById('login');
    if (login && login.parentNode) login.parentNode.insertBefore(node, login.nextSibling);
    // re-run observer so new cards fade in
    const newCards = document.querySelectorAll('#staff-content .card, #staff-content');
    newCards.forEach(c => c.classList.add('visible'));
  }

  // Netlify Identity (if enabled)
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', user => {
      if (user && user.app_metadata && user.app_metadata.roles && user.app_metadata.roles.includes('staff')) {
        revealStaffContent();
        const login = document.getElementById('login'); if (login) login.style.display = 'none';
      }
    });

    const netBtn = document.getElementById('netlifyLoginBtn');
    netBtn?.addEventListener('click', e => { e.preventDefault(); window.netlifyIdentity.open(); });
  }

  // Password fallback (note: client-side only; replace before going live)
  window.checkPassword = function() {
    const pw = document.getElementById('pw');
    const msg = document.getElementById('msg');
    if (!pw) return;
    const val = pw.value.trim();
    const PLACEHOLDER = 'SetYourPasswordHere'; // <--- replace with your chosen staff password before use
    if (val === PLACEHOLDER) {
      try { localStorage.setItem('mp_staff_auth','1'); } catch(e) {}
      const login = document.getElementById('login'); if (login) login.style.display = 'none';
      revealStaffContent();
    } else {
      if (msg) { msg.textContent = 'Incorrect password — please try again.'; msg.style.color = '#d9534f'; }
      pw.value = ''; pw.focus();
    }
  };

  // restore from localStorage
  try {
    if (localStorage.getItem('mp_staff_auth') === '1') {
      const login = document.getElementById('login'); if (login) login.style.display='none';
      revealStaffContent();
    }
  } catch(e){}
});

/* Meadow Pathways - script.js
   Carousel (compact), news ticker, staff unlock inject, form UX helpers
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
      const ds = Array.from(dotsContainer.children);
      ds.forEach((d, i) => d.classList.toggle('active', i === idx));
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

    // touch/swipe
    let startX = 0, moving = false;
    slidesEl.addEventListener('touchstart', (e) => { moving = true; startX = e.touches[0].clientX; stopTimer(); }, {passive:true});
    slidesEl.addEventListener('touchmove', (e) => { if (!moving) return; startX = startX; }, {passive:true});
    slidesEl.addEventListener('touchend', (e) => {
      moving = false;
      const endX = e.changedTouches[0].clientX;
      const dx = endX - startX;
      if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); }
      resetTimer();
    });

    function startTimer() { stopTimer(); timer = setInterval(next, INTERVAL); }
    function stopTimer() { if (timer) clearInterval(timer); timer = null; }
    function resetTimer() { stopTimer(); startTimer(); }

    slidesEl.addEventListener('mouseenter', stopTimer);
    slidesEl.addEventListener('mouseleave', startTimer);
    slidesEl.addEventListener('focusin', stopTimer);
    slidesEl.addEventListener('focusout', startTimer);

    // wait images loaded
    let loaded = 0;
    slides.forEach(img => {
      if (img.complete) loaded++;
      else img.addEventListener('load', () => { loaded++; if (loaded === slides.length) setTransform(); });
    });

    createDots();
    setTransform();
    startTimer();
  })();

  /* NEWS TICKER: wrap content in ticker-wrap */
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

  /* FORM UX: disable submit button on submit to avoid duplicates */
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

  /* STAFF PAGE: inject protected content only after correct password
     Protected content is stored in the script (not visible until injected).
     NOTE: client-side protection is not bulletproof; for higher security use Netlify Identity or server-protected area.
  */
  (function () {
    const unlockBtn = document.getElementById('unlockBtn');
    const pwdInput = document.getElementById('staffPassword');
    const staffPanel = document.getElementById('staffPanel');
    const lockedArea = document.getElementById('locked');
    if (!unlockBtn || !pwdInput || !staffPanel || !lockedArea) return;
    const PASSWORD = 'MPWEC!';

    // protected HTML to inject (keeps it out of immediate page HTML)
    const protectedHTML = `
      <h2>Welcome to the Staff Area</h2>
      <p>Protected resources and links for staff are shown here.</p>

      <h3>Statutory & Partner Resources</h3>
      <div class="policy-links">
        <a class="pill p-3" href="https://assets.publishing.service.gov.uk/media/68add931969253904d155860/Keeping_children_safe_in_education_from_1_September_2025.pdf" target="_blank" rel="noopener">Keeping children safe in education (Sep 2025)</a>
        <a class="pill p-3" href="https://beaconhouse.org.uk/resources/" target="_blank" rel="noopener">Beacon House resources</a>
        <a class="pill p-3" href="https://learning.nspcc.org.uk/research-resources/resources" target="_blank" rel="noopener">NSPCC learning & research</a>
        <a class="pill p-3" href="https://ciossafeguarding.org.uk/scp" target="_blank" rel="noopener">Cios safeguarding partnership</a>
      </div>

      <h3 style="margin-top:12px">Internal policy documents (downloads)</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
        <a class="pill p-1" href="MPWEC Curriculum Policy EOTAS September 2025.docx" download>Curriculum Policy (EOTAS)</a>
        <a class="pill p-2" href="MPWEC H&S Policy Sep 25.docx" download>H&S Policy</a>
        <a class="pill p-4" href="MPWEC Lone Working Policy Sep25.docx" download>Lone Working</a>
        <a class="pill p-1" href="MPWEC Safeguarding and Child Protection Policy Sep 2025.docx" download>Safeguarding</a>
        <a class="pill p-2" href="MPWEC Staff Conduct Policy.docx" download>Staff Conduct</a>
        <a class="pill p-4" href="MPWEC Whistleblowing Policy.docx" download>Whistleblowing</a>
      </div>

      <h3 style="margin-top:14px">Hours logged</h3>
      <form id="hoursForm" method="POST" action="https://formspree.io/f/movnvzqp">
        <input type="hidden" name="_subject" value="Hours logged - Meadow Pathways Staff" />
        <label for="staff-name">Staff member name</label>
        <input id="staff-name" name="staff_name" type="text" required />
        <label for="date-worked">Date</label>
        <input id="date-worked" name="date_worked" type="date" required />
        <label for="duration">Duration (hours)</label>
        <input id="duration" name="duration_hours" type="number" step="0.25" min="0" required />
        <label for="client">Client / session with</label>
        <input id="client" name="client_name" type="text" />
        <label for="notes">Brief notes</label>
        <textarea id="notes" name="notes" rows="4"></textarea>
        <label for="email-staff">Staff email</label>
        <input id="email-staff" name="staff_email" type="email" value="Michelle.Pascoe@meadowpathwayscornwall.com" required />
        <div class="actions"><button type="submit" class="pill">Submit hours</button></div>
        <div id="hoursStatus" role="status" aria-live="polite" style="margin-top:12px;color:var(--txt-dark);font-weight:600"></div>
      </form>
    `;

    function injectProtected() {
      staffPanel.innerHTML = protectedHTML;
      // attach hours form handler
      const hoursForm = document.getElementById('hoursForm');
      const hoursStatus = document.getElementById('hoursStatus');
      if (hoursForm) {
        hoursForm.addEventListener('submit', async function (e) {
          e.preventDefault();
          hoursStatus.textContent = 'Submitting...';
          try {
            const res = await fetch(hoursForm.action, { method: 'POST', body: new FormData(hoursForm), headers: { 'Accept': 'application/json' } });
            if (res.ok) { hoursForm.reset(); hoursStatus.textContent = 'Hours submitted. Thank you.'; setTimeout(() => { window.location.href = 'thankyou.html'; }, 800); }
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
    function toggle() { btn.style.display = window.scrollY > 300 ? 'block' : 'none'; }
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', toggle);
    toggle();
  })();

});

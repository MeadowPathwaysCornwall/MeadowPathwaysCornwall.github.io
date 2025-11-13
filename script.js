// script.js
document.addEventListener('DOMContentLoaded', function () {

  // --- Sidebar Active Tab Highlight ---
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    try {
      const href = tab.getAttribute('href') || '';
      if (href && (window.location.pathname === href || window.location.pathname.endsWith('/' + href))) {
        tab.style.opacity = '0.95';
        tab.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        tab.setAttribute('aria-current', 'page');
      }
    } catch (e) {}
  });

  // --- Staff Panel Unlock ---
  const PASSWORD = 'MPWEC!';
  const lockedEl = document.getElementById('locked');
  const staffPanel = document.getElementById('staffPanel');
  const unlockBtn = document.getElementById('unlockBtn');
  const pwdInput = document.getElementById('staffPassword');

  function unlock() {
    const val = pwdInput.value.trim();
    if (val === PASSWORD) {
      lockedEl.style.display = 'none';
      staffPanel.style.display = 'block';
      lockedEl.setAttribute('aria-hidden', 'true');
      staffPanel.setAttribute('aria-hidden', 'false');
      pwdInput.value = '';
      // focus first input in staff panel
      const firstInput = staffPanel.querySelector('input, textarea, select');
      if(firstInput) firstInput.focus();
    } else {
      alert('Incorrect password. Please contact Michelle or Zoe.');
      pwdInput.value = '';
      pwdInput.focus();
    }
  }

  if(unlockBtn && pwdInput){
    unlockBtn.addEventListener('click', unlock);
    pwdInput.addEventListener('keypress', e => { if(e.key === 'Enter') unlock(); });
  }

  // --- Smooth scroll for internal anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const sel = this.getAttribute('href');
      const target = document.querySelector(sel);
      if(target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Form submission with auto-clear for Hours & Case Notes ---
  const forms = [document.getElementById('hoursForm'), document.getElementById('caseForm')];
  forms.forEach(form => {
    if(!form) return;
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const statusEl = form.querySelector('[role="status"]');
      if(statusEl) statusEl.textContent = 'Submitting...';

      const data = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: {'Accept':'application/json'}
        });

        if(res.ok){
          form.reset();
          if(statusEl) statusEl.textContent = 'Submitted successfully. Redirecting...';
          setTimeout(() => { window.location.href = 'Thankyou.html'; }, 800);
        } else {
          let msg = 'Submission failed — please try again later.';
          try{
            const json = await res.json();
            if(json && json.errors) msg = json.errors.map(err => err.message).join('; ');
          } catch(err){}
          if(statusEl) statusEl.textContent = msg;
          else alert(msg);
        }
      } catch(err){
        if(statusEl) statusEl.textContent = 'Network error — check connection and try again.';
        else alert('Network error — check connection and try again.');
      }
    });
  });

  // --- Add noopener noreferrer to external links ---
  document.querySelectorAll('a[target="_blank"]').forEach(a=>{
    const rel = (a.getAttribute('rel')||'').split(/\s+/).filter(Boolean);
    if(!rel.includes('noopener')) rel.push('noopener');
    if(!rel.includes('noreferrer')) rel.push('noreferrer');
    a.setAttribute('rel', rel.join(' ').trim());
  });

});

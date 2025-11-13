// Meadow Pathways – staff page form handling & password

document.addEventListener('DOMContentLoaded', () => {
  // --- Password Protection ---
  const overlay = document.getElementById('password-overlay');
  const PASSWORD = 'MPWEC!';
  const submitBtn = document.getElementById('password-submit');
  const input = document.getElementById('staff-password');
  const error = document.getElementById('password-error');

  const stored = localStorage.getItem('staff_access_granted');
  if (stored === 'true') overlay.style.display = 'none';

  submitBtn.addEventListener('click', () => {
    if (input.value.trim() === PASSWORD) {
      localStorage.setItem('staff_access_granted', 'true');
      overlay.style.display = 'none';
    } else {
      error.textContent = 'Incorrect password. Please try again.';
    }
  });

  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitBtn.click(); });

  // --- Form Submission Helper ---
  async function handleFormSubmission(formId, statusId) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form || !status) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      status.style.color = '';
      status.textContent = 'Submitting...';

      // Set _replyto for Formspree
      try {
        const emailField = form.querySelector('input[type="email"]');
        const hiddenReply = form.querySelector('input[name="_replyto"]');
        if (emailField && hiddenReply) hiddenReply.value = emailField.value;
      } catch (err) { console.warn(err); }

      const data = new FormData(form);

      function show(msg, color='black') { status.style.color = color; status.textContent = msg; }

      try {
        const res = await fetch(form.action, { method:'POST', headers:{'Accept':'application/json'}, body:data });
        if (res.ok) {
          form.reset();
          show('Submission successful. Redirecting...', 'green');
          const redirectInput = form.querySelector('input[name="_redirect"]');
          if (redirectInput && redirectInput.value) setTimeout(()=>window.location.href=redirectInput.value, 900);
          return;
        }

        let json=null, text='';
        try { json = await res.json(); } catch(e){ text=await res.text().catch(()=>''); }
        if (json && json.errors) show(json.errors.map(err=>err.message).join('; '), 'red');
        else if (json && json.message) show(json.message, 'red');
        else if (text) show(text,'red');
        else show(`Submission failed (status ${res.status})`, 'red');
      } catch(err) {
        console.error(err);
        show('Network error. Check connection.','orange');
      }
    });
  }

  // Initialize both forms
  handleFormSubmission('log-hours-form','log-hours-status');
  handleFormSubmission('session-log-form','session-log-status');
});

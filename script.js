// Meadow Pathways – form handler
async function handleFormSubmission(formId, statusId) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form || !status) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    status.style.color = '';
    status.textContent = 'Submitting...';

    // Ensure _replyto is set
    const emailField = form.querySelector('input[type="email"]');
    const hiddenReply = form.querySelector('input[name="_replyto"]');
    if (emailField && !hiddenReply) {
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = '_replyto';
      hidden.value = emailField.value || '';
      form.appendChild(hidden);
    }

    const data = new FormData(form);

    function show(msg, color='black') {
      status.style.color = color;
      status.textContent = msg;
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept':'application/json' },
        body: data
      });
      if (res.ok) {
        form.reset();
        show('Submission successful. Redirecting...', 'green');
        const redirectInput = form.querySelector('input[name="_redirect"]');
        if (redirectInput && redirectInput.value) {
          setTimeout(()=>{window.location.href=redirectInput.value;},900);
        }
        return;
      }
      let json=null;
      try { json = await res.json(); } catch {}
      if (json && json.errors) show('Submission failed: ' + json.errors.map(e=>e.message).join('; '),'red');
      else show(`Submission failed (status ${res.status}). See console.`,'red');
    } catch(err){
      console.error(err);
      show('Network error — check connection.','red');
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  handleFormSubmission('staff-hours-form','staff-hours-status');
  handleFormSubmission('session-log-form','session-log-status');
});

// Meadow Pathways – handles all form submissions

async function handleFormSubmission(formId, statusId) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form || !status) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    status.style.color = '';
    status.textContent = 'Submitting...';

    const data = new FormData(form);

    function show(msg, color = 'black') {
      status.style.color = color;
      status.textContent = msg;
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });

      console.log(`[${formId}] fetch response`, res, 'status:', res.status);

      if (res.ok) {
        form.reset();
        show('Submission successful. Redirecting...', 'green');

        const redirectInput = form.querySelector('input[name="_redirect"]');
        const to = redirectInput ? redirectInput.value : '';
        if (to) setTimeout(() => { window.location.href = to; }, 900);
        return;
      }

      // Try JSON error
      let bodyText = '';
      let json = null;
      try {
        json = await res.json();
      } catch {
        bodyText = await res.text().catch(() => '');
      }

      if (json && json.errors && Array.isArray(json.errors)) {
        const msg = json.errors.map(err => err.message || JSON.stringify(err)).join('; ');
        show(`Submission failed: ${msg}`, 'red');
      } else if (json && json.message) {
        show(`Submission failed: ${json.message}`, 'red');
      } else if (bodyText) {
        show(`Submission failed: ${bodyText}`, 'red');
      } else {
        show(`Submission failed (status ${res.status}). See console for details.`, 'red');
      }
    } catch (err) {
      console.error(`[${formId}] fetch error:`, err);
      show('Network error — see console for details.', 'orange');
    }
  });
}

// Init forms
document.addEventListener('DOMContentLoaded', () => {
  handleFormSubmission('staff-hours-form', 'staff-hours-status');
  handleFormSubmission('session-log-form', 'session-log-status');
});

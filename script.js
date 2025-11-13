// Meadow Pathways – updated script to support staff-hours-form and session-log-form

async function handleFormSubmission(formId, statusId) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form || !status) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    status.style.color = '';
    status.textContent = 'Submitting...';

    // If there's a visible email field, ensure _replyto is set (helps Formspree/email delivery)
    try {
      const emailField = form.querySelector('input[type="email"][name*="email"], input[type="email"]');
      const hiddenReply = form.querySelector('input[name="_replyto"]');
      if (emailField && hiddenReply && !hiddenReply.value) {
        hiddenReply.value = emailField.value || '';
      }
    } catch (err) {
      console.warn('replyto populate error', err);
    }

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

      // Try to parse JSON error body (Formspree sends JSON on validation errors)
      let bodyText = '';
      let json = null;
      try {
        json = await res.json();
        console.log(`[${formId}] response json:`, json);
      } catch (err) {
        bodyText = await res.text().catch(() => '');
        console.log(`[${formId}] non-json response text:`, bodyText);
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

      return;
    } catch (err) {
      console.error(`[${formId}] fetch error:`, err);
      show('Network error — attempting fallback POST...', 'orange');

      // Fallback: try a simple URL-encoded POST (skip file inputs)
      try {
        const params = new URLSearchParams();
        for (const [k, v] of new FormData(form)) {
          if (v instanceof File) continue;
          params.append(k, v);
        }
        const res2 = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: params.toString()
        });
        console.log(`[${formId}] fallback response`, res2);
        if (res2.ok) {
          form.reset();
          show('Submission successful (fallback). Redirecting...', 'green');
          const redirectInput = form.querySelector('input[name="_redirect"]');
          const to = redirectInput ? redirectInput.value : '';
          if (to) setTimeout(() => { window.location.href = to; }, 900);
          return;
        }
        let txt = await res2.text().catch(() => '');
        console.warn(`[${formId}] fallback failed:`, res2.status, txt);
        show(`Submission failed (fallback). Status ${res2.status}. See console for details.`, 'red');
      } catch (err2) {
        console.error(`[${formId}] fallback fetch error:`, err2);
        show('Submission failed — network or server error. See console for details.', 'red');
      }
    }
  });
}

// Init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Existing contact form (if present on this page)
  handleFormSubmission('contact-form', 'contact-status');

  // Staff forms (these are on staff.html)
  handleFormSubmission('staff-hours-form', 'staff-hours-status');
  handleFormSubmission('session-log-form', 'session-log-status');

  // Backwards compatibility if you want a single staff-form id elsewhere
  handleFormSubmission('staff-form', 'staff-status');
});

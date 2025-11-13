async function handleFormSubmission(formId, statusId) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form || !status) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    status.style.color = '';
    status.textContent = 'Submitting...';

    const data = new FormData(form);

    // Add _replyto to help Formspree
    const emailField = form.querySelector('input[type="email"]');
    let reply = form.querySelector('input[name="_replyto"]');
    if (!reply) {
      reply = document.createElement('input');
      reply.type = 'hidden';
      reply.name = '_replyto';
      form.appendChild(reply);
    }
    reply.value = emailField ? emailField.value : '';

    function show(msg, color='black') {
      status.style.color = color;
      status.textContent = msg;
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });

      if (res.ok) {
        form.reset();
        show('Submission successful. Redirecting...', 'green');
        const redirect = form.querySelector('input[name="_redirect"]');
        if (redirect && redirect.value) setTimeout(()=>{window.location.href=redirect.value},900);
        return;
      }

      let json=null, txt='';
      try { json = await res.json(); } catch(err){ txt = await res.text().catch(()=>''); }
      if (json && json.errors) show(json.errors.map(e=>e.message).join('; '), 'red');
      else if (json && json.message) show(json.message,'red');
      else if (txt) show(txt,'red');
      else show(`Submission failed (status ${res.status})`,'red');

    } catch(err){
      console.error(err);
      show('Network error. Try again later.','red');
    }
  });
}

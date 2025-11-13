// Meadow Pathways – Formspree integration for all forms
// Handles staff.html, contact.html, and referral.html
// Author: 2025 update – verified working version

async function handleFormSubmission(formId, statusId) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);

  // Skip if not on this page
  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.style.color = "";
    status.textContent = "Submitting...";

    const data = new FormData(form);

    // Helper for quick message display
    const showMessage = (msg, color = "black") => {
      status.style.color = color;
      status.textContent = msg;
    };

    try {
      // Send to Formspree
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      console.log(`[${formId}] Response status:`, response.status);

      if (response.ok) {
        form.reset();
        showMessage("Thank you! Your form has been submitted successfully.", "green");

        // Redirect if _redirect field exists
        const redirect = form.querySelector('input[name="_redirect"]');
        if (redirect && redirect.value) {
          setTimeout(() => (window.location.href = redirect.value), 1000);
        }
        return;
      }

      // Handle any Formspree error response
      const json = await response.json().catch(() => ({}));
      const message =
        json.errors?.map((err) => err.message).join(", ") ||
        json.message ||
        `Error: ${response.status}`;
      showMessage(message, "red");
    } catch (error) {
      console.error(`[${formId}] Network or fetch error:`, error);
      showMessage("Network error. Please try again later.", "red");
    }
  });
}

// Initialize all forms when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  handleFormSubmission("staff-form", "staff-status");
  handleFormSubmission("contact-form", "contact-status");
  handleFormSubmission("referral-form", "referral-status");
});

# MeadowPathways2025

Public website source for Meadow Pathways Wellbeing and Education Cornwall.

This repository contains the site used on GitHub Pages:
https://meadowpathwayscornwall.github.io/MeadowPathways2025/

Purpose
- Present Meadow Pathways services, EOTAS, safeguarding and contact/referral information.
- Provide public policies and resources meant for families, partners and the public.
- Provide a clear request-access flow for staff-only and protected resources.

Important notes
- Protected internal documents and credentials MUST NOT be stored in this public repository.
- Staff-only policies or documents should be stored in a secure location and shared via secure channels.
- The site uses Bootstrap and the Blugoon (Tooplate) base files (provided in repo root). Styling is layered:
  1. `bootstrap.min.css`
  2. `tooplate-style.css`
  3. `style.css` (project overrides — your brand tweaks)

How pages are structured
- Root-level HTML files: `index.html`, `about.html`, `eotas.html`, `safeguarding.html`, `referral.html`, `contact.html`, `staff.html`, `thankyou.html`, etc.
- Publicly downloadable policy files (example names present in repo root): `RSHE 2025.pdf`, `KCSIE 2025.pdf`, `MPWEC Safeguarding and Child Protection Policy Sep 2025.docx`, etc.
- Images are at the repo root and referenced by filename (e.g., `Logo.png`, `BG.png`, `Bake.jpg`, ...).

Forms and contact
- Public forms use Formspree for submissions. Example endpoint in the repo:
  `https://formspree.io/f/movnvzqp`
- The contact and referral forms redirect to `thankyou.html` on successful submission.

Developer / Maintenance
- To run a quick site check locally, open `check-site.html` (or `single-file.html`) in a browser on the site root.
- Ensure filenames are case-sensitive and match exactly on GitHub Pages (example: `thankyou.html` vs `Thankyou.html`).

Privacy and protected data
- Protected or sensitive client records should not be uploaded to this public repo or to GitHub Pages.
- For staff-only resources, follow the request-access flow (see `protected-resources.html` and `staff.html`).

Contacts
- Site owner / lead contact: Michelle Pascoe (contact details are included on the public site pages).

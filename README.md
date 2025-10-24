# Meadow Pathways Wellbeing and Education Cornwall — Website

Overview
-------
This repository contains the static website for Meadow Pathways Wellbeing and Education Cornwall (MPWEC). The site is built with simple, accessible HTML, CSS and JavaScript designed for GitHub Pages or any static host. It presents the organisation, services, safeguarding information, staff resources and forms integrated with Formspree.

Included files
-------------
- `index.html` — Home page with hero, commitment text, carousel and what we offer section.
- `about.html` — About page with team bios, expertise pills and values.
- `eotas.html` — Education Other Than At School offer and sample activities.
- `safeguarding.html` — Safeguarding information and downloadable policies.
- `staff.html` — Staff area with client side password gate and hours logging form.
- `referral.html` — Referral form (submits via Formspree).
- `contact.html` — Contact form (submits via Formspree).
- `thankyou.html` — Thank you and next steps page.
- `style.css` — Site styles and responsive layout.
- `script.js` — Shared JS for nav, carousel and helpers.
- `BG.png`, `Logo.png`, `carousel1.jpg`, `carousel2.jpg`, `carousel3.jpg`, `sg.jpg`, `sg1.png` — Image assets referenced by pages (placeholders must be replaced with real images).
- Policy documents for staff and safeguarding (place in repo root or `docs/` as linked in pages):
  - `MPWEC Curriculum Policy EOTAS September 2025.docx`
  - `MPWEC H&S Policy Sep 25.docx`
  - `MPWEC Lone Working Policy Sep25.docx`
  - `MPWEC Safeguarding and Child Protection Policy Sep 2025.docx`
  - `MPWEC Staff Conduct Policy.docx`
  - `MPWEC Whistleblowing Policy.docx`
  - `MPWEC Behaviour Policy.docx`

Forms and email handling
------------------------
- Forms are configured to submit to Formspree using the endpoint included in the site scripts. Update the `FORMSPREE` variable in each page script to your Formspree endpoint if needed.
- On successful submission forms reset, display an inline thank you and redirect to `thankyou.html`.
- If you prefer server side redirects using Formspree, replace the JS submission with a regular form and include a hidden `_next` field set to `thankyou.html`.

Staff area password
-------------------
- The staff page uses a client side password gate for convenience only. The current password in the page code is `MPWEC!`.
- Client side password protection is not secure against determined access. For stronger protection use server side authentication or a private hosting solution.

Accessibility and content notes
-------------------------------
- Skip links, labels and aria attributes are included for improved accessibility.
- All pages avoid hyphens in visible content as requested.
- Emoji are used sparingly in bios to enhance warmth.
- Test keyboard navigation, tab order and screen reader experience after adding final content.

Deployment
----------
1. Place all files in your repository root or the site folder used by your static host.
2. Ensure image and document filenames match exactly what the pages reference.
3. Push to GitHub and enable GitHub Pages from the repository settings if using GitHub Pages. Alternatively upload to your static host.
4. Test forms by submitting and checking Formspree for incoming messages.
5. Verify downloads for the policy documents and that links to external resources open in a new tab.

Recommended improvements
------------------------
- Move staff area behind proper server side authentication for secure document access.
- Store sensitive documents in a private location and link to public summaries on the site.
- Add compression and responsive sizes for images to improve performance.
- Consider using a small static site generator if you plan to scale content or maintain many pages.
- Add analytics and uptime monitoring if desired.

Contact for updates
-------------------
If you want me to generate or update any page content, adjust form behaviour, or create image assets, say which page and what change and I will provide the full ready to paste code.

License and credits
-------------------
Content created for Meadow Pathways Wellbeing and Education Cornwall. Replace placeholder images with your own photography or licensed images. Icons and emoji used for visual emphasis only.

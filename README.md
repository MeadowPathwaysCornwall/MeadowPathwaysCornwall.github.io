Meadow Pathways Wellbeing and Education Cornwall — Website
Welcome to the Meadow Pathways website repository. This README documents the site structure, required assets, how the theme is implemented, and a verified checklist to confirm everything is working locally or on hosting.

What this repo contains
• 	Static website implementing the bokeh/infographic theme with circular panels, framed images, accessible navigation, a contained carousel reel, and pill-style resource links.
• 	Client-side staff gate for downloadable policy DOCX files.
• 	Referral and Contact forms wired to Formspree with inline success messages and form reset.
Files you should have in the project root:
• 	index.html
• 	about.html
• 	eotas.html
• 	safeguarding.html
• 	staff.html
• 	referral.html
• 	contact.html
• 	style.css
• 	script.js
• 	README.md (this file)
Folders to create and populate:
• 	images/
• 	bgr.png (hero background texture)
• 	sg.jpg
• 	sg1.png
• 	Logo.png (untouched original logo)
• 	policies/
• 	MPWEC Behaviour Policy.docx
• 	MPWEC Safeguarding and Child Protection Policy Sep 2025.docx
• 	MPWEC Staff Conduct Policy.docx
• 	MPWEC Whistleblowing Policy.docx
• 	MPWEC H&S Policy Sep 25 - 1.docx
• 	MPWEC H&S Policy Sep 25 - 2.docx
• 	MPWEC H&S Policy Sep 25 - 3.docx
• 	forms/
• 	empty-referral.pdf (optional downloadable blank referral form)

Key configuration and behaviour
• 	Logo: use your original Logo.png unchanged. Place at repo root or in images/ and update paths in HTML if you move it.
• 	Hero texture: images/bgr.png applied via CSS on the .hero::before pseudo-element at reduced opacity so overlay text remains high contrast.
• 	Carousel: contained inside a framed card, auto-plays, pauses on hover, keyboard arrow navigation supported.
• 	Circular panels: infographic circles are responsive and intended for short headings plus one-line summaries; full content is available in the page body.
• 	Framed safeguarding images: images/sg.jpg and images/sg1.png are displayed inside .image-frame blocks on safeguarding.html.
• 	Staff area: client-side password gate; password is MPWEC! (case-sensitive). After entry the staffContent section reveals downloadable DOCX policies from the policies/ folder. For stronger security use server-side auth or protected storage.
• 	Policies included in staff area (ensure files are uploaded to policies/):
• 	MPWEC Behaviour Policy.docx
• 	MPWEC Safeguarding and Child Protection Policy Sep 2025.docx
• 	MPWEC Staff Conduct Policy.docx
• 	MPWEC Whistleblowing Policy.docx
• 	MPWEC H&S Policy Sep 25 - 1.docx
• 	MPWEC H&S Policy Sep 25 - 2.docx
• 	MPWEC H&S Policy Sep 25 - 3.docx
• 	External guidance pills (staff.html): Keeping Children Safe in Education (Sep 2025) and partner resources (PookyH, Beacon House, NSPCC, CIOS).
• 	Parent/carer resources (safeguarding.html): Cornwall & IOS safeguarding partnership; Childnet; NSPCC; Cornwall Council early help.
• 	Forms: Referral and Contact forms POST to Formspree endpoint: https://formspree.io/f/movnvzqp. script.js handles POST, shows inline thank-you messaging, and resets the form on success.

Contact details (as included on Contact page)
• 	Michelle DSL — 07932 243358 — Michelle.Pascoe@meadowpathwayscornwall.com
• 	Zoe DDSL — 07775 733587 — Zoe.Waitz@meadowpathwayscornwall.com
• 	General — meadowpathwayscornwall@outlook.com

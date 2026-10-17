# Developer Portfolio

A responsive, accessible portfolio built with plain HTML, CSS and JavaScript.

## Features
- Sections for about, education, skills, projects and contact
- Light and dark themes that follow the visitor's system setting and remember their choice
- Mobile navigation menu, and the nav link for the section being read is highlighted
- Skip link, visible keyboard focus and reduced-motion support
- Scroll progress bar and a back-to-top button
- "Details" dialog on each CodeAlpha project card (edit the `PROJECTS` object in `script.js`)
- Message counter on the contact form
- Contact form that checks every field, then opens the visitor's email app (nothing is stored)

## Set up
Open `script.js` and set `CONTACT_EMAIL` at the top. That single value updates the email link and the form.

Optional: put your resume PDF next to `index.html` and set `RESUME_URL = 'resume.pdf'` in `script.js` to show a "Download resume" button.

## Links to other projects
The three CodeAlpha project cards use relative links. After you host the projects as separate repositories, replace them with the live URLs.

## Files
- `index.html` structure and content
- `style.css` design tokens, layout and both themes
- `script.js` theme, menu, section highlight and contact form

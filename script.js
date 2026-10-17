/* ==========================================================================
   Portfolio behaviour
   Change CONTACT_EMAIL once and every email link and the form will use it.
   ========================================================================== */
const CONTACT_EMAIL = 'your.email@example.com';

/* Optional: put a link to your resume PDF here (for example 'resume.pdf' beside index.html).
   The "Download resume" button stays hidden while this is empty. */
const RESUME_URL = '';

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const emailLink = document.getElementById('emailLink');
const defaultNote = formNote.textContent;
const hasRealEmail = !CONTACT_EMAIL.includes('example.com');

/* ----- Footer year and email link ----- */
document.getElementById('year').textContent = new Date().getFullYear();
emailLink.href = `mailto:${CONTACT_EMAIL}`;
emailLink.textContent = hasRealEmail ? CONTACT_EMAIL : 'Add your email in script.js';

/* ----- Resume button and copy-email button ----- */
const resumeLink = document.getElementById('resumeLink');
if (RESUME_URL) { resumeLink.href = RESUME_URL; resumeLink.hidden = false; }

const copyEmail = document.getElementById('copyEmail');
copyEmail.disabled = !hasRealEmail;
copyEmail.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(CONTACT_EMAIL);
    copyEmail.textContent = 'Copied';
  } catch (error) {
    copyEmail.textContent = 'Copy failed';
  }
  setTimeout(() => { copyEmail.textContent = 'Copy'; }, 1800);
});

/* ----- Theme: follows the visitor's system setting until they choose ----- */
function applyTheme(dark) {
  if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
  themeToggle.textContent = dark ? '☀' : '◐';
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
applyTheme(root.getAttribute('data-theme') === 'dark');

themeToggle.addEventListener('click', () => {
  const dark = root.getAttribute('data-theme') !== 'dark';
  applyTheme(dark);
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (error) { /* storage blocked */ }
});

/* ----- Mobile menu ----- */
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuToggle.textContent = open ? '✕' : '☰';
}
menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navLinks.classList.contains('open')) { setMenu(false); menuToggle.focus(); }
});

/* ----- Highlight the nav link for the section being read ----- */
const sectionLinks = [...navLinks.querySelectorAll('a[href^="#"]')];
const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(section => observer.observe(section));
}

/* ----- Scroll progress bar and back-to-top button ----- */
const scrollProgress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
  scrollProgress.style.transform = `scaleX(${ratio})`;
  toTop.hidden = window.scrollY < 700;
}
window.addEventListener('scroll', updateScroll, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ----- Project details dialog (content mirrors each project's README) ----- */
const PROJECTS = {
  gallery: {
    title: 'Interactive Image Gallery (Still)',
    summary: 'A responsive photo gallery for browsing nature, architecture and travel photos.',
    features: [
      'Category filters with live counts, search, sorting and a compact view',
      'Lightbox with arrow keys, swipe, slideshow, zoom and a keyboard focus trap',
      'Favourites saved on the device, plus download and shareable photo links',
      'Loading placeholders and a friendly fallback when a photo fails to load'
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Accessibility'],
    link: '../CodeAlpha_Image_Gallery/index.html'
  },
  calculator: {
    title: 'Bluecalc Calculator',
    summary: 'A calculator that behaves like the one on a phone, with a scientific panel.',
    features: [
      'Chained operations, repeat-equals and phone-style percent',
      'Scientific keys in degrees or radians, with clear error messages',
      'Memory keys, optional thousands separators and a saved history',
      'Full keyboard support, copy result, light and dark themes'
    ],
    tags: ['JavaScript', 'State handling', 'Keyboard input', 'Dark mode'],
    link: '../CodeAlpha_Calculator/index.html'
  },
  portfolio: {
    title: 'Developer Portfolio',
    summary: 'The site you are reading: built with plain HTML, CSS and JavaScript, no framework or build step.',
    features: [
      'Light and dark themes that follow the system setting and remember the choice',
      'Skip link, visible keyboard focus and reduced-motion support',
      'Contact form that validates every field before opening your email app',
      'Nav highlight for the section being read and a scroll progress bar'
    ],
    tags: ['Responsive', 'Accessible', 'UI design'],
    link: '#home'
  }
};

const dialog = document.getElementById('projectDialog');
const dialogTitle = document.getElementById('dialogTitle');
const dialogSummary = document.getElementById('dialogSummary');
const dialogFeatures = document.getElementById('dialogFeatures');
const dialogChips = document.getElementById('dialogChips');
const dialogLink = document.getElementById('dialogLink');

document.querySelectorAll('.details-btn').forEach(button => {
  button.addEventListener('click', () => {
    const project = PROJECTS[button.dataset.project];
    if (!project || typeof dialog.showModal !== 'function') { window.location.href = project ? project.link : '#projects'; return; }
    dialogTitle.textContent = project.title;
    dialogSummary.textContent = project.summary;
    dialogFeatures.replaceChildren(...project.features.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    dialogChips.replaceChildren(...project.tags.map(text => { const span = document.createElement('span'); span.textContent = text; return span; }));
    dialogLink.href = project.link;
    dialog.showModal();
  });
});
document.getElementById('dialogClose').addEventListener('click', () => dialog.close());
dialogLink.addEventListener('click', () => { if (dialogLink.getAttribute('href').startsWith('#')) dialog.close(); });
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }); // click outside closes

/* ----- Message character counter ----- */
const messageField = document.getElementById('message');
const messageCount = document.getElementById('messageCount');
function updateCount() { messageCount.textContent = `${messageField.value.length} / ${messageField.maxLength}`; }
messageField.addEventListener('input', updateCount);
updateCount();

/* ----- Contact form: validates, then opens the visitor's email app ----- */
function setNote(text, isError) {
  formNote.textContent = text;
  formNote.classList.toggle('error', Boolean(isError));
}

contactForm.addEventListener('submit', event => {
  event.preventDefault();
  let firstInvalid = null;

  contactForm.querySelectorAll('input, textarea').forEach(field => {
    const invalid = !field.checkValidity() || !field.value.trim();
    field.setAttribute('aria-invalid', String(invalid));
    if (invalid && !firstInvalid) firstInvalid = field;
  });

  if (firstInvalid) {
    setNote('Please fill in every field with a valid value.', true);
    firstInvalid.focus();
    return;
  }

  if (!hasRealEmail) {
    setNote('The site owner has not added an email address yet. Please use LinkedIn or GitHub instead.', true);
    return;
  }

  const data = new FormData(contactForm);
  const name = String(data.get('name')).trim();
  const email = String(data.get('email')).trim();
  const message = String(data.get('message')).trim();
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nReply email: ${email}\n\n${message}`);

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  setNote('Your email app should open with the message ready to send.', false);
});

contactForm.addEventListener('input', () => {
  if (formNote.classList.contains('error')) setNote(defaultNote, false);
});

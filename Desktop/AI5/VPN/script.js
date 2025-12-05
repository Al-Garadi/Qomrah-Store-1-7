const navLinks = document.querySelectorAll('.footer__links a');
const sections = [...document.querySelectorAll('main section')];
const tocList = document.getElementById('tocList');
const themeToggle = document.getElementById('themeToggle');

const setActive = (id) => {
  // update footer nav
  navLinks.forEach((link) => {
    if (link.getAttribute('href') === `#${id}`) link.classList.add('active'); else link.classList.remove('active');
  });
  // update TOC anchor state
  document.querySelectorAll('#tocList a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  },
  { rootMargin: '-40% 0px -40% 0px' }
);

sections.forEach((section) => {
  if (section.id) {
    observer.observe(section);
  }
});

// Build a small Table of Contents for quick navigation (desktop)
function buildTOC() {
  if (!tocList) return;
  tocList.innerHTML = '';
  const headings = sections.filter(s => s.id).map(s => {
    const heading = s.querySelector('h2, h3, h1');
    return { id: s.id, text: heading ? heading.textContent.trim() : s.id };
  });

  headings.forEach(h => {
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.text.length > 40 ? h.text.slice(0,40) + '…' : h.text;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(h.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${h.id}`);
    });
    tocList.appendChild(a);
  });
}

buildTOC();

// Smooth-scroll for all internal anchors (footer links or others)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', href);
    }
  });
});

// Theme toggle (light/dark) stored in localStorage
function applyTheme(theme) {
  if (theme === 'light') {
    document.body.setAttribute('data-theme', 'light');
    if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    document.body.removeAttribute('data-theme');
    if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
  }
}

const saved = localStorage.getItem('site-theme');
if (saved) applyTheme(saved);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const active = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(active === 'light' ? 'light' : null);
    localStorage.setItem('site-theme', active === 'light' ? 'light' : 'dark');
  });
}

// Keep TOC and footer nav in sync with the active section
const setActiveOnAll = (id) => {
  // footer nav
  navLinks.forEach((link) => {
    if (link.getAttribute('href') === `#${id}`) link.classList.add('active'); else link.classList.remove('active');
  });
  // TOC nav
  document.querySelectorAll('#tocList a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
};

// setActive already handles footer nav + TOC, keep a globally available helper
window.setActive = setActive;

// Contact form handling (POST to /api/contact)
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactStatus.textContent = 'Please complete required fields.';
      return;
    }

    contactStatus.textContent = 'Sending…';

    const body = {
      name: contactForm.name.value.trim(),
      email: contactForm.email.value.trim(),
      message: contactForm.message.value.trim()
    };

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!resp.ok) throw new Error('Server error');
      const json = await resp.json();
      contactStatus.textContent = json?.message || 'Message sent — thank you!';
      contactForm.reset();
    } catch (err) {
      contactStatus.textContent = 'Sorry — something went wrong. Try again later.';
      console.error(err);
    }
  });
}

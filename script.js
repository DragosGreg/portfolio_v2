// Combined scroll handler
const navbar     = document.getElementById('navbar');
const backToTop  = document.getElementById('backToTop');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sections   = [...navAnchors].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  navbar.classList.toggle('scrolled', y > 40);
  backToTop.classList.toggle('visible', y > 400);

  let current = '';
  sections.forEach(s => { if (s.getBoundingClientRect().top <= 100) current = s.id; });
  navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}, { passive: true });

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// Typewriter
const roles = ['Software Engineer', 'IT Engineer', 'Web Developer', 'Python Developer'];
let ri = 0, ci = 0, deleting = false;
const roleEl = document.getElementById('roleText');

function type() {
  const word = roles[ri];
  if (deleting) {
    roleEl.textContent = word.slice(0, --ci);
  } else {
    roleEl.textContent = word.slice(0, ++ci);
  }

  if (!deleting && ci === word.length) {
    setTimeout(() => { deleting = true; }, 2000);
  } else if (deleting && ci === 0) {
    deleting = false;
    ri = (ri + 1) % roles.length;
  }

  setTimeout(type, deleting ? 55 : 95);
}
setTimeout(type, 1400);

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Back to top
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Theme toggle
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  if (document.documentElement.getAttribute('data-theme') === 'light') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// Contact form — opens default mail client
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const data   = new FormData(e.target);
  const name   = data.get('name');
  const email  = data.get('email');
  const msg    = data.get('message');
  const body   = `Name: ${name}\nEmail: ${email}\n\n${msg}`;
  const mailto = `mailto:dragos.grigorie.m@gmail.com?subject=Portfolio%20message%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  document.getElementById('formNote').textContent = 'Opening your mail client…';
  e.target.reset();
});

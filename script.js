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
const roles = ['Software Engineer', 'IT Engineer', 'Cloud Engineer', 'DevOps Engineer', 'Web Developer'];
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

// Space background
(function () {
  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const STAR_COUNT = 220;
  const FOCAL      = 520;
  const SPEED      = 3.2;

  function mkStar() {
    return {
      x:  (Math.random() - 0.5) * 2600,
      y:  (Math.random() - 0.5) * 2600,
      z:  100 + Math.random() * 900,
      pz: 100 + Math.random() * 900
    };
  }

  const stars = Array.from({ length: STAR_COUNT }, () => {
    const s = mkStar();
    s.pz = s.z;
    return s;
  });

  const meteors    = [];
  let   nextMeteor = performance.now() + 1500 + Math.random() * 2000;

  function spawnMeteor() {
    const spd = 9 + Math.random() * 7;
    const ang = 0.45 + Math.random() * 0.35;
    meteors.push({
      x:       Math.random() * W,
      y:       -30 - Math.random() * 80,
      vx:      Math.cos(ang) * spd,
      vy:      Math.sin(ang) * spd,
      alpha:   0,
      maxA:    0.65 + Math.random() * 0.3,
      len:     85 + Math.random() * 110,
      phase:   'in',
      hold:    0,
    });
  }

  function draw(now) {
    requestAnimationFrame(draw);

    if (document.documentElement.getAttribute('data-theme') === 'light') {
      ctx.clearRect(0, 0, W, H);
      return;
    }

    ctx.fillStyle = 'rgba(13,17,23,0.20)';
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.pz = s.z;
      s.z -= SPEED;

      if (s.z <= 1) { Object.assign(s, mkStar()); s.z = s.pz = 900 + Math.random() * 100; continue; }

      const sx = (s.x / s.z) * FOCAL + cx;
      const sy = (s.y / s.z) * FOCAL + cy;

      if (sx < -8 || sx > W + 8 || sy < -8 || sy > H + 8) {
        Object.assign(s, mkStar()); s.z = s.pz = 900 + Math.random() * 100; continue;
      }

      const px = (s.x / s.pz) * FOCAL + cx;
      const py = (s.y / s.pz) * FOCAL + cy;

      const t     = Math.max(0, 1 - s.z / 1000);
      const alpha = Math.min(1, t * 1.4);
      const lw    = Math.max(0.4, t * 2.1);

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = `rgba(200,220,255,${alpha})`;
      ctx.lineWidth   = lw;
      ctx.stroke();
    }

    if (now >= nextMeteor) {
      spawnMeteor();
      nextMeteor = now + 2500 + Math.random() * 6000;
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;

      if (m.phase === 'in') {
        m.alpha += 0.06;
        if (m.alpha >= m.maxA) { m.alpha = m.maxA; m.phase = 'hold'; }
      } else if (m.phase === 'hold') {
        m.hold++;
        if (m.hold > 35) m.phase = 'out';
      } else {
        m.alpha -= 0.011;
      }

      if (m.alpha <= 0 || m.x > W + 80 || m.y > H + 80) { meteors.splice(i, 1); continue; }

      const a  = Math.atan2(m.vy, m.vx);
      const tx = m.x - Math.cos(a) * m.len;
      const ty = m.y - Math.sin(a) * m.len;

      const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
      g.addColorStop(0,   `rgba(240,250,255,${m.alpha})`);
      g.addColorStop(0.35, `rgba(190,215,255,${m.alpha * 0.55})`);
      g.addColorStop(1,   'rgba(160,195,255,0)');

      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = g;
      ctx.lineWidth   = 1.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${m.alpha})`;
      ctx.fill();
    }
  }

  requestAnimationFrame(draw);
})();

// Clickable project cards
document.querySelectorAll('.project-card').forEach(card => {
  const link = card.querySelector('.project-link-icon');
  if (!link) return;
  card.addEventListener('click', e => {
    if (e.target.closest('.project-link-icon')) return;
    window.open(link.href, '_blank', 'noopener');
  });
});

// Contact form — Web3Forms
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();

  const btn  = document.getElementById('submitBtn');
  const note = document.getElementById('formNote');

  btn.disabled    = true;
  btn.textContent = 'Sending…';
  note.textContent = '';
  note.style.color = '';

  try {
    const res  = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body:   new FormData(e.target)
    });
    const data = await res.json();

    if (data.success) {
      note.textContent = 'Message sent! I will get back to you soon.';
      note.style.color = '#3fb950';
      e.target.reset();
    } else {
      throw new Error(data.message);
    }
  } catch {
    note.textContent = 'Something went wrong. Please try emailing me directly.';
    note.style.color = '#f85149';
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Send Message';
  }
});

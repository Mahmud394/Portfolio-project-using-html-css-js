/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO SCRIPT — Interactions, Animations & Effects
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    // Kick off hero animations after loader hides
    document.querySelectorAll('#hero .reveal-left, #hero .reveal-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 150);
    });
  }, 1400);
});

/* ─── 2. CANVAS PARTICLE BACKGROUND ─── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], connections = [];
  const PARTICLE_COUNT = 60;
  const CONNECTION_DIST = 160;
  const MOUSE = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => { MOUSE.x = e.clientX; MOUSE.y = e.clientY; });

  resize();
  initParticles();
  animate();
})();

/* ─── 3. CUSTOM CURSOR: Removed — using default OS cursor ─── */



/* ─── 4. SCROLL PROGRESS BAR ─── */
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.getElementById('scroll-progress').style.width = pct + '%';
});

/* ─── 5. STICKY NAVBAR + ACTIVE LINK ─── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Sticky
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) link.classList.add('active');
    });

    // Back to top
    const btt = document.getElementById('back-to-top');
    if (window.scrollY > 400) btt.classList.add('visible');
    else btt.classList.remove('visible');
  });

  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const navLinksEl = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
  // Close on link click
  navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });
})();

/* ─── 6. BACK TO TOP ─── */
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── 7. TYPING EFFECT ─── */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const strings = [
    'Software Engineer',
    'Full Stack Developer',
    'Backend Developer',
    'System Designer',
    'Problem Solver'
  ];
  let si = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 80;
  const SPEED_DELETE = 40;
  const PAUSE = 1800;

  function type() {
    const current = strings[si];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) {
        deleting = true;
        setTimeout(type, PAUSE);
        return;
      }
      setTimeout(type, SPEED_TYPE);
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        si = (si + 1) % strings.length;
      }
      setTimeout(type, SPEED_DELETE);
    }
  }
  // Start after loader
  setTimeout(type, 1600);
})();

/* ─── 8. SCROLL REVEAL (IntersectionObserver) ─── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('revealed'), delay);
        observer.unobserve(el);

        // Skill bars
        el.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  // Add stagger delays to grid items
  const staggerGroups = [
    '.projects-grid .project-card',
    '.services-grid .service-card',
    '.skills-grid .skill-card',
    '.stats-grid .stat-item',
    '.timeline-item'
  ];
  staggerGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.dataset.delay = i * 100;
    });
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    // Skip hero (handled by loader)
    if (!el.closest('#hero')) observer.observe(el);
  });
})();

/* ─── 9. ANIMATED STAT COUNTERS ─── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ─── 10. CONTACT FORM ─── */
(function initForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      status.textContent = '⚠ Please fill in all fields.';
      status.className = 'form-status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = '⚠ Please enter a valid email address.';
      status.className = 'form-status error';
      return;
    }

    // Simulate sending (replace with actual endpoint)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Sending...';
    status.textContent = '';

    await new Promise(r => setTimeout(r, 1500));

    status.textContent = '✓ Message sent! I\'ll get back to you soon.';
    status.className = 'form-status success';
    form.reset();
    btn.disabled = false;
    btn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message';

    setTimeout(() => { status.textContent = ''; }, 5000);
  });
})();

/* ─── 11. SMOOTH SCROLL for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
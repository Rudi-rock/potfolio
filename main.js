/* ═══════════════════════════════════════════════════════
   GTA VI — VICE CITY PORTFOLIO
   Main JavaScript — Interactions & Animations
   ═══════════════════════════════════════════════════════ */

// ── Loading Screen ─────────────────────────────────────
(function initLoader() {
  const loader = document.getElementById('loading-screen');
  const fill = document.getElementById('loader-fill');
  const nav = document.getElementById('main-nav');
  let progress = 0;

  document.body.style.overflow = 'hidden';

  const interval = setInterval(() => {
    progress += Math.random() * 8 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        nav.classList.add('visible');
        initScrollAnimations();
      }, 600);
    }
    fill.style.width = progress + '%';
  }, 120);
})();

// ── Typewriter Effect ──────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typed-text');
  const phrases = [
    'BUILDING SOFTWARE // SOLVING PROBLEMS',
    'BLOCKCHAIN // AI RESEARCH',
    'CSE CORE // BLACK BELT',
    'WELCOME TO VICE CITY'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let delay = 3800; // wait for loading screen

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 60 + Math.random() * 40);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 30);
    }
  }

  setTimeout(type, delay);
})();

// ── Neon Particle Canvas ───────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#ff2d7b', '#00f0ff', '#b724ff', '#00ff88', '#ff6b35'];
  const particles = [];
  const PARTICLE_COUNT = 60;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2.5 + 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.15;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.01 + Math.random() * 0.02;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      const a = this.alpha * (0.6 + 0.4 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = a;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = a * 0.15;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Draw connecting lines between nearby particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = (1 - dist / 150) * 0.08;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── Scroll Animations ──────────────────────────────────
function initScrollAnimations() {
  // Elements to animate on scroll
  const animTargets = [
    ...document.querySelectorAll('.wanted-card'),
    ...document.querySelectorAll('.mission-card'),
    ...document.querySelectorAll('.stat-group'),
    ...document.querySelectorAll('.radio-card'),
    ...document.querySelectorAll('.section-header'),
  ];

  animTargets.forEach(el => el.classList.add('anim-hidden'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        // Don't unobserve — keep the glow
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  animTargets.forEach(el => observer.observe(el));

  // ── Skill Bars ───
  const bars = document.querySelectorAll('.stat-bar');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const pct = bar.dataset.percent;
        const color = bar.dataset.color;
        const fill = bar.querySelector('.bar-fill');
        fill.style.width = pct + '%';
        fill.style.background = `linear-gradient(90deg, ${color}, ${color})`;
        fill.style.color = color;
        fill.style.boxShadow = `0 0 12px ${color}, 0 0 24px ${color}40`;
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => barObserver.observe(b));
}

// ── Active Nav Link on Scroll ──────────────────────────
(function initNavHighlight() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');
  const nav = document.getElementById('main-nav');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Nav background on scroll
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Highlight active section
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) link.classList.add('active');
    });
  });
})();

// ── Smooth Scroll for Anchors ──────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        document.querySelector('.nav-links')?.classList.remove('mobile-open');
        document.getElementById('nav-hamburger')?.classList.remove('open');
      }
    });
  });
})();

// ── Mobile Hamburger Menu ──────────────────────────────
(function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });
})();

// ── Parallax subtle effect on hero ─────────────────────
(function initParallax() {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      hero.style.transform = `translateY(${scrollY * 0.25}px)`;
      hero.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
    }
  });
})();

// ── Mouse glow effect on mission cards ─────────────────
(function initCardGlow() {
  document.querySelectorAll('.mission-card, .radio-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--glow-x', x + 'px');
      card.style.setProperty('--glow-y', y + 'px');

      const glow = card.querySelector('.mission-hover-glow, .radio-static');
      if (glow && glow.classList.contains('mission-hover-glow')) {
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
        glow.style.transform = 'translate(-50%, -50%)';
      }
    });
  });
})();

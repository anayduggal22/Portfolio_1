// ============================================
// anay.duggal — shared behaviour
// ============================================

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- cursor glow ---------- */
(function cursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || !fineHover) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;
  let started = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!started) {
      glowX = mouseX;
      glowY = mouseY;
      started = true;
      glow.classList.add('active');
    }
  });

  document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  document.addEventListener('mouseenter', () => { if (started) glow.classList.add('active'); });

  function tick() {
    const ease = reduceMotion ? 1 : 0.12;
    glowX += (mouseX - glowX) * ease;
    glowY += (mouseY - glowY) * ease;
    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ---------- theme toggle ---------- */
function toggleTheme() {
  document.body.classList.toggle('light');
  const btn = document.getElementById('themeBtn');
  if (btn) btn.innerHTML = document.body.classList.contains('light') ? '🐱' : '😼';
}

/* ---------- nav active link ---------- */
(function navActive() {
  const page = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('nav a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('current');
  });
})();

/* ---------- scroll reveal ---------- */
(function revealOnScroll() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  if (reduceMotion) { targets.forEach((t) => t.classList.add('in')); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((t) => io.observe(t));
})();

/* ---------- animated counters ---------- */
(function counters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  function animate(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }

    const duration = 1100;
    const start = performance.now();

    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  nums.forEach((n) => io.observe(n));
})();

/* ---------- skills page: auto-count total skills ---------- */
(function skillTotal() {
  const counterEl = document.getElementById('skills-total-count');
  if (!counterEl) return;
  const total = document.querySelectorAll('.skill').length;
  counterEl.dataset.count = total;
  document.querySelectorAll('.skill-group').forEach((group) => {
    const countEl = group.querySelector('.skill-group-count');
    if (countEl) countEl.textContent = group.querySelectorAll('.skill').length + ' things';
  });
})();

/* ---------- hero photo tilt ---------- */
(function heroTilt() {
  const wrap = document.querySelector('.hero-photo-wrap');
  const photo = document.querySelector('.hero-photo');
  if (!wrap || !photo || !fineHover || reduceMotion) return;

  wrap.addEventListener('mousemove', (e) => {
    const rect = photo.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    photo.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
  });

  wrap.addEventListener('mouseleave', () => {
    photo.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
})();

/* ---------- project filters ---------- */
(function projectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const tags = (card.dataset.tags || '').split(' ');
        const show = filter === 'all' || tags.includes(filter);
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();

/* ---------- cat footer ---------- */
(function catFooter() {
  const el = document.getElementById('cat-text');
  if (!el) return;
  const catMessages = [
    'meow.exe running...',
    'cat detected near keyboard 🐾',
    'debugging with emotional support cat',
    'leetcode + coffee + cat energy',
    'the cat approves this portfolio',
    'currently training a model and a cat',
  ];
  setInterval(() => {
    el.innerHTML = catMessages[Math.floor(Math.random() * catMessages.length)];
  }, 4000);
})();

/* ═══════════════════════════════════════════════════
   DUJIANGYAN PRESENTATION — ENGINE
   Particles · Navigation · Scroll Reset
   ═══════════════════════════════════════════════════ */

// ── Particle Canvas ──
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const COUNT = 90;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.15 - 0.1,
        o: Math.random() * 0.35 + 0.05
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,168,78,${p.o})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
    }

    // Draw faint connections for nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200,168,78,${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  draw();
})();

// ── Cinematic Intro ──
(function initIntro() {
  const overlay = document.getElementById('introOverlay');
  const skipBtn = document.getElementById('introSkip');
  if (!overlay) return;

  let dismissed = false;

  function dismissIntro() {
    if (dismissed) return;
    dismissed = true;
    // Phase 1: blur + fade out (1.2s CSS transition)
    overlay.classList.add('outro');
    // Phase 2: fully remove after transition ends
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 1400);
  }

  // Auto-dismiss after one full slideshow cycle (16s) + some breathing room
  setTimeout(dismissIntro, 14000);

  // Manual skip
  skipBtn.addEventListener('click', dismissIntro);

  // Also skip on any key press
  document.addEventListener('keydown', function introKey(e) {
    if (!dismissed) {
      dismissIntro();
      // Don't remove listener — let the regular nav handler pick up subsequent keys
    }
  }, { once: true });
})();

// ── Slide Navigation ──
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const counter = document.getElementById('counter');
const progressFill = document.getElementById('progressFill');
let current = 0;

function renderSlide(index) {
  // Reset scroll on the departing slide
  slides[current].scrollTop = 0;

  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  current = index;

  counter.textContent = `${current + 1} / ${slides.length}`;
  progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
}

function goNext() { if (current < slides.length - 1) renderSlide(current + 1); }
function goPrev() { if (current > 0) renderSlide(current - 1); }

prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goNext(); }
  if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   { e.preventDefault(); goPrev(); }
  if (e.key === ' ') {
    // Space scrolls the current slide if it has overflow; otherwise go next
    const el = slides[current];
    if (el.scrollHeight <= el.clientHeight + 2) { e.preventDefault(); goNext(); }
  }
  if (e.key === 'Home') { e.preventDefault(); renderSlide(0); }
  if (e.key === 'End')  { e.preventDefault(); renderSlide(slides.length - 1); }
});

// Initial render
renderSlide(0);

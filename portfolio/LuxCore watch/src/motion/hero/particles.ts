import { HERO_CONFIG } from './config';

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.innerWidth <= HERO_CONFIG.mobileMax;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  life: number;
  depth: number;
};

/**
 * Lightweight canvas gold dust — few particles, paused off-screen / hidden tab.
 */
export const initHeroParticles = (root: HTMLElement): (() => void) => {
  if (prefersReduced()) return () => {};

  const canvas = root.querySelector<HTMLCanvasElement>('[data-layer="particles"]');
  if (!canvas) return () => {};

  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let w = 0;
  let h = 0;
  let raf = 0;
  let running = true;
  let inView = true;
  let mx = 0;
  let my = 0;
  const count = isMobile() ? HERO_CONFIG.particleCountMobile : HERO_CONFIG.particleCount;
  const particles: Particle[] = [];

  const resize = () => {
    const b = root.getBoundingClientRect();
    w = b.width;
    h = b.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const spawn = (): Particle => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -0.15 - Math.random() * 0.35,
    r: 0.6 + Math.random() * 1.8,
    a: 0.15 + Math.random() * 0.45,
    life: Math.random(),
    depth: Math.random(),
  });

  const boot = () => {
    resize();
    particles.length = 0;
    for (let i = 0; i < count; i += 1) particles.push(spawn());
  };

  const onMove = (e: PointerEvent) => {
    const b = root.getBoundingClientRect();
    mx = (e.clientX - b.left) / b.width - 0.5;
    my = (e.clientY - b.top) / b.height - 0.5;
  };

  const draw = () => {
    if (!running) return;
    if (!inView || document.hidden) {
      raf = requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, w, h);
    const hoverSlow = root.classList.contains('is-watch-hover') ? 0.55 : 1;

    for (const p of particles) {
      p.x += (p.vx + mx * 0.4 * p.depth) * hoverSlow;
      p.y += (p.vy + my * 0.15 * p.depth) * hoverSlow;
      p.life += 0.004;
      if (p.y < -10 || p.x < -20 || p.x > w + 20 || p.life > 1) {
        Object.assign(p, spawn(), { y: h + 10, life: Math.random() });
      }

      const alpha = p.a * (0.5 + 0.5 * Math.sin(p.life * Math.PI));
      ctx.beginPath();
      ctx.fillStyle = `rgba(226, 173, 104, ${alpha.toFixed(3)})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry?.isIntersecting ?? false;
    },
    { threshold: 0.05 },
  );
  io.observe(root);

  boot();
  root.addEventListener('pointermove', onMove);
  window.addEventListener('resize', resize);
  raf = requestAnimationFrame(draw);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', onMove);
    window.removeEventListener('resize', resize);
    io.disconnect();
  };
};

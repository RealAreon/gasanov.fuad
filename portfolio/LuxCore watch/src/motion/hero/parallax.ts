import gsap from 'gsap';
import { HERO_CONFIG, LAYER_AMPLITUDE } from './config';

type LayerState = {
  el: HTMLElement;
  layer: string;
  ampX: number;
  ampY: number;
  invert: boolean;
  curX: number;
  curY: number;
  baseTransform: string;
};

const isTouch = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;
const isMobile = () => window.innerWidth <= HERO_CONFIG.mobileMax;
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Multi-layer mouse parallax with lerp + gsap.quickTo-style smoothing via rAF.
 * Pauses when hero leaves viewport or tab is hidden.
 */
export const initHeroParallax = (root: HTMLElement): (() => void) => {
  if (prefersReduced() || isTouch() || isMobile()) return () => {};

  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-layer]'));
  const layers: LayerState[] = [];

  for (const el of nodes) {
    const layer = el.dataset.layer || '';
    const amp = LAYER_AMPLITUDE[layer];
    if (!amp) continue;
    layers.push({
      el,
      layer,
      ampX: amp.x * HERO_CONFIG.parallaxStrength,
      ampY: amp.y * HERO_CONFIG.parallaxStrength,
      invert: Boolean(amp.invert),
      curX: 0,
      curY: 0,
      baseTransform: '',
    });
  }

  let px = 0;
  let py = 0;
  let targetX = 0;
  let targetY = 0;
  let raf = 0;
  let running = true;
  let inView = true;

  const onMove = (e: PointerEvent) => {
    if (!inView) return;
    const b = root.getBoundingClientRect();
    targetX = (e.clientX - b.left) / b.width - 0.5;
    targetY = (e.clientY - b.top) / b.height - 0.5;
  };

  const onLeave = () => {
    targetX = 0;
    targetY = 0;
  };

  const tick = () => {
    if (!running) return;

    // Inertia toward pointer
    px += (targetX - px) * 0.065;
    py += (targetY - py) * 0.065;

    for (const layer of layers) {
      const dir = layer.invert ? -1 : 1;
      const destX = px * layer.ampX * dir;
      const destY = py * layer.ampY * dir;
      layer.curX += (destX - layer.curX) * 0.08;
      layer.curY += (destY - layer.curY) * 0.08;

      // Preserve float animations by writing CSS vars consumed in SCSS
      layer.el.style.setProperty('--px', `${layer.curX.toFixed(2)}px`);
      layer.el.style.setProperty('--py', `${layer.curY.toFixed(2)}px`);
    }

    raf = requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry?.isIntersecting ?? false;
      if (!inView) {
        targetX = 0;
        targetY = 0;
      }
    },
    { threshold: 0.05 },
  );
  io.observe(root);

  const onVis = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else if (running) {
      raf = requestAnimationFrame(tick);
    }
  };

  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerleave', onLeave);
  document.addEventListener('visibilitychange', onVis);
  raf = requestAnimationFrame(tick);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerleave', onLeave);
    document.removeEventListener('visibilitychange', onVis);
    io.disconnect();
    for (const layer of layers) {
      layer.el.style.removeProperty('--px');
      layer.el.style.removeProperty('--py');
    }
  };
};

/**
 * Watch hover intensify + slight rock push-away via CSS vars on root.
 */
export const initWatchHover = (root: HTMLElement): (() => void) => {
  if (prefersReduced() || isTouch()) return () => {};

  const wrap = root.querySelector<HTMLElement>('.hero__watch-wrap');
  if (!wrap) return () => {};

  const onEnter = () => {
    root.classList.add('is-watch-hover');
    gsap.to(wrap, {
      scale: 1.025,
      duration: 0.55,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const onLeave = () => {
    root.classList.remove('is-watch-hover');
    gsap.to(wrap, { scale: 1, duration: 0.65, ease: 'power2.out', overwrite: 'auto' });
  };

  const watchLayer = root.querySelector<HTMLElement>('[data-layer="watch"]');
  if (!watchLayer) return () => {};

  watchLayer.addEventListener('pointerenter', onEnter);
  watchLayer.addEventListener('pointerleave', onLeave);

  return () => {
    watchLayer.removeEventListener('pointerenter', onEnter);
    watchLayer.removeEventListener('pointerleave', onLeave);
    root.classList.remove('is-watch-hover');
  };
};

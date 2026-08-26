interface ParallaxTarget {
  el: HTMLElement;
  strength: number;
  x: number;
  y: number;
}

const PREFERS_REDUCED = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Single rAF loop that lerps [data-parallax] elements toward the pointer
 * position, scoped to one container so each section can opt in independently.
 */
export const initMouseParallax = (container: HTMLElement): (() => void) => {
  if (PREFERS_REDUCED()) return () => {};

  const nodes = Array.from(container.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (nodes.length === 0) return () => {};

  const targets: ParallaxTarget[] = nodes.map((el) => ({
    el,
    strength: Number(el.dataset.parallax) || 20,
    x: 0,
    y: 0,
  }));

  let pointerX = 0;
  let pointerY = 0;
  let rafId = 0;
  let active = true;

  const handlePointerMove = (event: PointerEvent) => {
    const bounds = container.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
  };

  const tick = () => {
    if (!active) return;

    for (const target of targets) {
      const destX = pointerX * target.strength;
      const destY = pointerY * target.strength;
      target.x += (destX - target.x) * 0.06;
      target.y += (destY - target.y) * 0.06;
      target.el.style.transform = `translate3d(${target.x.toFixed(2)}px, ${target.y.toFixed(2)}px, 0)`;
    }

    rafId = requestAnimationFrame(tick);
  };

  container.addEventListener('pointermove', handlePointerMove);
  rafId = requestAnimationFrame(tick);

  return () => {
    active = false;
    cancelAnimationFrame(rafId);
    container.removeEventListener('pointermove', handlePointerMove);
    for (const target of targets) {
      target.el.style.transform = '';
    }
  };
};

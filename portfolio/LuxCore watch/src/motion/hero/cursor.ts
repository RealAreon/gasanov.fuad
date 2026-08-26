import gsap from 'gsap';
import { HERO_CONFIG } from './config';

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Custom cursor only inside hero, desktop pointer devices.
 * Expands on CTA / watch; label EXPLORE over watch.
 */
export const initHeroCursor = (root: HTMLElement): (() => void) => {
  if (prefersReduced() || !isFinePointer() || window.innerWidth <= HERO_CONFIG.mobileMax) {
    return () => {};
  }

  const cursor = root.querySelector<HTMLElement>('.hero__cursor');
  const label = root.querySelector<HTMLElement>('.hero__cursor-label');
  if (!cursor) return () => {};

  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

  let visible = false;

  const show = () => {
    if (visible) return;
    visible = true;
    root.classList.add('has-custom-cursor');
    gsap.to(cursor, { autoAlpha: 1, scale: 1, duration: 0.25 });
  };

  const hide = () => {
    visible = false;
    root.classList.remove('has-custom-cursor');
    gsap.to(cursor, { autoAlpha: 0, scale: 0.6, duration: 0.2 });
  };

  const onMove = (e: PointerEvent) => {
    show();
    xTo(e.clientX);
    yTo(e.clientY);
  };

  const onOver = (e: PointerEvent) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    if (t.closest('[data-layer="watch"]')) {
      cursor.classList.add('is-explore');
      if (label) label.textContent = 'EXPLORE';
    } else if (t.closest('button, a')) {
      cursor.classList.add('is-expand');
      cursor.classList.remove('is-explore');
    } else {
      cursor.classList.remove('is-expand', 'is-explore');
    }
  };

  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerover', onOver);
  root.addEventListener('pointerleave', hide);

  gsap.set(cursor, { autoAlpha: 0, x: -100, y: -100 });

  return () => {
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerover', onOver);
    root.removeEventListener('pointerleave', hide);
    root.classList.remove('has-custom-cursor');
  };
};

import gsap from 'gsap';
import { HERO_CONFIG } from './config';

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealAll = (root: HTMLElement) => {
  root.classList.add('is-hero-ready');
  gsap.set(root.querySelectorAll('[data-layer]'), { clearProps: 'opacity,transform,filter,scale,y,x,autoAlpha' });
  gsap.set(root.querySelectorAll('[data-hero-title] span, [data-hero-eyebrow], [data-hero-copy], [data-hero-cta], [data-hero-side], [data-hero-stat], [data-hero-bottom]'), {
    clearProps: 'all',
    opacity: 1,
    autoAlpha: 1,
    y: 0,
    yPercent: 0,
  });
};

/** Fast intro — watch and UI visible within ~1s. No long black hold. */
export const initHeroIntro = (root: HTMLElement): gsap.core.Timeline => {
  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: () => revealAll(root),
  });

  if (prefersReduced()) {
    revealAll(root);
    return tl;
  }

  const q = (sel: string) => root.querySelectorAll(sel);
  const watch = root.querySelector('[data-layer="watch"]');

  // Subtle from-state only on key layers — rest stay visible via CSS
  gsap.set(q('[data-layer="background"]'), { opacity: 0.4 });
  gsap.set(watch, { opacity: 0, y: 24, scale: 0.94 });
  gsap.set(q('[data-hero-title] span'), { yPercent: 100, opacity: 0 });
  gsap.set(q('[data-hero-eyebrow], [data-hero-copy], [data-hero-cta]'), { autoAlpha: 0, y: 12 });

  const d = HERO_CONFIG.introDuration;

  tl.to(q('[data-layer="background"]'), { opacity: 1, duration: d * 0.5 }, 0)
    .to(watch, { opacity: 1, y: 0, scale: 1, duration: d * 0.55, ease: 'power3.out' }, 0.08)
    .to(
      q('[data-hero-title] span'),
      { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.04, ease: 'power3.out' },
      0.2,
    )
    .to(q('[data-hero-eyebrow]'), { autoAlpha: 1, y: 0, duration: 0.35 }, 0.35)
    .to(q('[data-hero-copy]'), { autoAlpha: 1, y: 0, duration: 0.35 }, 0.42)
    .to(q('[data-hero-cta]'), { autoAlpha: 1, y: 0, duration: 0.35 }, 0.48)
    .to(q('[data-hero-side], [data-hero-stat], [data-hero-bottom]'), { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.04 }, 0.5);

  return tl;
};

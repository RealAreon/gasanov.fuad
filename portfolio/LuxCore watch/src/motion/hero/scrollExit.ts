import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_CONFIG } from './config';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.innerWidth <= HERO_CONFIG.mobileMax;

/**
 * Cinematic exit of hero only — does not animate the next section.
 * Soft pin + scrub; disabled on mobile / reduced motion.
 */
export const initHeroScrollExit = (root: HTMLElement): (() => void) => {
  if (prefersReduced() || isMobile()) return () => {};

  const media = root.querySelector('.hero__media');
  const ui = root.querySelectorAll(
    '.hero__layout, .hero__bottom, [data-layer="interface"]',
  );
  const watch = root.querySelector('[data-layer="watch"]');
  const bg = root.querySelector('[data-layer="background"]');
  const left = root.querySelector('[data-layer="left-ruins"]');
  const right = root.querySelector('[data-layer="right-ruins"]');
  const rocksBack = root.querySelectorAll('[data-layer="rocks-back"], .hero__rock--back');
  const rocksFront = root.querySelectorAll('[data-layer="rocks-front"], .hero__rock--front');
  const fog = root.querySelector('[data-layer="fog"]');
  const ring = root.querySelector('[data-layer="planet"]');

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: `+=${HERO_CONFIG.scrollExitDistance}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    tl.to(ui, { autoAlpha: 0, y: -30, duration: 0.45, ease: 'none' }, 0)
      .to(
        watch,
        { scale: 1.18, y: -80, filter: 'blur(2px)', duration: 1, ease: 'none' },
        0,
      )
      .to(bg, { scale: 1.12, y: 40, duration: 1, ease: 'none' }, 0)
      .to(left, { x: -80, opacity: 0.35, duration: 1, ease: 'none' }, 0.05)
      .to(right, { x: 80, opacity: 0.35, duration: 1, ease: 'none' }, 0.05)
      .to(rocksBack, { y: -120, opacity: 0, duration: 0.9, ease: 'none' }, 0.1)
      .to(
        rocksFront,
        { scale: 1.35, y: 60, opacity: 0, duration: 0.95, ease: 'none' },
        0.15,
      )
      .to(fog, { y: -100, scale: 1.2, opacity: 1, duration: 0.85, ease: 'none' }, 0.2)
      .to(ring, { scale: 1.25, opacity: 0.2, duration: 1, ease: 'none' }, 0.1)
      .to(media, { opacity: 0.15, duration: 0.5, ease: 'none' }, 0.55);
  }, root);

  return () => ctx.revert();
};

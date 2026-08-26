import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let sharedLenis: Lenis | null = null;

export const getLenis = (): Lenis | null => sharedLenis;

export const scrollToSection = (id: string): void => {
  const target = document.getElementById(id);
  if (!target) return;

  if (sharedLenis) {
    sharedLenis.scrollTo(target, { offset: -88, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/**
 * Drives Lenis smooth scrolling off the GSAP ticker so ScrollTrigger and
 * Lenis always agree on scroll position. No-ops (native scroll) when the
 * user prefers reduced motion.
 */
export const useSmoothScroll = (enabled = true): void => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!enabled || prefersReducedMotion) {
      document.documentElement.classList.remove('lenis');
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.15,
    });

    sharedLenis = lenis;
    document.documentElement.classList.add('lenis');

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      sharedLenis = null;
      document.documentElement.classList.remove('lenis');
    };
  }, [enabled]);
};

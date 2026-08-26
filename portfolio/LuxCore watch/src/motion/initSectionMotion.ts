import { useEffect } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Reveals every [data-reveal] element inside root as it enters the viewport.
 * Supports data-reveal="up|fade|left|right" and an optional data-reveal-delay (ms).
 */
export const initScrollReveals = (root: HTMLElement): (() => void) => {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (nodes.length === 0) return () => {};

  if (prefersReducedMotion()) {
    for (const node of nodes) node.style.opacity = '1';
    return () => {};
  }

  const triggers: ScrollTrigger[] = [];

  for (const node of nodes) {
    const kind = node.dataset.reveal || 'up';
    const delay = Number(node.dataset.revealDelay || 0) / 1000;
    const distance = 36;

    const from: gsap.TweenVars = { opacity: 0 };
    if (kind === 'up') from.y = distance;
    if (kind === 'left') from.x = -distance;
    if (kind === 'right') from.x = distance;

    gsap.set(node, from);

    const tween = gsap.to(node, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.9,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: node,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });

    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  }

  return () => {
    for (const trigger of triggers) trigger.kill();
  };
};

/**
 * Animates numeric [data-count-to] elements from 0 to their target once visible.
 * Preserves any non-numeric suffix already present in the element's text (e.g. "+", "K+").
 */
export const initCountUp = (root: HTMLElement, options?: { immediate?: boolean }): (() => void) => {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-count-to]'));
  if (nodes.length === 0) return () => {};

  const triggers: ScrollTrigger[] = [];
  const immediate = options?.immediate ?? false;

  for (const node of nodes) {
    const target = Number(node.dataset.countTo);
    const suffix = node.dataset.countSuffix ?? '';
    const decimals = Number(node.dataset.countDecimals ?? 0);
    if (Number.isNaN(target)) continue;

    if (prefersReducedMotion()) {
      node.textContent = `${target.toFixed(decimals)}${suffix}`;
      continue;
    }

    const counter = { value: 0 };
    const tweenVars: gsap.TweenVars = {
      value: target,
      duration: 1.6,
      delay: immediate ? 1.1 : 0,
      ease: 'power2.out',
      onUpdate: () => {
        node.textContent = `${counter.value.toFixed(decimals)}${suffix}`;
      },
    };

    if (!immediate) {
      tweenVars.scrollTrigger = {
        trigger: node,
        start: 'top 90%',
        toggleActions: 'play none none none',
        once: true,
      };
    }

    const tween = gsap.to(counter, tweenVars);

    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  }

  return () => {
    for (const trigger of triggers) trigger.kill();
  };
};

/**
 * Draws every SVG path found under [data-draw] using stroke-dashoffset once visible.
 */
export const initSvgDraw = (root: HTMLElement): (() => void) => {
  const hosts = Array.from(root.querySelectorAll<SVGElement>('[data-draw]'));
  if (hosts.length === 0) return () => {};

  const triggers: ScrollTrigger[] = [];

  for (const host of hosts) {
    const paths = Array.from(host.querySelectorAll<SVGPathElement>('path'));
    if (paths.length === 0) continue;

    for (const path of paths) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: prefersReducedMotion() ? 0 : length });

      if (prefersReducedMotion()) continue;

      const tween = gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: host,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }
  }

  return () => {
    for (const trigger of triggers) trigger.kill();
  };
};

/**
 * Hero entrance timeline — staggers in the eyebrow, title, copy and CTA on mount.
 * Returns the timeline so callers can pause/replay if needed.
 */
export const buildHeroTimeline = (root: HTMLElement): gsap.core.Timeline => {
  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (prefersReducedMotion()) return timeline;

  const select = (selector: string) => root.querySelectorAll<HTMLElement>(selector);

  timeline
    .set(root, { autoAlpha: 1 })
    .from(select('[data-hero-bg]'), { scale: 1.12, duration: 1.8, ease: 'power2.out' }, 0)
    .from(select('[data-hero-watch]'), { autoAlpha: 0, y: 40, scale: 0.96, duration: 1.3 }, 0.15)
    .from(select('[data-hero-eyebrow]'), { autoAlpha: 0, y: 16, duration: 0.7 }, 0.3)
    .from(select('[data-hero-title] span'), { autoAlpha: 0, y: '110%', duration: 0.9, stagger: 0.08 }, 0.4)
    .from(select('[data-hero-copy]'), { autoAlpha: 0, y: 16, duration: 0.7 }, 0.75)
    .from(select('[data-hero-cta]'), { autoAlpha: 0, y: 16, duration: 0.7 }, 0.85)
    .from(select('[data-hero-side]'), { autoAlpha: 0, duration: 0.9 }, 0.9)
    .from(select('[data-hero-stat]'), { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.1 }, 1.0);

  return timeline;
};

/**
 * Pins the collection showcase panel for a short scroll distance on desktop
 * only, calling onProgress(0..1) so the caller can crossfade between watches.
 */
export const initCollectionStack = (
  panel: HTMLElement,
  onProgress: (progress: number) => void,
): (() => void) => {
  if (prefersReducedMotion()) return () => {};

  const mm = gsap.matchMedia();
  let trigger: ScrollTrigger | undefined;

  mm.add('(min-width: 901px)', () => {
    trigger = ScrollTrigger.create({
      trigger: panel,
      start: 'top top+=90',
      end: '+=70%',
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => onProgress(self.progress),
    });

    return () => trigger?.kill();
  });

  return () => mm.revert();
};

/**
 * Convenience hook combining scroll reveals, count-up stats and SVG draw-ins
 * for a section root. Covers every section except the hero, which needs its
 * own bespoke entrance timeline.
 */
export const useSectionMotion = (ref: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const cleanups = [initScrollReveals(root), initCountUp(root), initSvgDraw(root)];

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [ref]);
};

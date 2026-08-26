import gsap from 'gsap';
import { HERO_CONFIG } from './config';

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Idle watch float + glare sweep + eclipse pulse.
 * Float runs on inner wrap so outer layer keeps CSS --px/--py parallax.
 */
export const initWatchAnimation = (root: HTMLElement): (() => void) => {
  const wrap = root.querySelector<HTMLElement>('.hero__watch-wrap');
  const watch = root.querySelector<HTMLElement>('.hero__watch');
  const glare = root.querySelector<HTMLElement>('.hero__watch-glare');
  const ring = root.querySelectorAll('.hero__eclipse-ring, .hero__eclipse-glow');

  if (!wrap || !watch) return () => {};

  const ctx = gsap.context(() => {
    if (prefersReduced()) return;

    gsap.to(wrap, {
      y: HERO_CONFIG.watchFloatDistance,
      rotation: 0.55,
      duration: 5.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    if (glare) {
      gsap.fromTo(
        glare,
        { xPercent: -130, autoAlpha: 0 },
        {
          xPercent: 130,
          duration: 2.6,
          repeat: -1,
          repeatDelay: 4.5,
          ease: 'none',
          keyframes: [
            { autoAlpha: 0, duration: 0 },
            { autoAlpha: 0.9, duration: 0.4 },
            { autoAlpha: 0.9, duration: 1.6 },
            { autoAlpha: 0, duration: 0.6 },
          ],
        },
      );
    }

    if (ring.length) {
      gsap.to(ring, {
        opacity: 1,
        filter: 'brightness(1.12)',
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: 0.15,
      });
    }
  }, root);

  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;
  let raf = 0;
  let active = true;

  const onMove = (e: PointerEvent) => {
    const b = root.getBoundingClientRect();
    tx = ((e.clientX - b.left) / b.width - 0.5) * 2;
    ty = ((e.clientY - b.top) / b.height - 0.5) * 2;
  };

  const tick = () => {
    if (!active) return;
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;
    watch.style.setProperty('--wx', `${(-my * HERO_CONFIG.watchTiltX).toFixed(2)}deg`);
    watch.style.setProperty('--wy', `${(mx * HERO_CONFIG.watchTiltY).toFixed(2)}deg`);
    raf = requestAnimationFrame(tick);
  };

  const canTilt =
    !prefersReduced() &&
    !window.matchMedia('(hover: none)').matches &&
    window.innerWidth > HERO_CONFIG.mobileMax;

  if (canTilt) {
    root.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);
  }

  return () => {
    active = false;
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', onMove);
    ctx.revert();
  };
};

export const initFloatingRocks = (root: HTMLElement): (() => void) => {
  if (prefersReduced()) return () => {};

  const rocks = Array.from(root.querySelectorAll<HTMLElement>('.hero__rock'));
  const cluster = root.querySelector<HTMLElement>('[data-layer="rocks-back"] img');

  const ctx = gsap.context(() => {
    if (cluster) {
      gsap.to(cluster, {
        y: 16,
        x: 6,
        rotation: 3,
        duration: 9,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }

    rocks.forEach((rock, i) => {
      const speed = Number(rock.dataset.floatSpeed) || 6 + (i % 5);
      const dist = Number(rock.dataset.floatDistance) || 10 + (i % 4) * 4;
      const rot = Number(rock.dataset.rotationSpeed) || 3 + (i % 3);

      gsap.to(rock, {
        y: i % 2 === 0 ? dist : -dist,
        x: i % 3 === 0 ? dist * 0.35 : -dist * 0.25,
        rotation: i % 2 === 0 ? rot : -rot,
        duration: speed,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.35,
      });
    });
  }, root);

  return () => ctx.revert();
};

export const initCloudAnimation = (root: HTMLElement): (() => void) => {
  if (prefersReduced()) return () => {};

  const back = root.querySelector('[data-layer="clouds-back"]');
  const front = root.querySelector('[data-layer="clouds-front"]');
  const ctx = gsap.context(() => {
    if (back) {
      gsap.fromTo(
        back,
        { '--fx': '-2%', '--fs': 1, '--fo': 0.65 },
        {
          '--fx': '3%',
          '--fs': 1.02,
          '--fo': 0.8,
          duration: HERO_CONFIG.cloudsDuration,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        },
      );
    }
    if (front) {
      gsap.fromTo(
        front,
        { '--fx': '2%', '--fs': 1, '--fo': 0.75 },
        {
          '--fx': '-3.5%',
          '--fs': 1.025,
          '--fo': 0.9,
          duration: HERO_CONFIG.cloudsDuration * 0.85,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        },
      );
    }
  }, root);

  return () => ctx.revert();
};

export const initFogAnimation = (root: HTMLElement): (() => void) => {
  if (prefersReduced()) return () => {};

  const fogs = root.querySelectorAll('.hero__fog-layer');
  const ctx = gsap.context(() => {
    fogs.forEach((fog, i) => {
      gsap.to(fog, {
        xPercent: i % 2 === 0 ? 4 : -5,
        y: i % 2 === 0 ? -8 : 10,
        scale: 1.04,
        opacity: i % 2 === 0 ? 0.85 : 0.65,
        duration: HERO_CONFIG.fogDuration + i * 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    });
  }, root);

  return () => ctx.revert();
};

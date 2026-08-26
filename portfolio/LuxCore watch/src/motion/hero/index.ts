import { initHeroIntro } from './intro';
import { initHeroParallax, initWatchHover } from './parallax';
import { initWatchAnimation, initCloudAnimation, initFogAnimation } from './ambient';
import { initHeroParticles } from './particles';
import { initHeroCursor } from './cursor';
import { initHeroScrollExit } from './scrollExit';
import { initCountUp } from '../initSectionMotion';
import { HERO_CONFIG } from './config';

export { HERO_CONFIG } from './config';

type TimelineLike = { kill: () => void };

/** Lightweight hero motion — fast intro, optional parallax. */
export const initHeroScene = (root: HTMLElement): (() => void) => {
  const cleanups: Array<() => void> = [];
  let introTl: TimelineLike | null = null;

  introTl = initHeroIntro(root);

  cleanups.push(initHeroParallax(root));
  cleanups.push(initWatchHover(root));
  cleanups.push(initWatchAnimation(root));
  cleanups.push(initCloudAnimation(root));
  cleanups.push(initFogAnimation(root));
  cleanups.push(initCountUp(root, { immediate: true }));

  if (HERO_CONFIG.enableParticles) cleanups.push(initHeroParticles(root));
  if (HERO_CONFIG.enableCursor) cleanups.push(initHeroCursor(root));
  if (HERO_CONFIG.enableScrollExit) cleanups.push(initHeroScrollExit(root));

  return () => {
    introTl?.kill();
    for (const fn of cleanups) fn();
  };
};

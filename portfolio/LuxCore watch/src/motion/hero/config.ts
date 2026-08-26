/**
 * Hero scene animation knobs — keep values conservative for fast, clear first paint.
 */
export const HERO_CONFIG = {
  parallaxStrength: 0.65,
  watchFloatDistance: 8,
  watchTiltX: 2,
  watchTiltY: 2.5,
  particleCount: 0,
  particleCountMobile: 0,
  introDuration: 1.1,
  scrollExitDistance: '0%',
  watchGlow: 0.45,
  cloudsDuration: 22,
  fogDuration: 18,
  mobileMax: 900,
  enableCursor: false,
  enableScrollExit: false,
  enableParticles: false,
} as const;

export const LAYER_AMPLITUDE: Record<string, { x: number; y: number; invert?: boolean }> = {
  background: { x: 2, y: 1.5 },
  planet: { x: 4, y: 3 },
  'clouds-back': { x: 5, y: 3, invert: true },
  'left-ruins': { x: 7, y: 5 },
  'right-ruins': { x: 8, y: 5 },
  'rocks-back': { x: 9, y: 6, invert: true },
  watch: { x: 10, y: 8 },
  'clouds-front': { x: 6, y: 4 },
  fog: { x: 8, y: 5 },
};

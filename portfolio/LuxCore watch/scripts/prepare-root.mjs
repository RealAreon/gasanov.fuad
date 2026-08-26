// Publishes the production build to the project root so the site can be opened
// directly via file://index.html (double-click), with no server required.
// The Vite source entry lives permanently in index.dev.html; `npm run dev` restores
// it via ensure-dev.mjs before starting the dev server.
import { copyFileSync, cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const distDir = 'dist';
const distIndex = join(distDir, 'index.html');
const distAssets = join(distDir, 'assets');

if (!existsSync(distIndex)) {
  console.error('[prepare-root] dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

copyFileSync(distIndex, 'index.html');
console.log('[prepare-root] Copied dist/index.html -> index.html');

if (existsSync(distAssets)) {
  cpSync(distAssets, 'assets', { recursive: true, force: true });
  console.log('[prepare-root] Copied dist/assets -> assets/');
}

console.log('[prepare-root] Root is ready for file:// double-click (open index.html directly).');
console.log('[prepare-root] Run `npm run dev` next time to restore the development entry automatically.');

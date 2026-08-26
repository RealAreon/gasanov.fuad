// Restores the Vite development entry (index.dev.html) into index.html.
// index.html is overwritten with the production build output after `npm run build`
// (see prepare-root.mjs), so this script guarantees `npm run dev` and `npm run build`
// always start from the correct source entry, regardless of the previous state.
import { copyFileSync, existsSync } from 'node:fs';

const devEntry = 'index.dev.html';
const target = 'index.html';

if (existsSync(devEntry)) {
  copyFileSync(devEntry, target);
  console.log(`[ensure-dev] Restored ${target} from ${devEntry}`);
} else {
  console.warn(`[ensure-dev] ${devEntry} not found — leaving ${target} untouched`);
}

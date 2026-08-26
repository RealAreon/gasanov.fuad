import sharp from 'sharp';
import { copyFile, mkdir, access, constants, writeFile, stat, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = 'C:\\Users\\VipruX\\.cursor\\projects\\c-MyFiles-Work-DROPSHIPPING\\assets';
const OUT = join(root, 'public', 'assets', 'images');
const BACKUP = join(OUT, '_source');

const results = [];

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function report(label, path, ok, err) {
  if (!ok) {
    results.push({ label, path, ok: false, error: String(err) });
    console.error(`FAIL ${label}: ${err}`);
    return;
  }
  const s = await stat(path);
  results.push({ label, path, ok: true, size: s.size });
  console.log(`OK   ${label} -> ${path} (${s.size} bytes)`);
}

async function backupPng(name) {
  const src = join(SOURCE, name);
  if (!(await exists(src))) {
    console.warn(`backup skip (missing): ${name}`);
    return;
  }
  const dest = join(BACKUP, name);
  await ensureDir(dirname(dest));
  await copyFile(src, dest);
  console.log(`backup ${name}`);
}

async function toWebp(inputName, outRel, opts = {}) {
  const { maxWidth, quality = 82, fit = 'inside' } = opts;
  const input = join(SOURCE, inputName);
  const output = join(OUT, outRel);
  try {
    if (!(await exists(input))) throw new Error(`source missing: ${input}`);
    await ensureDir(dirname(output));
    let pipeline = sharp(input);
    if (maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, { fit, withoutEnlargement: true });
    }
    await pipeline.webp({ quality }).toFile(output);
    await report(outRel, output, true);
  } catch (err) {
    await report(outRel, output, false, err);
  }
}

async function processWatchTransparent() {
  const input = join(SOURCE, 'hero-watch-raw.png');
  const heroOut = join(OUT, 'hero', 'hero-watch.webp');
  const collectionOut = join(OUT, 'collection', 'watch-infinitum.webp');
  try {
    if (!(await exists(input))) throw new Error(`source missing: ${input}`);
    await ensureDir(dirname(heroOut));
    await ensureDir(dirname(collectionOut));

    const { data, info } = await sharp(input)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (r + g + b) / 3;
      if (lum < 18) {
        data[i + 3] = 0;
      } else if (lum < 45) {
        data[i + 3] = Math.round(((lum - 18) / 27) * 255);
      }
    }

    const base = sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    });

    await base
      .clone()
      .resize(1800, 1800, { fit: 'inside' })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(heroOut);
    await report('hero/hero-watch.webp', heroOut, true);

    await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .resize(1600, 1600, { fit: 'inside' })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(collectionOut);
    await report('collection/watch-infinitum.webp', collectionOut, true);
  } catch (err) {
    await report('hero/hero-watch.webp', heroOut, false, err);
  }
}

async function writeEclipseSvg() {
  const path = join(OUT, 'hero', 'hero-eclipse-ring.svg');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" fill="none">
  <circle
    cx="200"
    cy="200"
    r="168"
    stroke="#c88a42"
    stroke-width="1.25"
    stroke-linecap="round"
    stroke-dasharray="420 640"
    stroke-dashoffset="80"
    opacity="0.92"
  />
</svg>
`;
  try {
    await ensureDir(dirname(path));
    await writeFile(path, svg, 'utf8');
    await report('hero/hero-eclipse-ring.svg', path, true);
  } catch (err) {
    await report('hero/hero-eclipse-ring.svg', path, false, err);
  }
}

async function ensureJournalSecondaries() {
  const journalDir = join(OUT, 'journal');
  const checks = [
    { webp: 'journal-mechanics.webp', src: 'journal-mechanics.png', out: 'journal/journal-mechanics.webp' },
    { webp: 'journal-mountains-watch.webp', src: 'journal-mountains-watch.png', out: 'journal/journal-mountains-watch.webp' },
    { webp: 'journal-sketch.webp', src: 'journal-sketch.png', out: 'journal/journal-sketch.webp' },
    { webp: 'journal-movement.webp', src: 'movement-macro.png', out: 'journal/journal-movement.webp' },
  ];
  const TINY = 8 * 1024;

  for (const item of checks) {
    const webpPath = join(journalDir, item.webp);
    let needs = true;
    if (await exists(webpPath)) {
      const s = await stat(webpPath);
      if (s.size >= TINY) {
        console.log(`keep ${item.webp} (${s.size} bytes)`);
        needs = false;
      } else {
        console.log(`tiny ${item.webp} (${s.size} bytes) — regenerating`);
      }
    } else {
      console.log(`missing ${item.webp} — generating`);
    }
    if (!needs) continue;

    const srcPath = join(SOURCE, item.src);
    const featured = join(SOURCE, 'journal-featured.png');
    try {
      await ensureDir(journalDir);
      if (await exists(srcPath)) {
        await sharp(srcPath).resize(1600, null, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(webpPath);
      } else if (await exists(featured)) {
        await sharp(featured).resize(1200, 800, { fit: 'cover' }).webp({ quality: 80 }).toFile(webpPath);
      } else {
        throw new Error('no source for journal secondary');
      }
      await report(item.out, webpPath, true);
    } catch (err) {
      await report(item.out, webpPath, false, err);
    }
  }
}

async function keepExistingWatches() {
  for (const name of ['watch-aurum.webp', 'watch-legacy.webp']) {
    const path = join(OUT, 'collection', name);
    if (await exists(path)) {
      const s = await stat(path);
      console.log(`keep collection/${name} (${s.size} bytes)`);
    } else {
      console.warn(`WARN missing collection/${name}`);
    }
  }
}

async function listTree() {
  async function walk(dir, prefix = '') {
    const entries = await readdir(dir, { withFileTypes: true });
    const lines = [];
    for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        lines.push(`${prefix}${e.name}/`);
        lines.push(...(await walk(p, prefix + '  ')));
      } else {
        const s = await stat(p);
        lines.push(`${prefix}${e.name}  ${s.size}`);
      }
    }
    return lines;
  }
  return walk(OUT);
}

await ensureDir(BACKUP);
await ensureDir(OUT);

const pngBackups = [
  'hero-bg-space.png',
  'hero-watch-raw.png',
  'collection-bg.png',
  'benefits-bg.png',
  'clients-interior-bg.png',
  'journal-featured.png',
  'footer-architecture-bg.png',
  'journal-mechanics.png',
  'journal-mountains-watch.png',
  'journal-sketch.png',
  'movement-macro.png',
  'watch-infinitum.png',
];

console.log('--- backup PNGs ---');
for (const name of pngBackups) {
  await backupPng(name);
}

console.log('--- convert ---');
await toWebp('hero-bg-space.png', 'hero/hero-bg-space.webp', { maxWidth: 1920, quality: 82 });
await processWatchTransparent();
await toWebp('collection-bg.png', 'collection/collection-bg.webp', { maxWidth: 1920, quality: 82 });
await toWebp('benefits-bg.png', 'benefits/benefits-bg.webp', { maxWidth: 1920, quality: 82 });
await toWebp('clients-interior-bg.png', 'clients/clients-interior-bg.webp', { maxWidth: 1920, quality: 82 });
await toWebp('journal-featured.png', 'journal/journal-featured.webp', { maxWidth: 1600, quality: 82 });
await toWebp('footer-architecture-bg.png', 'footer/footer-architecture-bg.webp', { maxWidth: 1920, quality: 82 });
await writeEclipseSvg();
await keepExistingWatches();
await ensureJournalSecondaries();

console.log('\n=== SUMMARY ===');
const ok = results.filter((r) => r.ok);
const fail = results.filter((r) => !r.ok);
for (const r of ok) console.log(`SUCCESS ${r.label}: ${r.size} bytes`);
for (const r of fail) console.log(`FAILURE ${r.label}: ${r.error}`);
console.log(`\n${ok.length} succeeded, ${fail.length} failed`);

console.log('\n=== TREE public/assets/images ===');
for (const line of await listTree()) console.log(line);

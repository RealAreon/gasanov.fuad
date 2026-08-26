/**
 * Download unique Unsplash product images and compress to WebP + JPEG.
 * Then rewrite data.js / HTML references to local public/media/products/*.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public', 'media', 'products');
const sharp = require(path.join(root, 'node_modules', 'sharp'));

const targets = [
  path.join(root, 'js', 'data.js'),
  path.join(root, 'index.html'),
  ...fs.readdirSync(path.join(root, 'product')).filter((f) => f.endsWith('.html')).map((f) => path.join(root, 'product', f)),
];

function collectIds(text) {
  const ids = new Set();
  const re = /images\.unsplash\.com\/(photo-\d+[a-z0-9-]*)/gi;
  let m;
  while ((m = re.exec(text))) ids.add(m[1]);
  return ids;
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'ChronosOptimizer/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchBuffer(res.headers.location).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
  });
}

async function optimizeOne(id) {
  const webpPath = path.join(outDir, `${id}.webp`);
  const jpgPath = path.join(outDir, `${id}.jpg`);
  if (fs.existsSync(webpPath) && fs.existsSync(jpgPath)) {
    const kb = Math.round(fs.statSync(webpPath).size / 1024);
    console.log(`skip ${id} (${kb} KB webp)`);
    return true;
  }
  const candidates = [
    `https://images.unsplash.com/${id}?w=900&q=85&auto=format&fit=crop`,
    `https://images.unsplash.com/${id}?ixlib=rb-4.0.3&w=900&q=80`,
    `https://images.unsplash.com/${id}?w=800&q=80`,
  ];
  let buf = null;
  for (const srcUrl of candidates) {
    try {
      console.log(`fetch ${id}...`);
      buf = await fetchBuffer(srcUrl);
      break;
    } catch (err) {
      console.warn(`  fail ${srcUrl}: ${err.message}`);
    }
  }
  if (!buf) {
    console.warn(`MISSING ${id} — will keep remote or substitute later`);
    return false;
  }
  const pipeline = sharp(buf).rotate().resize({ width: 900, height: 900, fit: 'cover', withoutEnlargement: true });
  await pipeline.clone().webp({ quality: 72, effort: 5 }).toFile(webpPath);
  await pipeline.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(jpgPath);
  console.log(
    `ok ${id}: webp=${Math.round(fs.statSync(webpPath).size / 1024)}KB jpg=${Math.round(fs.statSync(jpgPath).size / 1024)}KB`
  );
  return true;
}

function rewriteFile(filePath, ids) {
  let text = fs.readFileSync(filePath, 'utf8');
  const inProduct = path.dirname(filePath).endsWith(`${path.sep}product`) || /[\\/]product$/.test(path.dirname(filePath));
  const prefix = inProduct ? '../public/media/products/' : 'public/media/products/';
  let changed = false;
  for (const id of ids) {
    const re = new RegExp(`https://images\\.unsplash\\.com/${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"'\s]*`, 'g');
    const next = text.replace(re, `${prefix}${id}.webp`);
    if (next !== text) {
      text = next;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, text, 'utf8');
    console.log(`rewrote ${path.relative(root, filePath)}`);
  }
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const allText = targets.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  const ids = [...collectIds(allText)];
  console.log(`unique images: ${ids.length}`);
  const ok = new Set();
  for (const id of ids) {
    if (await optimizeOne(id)) ok.add(id);
  }
  // Map missing images to a working local substitute
  const fallback = [...ok][0];
  for (const id of ids) {
    if (ok.has(id)) continue;
    if (!fallback) continue;
    fs.copyFileSync(path.join(outDir, `${fallback}.webp`), path.join(outDir, `${id}.webp`));
    fs.copyFileSync(path.join(outDir, `${fallback}.jpg`), path.join(outDir, `${id}.jpg`));
    console.log(`substituted ${id} <- ${fallback}`);
    ok.add(id);
  }
  for (const file of targets) rewriteFile(file, [...ok]);
  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

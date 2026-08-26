/**
 * Force all product images to square 900x900 cover crops (webp + jpg).
 */
const fs = require('fs');
const path = require('path');
const sharp = require(path.join(__dirname, '..', 'node_modules', 'sharp'));

const dir = path.join(__dirname, '..', 'public', 'media', 'products');

async function run() {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp') || f.endsWith('.jpg'));
  const ids = [...new Set(files.map((f) => f.replace(/\.(webp|jpg)$/i, '')))];
  for (const id of ids) {
    const webp = path.join(dir, `${id}.webp`);
    const jpg = path.join(dir, `${id}.jpg`);
    const src = fs.existsSync(webp) ? webp : jpg;
    if (!fs.existsSync(src)) continue;
    const buf = await fs.promises.readFile(src);
    const base = sharp(buf).rotate().resize(900, 900, { fit: 'cover', position: 'centre' });
    await base.clone().webp({ quality: 74, effort: 5 }).toFile(webp);
    await base.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(jpg);
    const m = await sharp(webp).metadata();
    console.log(`ok ${id} -> ${m.width}x${m.height}`);
  }
  console.log(`done ${ids.length} images`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

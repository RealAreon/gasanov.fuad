import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { extname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const imagesRoot = fileURLToPath(new URL('../public/assets/images/', import.meta.url));
const chromaKeyFiles = new Set(['hero-watch.png', 'watch-infinitum.png']);

async function findPngs(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? findPngs(path) : [path];
  }));

  return nested.flat().filter((path) => extname(path).toLowerCase() === '.png');
}

function removeGreenChroma(data) {
  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const dominance = green - Math.max(red, blue);

    if (green > 90 && dominance > 28) {
      const edgeOpacity = Math.max(0, Math.min(1, (120 - dominance) / 70));
      data[index + 1] = Math.min(green, Math.round(Math.max(red, blue) * 1.05 + 8));
      data[index + 3] = Math.round(data[index + 3] * edgeOpacity);
    }
  }

  return data;
}

async function processImage(inputPath) {
  const { dir, name, base } = parse(inputPath);
  const outputPath = join(dir, `${name}.webp`);

  if (chromaKeyFiles.has(base)) {
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    await sharp(removeGreenChroma(data), { raw: info })
      .webp({ quality: 82, alphaQuality: 100 })
      .toFile(outputPath);
  } else {
    await sharp(inputPath).webp({ quality: 82 }).toFile(outputPath);
  }

  console.log(`${base} -> ${outputPath}`);
}

const pngs = await findPngs(imagesRoot);
await Promise.all(pngs.map(processImage));
console.log(`Processed ${pngs.length} PNG image(s).`);


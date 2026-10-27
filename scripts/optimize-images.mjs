// Regenerates the WebP files in public/images from the full-resolution PNGs in assets/source.
// The deploy serves the WebP files directly (next/image runs with `unoptimized` in a static
// export), so this is where image weight is controlled. Run with `bun run images:optimize`.
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = 'assets/source';
const OUTPUT_DIR = 'public/images';
const QUALITY = 90;

// Render width in CSS pixels x2, measured from the current layout:
// the hero photo column is about 510px wide, each project cover about 377px, and the
// service card media about 600px.
const WIDTHS = { profile: 1100, cafe: 960, qpay: 960, ticketin: 960, chatbot: 1280 };

for (const file of (await readdir(SOURCE_DIR)).sort()) {
  if (!file.endsWith('.png')) continue;
  const name = path.basename(file, '.png');
  const width = WIDTHS[name];
  if (!width) {
    console.warn(`skip ${file}: no entry in WIDTHS`);
    continue;
  }

  const output = path.join(OUTPUT_DIR, `${name}.webp`);
  const info = await sharp(path.join(SOURCE_DIR, file))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(output);

  const before = (await stat(path.join(SOURCE_DIR, file))).size;
  console.log(
    `${output}  ${info.width}x${info.height}  ${(before / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB`,
  );
}

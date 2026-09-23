/**
 * Generates responsive WebP copies of every photograph in public/images.
 *
 * The site is a static export with `images.unoptimized: true`, so Next does
 * none of this for us: whatever file a page names is the file every visitor
 * downloads, at full size, whatever their screen. On the home page that meant
 * a phone fetching a 2000px hero — Lighthouse measured 659KB of it wasted and
 * a Largest Contentful Paint of 5.9 seconds on mobile.
 *
 * For each source it writes `name-480.webp`, `name-960.webp` and
 * `name-1600.webp` beside it. `Picture` then offers all three in a srcset and
 * lets the browser take the one that fits, falling back to the original for
 * anything that cannot read WebP.
 *
 * Originals are never modified and never deleted — the variants sit alongside
 * them, and deleting the whole lot and re-running produces the same result.
 *
 *   npm run images
 */
import sharp from 'sharp';
import { readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.join('public', 'images');
const WIDTHS = [480, 960, 1600];
/** Written by this script; never treat one as a source. */
const VARIANT = /-(?:480|960|1600)\.webp$/;

function photographs(dir, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) photographs(full, found);
    else if (/\.(jpe?g|png)$/i.test(entry)) found.push(full);
  }
  return found;
}

const sources = photographs(ROOT);
let written = 0;
let skipped = 0;
let saved = 0;

for (const source of sources) {
  if (VARIANT.test(source)) continue;
  const meta = await sharp(source).metadata();
  const original = statSync(source).size;

  for (const width of WIDTHS) {
    // No point upscaling: a 720px source has nothing to give a 1600px slot.
    if (meta.width && meta.width < width * 0.9 && width !== WIDTHS[0]) continue;

    const out = source.replace(/\.(jpe?g|png)$/i, `-${width}.webp`);
    if (existsSync(out) && statSync(out).mtimeMs >= statSync(source).mtimeMs) {
      skipped += 1;
      continue;
    }
    mkdirSync(path.dirname(out), { recursive: true });
    await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(out);
    written += 1;
    saved += original - statSync(out).size;
  }
}

console.log('');
console.log(`${sources.length} photographs — ${written} variants written, ${skipped} already current.`);
if (written) console.log(`Roughly ${Math.round(saved / 1024)}KB less to download per view, before the browser even chooses.`);
console.log('');

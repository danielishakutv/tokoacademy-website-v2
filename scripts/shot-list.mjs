/**
 * Every image the site asks for, and which of them we actually have.
 *
 * The design is finished and photo-ready: each `Picture` slot renders a real
 * photograph if the file is in `public/`, and a labelled placeholder if it is
 * not. This prints the difference, so "what should I photograph next" has an
 * answer that is always current rather than a list in a document that goes
 * stale the moment somebody adds a picture.
 *
 *   npm run shots
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const SRC = 'src';
const PUBLIC = 'public';

/** Every .tsx under src/, so a new page is picked up without being registered. */
function sources(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) sources(full, found);
    else if (/\.(tsx|ts)$/.test(entry)) found.push(full);
  }
  return found;
}

const slots = new Map(); // path -> { alt, brief, files }

for (const file of sources(SRC)) {
  const text = readFileSync(file, 'utf8');
  // Only <Picture …> blocks: a bare <img> is usually a logo or an icon and is
  // not something anybody needs to go and photograph.
  for (const block of text.match(/<Picture[\s\S]{0,700}?\/>/g) ?? []) {
    const src = block.match(/src=["']([^"']+)["']/)?.[1];
    if (!src || !src.startsWith('/images/')) continue;
    const alt = block.match(/alt=["']([^"']+)["']/)?.[1] ?? '';
    const brief = block.match(/brief=["']([^"']+)["']/)?.[1] ?? '';
    const existing = slots.get(src) ?? { alt, brief, files: new Set() };
    if (alt && !existing.alt) existing.alt = alt;
    if (brief && !existing.brief) existing.brief = brief;
    existing.files.add(file.replace(/\\/g, '/'));
    slots.set(src, existing);
  }
}

const have = [];
const want = [];
for (const [src, meta] of [...slots].sort(([a], [b]) => a.localeCompare(b))) {
  (existsSync(path.join(PUBLIC, src.replace(/^\//, ''))) ? have : want).push({ src, ...meta });
}

console.log('');
console.log(`${slots.size} image slots — ${have.length} filled, ${want.length} waiting.`);
console.log('');

if (want.length) {
  console.log('STILL TO PHOTOGRAPH');
  console.log('');
  for (const item of want) {
    console.log(`  ${item.src}`);
    if (item.alt) console.log(`     what it shows : ${item.alt}`);
    if (item.brief) console.log(`     how to shoot  : ${item.brief}`);
    console.log(`     used on       : ${[...item.files].join(', ')}`);
    console.log('');
  }
}

if (have.length) {
  console.log('ALREADY IN PLACE');
  for (const item of have) console.log(`  ${item.src}`);
  console.log('');
}

console.log('Guidance on framing, consent and file sizes: docs/IMAGE-GUIDE.md');
console.log('');

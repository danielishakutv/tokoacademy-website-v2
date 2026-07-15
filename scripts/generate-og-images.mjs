// Postbuild step: optimize social-share (Open Graph) images in the exported site.
//
// Why not fetch WordPress directly? wp.tokoacademy.org's firewall (Wordfence)
// returns 403 to standalone GraphQL requests, so we can't query it from a script.
// But `next build` CAN reach it, and it bakes the featured-image URLs into each
// page's og:image / twitter:image tags. This step runs AFTER the build: it reads
// those URLs out of the exported HTML, downloads each image (static files ARE
// reachable), and produces a same-domain 1200x630 JPEG under ~280KB — small
// enough for WhatsApp (which drops og:images over ~300KB) and correctly sized.
// It then rewrites the tags to point at the optimized, local copy.
//
// Anything that fails (a download, a resize) is left untouched, so previews never
// regress. This step must never fail the build; it always exits 0.

import sharp from 'sharp';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'out');
const OG_OUT_DIR = join(OUT_DIR, 'og');

const SITE_ORIGIN = 'https://tokoacademy.org';
const SOURCE_HOST = 'wp.tokoacademy.org'; // only optimize images from the WordPress origin

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const MAX_BYTES = 280 * 1024; // stay safely under WhatsApp's ~300KB ceiling
const FETCH_TIMEOUT_MS = 20000;
const CONCURRENCY = 6;

// A <meta> tag is an OG/Twitter image if it carries one of these property/name values.
const IMAGE_META_RE =
  /property=["'](?:og:image(?::(?:url|secure_url))?)["']|name=["']twitter:image(?::src)?["']/i;
const CONTENT_RE = /content=["']([^"']+)["']/i;

async function listHtmlFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listHtmlFiles(full)));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function isSourceImage(url) {
  try {
    return new URL(url).host === SOURCE_HOST;
  } catch {
    return false;
  }
}

// Pull every og:image/twitter:image URL (on SOURCE_HOST) out of an HTML string.
function collectImageUrls(html, into) {
  const metaRe = /<meta\b[^>]*>/gi;
  let match;
  while ((match = metaRe.exec(html)) !== null) {
    const tag = match[0];
    if (!IMAGE_META_RE.test(tag)) continue;
    const content = CONTENT_RE.exec(tag);
    if (content && isSourceImage(content[1])) into.add(content[1]);
  }
}

// Replace the content URL of OG/Twitter image tags using the url->newUrl map.
function rewriteHtml(html, urlMap) {
  return html.replace(/<meta\b[^>]*>/gi, (tag) => {
    if (!IMAGE_META_RE.test(tag)) return tag;
    return tag.replace(CONTENT_RE, (whole, url) => {
      const mapped = urlMap.get(url);
      return mapped ? `content="${mapped}"` : whole;
    });
  });
}

async function fetchBuffer(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } finally {
    clearTimeout(timer);
  }
}

async function toOgJpeg(inputBuffer) {
  const render = (quality) =>
    sharp(inputBuffer)
      .flatten({ background: '#ffffff' }) // transparent PNGs -> white, not black
      .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'attention' })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

  let quality = 82;
  let out = await render(quality);
  while (out.length > MAX_BYTES && quality > 40) {
    quality -= 10;
    out = await render(quality);
  }
  return out;
}

async function runWithConcurrency(items, limit, worker) {
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index++;
      await worker(items[current]);
    }
  });
  await Promise.all(runners);
}

async function main() {
  let htmlFiles;
  try {
    htmlFiles = await listHtmlFiles(OUT_DIR);
  } catch (err) {
    console.warn(`[og] no exported site found at out/ (${err.message}); skipping`);
    return;
  }

  // 1. Collect every unique source image URL referenced across the exported HTML.
  const fileContents = new Map();
  const urls = new Set();
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    fileContents.set(file, html);
    collectImageUrls(html, urls);
  }

  if (urls.size === 0) {
    console.log('[og] no WordPress og:image URLs found; nothing to optimize');
    return;
  }

  await mkdir(OG_OUT_DIR, { recursive: true });

  // 2. Download + optimize each unique image; build url -> optimized-url map.
  const urlMap = new Map();
  let ok = 0;
  await runWithConcurrency([...urls], CONCURRENCY, async (url) => {
    try {
      const hash = createHash('sha1').update(url).digest('hex').slice(0, 16);
      const fileName = `${hash}.jpg`;
      const jpeg = await toOgJpeg(await fetchBuffer(url));
      await writeFile(join(OG_OUT_DIR, fileName), jpeg);
      urlMap.set(url, `${SITE_ORIGIN}/og/${fileName}`);
      ok += 1;
    } catch (err) {
      console.warn(`[og] left original (optimize failed): ${url} -> ${err.message}`);
    }
  });

  // 3. Rewrite og:image/twitter:image tags in every HTML file that referenced one.
  let rewritten = 0;
  for (const [file, html] of fileContents) {
    const next = rewriteHtml(html, urlMap);
    if (next !== html) {
      await writeFile(file, next);
      rewritten += 1;
    }
  }

  console.log(`[og] optimized ${ok}/${urls.size} image(s); rewrote ${rewritten} page(s)`);
}

main().catch((err) => {
  console.warn(`[og] postbuild skipped due to error (previews keep original images): ${err?.message ?? err}`);
});

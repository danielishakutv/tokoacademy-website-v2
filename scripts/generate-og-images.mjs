// Pre-build step: generate social-share (Open Graph) images for every WordPress
// article, event, and gallery album.
//
// Why: link-preview crawlers (WhatsApp especially, which drops any og:image over
// ~300KB) need a small, correctly-sized, same-domain image. WordPress featured
// images are often large PNGs on the wp. subdomain, so previews fail. This script
// downloads each source image and produces a 1200x630 JPEG under ~280KB in
// public/og/, then writes src/lib/og-manifest.json mapping each item to its file.
//
// The site's metadata reads that manifest. If this script fails for an item (or
// entirely), the manifest simply omits it and the app falls back to the original
// image — so a failure here never makes previews worse than before. This script
// therefore always exits 0; it must never block a deploy.

import sharp from 'sharp';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');
const OG_DIR = join(PUBLIC_DIR, 'og');
const MANIFEST_PATH = join(ROOT, 'src', 'lib', 'og-manifest.json');

const WP_API_URL =
  process.env.WORDPRESS_API_URL ??
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ??
  'https://wp.tokoacademy.org/graphql';

const DEFAULT_LOCAL_IMAGE = join(PUBLIC_DIR, 'images', 'hero', 'professional-courses.jpg');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const MAX_BYTES = 280 * 1024; // stay safely under WhatsApp's ~300KB ceiling
const FETCH_TIMEOUT_MS = 20000;
const CONCURRENCY = 6;

const ALLOWED_NEWS_CATEGORY_SLUGS = ['in-the-news', 'newsroom', 'press-release'];

// IMPORTANT: send only Content-Type, exactly like src/lib/wordpress.ts's
// graphqlRequest(). Wordfence/Cloudflare in front of wp.tokoacademy.org returns
// 403 to requests carrying a browser User-Agent that lacks matching browser
// fingerprint headers (it reads as a spoofed browser), while this minimal,
// honest request is allowed.
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function gqlOnce(query, variables) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(WP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
    return json.data;
  } finally {
    clearTimeout(timer);
  }
}

// Retry transient failures (rate limits, brief network blips) a couple of times.
async function gql(query, variables = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await gqlOnce(query, variables);
    } catch (err) {
      lastError = err;
      if (attempt < 3) await sleep(attempt * 1500);
    }
  }
  throw lastError;
}

async function fetchImageBuffer(url) {
  if (/^https?:\/\//i.test(url)) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`image HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } finally {
      clearTimeout(timer);
    }
  }
  // Local public asset, e.g. "/images/hero/foo.jpg"
  return readFile(join(PUBLIC_DIR, url.replace(/^\//, '')));
}

// Resize/crop to a 1200x630 JPEG, dropping quality until it fits under MAX_BYTES.
async function toOgJpeg(inputBuffer) {
  const render = (quality) =>
    sharp(inputBuffer)
      .flatten({ background: '#ffffff' }) // PNGs with transparency -> white, not black
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

function extractFirstContentImage(html) {
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html || '');
  return match ? match[1] : null;
}

// Gather every {key, slug, type, source} we should produce an OG image for.
async function collectItems() {
  const items = [];

  // News: published posts in an allowed news category
  try {
    const data = await gql(
      `query { posts(first: 50, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
        nodes { slug status featuredImage { node { sourceUrl } } categories { nodes { slug } } }
      } }`
    );
    for (const post of data.posts?.nodes ?? []) {
      const cats = (post.categories?.nodes ?? []).map((c) => (c.slug ?? '').toLowerCase());
      if ((post.status ?? '').toLowerCase() !== 'publish') continue;
      if (!cats.some((c) => ALLOWED_NEWS_CATEGORY_SLUGS.includes(c))) continue;
      items.push({
        type: 'news',
        slug: post.slug,
        source: post.featuredImage?.node?.sourceUrl || null,
      });
    }
  } catch (err) {
    console.warn(`[og] could not load news posts: ${err.message}`);
  }

  // Events: published posts in the "events" category
  try {
    const data = await gql(
      `query { posts(first: 50, where: { status: PUBLISH, categoryName: "events", orderby: { field: DATE, order: DESC } }) {
        nodes { slug status featuredImage { node { sourceUrl } } categories { nodes { slug } } }
      } }`
    );
    for (const post of data.posts?.nodes ?? []) {
      const cats = (post.categories?.nodes ?? []).map((c) => (c.slug ?? '').toLowerCase());
      if ((post.status ?? '').toLowerCase() !== 'publish' || !cats.includes('events')) continue;
      items.push({
        type: 'event',
        slug: post.slug,
        source: post.featuredImage?.node?.sourceUrl || null,
      });
    }
  } catch (err) {
    console.warn(`[og] could not load event posts: ${err.message}`);
  }

  // Gallery: albums use their first content image
  try {
    const data = await gql(
      `query { posts(first: 100, where: { categoryName: "Gallery", orderby: { field: DATE, order: DESC } }) {
        nodes { slug content categories { nodes { name } } }
      } }`
    );
    for (const post of data.posts?.nodes ?? []) {
      const isGallery = (post.categories?.nodes ?? []).some((c) => (c.name ?? '').toLowerCase() === 'gallery');
      if (!isGallery) continue;
      const source = extractFirstContentImage(post.content);
      if (!source) continue; // gallery pages only exist when they have images
      items.push({ type: 'gallery', slug: post.slug, source });
    }
  } catch (err) {
    console.warn(`[og] could not load gallery albums: ${err.message}`);
  }

  return items;
}

async function runWithConcurrency(items, limit, worker) {
  const results = [];
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current]);
    }
  });
  await Promise.all(runners);
  return results;
}

// Temporary diagnostic: reveal why GraphQL is blocked and whether image files
// (all this script really needs) are fetchable from the build environment.
async function probe() {
  console.log('[og][probe] node', process.version);
  try {
    const r = await fetch(WP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{posts(first:1){nodes{slug}}}' }),
    });
    const body = await r.text();
    console.log(`[og][probe] graphql status=${r.status} server=${r.headers.get('server')} cf-ray=${r.headers.get('cf-ray')} cf-mitigated=${r.headers.get('cf-mitigated')}`);
    console.log(`[og][probe] graphql body: ${body.replace(/\s+/g, ' ').slice(0, 180)}`);
  } catch (err) {
    console.log(`[og][probe] graphql ERR ${err.message}`);
  }
  const testImg = 'https://wp.tokoacademy.org/wp-content/uploads/2026/07/toko-academy-partners-with-sirstevehq.png';
  try {
    const r = await fetch(testImg);
    console.log(`[og][probe] image status=${r.status} type=${r.headers.get('content-type')} len=${r.headers.get('content-length')} cf-cache=${r.headers.get('cf-cache-status')}`);
  } catch (err) {
    console.log(`[og][probe] image ERR ${err.message}`);
  }
}

async function main() {
  await probe();
  await mkdir(OG_DIR, { recursive: true });

  // Default image buffer, used when an item has no source or its source fails.
  let defaultBuffer = null;
  try {
    defaultBuffer = await toOgJpeg(await readFile(DEFAULT_LOCAL_IMAGE));
    await writeFile(join(OG_DIR, 'default.jpg'), defaultBuffer);
  } catch (err) {
    console.warn(`[og] could not build default image: ${err.message}`);
  }

  const items = await collectItems();
  console.log(`[og] generating ${items.length} OG image(s) -> public/og/`);

  const manifest = {};
  let ok = 0;
  let fallback = 0;

  await runWithConcurrency(items, CONCURRENCY, async (item) => {
    const fileName = `${item.type}-${item.slug}.jpg`;
    const key = `${item.type}:${item.slug}`;
    try {
      let buffer;
      if (item.source) {
        buffer = await toOgJpeg(await fetchImageBuffer(item.source));
      } else if (defaultBuffer) {
        buffer = defaultBuffer;
        fallback += 1;
      } else {
        throw new Error('no source and no default');
      }
      await writeFile(join(OG_DIR, fileName), buffer);
      manifest[key] = `/og/${fileName}`;
      ok += 1;
    } catch (err) {
      // On failure, still give the item a picture if we have a default, so the
      // preview shows *something* rather than nothing.
      if (defaultBuffer) {
        try {
          await writeFile(join(OG_DIR, fileName), defaultBuffer);
          manifest[key] = `/og/${fileName}`;
          fallback += 1;
          return;
        } catch {
          /* fall through to omit */
        }
      }
      console.warn(`[og] skipped ${key}: ${err.message} (app will use the original image)`);
    }
  });

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`[og] done: ${ok} optimized, ${fallback} used default, ${items.length - ok} omitted`);
}

main().catch((err) => {
  // Never block the build; write an empty manifest so the import always resolves
  // and the app falls back to original images everywhere.
  console.warn(`[og] generation failed, falling back to original images: ${err?.message ?? err}`);
  writeFile(MANIFEST_PATH, '{}\n').catch(() => {});
});

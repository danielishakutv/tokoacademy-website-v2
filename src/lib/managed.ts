/**
 * What has been changed from the Website screen in ta_admin.
 *
 * The photographs and the fixed copy on this site used to live only in this
 * repository, so replacing a picture or changing a sentence meant a developer
 * and a commit. Both are now editable in ta_admin, and this is how the change
 * reaches the page.
 *
 * Read once per build. The site is a static export, so nothing here is fetched
 * in a visitor's browser — what ships is already resolved, and a change is
 * live after the next publish.
 *
 * Deliberately fails soft. If ta_admin is unreachable when the site builds,
 * every page falls back to what this repository ships and the build succeeds.
 * A marketing site that cannot deploy because an unrelated admin server is
 * restarting would be a worse problem than a photograph being a day late.
 */

const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? 'https://admin.tokoacademy.org/api/v1';

interface ManagedImage {
  url: string;
  width: number | null;
  height: number | null;
}

interface Managed {
  images: Record<string, ManagedImage>;
  content: Record<string, string>;
}

const EMPTY: Managed = { images: {}, content: {} };

/**
 * Fetched once and reused for the whole build.
 *
 * Next renders dozens of pages in one process and every `Picture` asks for
 * this; without the cache that would be one HTTP request per image on the
 * site, for data that cannot change mid-build.
 */
let cached: Promise<Managed> | null = null;

export function managed(): Promise<Managed> {
  if (cached) return cached;
  cached = (async () => {
    try {
      const response = await fetch(`${ADMIN_API}/public/website`, {
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 300 },
      });
      if (!response.ok) return EMPTY;
      const body = (await response.json()) as { data?: Managed };
      return {
        images: body.data?.images ?? {},
        content: body.data?.content ?? {},
      };
    } catch {
      // Unreachable at build time: ship what the repository has.
      return EMPTY;
    }
  })();
  return cached;
}

/**
 * The slot id for an image path.
 *
 * `/images/home/cta-graduation.jpg` → `home/cta-graduation`. Deriving it from
 * the path rather than making every call site pass one means a page that
 * already uses `Picture` becomes manageable without being touched, and the two
 * lists cannot drift apart.
 */
export function slotFor(src: string): string {
  return src.replace(/^\/images\//, '').replace(/\.(jpe?g|png|webp|avif)$/i, '');
}

/** The uploaded replacement for an image, if somebody has set one. */
export async function managedImage(src: string): Promise<ManagedImage | null> {
  const { images } = await managed();
  return images[slotFor(src)] ?? null;
}

/**
 * A line of copy, with the wording in this repository as the fallback.
 *
 * The default lives at the call site rather than here, so a page reads as the
 * words it shows — `copy('home.hero.title', 'Practical digital skills…')` is
 * legible on its own, and the page still says something sensible if ta_admin
 * has never been touched.
 */
export async function copy(key: string, fallback: string): Promise<string> {
  const { content } = await managed();
  const value = content[key];
  return value && value.trim() ? value : fallback;
}

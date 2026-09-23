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

/** One placed component on a composed page. */
export interface ManagedSection {
  /** The key into the renderer index — `hero`, `cards`, `faq`… */
  type: string;
  enabled: boolean;
  /**
   * Whatever that section's schema declares, already stripped to known fields
   * by ta_admin. Deliberately loose here: this repository does not import the
   * admin's schema, so every renderer reads its own fields defensively rather
   * than trusting a shape it cannot verify.
   */
  data: Record<string, unknown>;
}

/** A page composed in ta_admin rather than written as a file here. */
export interface ManagedPage {
  slug: string;
  title: string;
  description: string;
  sections: ManagedSection[];
}

interface Managed {
  images: Record<string, ManagedImage>;
  content: Record<string, string>;
  pages: ManagedPage[];
}

const EMPTY: Managed = { images: {}, content: {}, pages: [] };

/**
 * Pages, reduced to what a renderer can safely read.
 *
 * Everything below is guarded rather than cast. This data crosses a network
 * boundary from a separate application with its own release cycle, and the
 * failure mode of trusting it is a build that dies on `sections.map` because
 * one row came back null — taking the whole site offline over one page
 * somebody was still drafting.
 */
function readPages(raw: unknown): ManagedPage[] {
  if (!Array.isArray(raw)) return [];
  const pages: ManagedPage[] = [];

  for (const entry of raw) {
    const page = (entry ?? {}) as Record<string, unknown>;
    const slug = typeof page.slug === 'string' ? page.slug.trim() : '';
    // No slug, no URL, so there is nowhere to put it.
    if (!slug) continue;

    const sections = Array.isArray(page.sections) ? page.sections : [];

    pages.push({
      slug,
      title: typeof page.title === 'string' ? page.title : '',
      description: typeof page.description === 'string' ? page.description : '',
      sections: sections
        .map((item) => {
          const section = (item ?? {}) as Record<string, unknown>;
          const type = typeof section.type === 'string' ? section.type : '';
          return {
            type,
            // Absent means shown: a section is only hidden by being switched off.
            enabled: section.enabled !== false,
            data:
              section.data && typeof section.data === 'object' && !Array.isArray(section.data)
                ? (section.data as Record<string, unknown>)
                : {},
          };
        })
        .filter((section) => section.type !== ''),
    });
  }

  return pages;
}

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
      const body = (await response.json()) as { data?: Partial<Managed> };
      return {
        images: body.data?.images ?? {},
        content: body.data?.content ?? {},
        pages: readPages(body.data?.pages),
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

/**
 * Every page composed in ta_admin.
 *
 * An empty list is the normal answer before anybody has built one, and also
 * the answer when ta_admin is unreachable — so `/p/<slug>` simply has no
 * pages in it and the rest of the site builds as it always did.
 */
export async function managedPages(): Promise<ManagedPage[]> {
  const { pages } = await managed();
  return pages;
}

/** One composed page, or null if nothing answers to that slug. */
export async function managedPage(slug: string): Promise<ManagedPage | null> {
  const pages = await managedPages();
  return pages.find((page) => page.slug === slug) ?? null;
}

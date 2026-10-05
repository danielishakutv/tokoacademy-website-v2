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

/** Which band of the team page somebody appears in. */
export type TeamGroup = 'leadership' | 'team' | 'trainers' | 'board' | 'advisors';

/**
 * Somebody the academy presents as part of itself.
 *
 * Maintained in ta_admin, and deliberately not derived from anybody's staff
 * record: the title is the one the academy chose for this page, the profile is
 * written for a stranger, and board members and advisors are on it without
 * ever having been employees.
 *
 * Only published entries reach this feed, so there is no flag here to check —
 * an entry somebody is still drafting is simply absent.
 */
export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  headline: string;
  bio: string;
  group: TeamGroup;
  photo: ManagedImage | null;
  email: string;
  phone: string;
  links: TeamLink[];
}

/** A profile to follow, already filtered down to a scheme we will render. */
export interface TeamLink {
  /** `linkedin`, `x`, `instagram`, `facebook`, `github`, `website`. */
  kind: TeamLinkKind;
  label: string;
  href: string;
}

export type TeamLinkKind = 'linkedin' | 'x' | 'instagram' | 'facebook' | 'github' | 'website';

interface Managed {
  images: Record<string, ManagedImage>;
  content: Record<string, string>;
  pages: ManagedPage[];
  team: TeamMember[];
}

const EMPTY: Managed = { images: {}, content: {}, pages: [], team: [] };

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

/** The bands of the team page, in the order the page draws them. */
export const TEAM_GROUPS: TeamGroup[] = ['leadership', 'team', 'trainers', 'board', 'advisors'];

const GROUPS = new Set<string>(TEAM_GROUPS);

/**
 * A link somebody typed in the admin, kept only if it is safe to put in an
 * `href`.
 *
 * ta_admin validates the scheme on the way in, and this checks it again on the
 * way out, because the whole value of that check is lost if this side assumes
 * it happened. A `javascript:` URL rendered into a link on a public page is
 * script execution on tokoacademy.org for whoever clicks a staff member's
 * LinkedIn icon — and this is a static export, so it would be baked into the
 * HTML rather than being something a later fix could intercept.
 */
function readLink(raw: unknown, kind: TeamLinkKind, label: string): TeamLink | null {
  if (typeof raw !== 'string') return null;
  const href = raw.trim();
  if (!href || !/^https?:\/\//i.test(href)) return null;
  return { kind, label, href };
}

/** A string field, trimmed, with '' for anything that is not one. */
function str(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * The team, reduced to what the pages can safely render.
 *
 * Guarded the same way `readPages` is, and for the same reason: this crosses a
 * network boundary from an application with its own release cycle, and the
 * failure mode of trusting it is a build that dies on one malformed row —
 * taking the whole site offline over one profile somebody was editing.
 *
 * An entry with no name is dropped: it has nothing to draw and nothing to say,
 * and a card showing a photograph of an unnamed person is worse than no card.
 */
function readTeam(raw: unknown): TeamMember[] {
  if (!Array.isArray(raw)) return [];
  const members: TeamMember[] = [];

  for (const entry of raw) {
    const row = (entry ?? {}) as Record<string, unknown>;
    const name = str(row, 'name');
    const slug = str(row, 'slug');
    if (!name || !slug) continue;

    const group = str(row, 'group');
    const photoUrl = str(row, 'photoUrl');
    const width = Number(row.photoWidth);
    const height = Number(row.photoHeight);

    members.push({
      slug,
      name,
      role: str(row, 'role'),
      headline: str(row, 'headline'),
      bio: str(row, 'bio'),
      // An unrecognised group means ta_admin is a release ahead of this repo.
      // Falling back to the main list keeps the person on the page, which is
      // better than dropping them for being in a band this build cannot name.
      group: GROUPS.has(group) ? (group as TeamGroup) : 'team',
      photo: photoUrl
        ? {
            url: photoUrl,
            width: Number.isFinite(width) && width > 0 ? width : null,
            height: Number.isFinite(height) && height > 0 ? height : null,
          }
        : null,
      email: str(row, 'email'),
      phone: str(row, 'phone'),
      links: [
        readLink(row.linkedinUrl, 'linkedin', 'LinkedIn'),
        readLink(row.twitterUrl, 'x', 'X'),
        readLink(row.instagramUrl, 'instagram', 'Instagram'),
        readLink(row.facebookUrl, 'facebook', 'Facebook'),
        readLink(row.githubUrl, 'github', 'GitHub'),
        readLink(row.websiteUrl, 'website', 'Website'),
      ].filter((link): link is TeamLink => link !== null),
    });
  }

  return members;
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
        team: readTeam(body.data?.team),
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

/**
 * Everybody on the team page, in the order they are meant to read.
 *
 * An empty list is the normal answer before anybody has been added, and also
 * the answer when ta_admin is unreachable at build time. `/team` says so
 * plainly in that case rather than drawing an empty grid, and no profile pages
 * are generated — which is correct either way, because there is nothing to put
 * on them.
 */
export async function managedTeam(): Promise<TeamMember[]> {
  const { team } = await managed();
  return team;
}

/** One profile, or null if nothing answers to that slug. */
export async function managedTeamMember(slug: string): Promise<TeamMember | null> {
  const team = await managedTeam();
  return team.find((member) => member.slug === slug) ?? null;
}

/**
 * Whether a member has enough to fill a page of their own.
 *
 * The grid links to a profile page only when there is something on it. A card
 * for somebody with a name and a title is a reasonable thing for the page to
 * show; a dedicated page containing a name and a title is a thin page that
 * tells a visitor nothing and gives a search engine a reason to think less of
 * the site. So the same test decides both the link and whether the page is
 * built at all, and the two cannot drift apart.
 */
export function hasProfilePage(member: TeamMember): boolean {
  return Boolean(member.bio || member.email || member.phone || member.links.length > 0);
}

/** The members of one band, in feed order. */
export function teamIn(team: TeamMember[], group: TeamGroup): TeamMember[] {
  return team.filter((member) => member.group === group);
}

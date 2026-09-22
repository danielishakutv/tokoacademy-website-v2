/**
 * Courses, read from the one place they are actually maintained.
 *
 * Until now this site listed courses from the legacy PHP registration app at
 * app.tokoacademy.org, while the learning platform at learn.tokoacademy.org
 * held the real ones — the prices people pay, the curricula they are taught,
 * the enrolments. Two catalogues, edited separately, inevitably disagreeing:
 * the site advertised courses that no longer ran and never showed the ones
 * that did.
 *
 * There is now one catalogue. This module reads it, and the PHP app is being
 * retired.
 *
 * Everything here runs at BUILD time. The site is a static export
 * (`output: 'export'`), so there is no server to fetch anything later — the
 * HTML that ships is the HTML a visitor gets. That is why a course change in
 * the admin needs a rebuild to appear, and why the platform pings this repo's
 * deploy webhook when a course is published.
 */

const API = process.env.DLC_API_URL ?? 'https://learn.tokoacademy.org';

/** A course as the catalogue lists it. */
export interface DlcCourseCard {
  id: string;
  slug: string;
  title: string;
  icon: string;
  thumbnailUrl: string | null;
  description: string;
  price: number;
  currency: string;
  hours: number;
  lessonCount: number;
  quizzes: number;
  hasCertificate: boolean;
  deliveryMode: 'self_paced' | 'blended' | string;
  enrolledCount: number;
  school: { id: string; name: string; slug: string } | null;
  type: { id: string; name: string; slug: string } | null;
  audiences: { id: string; name: string; slug: string }[];
}

/** One course, with everything the detail page shows. */
export interface DlcCourse extends Omit<DlcCourseCard, 'lessonCount'> {
  about: string;
  curriculum: { title: string; lessons: { title: string; duration: string | null }[] }[];
  faqs: { question: string; answer: string }[];
}

/**
 * Links people already have.
 *
 * The old catalogue's URLs were built from a course code — `/courses/daav`,
 * `/courses/wd-nc`. Those links are in emails, on flyers, in Google's index
 * and in people's bookmarks, and none of them stop existing because we changed
 * where courses are stored. Each one still resolves; it renders the course it
 * always meant, with a canonical tag pointing at the new address so the search
 * ranking follows rather than splits.
 *
 * `null` means the course is genuinely retired. Those pages say so plainly
 * instead of 404ing, because "no longer offered, here is what we do run" keeps
 * somebody on the site and a 404 does not.
 */
export const LEGACY_SLUGS: Record<string, string | null> = {
  // Course codes from the PHP app
  'ai-chat': 'ai-powered-chatbots',
  'ai-ess': 'ai-essentials',
  'cyb-fu': 'cybersecurity-fundamentals',
  daav: 'data-analysis-visualization',
  'dm-cc': 'digital-marketing',
  py: 'python-programming',
  'kids-scr': 'scratch-programming',
  // The two web development streams were retired in favour of the new pair.
  'wd-nc': 'web-development-foundations', // was the CMS / no-code stream
  wdc: 'web-development', // was the code stream
  'ai-pr': null, // AI for Productivity
  'ai-web': null, // AI Web Development
  'uiux-de': null, // UI/UX Design

  // Slugs the site itself used before the PHP catalogue
  'data-analysis': 'data-analysis-visualization',
  'ai-automation': 'ai-powered-chatbots',
  'microsoft-packages': 'digital-foundations',
  'mobile-app': null,
  'graphics-design': null,
  'ui-ux-design': null,
};

/** The typo that was live long enough to be linked to. */
export const MISSPELT_SLUGS: Record<string, string> = {
  'data-analysis-visuatlization': 'data-analysis-visualization',
};

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API}/api/public${path}`, {
    // Inert under static export, but correct if this site ever gains a server.
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error(`DLC ${path} returned ${response.status}`);
  }
  return (await response.json()) as T;
}

/**
 * Every published course.
 *
 * This throws rather than returning an empty list, and the build fails with
 * it. That is deliberate: a catalogue page with no courses on it is worse than
 * yesterday's build staying up, and a silent empty array would deploy exactly
 * that without anybody noticing.
 */
export async function getCourses(): Promise<DlcCourseCard[]> {
  const body = await get<{ courses: DlcCourseCard[] }>('/courses');
  if (!Array.isArray(body.courses) || body.courses.length === 0) {
    throw new Error('The course catalogue came back empty — refusing to build a site with no courses.');
  }
  return body.courses;
}

/** One course by slug, following a legacy or misspelt slug to its real one. */
export async function getCourse(slug: string): Promise<DlcCourse | null> {
  const real = resolveSlug(slug);
  if (!real) return null;
  try {
    return await get<DlcCourse>(`/courses/${encodeURIComponent(real)}`);
  } catch {
    return null;
  }
}

/**
 * The real slug behind whatever was in the URL.
 *
 * Returns null for a slug we know refers to a retired course, so the caller can
 * say so rather than showing a 404 to somebody who followed our own old link.
 */
export function resolveSlug(slug: string): string | null {
  if (slug in LEGACY_SLUGS) return LEGACY_SLUGS[slug];
  if (slug in MISSPELT_SLUGS) return MISSPELT_SLUGS[slug];
  return slug;
}

/** Whether this URL is an old one we are still honouring. */
export function isLegacySlug(slug: string): boolean {
  return slug in LEGACY_SLUGS || slug in MISSPELT_SLUGS;
}

/** Headline counters, straight from the platform. */
export async function getStats(): Promise<{
  totalCourses: number;
  totalEnrollments: number;
  totalCertificates: number;
} | null> {
  try {
    return await get('/stats');
  } catch {
    // A missing number is a number left off a page, not a failed build.
    return null;
  }
}

const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

/** What a course costs, or that it is free. */
export function formatPrice(price: number): string {
  return price > 0 ? naira.format(price) : 'Free';
}

/** How the course is delivered, in the words the site uses. */
export function deliveryLabel(mode: string): string {
  return mode === 'self_paced' ? 'Self-paced' : 'Scheduled classes';
}

/** Total lessons across a course's modules. */
export function countLessons(curriculum: DlcCourse['curriculum']): number {
  return curriculum.reduce((total, section) => total + section.lessons.length, 0);
}

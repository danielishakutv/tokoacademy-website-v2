import { MetadataRoute } from 'next'
import { fetchNewsArticles, fetchGalleryAlbums, fetchEventPosts } from '@/lib/wordpress'
import { getCourses } from '@/lib/dlc'
import { canonical } from '@/lib/seo'

/**
 * The sitemap.
 *
 * Three corrections over the previous version:
 *
 * 1. Every URL now ends in a trailing slash, via `canonical()`. `trailingSlash`
 *    is on in next.config.js, so `/about` 301s to `/about/`. Submitting the
 *    redirecting form made Google follow a hop to reach every single page and
 *    disagreed with the canonical tags on those pages.
 *
 * 2. Pages that existed but were missing: /impact, /thematic-areas, the twelve
 *    course detail pages, and the policy pages (/privacy, /terms,
 *    /safeguarding). The policy pages carry low priority — they are not what we
 *    want to rank for — but a safeguarding policy is a genuine trust signal for
 *    an organisation that teaches children, and it should be discoverable.
 *
 * 3. `lastModified` is no longer `new Date()` everywhere. A timestamp that
 *    changes on every build, on every page, tells a crawler that all 40-odd
 *    pages changed the moment we deployed — so it learns to ignore the field.
 *    Static marketing pages now carry the build date only because that is the
 *    honest upper bound of when their content could have changed; WordPress-
 *    backed content carries its own published date instead.
 *
 * Deliberately NOT here:
 *   - /home-v1-original and /home-v2-hybrid — abandoned homepage drafts, both
 *     noindex. Listing a noindex page in a sitemap is a direct contradiction and
 *     Search Console flags it.
 *   - /profile — the legacy mock. It no longer exists in the app and returns
 *     404 in production; verified, nothing to remove.
 *   - /404.
 */

/**
 * One timestamp for the whole build, so static pages at least agree with each
 * other instead of each carrying a different millisecond.
 */
const BUILD_DATE = new Date()

/**
 * The real date on a WordPress item, falling back to the build date if the
 * field is missing or unparseable. The API gives us the published date rather
 * than a modified date; for an article or an album that is close enough, and it
 * is vastly better than stamping today on a post from two years ago.
 */
function publishedDate(item: { date?: string | null }): Date {
  if (item.date) {
    const parsed = new Date(item.date)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return BUILD_DATE
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    // Priority is relative and only meaningful within this file: the homepage
    // and the two pages that convert (courses, zero2live) sit at the top.
    { url: canonical('/'), lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 1 },
    { url: canonical('/courses'), lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: canonical('/zero2live'), lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: canonical('/about'), lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: canonical('/kids'), lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: canonical('/corporate'), lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: canonical('/impact'), lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: canonical('/thematic-areas'), lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: canonical('/partners'), lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: canonical('/schedules'), lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.8 },
    { url: canonical('/news'), lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.8 },
    { url: canonical('/events'), lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.7 },
    { url: canonical('/gallery'), lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.7 },
    { url: canonical('/contact'), lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.7 },
    // Policy pages: rarely change, rarely the destination, but they should be
    // findable — especially safeguarding, for a body that teaches children.
    { url: canonical('/safeguarding'), lastModified: BUILD_DATE, changeFrequency: 'yearly', priority: 0.4 },
    { url: canonical('/privacy'), lastModified: BUILD_DATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: canonical('/terms'), lastModified: BUILD_DATE, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Course detail pages. `getCourses()` is the same call the catalogue page
  // makes and it throws rather than returning an empty list, so a sitemap can
  // never silently ship without the courses in it. Only canonical slugs: the
  // legacy and misspelt aliases in src/lib/dlc.ts are built so old links keep
  // working, and listing them would be submitting known duplicates.
  const courses = await getCourses()
  const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
    url: canonical(`/courses/${course.slug}`),
    lastModified: BUILD_DATE,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const newsItems = await fetchNewsArticles()
  const newsRoutes: MetadataRoute.Sitemap = newsItems.map((item) => ({
    url: canonical(`/news/${item.slug}`),
    lastModified: publishedDate(item),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  const galleryAlbums = await fetchGalleryAlbums()
  const galleryRoutes: MetadataRoute.Sitemap = galleryAlbums.map((album) => ({
    url: canonical(`/gallery/${album.slug}`),
    lastModified: publishedDate(album),
    changeFrequency: 'yearly',
    priority: 0.5,
  }))

  const events = await fetchEventPosts()
  const eventRoutes: MetadataRoute.Sitemap = events.map((eventItem) => ({
    url: canonical(`/events/${eventItem.slug}`),
    lastModified: publishedDate(eventItem),
    changeFrequency: 'yearly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...courseRoutes, ...newsRoutes, ...galleryRoutes, ...eventRoutes]
}

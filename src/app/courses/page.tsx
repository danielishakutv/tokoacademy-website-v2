import type { Metadata } from 'next';
import Link from 'next/link';
import { IconWrapper } from '@/components/IconWrapper';
import CourseThumbnail from '@/components/CourseThumbnail';
import { getCourses, formatPrice, deliveryLabel, thumbnailUrl, type DlcCourseCard } from '@/lib/dlc';

/**
 * Everything Toko Academy actually teaches.
 *
 * This page listed six courses hardcoded in `src/data/courses.ts` — a list
 * that had not matched the academy for a long time. Courses created in the
 * admin never appeared, and the six that did appear linked to detail pages for
 * courses nobody was running. It was, in effect, a shop window showing stock
 * that did not exist while hiding the stock that did.
 *
 * It now reads the published catalogue from the learning platform, grouped by
 * school, at build time. The grouping is not decoration: the site's main menu
 * links to a school, so `#school-<slug>` here is what those links land on.
 */

export const metadata: Metadata = {
  title: 'Our Courses - Learn In-Demand Digital Skills',
  description:
    'Training courses from Toko Academy across digital literacy, software engineering, data, AI and creative technology — taught in person in Abuja and online.',
  keywords: [
    'digital skills courses Nigeria',
    'training Abuja',
    'web development training',
    'data analysis course',
    'cybersecurity training Nigeria',
    'AI courses Nigeria',
  ],
  alternates: { canonical: 'https://tokoacademy.org/courses' },
  openGraph: {
    title: 'Toko Academy Courses',
    description: 'Industry-relevant training in digital skills, taught in person and online.',
    url: 'https://tokoacademy.org/courses',
    type: 'website',
    images: [
      {
        url: 'https://tokoacademy.org/images/hero/professional-courses.jpg',
        width: 1200,
        height: 630,
        alt: 'Toko Academy Courses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toko Academy Courses',
    description: 'Industry-relevant training in digital skills, taught in person and online.',
    images: ['https://tokoacademy.org/images/hero/professional-courses.jpg'],
  },
};

/** Courses in the order a school's own courses should read: cheapest entry point first. */
function bySchool(courses: DlcCourseCard[]) {
  const groups = new Map<string, { name: string; slug: string; courses: DlcCourseCard[] }>();
  const ungrouped: DlcCourseCard[] = [];

  for (const course of courses) {
    if (!course.school) {
      ungrouped.push(course);
      continue;
    }
    const existing = groups.get(course.school.slug);
    if (existing) existing.courses.push(course);
    else groups.set(course.school.slug, { name: course.school.name, slug: course.school.slug, courses: [course] });
  }

  const ordered = Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name));
  for (const group of ordered) group.courses.sort((a, b) => a.price - b.price);
  ungrouped.sort((a, b) => a.price - b.price);
  return { groups: ordered, ungrouped };
}

export default async function CoursesPage() {
  const courses = await getCourses();
  const { groups, ungrouped } = bySchool(courses);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-14 md:pt-40 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative">
          <div className="mx-auto max-w-3xl text-center reveal">
            <p className="eyebrow">What we teach</p>
            <h1 className="mt-3">Our Courses</h1>
            <p className="prose-measure mx-auto mt-5 text-lg text-ink-muted md:text-xl">
              {courses.length} courses across digital literacy, software engineering, data, AI and
              creative technology — most taught in person, some at your own pace.
            </p>
          </div>
        </div>
      </section>

      {/* Jump to a school. These are the anchors the main menu links to.

          The offsets track the fixed header's height, and are deliberately a
          few pixels short of it: tucking this bar under the header's edge is
          invisible, whereas being a few pixels below it shows a sliver of the
          page sliding past. */}
      {groups.length > 1 && (
        <section className="sticky top-[60px] z-30 border-b border-line bg-surface/95 backdrop-blur md:top-[96px] lg:top-[100px]">
          <div className="section-container py-3">
            {/* Horizontal scroll rather than four wrapped rows of chips eating
                a third of a 360px screen. */}
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
              {groups.map((group) => (
                <a
                  key={group.slug}
                  href={`#school-${group.slug}`}
                  className="shrink-0 whitespace-nowrap rounded-full bg-surface-sunken px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-brand hover:text-white"
                >
                  {group.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-surface">
        <div className="section-container space-y-16">
          {groups.map((group) => (
            <div key={group.slug} id={`school-${group.slug}`} className="scroll-mt-36">
              <h2 className="mb-2">{group.name}</h2>
              <p className="mb-8 text-ink-subtle">
                {group.courses.length} {group.courses.length === 1 ? 'course' : 'courses'}
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {group.courses.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            </div>
          ))}

          {ungrouped.length > 0 && (
            <div id="school-other" className="scroll-mt-36">
              <h2 className="mb-8">More courses</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {ungrouped.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Courses */}
      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="mb-12 text-center reveal">
            <p className="eyebrow">Why us</p>
            <h2 className="mt-3">Why Choose Our Courses?</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Reason
              icon="material-symbols:school-rounded"
              title="Taught by practitioners"
              body="Sessions are run by people who do this work, not only teach it."
            />
            <Reason
              icon="material-symbols:home-repair-service-rounded"
              title="Built around projects"
              body="You leave with work you can show, not only notes you can read."
            />
            <Reason
              icon="material-symbols:schedule-rounded"
              title="In person or at your pace"
              body="Scheduled classes for those who want a room and a cohort; self-paced tracks for those who do not."
            />
            <Reason
              icon="material-symbols:workspace-premium-rounded"
              title="A certificate that can be checked"
              body="Every certificate carries an ID an employer can verify online."
            />
          </div>
        </div>
      </section>

      {/* CTA. A saturated brand band, so the type on it stays white in both
          themes — that is what `text-white` is for. */}
      <section className="section-padding bg-gradient-to-r from-toko-green to-toko-blue">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center text-white reveal">
            <h2 className="text-white">Not sure which one?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/95">
              Tell us what you want to be able to do and we will point you at the right course —
              or tell you honestly if we do not run it.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="btn-primary bg-white text-toko-green hover:bg-white/90">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CourseCard({ course }: { course: DlcCourseCard }) {
  const selfPaced = course.deliveryMode === 'self_paced';

  return (
    <Link
      href={`/courses/${course.slug}`}
      id={course.slug}
      className="card group flex scroll-mt-36 flex-col p-5 sm:p-6 reveal"
    >
      <div className="mb-4">
        <CourseThumbnail
          id={course.slug}
          title={course.title}
          src={thumbnailUrl(course.thumbnailUrl)}
          duration={course.hours > 0 ? `${course.hours} hrs` : undefined}
        />
      </div>

      <h3 className="mb-2 transition-colors group-hover:text-brand">{course.title}</h3>
      <p className="mb-4 flex-1 text-ink-muted">{course.description}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded bg-toko-blue/10 px-3 py-1 text-sm font-medium text-toko-blue-dark dark:text-toko-blue-light">
          {deliveryLabel(course.deliveryMode)}
        </span>
        {/* Hours are on the thumbnail badge already — saying it twice on one
            card reads as a mistake. */}
        {course.hasCertificate && (
          <span className="rounded bg-toko-magenta/10 px-3 py-1 text-sm font-medium text-toko-magenta-dark dark:text-toko-magenta-light">
            Certificate
          </span>
        )}
      </div>

      {course.audiences.length > 0 && (
        <p className="mb-4 text-xs text-ink-subtle">
          For {course.audiences.map((audience) => audience.name).join(', ')}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
        <span className="text-lg font-bold text-ink">{formatPrice(course.price)}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-brand">
          {selfPaced ? 'Start now' : 'View details'}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function Reason({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="text-center reveal">
      <div className="mb-4 flex justify-center">
        <IconWrapper icon={icon} className="h-12 w-12 text-brand" ariaHidden />
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-ink-muted">{body}</p>
    </div>
  );
}

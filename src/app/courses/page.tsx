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
      <section className="pt-48 md:pt-56 pb-16 md:pb-20 bg-gradient-to-br from-toko-magenta to-toko-blue text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Our Courses</h1>
            <p className="text-xl md:text-2xl text-white/95">
              {courses.length} courses across digital literacy, software engineering, data, AI and
              creative technology — most taught in person, some at your own pace.
            </p>
          </div>
        </div>
      </section>

      {/* Jump to a school. These are the anchors the main menu links to. */}
      {groups.length > 1 && (
        <section className="bg-white border-b border-toko-gray-200 sticky top-0 z-30">
          <div className="section-container py-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {groups.map((group) => (
                <a
                  key={group.slug}
                  href={`#school-${group.slug}`}
                  className="px-4 py-2 rounded-full bg-toko-gray-100 text-sm font-medium text-toko-gray-700 hover:bg-toko-green hover:text-white transition-colors"
                >
                  {group.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="section-container space-y-16">
          {groups.map((group) => (
            <div key={group.slug} id={`school-${group.slug}`} className="scroll-mt-32">
              <h2 className="text-toko-gray-900 mb-2">{group.name}</h2>
              <p className="text-toko-gray-500 mb-8">
                {group.courses.length} {group.courses.length === 1 ? 'course' : 'courses'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.courses.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            </div>
          ))}

          {ungrouped.length > 0 && (
            <div id="school-other" className="scroll-mt-32">
              <h2 className="text-toko-gray-900 mb-8">More courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ungrouped.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Courses */}
      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">Why Choose Our Courses?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-toko-green to-toko-blue">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-white mb-6">Not sure which one?</h2>
            <p className="text-xl mb-8 text-white/95">
              Tell us what you want to be able to do and we will point you at the right course —
              or tell you honestly if we do not run it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary bg-white text-toko-green hover:bg-toko-gray-100">
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
      className="card p-6 flex flex-col scroll-mt-32 hover:shadow-toko-lg transition-shadow group"
    >
      <div className="mb-4">
        <CourseThumbnail
          id={course.slug}
          title={course.title}
          src={thumbnailUrl(course.thumbnailUrl)}
          duration={course.hours > 0 ? `${course.hours} hrs` : undefined}
        />
      </div>

      <h3 className="text-xl font-bold text-toko-gray-900 mb-2 group-hover:text-toko-green transition-colors">
        {course.title}
      </h3>
      <p className="text-toko-gray-600 mb-4 flex-1">{course.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-toko-blue/10 text-toko-blue text-sm font-medium rounded">
          {deliveryLabel(course.deliveryMode)}
        </span>
        {/* Hours are on the thumbnail badge already — saying it twice on one
            card reads as a mistake. */}
        {course.hasCertificate && (
          <span className="px-3 py-1 bg-toko-magenta/10 text-toko-magenta text-sm font-medium rounded">
            Certificate
          </span>
        )}
      </div>

      {course.audiences.length > 0 && (
        <p className="text-xs text-toko-gray-500 mb-4">
          For {course.audiences.map((audience) => audience.name).join(', ')}
        </p>
      )}

      <div className="pt-4 border-t border-toko-gray-200 flex items-center justify-between">
        <span className="text-lg font-bold text-toko-gray-900">{formatPrice(course.price)}</span>
        <span className="text-toko-green font-semibold inline-flex items-center gap-1">
          {selfPaced ? 'Start now' : 'View details'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function Reason({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <IconWrapper icon={icon} className="w-12 h-12 text-toko-green" ariaHidden />
      </div>
      <h3 className="text-xl font-bold text-toko-gray-900 mb-2">{title}</h3>
      <p className="text-toko-gray-600">{body}</p>
    </div>
  );
}

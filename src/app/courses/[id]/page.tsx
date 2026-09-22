import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getCourse,
  getCourses,
  resolveSlug,
  isLegacySlug,
  formatPrice,
  deliveryLabel,
  countLessons,
  thumbnailUrl,
  LEGACY_SLUGS,
  MISSPELT_SLUGS,
  type DlcCourse,
} from '@/lib/dlc';
import CourseThumbnail from '@/components/CourseThumbnail';
import EnrolPanel from './EnrolPanel';

/**
 * One course, as somebody decides whether to pay for it.
 *
 * This used to fetch the legacy PHP registration app twice — once at build for
 * the title, then again in the browser on every view for everything else — and
 * render fields that app had and the real catalogue does not: an instructor
 * biography, a week count, a "syllabus coming soon" placeholder. It also
 * showed a 15% discount worked out in the browser with `price * 0.85` and a
 * "15% OFF TODAY" badge that was on the page every day of the year.
 *
 * It now renders, on the server, from the course record the academy actually
 * maintains: the real price, the real module-by-module curriculum, and the
 * real answers to the questions buyers ask. Nothing is fetched in the browser,
 * so the page is fast, crawlable, and shows the same thing to a person and to
 * Google.
 */

const SITE = 'https://tokoacademy.org';

export const dynamicParams = false;

/**
 * Every URL this route answers on: today's courses, plus every address a
 * course has ever had. Old links are in flyers, emails and Google's index,
 * and they do not stop existing because the catalogue moved.
 */
export async function generateStaticParams() {
  const courses = await getCourses();
  const ids = new Set<string>(courses.map((course) => course.slug));
  for (const legacy of Object.keys(LEGACY_SLUGS)) ids.add(legacy);
  for (const misspelt of Object.keys(MISSPELT_SLUGS)) ids.add(misspelt);
  return Array.from(ids, (id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const course = await getCourse(params.id);
  // Titles here are the course name alone: the root layout's title template
  // (`%s | Toko Academy`) adds the academy's name, so repeating it produces
  // "Python Programming - Toko Academy | Toko Academy" in the tab and in search.
  if (!course) {
    return {
      title: 'Course not available',
      description: 'This course is no longer offered. See the courses Toko Academy runs today.',
      robots: { index: false, follow: true },
    };
  }

  // A legacy address points its ranking at the real one rather than competing
  // with it for the same content.
  const canonical = `${SITE}/courses/${course.slug}`;
  // Absolute, because a social card is fetched by Facebook's or Twitter's
  // servers, which have no idea what a path relative to our host means.
  const shareImage = thumbnailUrl(course.thumbnailUrl) ?? `${SITE}/images/courses/default_course_image.webp`;

  return {
    title: course.title,
    description: course.description,
    keywords: [course.title, 'Toko Academy', 'training Nigeria', 'digital skills', course.school?.name ?? ''].filter(Boolean),
    alternates: { canonical },
    openGraph: {
      title: `${course.title} - Toko Academy`,
      description: course.description,
      url: canonical,
      type: 'website',
      images: [{ url: shareImage, width: 1200, height: 630, alt: course.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${course.title} - Toko Academy`,
      description: course.description,
      images: [shareImage],
    },
  };
}

/**
 * The course overview, rendered without a markdown library.
 *
 * The stored text is paragraphs and the occasional heading, so that is all
 * this handles — and because it only ever emits text nodes, there is no path
 * from the database to raw HTML on the page.
 */
function Overview({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const heading = /^#{2,3}\s+(.*)$/.exec(block);
        if (heading) {
          return (
            <h3 key={index} className="text-2xl font-bold text-toko-gray-900 pt-2">
              {heading[1]}
            </h3>
          );
        }
        return (
          <p key={index} className="text-lg text-toko-gray-600 leading-relaxed">
            {block.replace(/\*\*/g, '')}
          </p>
        );
      })}
    </div>
  );
}

/** What somebody sees if they follow a link to a course that is no longer run. */
function Retired() {
  return (
    <>
      <section className="pt-48 md:pt-56 pb-16 md:pb-20 bg-gradient-to-br from-toko-magenta to-toko-blue text-white">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">This course is no longer offered</h1>
            <p className="text-xl text-white/95">
              Our curriculum changed and this one has been retired. Everything we teach today is
              on the courses page — several of them cover the same ground in more depth.
            </p>
          </div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="section-container text-center">
          <Link href="/courses" className="btn-primary">
            See our current courses
          </Link>
        </div>
      </section>
    </>
  );
}

export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  if (!course) return <Retired />;

  const selfPaced = course.deliveryMode === 'self_paced';
  const lessons = countLessons(course.curriculum);
  const priceLabel = formatPrice(course.price);
  const onLegacyUrl = isLegacySlug(params.id) && resolveSlug(params.id) === course.slug;

  return (
    <>
      {/* Hero */}
      <section className="pt-48 md:pt-56 pb-16 md:pb-20 bg-gradient-to-br from-toko-magenta to-toko-blue text-white">
        <div className="section-container">
          <nav className="text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            {' / '}
            <Link href="/courses" className="hover:text-white">Courses</Link>
            {' / '}
            <span className="text-white">{course.title}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/15 text-sm font-semibold">
                {deliveryLabel(course.deliveryMode)}
              </span>
              {course.hasCertificate && (
                <span className="px-3 py-1 rounded-full bg-white/15 text-sm font-semibold">
                  Certificate
                </span>
              )}
              {course.school && (
                <span className="px-3 py-1 rounded-full bg-white/15 text-sm font-semibold">
                  {course.school.name}
                </span>
              )}
            </div>

            <h1 className="mb-6">{course.title}</h1>
            <p className="text-xl md:text-2xl text-white/95">{course.description}</p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-8 text-white/90">
              {course.hours > 0 && (
                <span><strong className="text-white">{course.hours}</strong> hours</span>
              )}
              {lessons > 0 && (
                <span><strong className="text-white">{lessons}</strong> lessons</span>
              )}
              {course.curriculum.length > 0 && (
                <span><strong className="text-white">{course.curriculum.length}</strong> modules</span>
              )}
              {course.enrolledCount > 0 && (
                <span><strong className="text-white">{course.enrolledCount}</strong> enrolled</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section-padding bg-white">
        <div className="section-container">
          {onLegacyUrl && (
            <p className="mb-8 rounded-lg bg-toko-gray-50 border border-toko-gray-200 px-4 py-3 text-sm text-toko-gray-600">
              You followed an older link. This course now lives at{' '}
              <Link href={`/courses/${course.slug}`} className="font-semibold text-toko-green hover:underline">
                /courses/{course.slug}
              </Link>
              .
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {course.about && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-toko-gray-900 mb-6">About this course</h2>
                  <Overview text={course.about} />
                </div>
              )}

              {course.curriculum.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-toko-gray-900 mb-2">What you will cover</h2>
                  <p className="text-toko-gray-500 mb-6">
                    {course.curriculum.length} modules, {lessons} sessions.
                  </p>
                  <div className="space-y-6">
                    {course.curriculum.map((module, index) => (
                      <div key={index} className="border-l-4 border-toko-green bg-toko-gray-50 rounded p-5">
                        <h3 className="font-bold text-toko-gray-900 mb-3">{module.title}</h3>
                        <ul className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li
                              key={lessonIndex}
                              className="flex items-baseline justify-between gap-4 text-toko-gray-600"
                            >
                              <span>{lesson.title}</span>
                              {lesson.duration && (
                                <span className="shrink-0 text-sm text-toko-gray-400">{lesson.duration}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {course.faqs.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-toko-gray-900 mb-6">Questions people ask</h2>
                  <div className="space-y-4">
                    {course.faqs.map((faq, index) => (
                      <details key={index} className="group rounded-lg border border-toko-gray-200 p-5">
                        <summary className="cursor-pointer font-semibold text-toko-gray-900 marker:content-['']">
                          {faq.question}
                        </summary>
                        <p className="mt-3 text-toko-gray-600 leading-relaxed">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 bg-toko-gray-50 rounded-lg p-8">
                <div className="mb-6">
                  <CourseThumbnail
                    id={course.slug}
                    title={course.title}
                    src={thumbnailUrl(course.thumbnailUrl)}
                    priority
                  />
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-toko-magenta">{priceLabel}</span>
                  <p className="text-toko-gray-600 mt-2">{deliveryLabel(course.deliveryMode)}</p>
                </div>

                <EnrolPanel
                  slug={course.slug}
                  title={course.title}
                  price={course.price}
                  priceLabel={priceLabel}
                  selfPaced={selfPaced}
                />

                <a
                  href={`mailto:info@tokoacademy.org?subject=${encodeURIComponent(`Question about ${course.title}`)}`}
                  className="mt-4 block w-full rounded-lg border-2 border-toko-gray-200 bg-white px-6 py-3 text-center font-semibold text-toko-gray-900 transition-colors hover:bg-toko-gray-100"
                >
                  Ask a question
                </a>

                <dl className="space-y-4 pt-8 mt-8 border-t border-toko-gray-200">
                  <Fact label="Format" value={deliveryLabel(course.deliveryMode)} />
                  {course.hours > 0 && <Fact label="Contact hours" value={`${course.hours} hours`} />}
                  {lessons > 0 && <Fact label="Sessions" value={`${lessons} across ${course.curriculum.length} modules`} />}
                  <Fact label="Certificate" value={course.hasCertificate ? 'Yes, on completion' : 'Not on this course'} />
                  {course.audiences.length > 0 && (
                    <Fact label="Who it is for" value={course.audiences.map((a) => a.name).join(', ')} />
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CourseJsonLd course={course} />
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-toko-gray-500 mb-1">{label}</dt>
      <dd className="font-semibold text-toko-gray-900">{value}</dd>
    </div>
  );
}

/**
 * Structured data, stating only what is true of the record.
 *
 * No aggregate rating and no review count: we have neither, and inventing them
 * is what gets rich results revoked.
 */
function CourseJsonLd({ course }: { course: DlcCourse }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: `${SITE}/courses/${course.slug}`,
    provider: {
      '@type': 'Organization',
      name: 'Toko Academy',
      url: SITE,
    },
    ...(course.price > 0
      ? {
          offers: {
            '@type': 'Offer',
            price: course.price,
            priceCurrency: course.currency || 'NGN',
            category: 'Paid',
          },
        }
      : {}),
  };
  return (
    <script
      type="application/ld+json"
      // Serialised from our own record, and `<` is escaped so no value can
      // close this tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

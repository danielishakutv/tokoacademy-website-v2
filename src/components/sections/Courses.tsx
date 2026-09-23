import Link from 'next/link';
import CourseThumbnail from '@/components/CourseThumbnail';
import { deliveryLabel, formatPrice, getCourses, thumbnailUrl, type DlcCourseCard } from '@/lib/dlc';
import { actions, choice, count, stagger, text, type SectionProps } from './fields';
import Band, { Actions, Intro, toneOf } from './tone';

/**
 * Courses, read from the learning platform when the site builds.
 *
 * `getCourses` throws when the catalogue is unreachable or empty — correct on
 * `/courses`, where a page listing nothing would be worse than yesterday's
 * build staying up. On a composed page it is not: the guarantee that the
 * catalogue is never silently empty is already enforced where the catalogue
 * lives, and an unrelated marketing page should not be the thing that stops a
 * deployment. So this fails soft and the band simply does not appear.
 */
async function coursesOrNothing(): Promise<DlcCourseCard[]> {
  try {
    return await getCourses();
  } catch (error) {
    console.warn('Courses section: the catalogue was unreachable, leaving the band out.', error);
    return [];
  }
}

/**
 * One course from each school, so the tiles show the range of what is taught
 * rather than several variations of the same thing — and so the selection
 * maintains itself as the catalogue changes.
 */
function onePerSchool(courses: DlcCourseCard[]): DlcCourseCard[] {
  const seen = new Set<string>();
  const picked: DlcCourseCard[] = [];
  const bySchoolName = [...courses].sort(
    (a, b) =>
      (a.school?.name ?? 'zzz').localeCompare(b.school?.name ?? 'zzz') || b.enrolledCount - a.enrolledCount,
  );
  for (const course of bySchoolName) {
    const key = course.school?.slug ?? 'none';
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(course);
  }
  return picked;
}

export default async function Courses({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const pick = choice(data, 'pick', ['one-per-school', 'all', 'popular'] as const);
  const limit = count(data, 'limit', 6);
  const buttons = actions(data);

  const all = await coursesOrNothing();
  const chosen =
    pick === 'popular'
      ? [...all].sort((a, b) => b.enrolledCount - a.enrolledCount)
      : pick === 'all'
        ? all
        : onePerSchool(all);
  const shown = chosen.slice(0, limit);

  const eyebrow = text(data, 'eyebrow');
  const heading = text(data, 'heading');
  const body = text(data, 'body');

  if (!eyebrow && !heading && !body && shown.length === 0) return null;

  return (
    <Band tone={tone} first={first}>
      <Intro
        tone={tone}
        eyebrow={eyebrow}
        heading={heading}
        body={body}
        className="reveal"
        action={buttons.length > 0 ? <Actions items={buttons} tone={tone} /> : undefined}
      />

      {shown.length > 0 && (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((course, index) => (
            // `.card` keeps its own surface on every tone, so the course
            // details inside need no per-tone colours.
            <article key={course.slug} className={`card reveal ${stagger(index)} flex flex-col p-5 sm:p-6`}>
              <CourseThumbnail
                id={course.slug}
                title={course.title}
                src={thumbnailUrl(course.thumbnailUrl)}
                duration={course.hours > 0 ? `${course.hours} hrs` : ''}
                courseId={course.slug}
              />

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                  {deliveryLabel(course.deliveryMode)}
                </span>
                {course.school && (
                  <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-muted">
                    {course.school.name}
                  </span>
                )}
              </div>

              <h3 className="mt-4">{course.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm text-ink-muted sm:text-base">{course.description}</p>

              <div className="mt-auto">
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <span className="font-semibold text-ink">{formatPrice(course.price)}</span>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="link-hover inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                  >
                    View course
                    <span aria-hidden>&rarr;</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Band>
  );
}

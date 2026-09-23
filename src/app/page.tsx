import type { Metadata } from 'next';
import Link from 'next/link';
import PartnerLogosStrip from '@/components/PartnerLogosStrip';
import CourseThumbnail from '@/components/CourseThumbnail';
import Picture from '@/components/ui/Picture';
import HeroSlider, { type HeroSlide } from '@/components/home/HeroSlider';
import SectionHeading from '@/components/home/SectionHeading';
import { getCourses, formatPrice, deliveryLabel, thumbnailUrl, type DlcCourseCard } from '@/lib/dlc';
import { fetchNewsArticles, fetchEventPosts, type NewsArticle, type EventPost } from '@/lib/wordpress';

/**
 * WordPress, but never at the cost of the home page.
 *
 * `fetchNewsArticles` and `fetchEventPosts` throw when WordPress is
 * unreachable — and it has been: the build runs on a GitHub runner, and
 * wp.tokoacademy.org's firewall has blocked those before. On a dedicated news
 * page a failure is arguably worth failing the build over. On the home page it
 * is not: better to ship a home page without its news strip than to ship no
 * site at all.
 */
async function newsOrNothing(limit: number): Promise<NewsArticle[]> {
  try {
    return (await fetchNewsArticles(limit)).slice(0, limit);
  } catch {
    return [];
  }
}

async function eventsOrNothing(limit: number): Promise<EventPost[]> {
  try {
    return (await fetchEventPosts(limit)).slice(0, limit);
  } catch {
    return [];
  }
}

const readableDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * The courses on the front page are now the courses that exist.
 *
 * This section rendered six entries from `src/data/featured-courses.json`,
 * hand-maintained and out of date: it advertised "UI/UX Design", which the
 * academy no longer runs, and "Website Development", which had been split into
 * two separate courses. A visitor clicking either reached a page for something
 * they could not buy.
 *
 * One course per school, so the six tiles show the range of what is taught
 * rather than six variations of the same thing — and so the selection maintains
 * itself as the catalogue changes.
 */
function onePerSchool(courses: DlcCourseCard[], limit = 6): DlcCourseCard[] {
  const seen = new Set<string>();
  const picked: DlcCourseCard[] = [];
  const bySchoolName = [...courses].sort((a, b) =>
    (a.school?.name ?? 'zzz').localeCompare(b.school?.name ?? 'zzz') || b.enrolledCount - a.enrolledCount,
  );
  for (const course of bySchoolName) {
    const key = course.school?.slug ?? 'none';
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(course);
    if (picked.length === limit) break;
  }
  return picked;
}

/**
 * Stagger classes, looked up rather than built.
 *
 * `reveal-delay-1` and friends live in `globals.css` under `@layer utilities`,
 * which means Tailwind strips any of them it cannot find spelled out in the
 * source. A template literal would produce the right class at runtime and an
 * empty stylesheet at build time, so the names are written out in full here.
 */
const STAGGER = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5'];
const stagger = (index: number) => STAGGER[index % STAGGER.length];

export const metadata: Metadata = {
  title: 'Digital Skills & Professional Growth - Toko Academy',
  // 160 characters. The previous one ran to 183 and was cut off mid-sentence
  // in results pages, and said nothing about where we are or what we teach —
  // "practical learning pathways" describes every training provider alive.
  description:
    'Digital skills training in Yola, Abuja and online: software engineering, data, AI, cybersecurity and digital literacy for professionals, youth and institutions.',
  keywords: [
    'digital skills training Nigeria',
    'tech training Yola',
    'digital skills Adamawa',
    'corporate IT training Nigeria',
    'coding classes for children Nigeria',
  ],
  alternates: {
    // With a trailing slash: `trailingSlash: true` means the server 301s the
    // slashless form, so a canonical without it points at a redirect.
    canonical: 'https://tokoacademy.org/',
  },
  openGraph: {
    title: 'Digital Skills & Professional Growth - Toko Academy',
    description:
      'Practical learning pathways for youths, children, and professionals delivered with government and organizational partners.',
    url: 'https://tokoacademy.org',
    type: 'website',
    images: [
      {
        url: 'https://tokoacademy.org/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Toko Academy - Skills for Tomorrow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Skills & Professional Growth - Toko Academy',
    description:
      'Explore practical learning pathways for youths, children, and professionals with measurable outcomes.',
    images: ['https://tokoacademy.org/og-image.png'],
  },
};

/*
 * Owner-confirmed. Nothing here is rounded up, restated or "improved" — the
 * four figures below are the only numbers on this page that claim anything.
 */
const impactStats = [
  { label: 'Learners Trained', value: '2,000+' },
  { label: 'Programmes Delivered', value: '20+' },
  { label: 'Partner Institutions', value: '35+' },
  { label: 'Career Progression', value: '75%' },
];

/*
 * The four audiences, each with a photograph of that audience.
 *
 * The `id`s are load-bearing: `#parents`, `#students`, `#professionals` and
 * `#organizations` have been linkable since the first version of this page and
 * may be in somebody's newsletter. They survive the redesign even though the
 * selector row that used to point at them has gone — with the cards themselves
 * visible a few hundred pixels down, a row of buttons that scrolls you to them
 * was furniture.
 */
const pathways = [
  {
    id: 'parents',
    title: "Children's Programmes",
    audience: 'For parents and guardians',
    summary:
      'Creative, safe and practical digital learning pathways for children to build confidence early.',
    href: '/kids',
    cta: "Explore children's programmes",
    image: '/images/home/pathway-children-club.jpg',
    alt: 'Children working at laptops in a Toko Academy coding club',
    brief:
      'Four or five children at laptops in the Yola lab, an instructor crouched at their level. Shoot from their eye height, faces lit and visible, screens showing their own work.',
  },
  {
    id: 'students',
    title: 'Youth Bootcamps',
    audience: 'For students and young adults',
    summary:
      'Project-based training that turns curiosity into practical, career-relevant tech skills.',
    href: '/courses',
    cta: 'Explore youth pathways',
    image: '/images/home/pathway-youth-bootcamp.jpg',
    alt: 'Young adults working together on a project during a Toko Academy bootcamp',
    brief:
      'Three or four young adults around one laptop, mid-argument about the work. Natural light, no posing, whiteboard or sticky notes in the background.',
  },
  {
    id: 'professionals',
    title: 'Professional Upskilling',
    audience: 'For working professionals',
    summary:
      'Flexible training for professionals ready to upgrade digital capabilities and stay competitive.',
    href: '/courses',
    cta: 'Advance your skills',
    image: '/images/home/pathway-professional-class.jpg',
    alt: 'Working professionals in an evening class at Toko Academy',
    brief:
      'Adults in work clothes at an evening or weekend session, laptops open, one person asking a question. Warm indoor light, room clearly in use.',
  },
  {
    id: 'organizations',
    title: 'Corporate and Institutional Training',
    audience: 'For organisations and government',
    summary:
      'Tailored capacity-building programmes co-designed for workforce development and lasting impact.',
    href: '/corporate',
    cta: 'See training solutions',
    image: '/images/home/pathway-institutional-training.jpg',
    alt: 'A Toko Academy facilitator leading a training session for an institutional cohort',
    brief:
      'A facilitator at the front of a full room of staff from one institution — badges, uniforms or branded banner visible so the client is identifiable. Wide, from the back corner.',
  },
];

const differentiators = [
  {
    title: 'Industry-Relevant Learning',
    description:
      'Every programme is structured around practical competencies that learners can apply immediately.',
  },
  {
    title: 'Inclusive Access',
    description:
      'We make quality digital education accessible to diverse audiences and communities.',
  },
  {
    title: 'Measurable Outcomes',
    description:
      'Our approach emphasises clear progress, performance and long-term advancement.',
  },
];

const partnerTypes = [
  'Government Agencies',
  'Educational Institutions',
  'Development Organisations',
  'Private Sector Partners',
];

export default async function Home() {
  const [courses, latestNews, upcomingEvents] = await Promise.all([
    getCourses(),
    newsOrNothing(3),
    eventsOrNothing(3),
  ]);
  const featured = onePerSchool(courses);

  /*
   * The hero.
   *
   * These four use photographs that are already in the repository — real
   * rooms, real cohorts, taken in Yola. A hero built out of four placeholders
   * would have answered the brief on paper and shown the owner nothing, and
   * the complaint was precisely that there are no pictures. Every other slot
   * on the page is a placeholder waiting for a photograph, and says so.
   *
   * Each slide's title is an `h1`. Four of them in one document is legal HTML
   * and understood by search engines; the alternative — one real heading and
   * three paragraphs dressed up to look like it — would mean hard-coding the
   * heading size in three places, which is exactly what the new type scale is
   * there to prevent. Only the current slide is exposed to assistive
   * technology, so a screen reader is read one heading, not four.
   */
  const slides: HeroSlide[] = [
    {
      id: 'programmes',
      eyebrow: 'Skills for Tomorrow',
      title: 'Practical digital skills, taught in Yola and online.',
      blurb:
        'Software engineering, data, AI, cybersecurity and digital literacy — structured around what you will actually be asked to do at work.',
      href: '/courses',
      cta: 'Explore programmes',
      media: (
        <Picture
          src="/images/hero/professional-courses.jpg"
          alt="Adult learners around a table of laptops in a Toko Academy classroom in Yola, watching a session on a wall screen"
          brief="A full class in progress, seen from the back corner: laptops open, the screen lit, faces turned towards the front."
          aspect="aspect-[4/3]"
          sizes="(max-width: 1024px) 100vw, 560px"
          priority
        />
      ),
    },
    {
      id: 'mentorship',
      eyebrow: 'How we teach',
      title: 'You learn it by building it, beside someone who has.',
      blurb:
        'Cohorts are project-based and mentored in the room — an instructor at your shoulder while the work is still unfinished.',
      href: '/about',
      cta: 'See how we teach',
      media: (
        <Picture
          src="/images/hero/practical-mentorship-approach-classes.jpg"
          alt="A Toko Academy instructor leaning over a learner's laptop while classmates follow along"
          brief="Close, over the shoulder: an instructor pointing at something on a learner's screen, other learners watching."
          aspect="aspect-[4/3]"
          sizes="(max-width: 1024px) 100vw, 560px"
        />
      ),
    },
    {
      id: 'children',
      eyebrow: 'For parents and guardians',
      title: 'Children who build things, not just watch screens.',
      blurb:
        'Coding classes where children design their own games, present the work to the room, and leave able to explain how it runs.',
      href: '/kids',
      cta: "Explore children's programmes",
      media: (
        <Picture
          src="/images/hero/kids-coding.jpg"
          alt="A young girl presenting the game she has built, shown on a large screen beside her"
          brief="A child standing beside the screen showing her own project, mid-sentence. Shot at her eye level, not looking down at her."
          aspect="aspect-[4/3]"
          sizes="(max-width: 1024px) 100vw, 560px"
        />
      ),
    },
    {
      id: 'institutions',
      eyebrow: 'For organisations and government',
      title: 'Capacity building, designed with the institution.',
      blurb:
        'We co-design and deliver training with agencies, security services, schools and development partners across Nigeria.',
      href: '/corporate',
      cta: 'See training solutions',
      media: (
        <Picture
          src="/images/hero/training-military-officers.jpg"
          alt="Police, army and paramilitary officers seated in an auditorium during a Toko Academy training session"
          brief="A full auditorium of an institutional cohort, shot wide from the side so the room and the uniforms both read."
          aspect="aspect-[4/3]"
          sizes="(max-width: 1024px) 100vw, 560px"
        />
      ),
    },
  ];

  return (
    <>
      {/*
        `.reveal` starts at zero opacity and is switched on by an observer in
        the root layout. That is the right trade for a page with JavaScript and
        the wrong one for a page without it — a visitor whose script never
        arrives would get a hero and then nothing. Two lines of CSS that only a
        scriptless browser ever parses close that hole.
      */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: '.reveal{opacity:1 !important;transform:none !important}',
          }}
        />
      </noscript>

      <HeroSlider slides={slides} />

      {/* Impact --------------------------------------------------------- */}
      <section className="section-padding relative overflow-hidden bg-surface-sunken">
        <div className="section-container relative z-10">
          <SectionHeading
            className="reveal"
            eyebrow="Impact so far"
            title="What the work has added up to"
            lead="Built through sustained collaboration, practical training and outcomes we can point to — across learners, schools and institutions."
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
            <Picture
              className="reveal"
              src="/images/home/impact-cohort-yola.jpg"
              alt="A Toko Academy cohort together at the end of a programme in Yola"
              brief="The whole cohort outside the Yola campus on their last day — wide, everyone's face visible, late-afternoon light."
              aspect="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 520px"
            />

            {/*
              Hairlines rather than four floating cards. The figures belong to
              one claim, and a 1px grid says that; four separate boxes with
              four shadows says "spreadsheet", which is what the owner was
              looking at and disliking. The grid is drawn by a background
              colour showing through a one-pixel gap.
            */}
            <dl className="reveal reveal-delay-1 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {impactStats.map((item) => (
                <div key={item.label} className="bg-surface p-6 sm:p-8">
                  <dt className="text-sm text-ink-muted">{item.label}</dt>
                  <dd className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-brand sm:text-4xl">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Pathways ------------------------------------------------------- */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <SectionHeading
            className="reveal"
            eyebrow="Pathways by audience"
            title="Clear routes for every learner and partner"
            lead="Four ways in. Each one is a different room, a different pace and a different promise."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {pathways.map((pathway, index) => (
              <article
                id={pathway.id}
                key={pathway.id}
                // The header is fixed, so an anchor that lands flush at the top
                // of the viewport lands underneath it.
                className={`card reveal ${stagger(index)} flex scroll-mt-28 flex-col overflow-hidden md:scroll-mt-36`}
              >
                <Picture
                  src={pathway.image}
                  alt={pathway.alt}
                  brief={pathway.brief}
                  aspect="aspect-[16/10]"
                  rounded={false}
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 600px"
                />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="eyebrow">{pathway.audience}</p>
                  <h3 className="mt-2">{pathway.title}</h3>
                  <p className="mt-3 text-ink-muted">{pathway.summary}</p>
                  <div className="mt-auto pt-6">
                    <Link
                      href={pathway.href}
                      className="link-hover inline-flex items-center gap-1.5 text-sm font-semibold text-brand sm:text-base"
                    >
                      {pathway.cta}
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses ------------------------------------------------ */}
      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <SectionHeading
            className="reveal"
            eyebrow="Featured courses"
            title="Programmes you can start with"
            lead="One course from each school, so this is a cross-section of what is taught rather than six versions of the same thing."
            action={
              <Link href="/courses" className="btn-secondary">
                View all courses
              </Link>
            }
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((course, index) => (
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
        </div>
      </section>

      {/* Why Toko Academy ------------------------------------------------ */}
      {/*
        The one dark slab on the page. It is here rather than at the top
        because a page that opens dark and stays dark is a brochure; a single
        inverted section two thirds of the way down is a change of tone at the
        point where somebody is deciding whether to believe us.
      */}
      <section className="section-padding relative overflow-hidden bg-surface-inverted">
        <div className="section-container relative z-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Picture
              className="reveal"
              src="/images/home/approach-instructor-and-learner.jpg"
              alt="A Toko Academy instructor working through a problem with a learner"
              brief="One instructor, one learner, one screen, mid-explanation. Tight enough that you can read both faces."
              aspect="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 560px"
            />

            <div>
              <SectionHeading
                inverted
                className="reveal"
                eyebrow="Why Toko Academy"
                title="Focused, inclusive and results-driven"
                lead="Three things we hold to, on every programme, for every audience."
              />

              <ol className="reveal reveal-delay-1 mt-8 border-t border-ink-inverted/15">
                {differentiators.map((item, index) => (
                  <li
                    key={item.title}
                    className="flex gap-5 border-b border-ink-inverted/15 py-6"
                  >
                    <span className="mt-1 text-sm font-semibold tabular-nums text-ink-inverted/45">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-ink-inverted">{item.title}</h3>
                      <p className="mt-2 text-ink-inverted/70">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <PartnerLogosStrip limit={12} showViewAll={true} />

      {/* Partnership ----------------------------------------------------- */}
      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="reveal">
              <p className="eyebrow text-brand">Partnership ecosystem</p>
              <h2 className="mt-3">Built with government and organisations</h2>
              <p className="prose-measure mt-4 text-base text-ink-muted sm:text-lg">
                We co-design and deliver capacity-building programmes that align with community needs,
                workforce demands and long-term development goals.
              </p>

              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {partnerTypes.map((type) => (
                  <li
                    key={type}
                    className="rounded-xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink sm:text-base"
                  >
                    {type}
                  </li>
                ))}
              </ul>

              <Link href="/contact" className="btn-primary mt-8">
                Become a partner
              </Link>
            </div>

            <Picture
              className="reveal reveal-delay-1"
              src="/images/home/partnership-signing.jpg"
              alt="Toko Academy and a partner institution at the signing of a training agreement"
              brief="Two or three people at a table signing or shaking hands, both organisations' banners behind them. Landscape, room visible."
              aspect="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
        </div>
      </section>

      {/*
        What we are actually doing, rather than two buttons inviting you to go
        and look. This block used to be a heading and a pair of links — nothing
        to read, and nothing to make anybody click. Showing the work is what
        keeps a visitor on the site.

        Both strips disappear entirely when there is nothing to show, so an
        empty newsroom or a WordPress outage leaves a shorter page rather than
        an empty promise.
      */}
      {(latestNews.length > 0 || upcomingEvents.length > 0) && (
        <section className="section-padding bg-surface">
          <div className="section-container space-y-16 lg:space-y-20">
            {latestNews.length > 0 && (
              <div>
                <SectionHeading
                  className="reveal"
                  eyebrow="Newsroom"
                  title="What we have been doing"
                  action={
                    <Link
                      href="/news"
                      className="link-hover inline-flex items-center gap-1.5 font-semibold text-brand"
                    >
                      All news
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  }
                />

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {latestNews.map((article, index) => (
                    <Link
                      key={article.slug}
                      href={`/news/${article.slug}`}
                      className={`card reveal ${stagger(index)} group flex flex-col overflow-hidden`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.image}
                        alt={article.imageAlt || ''}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={360}
                      />
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                          <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-brand">
                            {article.category}
                          </span>
                          {readableDate(article.date) && <span>{readableDate(article.date)}</span>}
                          {article.readTime && <span>· {article.readTime}</span>}
                        </div>
                        <h3 className="mt-3 transition-colors group-hover:text-brand">{article.title}</h3>
                        <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{article.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {upcomingEvents.length > 0 && (
              <div>
                <SectionHeading
                  className="reveal"
                  eyebrow="Events"
                  title="Where to find us"
                  action={
                    <Link
                      href="/events"
                      className="link-hover inline-flex items-center gap-1.5 font-semibold text-brand"
                    >
                      All events
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  }
                />

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {upcomingEvents.map((event, index) => (
                    <Link
                      key={event.slug}
                      href={`/events/${event.slug}`}
                      className={`card reveal ${stagger(index)} group flex gap-4 p-5`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={event.image}
                        alt={event.imageAlt || ''}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                        loading="lazy"
                        decoding="async"
                        width={160}
                        height={160}
                      />
                      <div className="min-w-0">
                        {readableDate(event.date) && (
                          <p className="text-xs text-ink-muted">{readableDate(event.date)}</p>
                        )}
                        {/* h3, not h4. The section above it is an h2, so an
                            h4 here skips a level — which to a screen reader
                            sounds like a missing heading rather than a tidy
                            size choice. Size comes from the global scale, not
                            from the tag. */}
                        <h3 className="mt-1 text-lg transition-colors group-hover:text-brand">{event.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{event.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Closing call to action ------------------------------------------ */}
      {/*
        A panel rather than a full-bleed photograph. A hero-sized picture with
        white text across it is unreadable the moment the photograph has not
        arrived yet — and on this page most of them have not. Inside a panel
        the copy owns its own background and the picture is free to be a
        placeholder without taking the call to action down with it.
      */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="reveal relative overflow-hidden rounded-3xl bg-surface-inverted">
            <div className="relative z-10 grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:p-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-inverted/60">
                  Take the next step
                </p>
                <h2 className="mt-3 text-ink-inverted">Start your journey, or build one with us</h2>
                <p className="prose-measure mt-4 text-base text-ink-inverted/75 sm:text-lg">
                  Pick a course and begin, or tell us what your organisation needs and we will design
                  the programme around it.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* Was href="/register" — a route this site does not have, so
                      the one call-to-action on the front page 404'd unless the
                      old PHP app happened to answer on that path. */}
                  <Link href="/courses" className="btn-primary">
                    Apply now
                  </Link>
                  <Link href="/contact" className="btn-secondary">
                    Talk to our team
                  </Link>
                </div>
              </div>

              <Picture
                src="/images/home/cta-graduation.jpg"
                alt="Toko Academy learners at the close of a programme in Yola"
                brief="Graduation or closing ceremony: certificates in hands, people mid-celebration. Landscape, crowd reading left to right."
                aspect="aspect-[4/3]"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

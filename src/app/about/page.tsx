import type { Metadata } from 'next';
import Link from 'next/link';
import Picture from '@/components/ui/Picture';
import { externalLinks } from '@/data/config';
import { pageMetadata, pageEntityJsonLd, jsonLdScript, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/about',
  // The root layout appends " | Toko Academy", so the name is never repeated here.
  title: 'About Us — Our Mission, Vision and Story',
  description:
    'Toko Academy exists to make quality digital skills education reachable in Nigeria. Read our mission, our vision, and the story behind how we teach.',
  socialTitle: 'About Toko Academy — Mission, Vision and Story',
  socialDescription:
    'Why we started, what we believe, and the values behind every programme we run in Jimeta-Yola and beyond.',
  image: {
    url: `${SITE_URL}/images/hero/our-ceo-daniel-ishaku-speaking.jpg`,
    alt: 'Daniel Ishaku, founder of Toko Academy, speaking at a training event',
  },
  keywords: ['about Toko Academy', 'digital skills training Nigeria', 'tech education Africa', 'mission and vision', 'Jimeta Yola tech academy'],
});

// "About" is a top-level hub in the site navigation; this is the page it points
// at. `AboutPage` with `mainEntity` pointing at the organisation is the whole
// purpose of the type — it tells a crawler that this page IS the description of
// Toko Academy, rather than one more page that happens to mention it.
const entityJsonLd = pageEntityJsonLd({
  path: '/about',
  type: 'AboutPage',
  name: 'About Toko Academy',
  description:
    'Toko Academy’s mission, vision, values and story — a digital skills training academy in Jimeta-Yola, Adamawa State, Nigeria.',
  isAboutOrganisation: true,
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ],
});

/*
 * Stagger classes, written out rather than composed.
 *
 * `reveal-delay-1`…`reveal-delay-5` are hand-written rules inside
 * globals.css's `@layer utilities`, which means Tailwind tree-shakes them
 * against what it can find in the source. A template literal like
 * `reveal-delay-${i}` is invisible to that scan, so the rule would be stripped
 * from the build and the stagger would silently stop happening.
 */
const DELAYS = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5'] as const;
const delay = (index: number) => DELAYS[Math.min(index, DELAYS.length - 1)];

/*
 * The six values, shortened.
 *
 * They were six identical cards, each carrying a 12-pixel icon — and five of
 * those six icons do not exist in IconWrapper's inlined set, so they rendered
 * as empty squares. A value is a sentence, not a tile: set as a list with the
 * word first and the meaning beside it, the section reads in about a quarter of
 * the vertical space and nothing is missing.
 */
const values = [
  { title: 'Excellence', description: 'The highest standard we can teach to, every cohort, not only the ones being watched.' },
  { title: 'Innovation', description: 'Curriculum revised against what the industry is actually hiring for.' },
  { title: 'Integrity', description: 'Honest about what a programme will and will not do for you, and figures we can show our workings for.' },
  { title: 'Empowerment', description: 'Practical skills a learner can earn from, not certificates alone.' },
  { title: 'Accessibility', description: 'Quality tech education within reach, whatever a learner started with.' },
  { title: 'Growth', description: 'Continuous learning — for our students, and for the people teaching them.' },
];

/*
 * Where to go next, in place of "What We Offer".
 *
 * That section listed six things the academy does — courses, instructors,
 * projects, certification, careers, corporate training — each of which has its
 * own page saying the same thing at greater length. Three signposts to the real
 * pages is shorter and more useful than a summary nobody asked for.
 */
const signposts = [
  {
    href: '/courses',
    title: 'Courses for individuals',
    text: 'Software engineering, data, design, digital marketing and the Microsoft suite — in person in Jimeta-Yola, or online.',
    image: '/images/about/classroom-wide.jpg',
    alt: 'A Toko Academy class in session in Jimeta-Yola',
    brief: 'Wide shot of a full classroom from the back: learners at laptops, trainer at the board, projector screen visible',
  },
  {
    href: '/corporate',
    title: 'Training for organisations',
    text: 'Curriculum built around your objectives and delivered to your team, on site or remotely.',
    image: '/images/hero/professional-courses.jpg',
    alt: 'Professionals at laptops during a Toko Academy training session in Yola',
    brief: 'Team of professionals around a table with laptops, trainer presenting from a screen',
  },
  {
    href: '/kids',
    title: 'Children and teenagers',
    text: 'Scratch, web basics and computer literacy for ages 6 to 18, in small classes at weekends and holidays.',
    image: '/images/hero/kids-coding.jpg',
    alt: 'A young girl presenting her Scratch project on a screen at Toko Academy',
    brief: 'Child standing beside a screen showing their own Scratch project, mid-presentation',
  },
];

export default function AboutPage() {
  return (
    <>
      <script {...jsonLdScript(entityJsonLd)} />

      {/*
        The page opened with a green-to-blue gradient band carrying one sentence
        of abstraction and no photograph — the same band four other pages used.
        A first screen that shows the actual room, with the proposition beside
        it, says more about the academy than any gradient can.
      */}
      <section className="relative overflow-hidden bg-surface-sunken pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="reveal">
              <p className="eyebrow">About Toko Academy</p>
              <h1 className="mt-4">We built the academy around a gap.</h1>
              <p className="prose-measure mt-6 text-lg text-ink-muted">
                There is a growing distance between the digital skills employers ask for and the skills
                job seekers have. Toko Academy opened in Jimeta-Yola, Adamawa State, to close it —
                practical training, taught in small rooms, with work you can show at the end of it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={externalLinks.applyNow} className="btn-primary">
                  See what we teach
                </Link>
                <Link href="/impact" className="btn-secondary">
                  Read our impact
                </Link>
              </div>
            </div>

            <Picture
              src="/images/hero/practical-mentorship-approach-classes.jpg"
              alt="A Toko Academy trainer working through a problem with learners at their laptops"
              brief="Trainer leaning over a learner’s laptop mid-class, others watching — taken from the side, natural light"
              aspect="aspect-[4/3]"
              className="reveal reveal-delay-1"
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      {/*
        Mission and vision were two bordered cards of four lines each, saying
        much the same thing twice. Kept — they are what a funder looks for — but
        halved, and set as a statement rather than as furniture.
      */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="reveal">
              <p className="eyebrow">Why we exist</p>
              <h2 className="mt-4">Industry-relevant, and within reach.</h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="reveal reveal-delay-1">
                <h3 className="text-brand">Our mission</h3>
                <p className="mt-3 text-ink-muted">
                  To make industry-relevant digital skills training reachable for individuals and
                  organisations across Nigeria — hands-on education that prepares people for the work
                  itself, not only for the examination.
                </p>
              </div>
              <div className="reveal reveal-delay-2">
                <h3 className="text-brand">Our vision</h3>
                <p className="mt-3 text-ink-muted">
                  A country where the place you were born does not decide whether you can take part in the
                  digital economy — and where the training that makes that possible is taught close to home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Picture
              src="/images/hero/our-ceo-daniel-ishaku-speaking.jpg"
              alt="Daniel Ishaku, founder of Toko Academy, speaking at a training event"
              brief="Founder mid-sentence addressing a room, hands in motion, shot at eye level"
              aspect="aspect-[4/5]"
              className="reveal"
              sizes="(max-width: 1024px) 100vw, 38vw"
            />

            <div className="reveal reveal-delay-1">
              <p className="eyebrow">Our story</p>
              <h2 className="mt-4">The gap was visible from where we stood.</h2>
              <div className="prose-measure mt-6 space-y-4 text-ink-muted">
                <p>
                  The advertisements were for data skills, for developers, for people who could run a
                  campaign or keep a network safe. The skills job seekers had were not those skills. Closing
                  that distance here — rather than telling people to travel for it — is the part we insisted on.
                </p>
                <p>
                  Since then, over 2,000 learners have come through our programmes: school pupils, graduates,
                  traders, public servants, officers in uniform. Each cohort is taught the same way — a short
                  explanation, then the keyboard, then something built and shown to the room.
                </p>
                <p>
                  What has kept it working is unglamorous. Instructors who do the work outside the classroom.
                  A curriculum revised when the job adverts change. Small enough classes that nobody sits at
                  the back for twelve weeks without being noticed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
        The four figures the owner stands behind, with the provenance stated
        plainly next to them. They come from internal enrolment records and
        participant follow-up, and there is no audited third-party source — so
        the page says that rather than dressing the numbers as certified.
      */}
      <section className="bg-surface-inverted py-16 text-ink-inverted md:py-24">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
            <div className="reveal">
              <p className="eyebrow text-ink-inverted/60">By the numbers</p>
              <p className="mt-5 font-heading text-6xl font-bold leading-none md:text-7xl">2,000+</p>
              <p className="mt-4 max-w-md text-ink-inverted/80">
                learners trained since we opened. Counted from our own enrolment and attendance records —
                not an audited figure, and we would rather say so than imply otherwise.
              </p>
              {/* TODO: one named graduate, in their own words and with their permission,
                  belongs here. A single story does more than the count above it. */}
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 reveal reveal-delay-1 sm:grid-cols-3">
              <div>
                <dt className="font-heading text-3xl font-bold md:text-4xl">20+</dt>
                <dd className="mt-2 text-sm text-ink-inverted/70">programmes delivered</dd>
              </div>
              <div>
                <dt className="font-heading text-3xl font-bold md:text-4xl">35+</dt>
                <dd className="mt-2 text-sm text-ink-inverted/70">partner institutions</dd>
              </div>
              <div>
                <dt className="font-heading text-3xl font-bold md:text-4xl">75%</dt>
                <dd className="mt-2 text-sm text-ink-inverted/70">career progression at follow-up</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <div className="reveal">
                <p className="eyebrow">What we hold to</p>
                <h2 className="mt-4">Six words we are held to.</h2>
              </div>

              <dl className="mt-8 divide-y divide-line border-t border-line">
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className={`reveal ${delay(index)} grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6`}
                  >
                    <dt className="font-heading font-bold text-ink">{value.title}</dt>
                    <dd className="text-ink-muted">{value.description}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Picture
              src="/images/about/cohort-portrait.jpg"
              alt="A Toko Academy cohort photographed together at the end of their programme"
              brief="Whole cohort outside the Bekaji Road building, certificates in hand, shot slightly wide so the building is readable"
              aspect="aspect-[3/4]"
              className="reveal reveal-delay-2 lg:sticky lg:top-32"
              sizes="(max-width: 1024px) 100vw, 34vw"
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">Where to start</p>
            <h2 className="mt-4">Three ways in.</h2>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {signposts.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`reveal ${delay(index)} group block`}
              >
                <Picture
                  src={item.image}
                  alt={item.alt}
                  brief={item.brief}
                  aspect="aspect-[3/2]"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
                <h3 className="mt-5 transition-colors group-hover:text-brand">{item.title}</h3>
                <p className="mt-2 text-ink-muted">{item.text}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-brand">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface py-16 md:py-24">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="reveal prose-measure">
            <h2>Come and see a class.</h2>
            <p className="mt-4 text-lg text-ink-muted">
              You are welcome at the academy on Bekaji Road, Jimeta, during teaching hours — or start with
              the catalogue and pick the thing you have been meaning to learn.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={externalLinks.applyNow} className="btn-primary">
                Browse courses
              </Link>
              <Link href="/contact" className="btn-secondary">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Picture from '@/components/ui/Picture';
import { kidsCourses } from '@/data/courses';
import { externalLinks } from '@/data/config';
import { pageMetadata, pageEntityJsonLd, faqJsonLd, jsonLdScript, SITE_URL } from '@/lib/seo';

// The old title ran to 70 characters before the site name was appended, so
// Google truncated it mid-phrase. This one leaves room for the template.
export const metadata: Metadata = pageMetadata({
  path: '/kids',
  title: 'Kids & Teens Coding Classes (Ages 6–18)',
  description:
    'Hands-on coding and computer classes for children aged 6 to 18. Scratch, web basics and digital literacy in small groups, taught in person and online.',
  socialTitle: 'Kids & Teens Coding Classes, Ages 6–18 | Toko Academy',
  socialDescription:
    'Fun, project-based technology programmes for young learners — Scratch, web basics and computer literacy, in small classes with personal attention.',
  image: {
    url: `${SITE_URL}/images/hero/kids-coding.jpg`,
    alt: 'Children learning to code at a Toko Academy class',
  },
});

// "Kids & Youth" sits under the Programs menu in src/data/config.ts, and
// Programs itself resolves to /courses.
const entityJsonLd = pageEntityJsonLd({
  path: '/kids',
  name: 'Kids & Teens Programmes',
  description:
    'Coding and computer training from Toko Academy for children and teenagers aged 6 to 18, taught in small groups in person and online.',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/courses' },
    { name: 'Kids & Youth', path: '/kids' },
  ],
});

// Hand-written utilities in globals.css are tree-shaken against the source, so
// a composed `reveal-delay-${i}` would be stripped from the build.
const DELAYS = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5'] as const;
const delay = (index: number) => DELAYS[Math.min(index, DELAYS.length - 1)];

/*
 * One photograph per programme, in the order `kidsCourses` declares them.
 *
 * Keyed by course id rather than by position: if a third programme is added to
 * src/data/courses.ts tomorrow it renders with a clearly-marked empty frame
 * instead of silently borrowing the picture belonging to another class.
 */
const programmeImages: Record<string, { src: string; alt: string; brief: string }> = {
  'weekend-coding': {
    src: '/images/bootcamps/robotics-student.png',
    alt: 'A child assembling a robotics kit during a Toko Academy weekend class',
    brief: 'Child concentrating on a robotics build at a desk, other children working behind',
  },
  'cbt-program': {
    src: '/images/kids/cbt-lab.jpg',
    alt: 'Teenagers working at computers in the Toko Academy training lab',
    brief: 'Row of teenagers at desktop machines in the lab, invigilator walking the row — shot down the row',
  },
};

const stages = [
  {
    ages: 'Ages 6–9',
    title: 'Foundation',
    text: 'Getting comfortable with a computer, then straight into visual programming with Scratch. The work is creative on purpose — at this age, confidence is the curriculum.',
  },
  {
    ages: 'Ages 10–13',
    title: 'Intermediate',
    text: 'Bigger Scratch projects, the beginnings of web development, and the digital literacy that school assumes but rarely teaches.',
  },
  {
    ages: 'Ages 14–18',
    title: 'Advanced',
    text: 'Text-based programming in Python, web and mobile development, and preparation for professional certifications. By this point it is career readiness, not play.',
  },
];

/*
 * Six reasons, one line each.
 *
 * These were six centred cards with a 56-pixel icon above each — and five of
 * those six icons are not in IconWrapper's inlined set, so they rendered as
 * blank squares. A parent deciding about a Saturday morning wants the reasons,
 * not the furniture around them.
 */
const reasons = [
  { title: 'It is genuinely fun', text: 'Games, animations and things that move. Nobody has to be persuaded to come back.' },
  { title: 'Problem solving', text: 'Code does not accept "nearly". Debugging teaches patience that transfers to everything else.' },
  { title: 'Creative work', text: 'They build their own games and stories rather than completing somebody else’s worksheet.' },
  { title: 'Small classes', text: 'Group sizes kept small enough that no child spends a term quietly lost.' },
  { title: 'It grows with them', text: 'An age-appropriate path from blocks to Python, with the same instructors along the way.' },
  { title: 'Confidence', text: 'Finishing something difficult, then standing up and explaining it to a room.' },
];

const faqs = [
  {
    question: 'Is prior computer experience required?',
    answer: 'None at all. Every programme starts from the beginning and builds up, and children who have never used a keyboard are exactly who these classes are written for.'
  },
  {
    question: 'What equipment does my child need?',
    answer: 'For online classes, a computer or laptop and an internet connection. For in-person classes at Jimeta-Yola, we provide everything.'
  },
  {
    question: 'How are classes structured?',
    answer: 'A short explanation, guided practice, then independent project work. Children spend most of the session with their hands on the keyboard.'
  },
  {
    question: 'Will my child receive a certificate?',
    answer: 'Yes — a certificate on successful completion of each programme level.'
  }
];

export default function KidsPage() {
  return (
    <>
      <script {...jsonLdScript(entityJsonLd)} />
      {/*
        Built from the very same `faqs` array rendered further down the page, so
        the markup can never describe questions a visitor cannot read. If a
        question is removed from the page it disappears from the markup with it.
      */}
      <script {...jsonLdScript(faqJsonLd(faqs))} />

      <section className="relative overflow-hidden bg-surface-sunken pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="reveal">
              <p className="eyebrow">Ages 6 to 18</p>
              <h1 className="mt-4">Give a child something to build, and they will teach themselves the rest.</h1>
              <p className="prose-measure mt-6 text-lg text-ink-muted">
                Weekend and holiday classes in Jimeta-Yola, in groups small enough for every child to be
                noticed. They write code, they make something that works, and at the end of the programme
                they stand up and present it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={externalLinks.applyNow} className="btn-primary">
                  Enrol your child
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Ask us a question
                </Link>
              </div>
            </div>

            <Picture
              src="/images/hero/kids-coding.jpg"
              alt="A young girl presenting her Scratch project on a screen at Toko Academy"
              brief="Child standing beside a large screen showing their own Scratch game, mid-presentation"
              aspect="aspect-[4/3]"
              className="reveal reveal-delay-1"
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      {/*
        The two programmes, each given a row of its own rather than sharing a
        two-up grid of dense cards: age range, when it runs, and what is
        actually taught, in that order, because that is the order a parent asks.
      */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="reveal prose-measure">
            <p className="eyebrow">The programmes</p>
            <h2 className="mt-4">Two classes, running now.</h2>
          </div>

          <div className="mt-12 space-y-16 md:space-y-24">
            {kidsCourses.map((course, index) => {
              const image = programmeImages[course.id];
              return (
                <article key={course.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                  <Picture
                    src={image?.src ?? `/images/kids/${course.id}.jpg`}
                    alt={image?.alt ?? `Children in the ${course.title} class at Toko Academy`}
                    brief={image?.brief ?? 'Children mid-class, hands on keyboards, instructor in frame'}
                    aspect="aspect-[3/2]"
                    className={`reveal ${index % 2 === 1 ? 'md:order-2' : ''}`}
                    sizes="(max-width: 768px) 100vw, 46vw"
                  />

                  <div className="reveal reveal-delay-1">
                    <h3>{course.title}</h3>
                    <p className="mt-4 text-ink-muted">{course.description}</p>

                    <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-4">
                      <div>
                        <dt className="eyebrow">Ages</dt>
                        <dd className="mt-1 font-heading font-bold text-ink">{course.ageRange}</dd>
                      </div>
                      <div>
                        <dt className="eyebrow">Runs</dt>
                        <dd className="mt-1 font-heading font-bold text-ink">{course.schedule}</dd>
                      </div>
                    </dl>

                    <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                      {course.features.map((feature) => (
                        <li key={feature} className="flex gap-2.5 text-sm text-ink">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" aria-hidden />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={externalLinks.applyNow} className="btn-primary mt-7">
                      Enrol in this class
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <div className="reveal">
                <p className="eyebrow">The path</p>
                <h2 className="mt-4">From blocks at six to Python at sixteen.</h2>
                <p className="mt-5 text-ink-muted">
                  Children join wherever they are and move up when they are ready, not when the calendar
                  says so.
                </p>
              </div>

              <ol className="mt-10 border-l border-line">
                {stages.map((stage, index) => (
                  <li key={stage.title} className={`reveal ${delay(index)} relative pb-9 pl-8 last:pb-0`}>
                    <span className="absolute -left-[0.4375rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-surface-sunken bg-brand" aria-hidden />
                    <p className="eyebrow">{stage.ages}</p>
                    <p className="mt-2 font-heading font-bold text-ink">{stage.title}</p>
                    <p className="mt-1.5 text-ink-muted">{stage.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <Picture
              src="/images/events/kscc-graduation.jpg"
              alt="A young learner working at a laptop in a coding class"
              brief="Child at a laptop looking up from the screen, classroom signage visible behind"
              aspect="aspect-[4/5]"
              className="reveal reveal-delay-1"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="reveal">
              <p className="eyebrow">Why parents enrol</p>
              <h2 className="mt-4">What a Saturday morning here is for.</h2>
              <p className="mt-5 text-ink-muted">
                Every trainer working with children is bound by our safeguarding standards and code of
                conduct.{' '}
                <Link href="/safeguarding" className="font-semibold text-brand">
                  Read how we keep children safe
                </Link>
                .
              </p>
            </div>

            <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {reasons.map((reason, index) => (
                <div key={reason.title} className={`reveal ${delay(index)}`}>
                  <dt className="font-heading font-bold text-ink">{reason.title}</dt>
                  <dd className="mt-1.5 text-ink-muted">{reason.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="reveal">
              <p className="eyebrow">Before you ask</p>
              <h2 className="mt-4">The four questions we get most.</h2>
            </div>

            <dl className="border-t border-line">
              {faqs.map((faq, index) => (
                <div key={faq.question} className={`reveal ${delay(index)} border-b border-line py-5`}>
                  <dt className="font-heading font-bold text-ink">{faq.question}</dt>
                  <dd className="mt-2 text-ink-muted">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface py-16 md:py-24">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="reveal prose-measure">
              <h2>Bring them to a class.</h2>
              <p className="mt-5 text-lg text-ink-muted">
                Tell us your child’s age and we will point you at the right group — or come and watch a
                session before you decide.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={externalLinks.applyNow} className="btn-primary">
                  Enrol your child
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Arrange a visit
                </Link>
              </div>
            </div>

            <Picture
              src="/images/kids/showcase-presentation.jpg"
              alt="A child presenting a finished project to parents at a Toko Academy showcase"
              brief="Child at the front presenting their project, parents watching from seats — shot from the side of the room"
              aspect="aspect-[3/2]"
              className="reveal reveal-delay-1"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Picture from '@/components/ui/Picture';
import { pageMetadata, pageEntityJsonLd, jsonLdScript, SITE_URL } from '@/lib/seo';

// No specific years in the description: a meta description outlives the cohort
// it was written about, and "2023 to 2026" starts reading as stale the moment
// the calendar turns.
export const metadata: Metadata = pageMetadata({
  path: '/impact',
  title: 'Our Impact — Outcomes, Evidence, Case Studies',
  description:
    'Learners trained, career progression, partner institutions and federal agencies reached — with the monitoring and evaluation framework behind every figure.',
  socialTitle: 'Our Impact — Real Numbers, Documented | Toko Academy',
  socialDescription:
    'Impact metrics, MEL framework and case studies from our work with communities, schools and government agencies across North-East Nigeria.',
  image: {
    url: `${SITE_URL}/images/hero/training-military-officers.jpg`,
    alt: 'Toko Academy delivering digital skills training to uniformed officers',
  },
});

// Impact sits under About in the site navigation.
//
// Note what is NOT in this markup: the 2,000+ learners, the 75% and the 35+
// partners. The owner stands behind those figures from offline records and they
// belong in the page copy — but there is no audited source to cite, and putting
// them into structured data restates them to a search engine as verified fact.
const entityJsonLd = pageEntityJsonLd({
  path: '/impact',
  name: 'Toko Academy Impact',
  description:
    'Outcome figures, the monitoring and evaluation framework, and case studies from Toko Academy’s digital skills programmes.',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Our Impact', path: '/impact' },
  ],
});

// Hand-written utilities in globals.css are tree-shaken against the source, so
// a composed `reveal-delay-${i}` would be stripped from the build. Written out,
// the scanner can see them.
const DELAYS = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5'] as const;
const delay = (index: number) => DELAYS[Math.min(index, DELAYS.length - 1)];

/*
 * The figures, unchanged in value and given somewhere to stand.
 *
 * They were six identical tiles: a green number over a tracked caption, six
 * across, saying nothing about how any of them was arrived at. The headline
 * count now leads the section on its own and the rest support it — because
 * "2,000+" and "4+ states" are not the same kind of claim and should not be
 * presented as though they were.
 */
const supportingFigures = [
  { value: '20+', label: 'programmes delivered' },
  { value: '35+', label: 'partner institutions' },
  { value: '75%', label: 'career progression at follow-up' },
  { value: '5', label: 'federal agencies trained' },
];

/*
 * Targets, not results — which is what the old three-column table never said.
 *
 * A row reading "Digital Skills · % passing post-training assessment · ≥75%"
 * beside a headline figure of "75%" invites a reader to conclude the target has
 * been met and measured. The section now states plainly that these are the
 * standards we hold ourselves to.
 */
const melFramework = [
  { outcome: 'Digital Skills', indicator: '% of participants passing post-training assessment', target: '≥75%' },
  { outcome: 'Employment', indicator: '% securing income within 6 months of training', target: '≥50%' },
  { outcome: 'Gender Inclusion', indicator: '% of female participants per programme', target: '≥40%' },
  { outcome: 'Institutional Impact', indicator: '% of government partners reporting improved digital tool use', target: '≥70%' },
  { outcome: 'Child Digital Literacy', indicator: 'Skills assessment score gain — kids programmes', target: 'Baseline +30%' },
  { outcome: 'Partner Satisfaction', indicator: 'Post-engagement satisfaction score', target: '≥4 / 5' },
];

/*
 * Three programmes told at length, three in brief — rather than six identical
 * cards, which is what makes a page of real work read like a directory listing.
 */
const featuredWork = [
  {
    title: 'TEDxYola 2025: AI, Culture, and Change',
    text: 'An officially licensed TEDx event in North-East Nigeria, bringing national thought leaders to a Yola audience of 200+ to argue about what artificial intelligence means for culture here rather than elsewhere.',
    meta: '200+ attendees · SDG 4, 17',
    image: '/images/hero/professional-courses.jpg',
    alt: 'A Toko Academy session in Yola with the TEDxYola banner behind the room',
    brief: 'Room of participants at laptops with the TEDxYola pull-up banner and speaker screen in frame',
  },
  {
    title: 'AI & Digital Literacy for Government Agencies',
    text: 'Structured training for officers across NSCDC, the Nigeria Police Force, FRSC and NMDPRA — AI tools they can use on Monday, the cybersecurity risks that come with them, and what data-informed decisions look like in an operational unit.',
    meta: '4 federal agencies · November 2025 · SDG 4, 8, 16',
    image: '/images/impact/agency-training-yola.jpg',
    alt: 'Officers from federal agencies at laptops during a Toko Academy training session',
    brief: 'Officers in uniform seated at laptops in a conference room, trainer at the front, agency insignia visible',
  },
  {
    title: 'Women in Uniform — IWD 2025',
    text: 'An International Women’s Day initiative recognising women serving in the military, police, NSCDC and Immigration — and putting digital skills in front of women the digital transition too often leaves behind.',
    meta: 'Military · Police · NSCDC · Immigration · SDG 5, 4',
    image: '/images/hero/commissioner-for-women-affairs.jpg',
    alt: 'Toko Academy hosts with a guest at the Women in Uniform event in Yola',
    brief: 'Guests photographed at the event backdrop, award in hand, partner logos visible behind',
  },
];

const furtherWork = [
  {
    title: 'Kids Coding Bootcamp & Summer Classes',
    text: 'Project-based programming and digital creativity for ages 6–17, ending in a public showcase where each child presents what they built.',
    meta: 'Scratch, HTML, CSS · SDG 4',
    image: '/images/hero/kids-coding.jpg',
    alt: 'A child presenting her Scratch project on screen at a Toko Academy class',
    brief: 'Child mid-presentation beside a screen showing their own Scratch game',
  },
  {
    title: 'From AI Users to AI Builders',
    text: 'A community event for students, professionals and enthusiasts, shifting participants from consuming AI tools to building with them.',
    meta: 'February 2026 · SDG 4, 8, 9',
    image: '/images/impact/ai-builders-yola.jpg',
    alt: 'Participants building with AI tools at a Toko Academy community event',
    brief: 'Two or three participants at one laptop, screen showing code or an AI tool, others in discussion behind',
  },
  {
    title: '16 Days of Activism — Safe Spaces, Strong Voices',
    text: 'A GBV awareness, digital safety and youth advocacy workshop delivered with the Tent2School Initiative.',
    meta: 'December 2025 · SDG 5, 10',
    image: '/images/impact/16-days-workshop.jpg',
    alt: 'Young women and men at a digital safety and advocacy workshop in Yola',
    brief: 'Workshop circle mid-discussion, facilitator standing, flip chart visible — faces of minors not identifiable',
  },
];

/*
 * Four quotes, kept exactly as given and attributed exactly as given.
 *
 * They are anonymous, so they are set as what they are — the lead one carries
 * weight because it is the most specific, and the rest sit quietly beneath it
 * rather than four abreast pretending to be case evidence.
 */
const leadTestimonial = {
  quote:
    'Our personnel left the training able to use AI tools, recognise cybersecurity risks, and apply data-informed thinking to operational decisions.',
  author: 'Senior Officer, Federal Agency',
};

const testimonials = [
  {
    quote: 'I moved from beginner to building real projects and presenting my work confidently in just a few months.',
    author: 'Program Graduate',
  },
  {
    quote: 'The structure made it easy to balance work and learning, and the outcomes were visible almost immediately.',
    author: 'Working Professional',
  },
  {
    quote: 'Our collaboration produced stronger digital literacy outcomes and better readiness among beneficiaries.',
    author: 'Partner Organization',
  },
];

export default function ImpactPage() {
  return (
    <>
      <script {...jsonLdScript(entityJsonLd)} />

      <section className="relative overflow-hidden bg-surface-sunken pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="reveal">
              <p className="eyebrow">Our impact</p>
              <h1 className="mt-4">More than 2,000 people have trained here. This is how we count.</h1>
              <p className="prose-measure mt-6 text-lg text-ink-muted">
                Every cohort is tracked against documented indicators and reported to the partners who
                funded it. What follows comes from our internal monitoring, evaluation and learning data
                for 2023–2026 — our own records, honestly kept, and not independently audited.
              </p>
            </div>

            <Picture
              src="/images/hero/training-military-officers.jpg"
              alt="Officers in uniform seated at a Toko Academy digital skills session in Yola"
              brief="Wide shot from the front of the hall showing the audience, uniforms readable, mid-session"
              aspect="aspect-[4/3]"
              className="reveal reveal-delay-1"
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      {/*
        The headline count, with its provenance beside it rather than in a
        footnote nobody reads. The supporting figures are deliberately smaller:
        they qualify the first number, they do not compete with it.
      */}
      <section className="bg-surface-inverted py-16 text-ink-inverted md:py-24">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
            <div className="reveal">
              <p className="eyebrow text-ink-inverted/60">Learners trained</p>
              <p className="mt-5 font-heading text-6xl font-bold leading-none md:text-7xl">2,000+</p>
              <p className="mt-4 max-w-md text-ink-inverted/80">
                counted from enrolment and attendance records across every programme we have run —
                schools, bootcamps, community workshops and agency training alike.
              </p>
              {/* TODO: one graduate, named and quoted with their permission, would do more
                  here than any of the figures below. Ask at the next showcase. */}
            </div>

            <dl className="reveal reveal-delay-1 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              {supportingFigures.map((figure) => (
                <div key={figure.label}>
                  <dt className="font-heading text-3xl font-bold md:text-4xl">{figure.value}</dt>
                  <dd className="mt-2 text-sm text-ink-inverted/70">{figure.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="reveal reveal-delay-2 prose-measure mt-12 border-t border-ink-inverted/15 pt-8 text-ink-inverted/80">
            Across all programmes delivered to date, women and girls make up approximately 43% of
            beneficiaries, youth aged 15–35 make up over 60%, and we have reached learners in four
            states physically and virtually.
          </p>
        </div>
      </section>

      {/*
        The MEL framework was a three-column table that shrank to unreadable
        columns on a phone — the exact "spreadsheet" the owner objected to. The
        same six rows, set as a list: the standard on the left, the number it is
        measured against on the right, and no horizontal scroll at 360px.
      */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <div className="reveal">
                <p className="eyebrow">How we know</p>
                <h2 className="mt-4">The standards we hold ourselves to.</h2>
                <p className="mt-5 text-ink-muted">
                  These are targets, not results. Each one is measured after a programme ends, reported to
                  the partner who commissioned it, and used to decide what the next cohort is taught.
                </p>
              </div>

              <Picture
                src="/images/impact/mel-review-session.jpg"
                alt="Toko Academy staff reviewing post-training assessment results"
                brief="Two staff at a desk going through printed assessment sheets and a laptop dashboard, close crop"
                aspect="aspect-[3/2]"
                className="reveal reveal-delay-1 mt-10 hidden lg:block"
                sizes="38vw"
              />
            </div>

            <ul className="border-t border-line">
              {melFramework.map((item, index) => (
                <li
                  key={item.outcome}
                  className={`reveal ${delay(index)} grid gap-2 border-b border-line py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8`}
                >
                  <div>
                    <p className="font-heading font-bold text-ink">{item.outcome}</p>
                    <p className="mt-1 text-ink-muted">{item.indicator}</p>
                  </div>
                  <p className="font-heading text-xl font-bold text-brand sm:text-right">{item.target}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/*
        Case studies, alternating side to side. A programme is a thing that
        happened in a room with people in it, and one photograph carries that
        further than three lines of SDG codes ever did.
      */}
      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="reveal prose-measure">
            <p className="eyebrow">Evidence from our programmes</p>
            <h2 className="mt-4">Six pieces of work, and who they were for.</h2>
          </div>

          <div className="mt-12 space-y-14 md:space-y-20">
            {featuredWork.map((item, index) => (
              <article
                key={item.title}
                className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
              >
                <Picture
                  src={item.image}
                  alt={item.alt}
                  brief={item.brief}
                  aspect="aspect-[3/2]"
                  // Every second row swaps sides on desktop and stays
                  // image-first on a phone, where a zig-zag is only confusing.
                  className={`reveal ${index % 2 === 1 ? 'md:order-2' : ''}`}
                  sizes="(max-width: 768px) 100vw, 46vw"
                />
                <div className="reveal reveal-delay-1">
                  <h3>{item.title}</h3>
                  <p className="mt-4 text-ink-muted">{item.text}</p>
                  <p className="mt-5 text-sm text-ink-subtle">{item.meta}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 grid gap-8 border-t border-line pt-12 md:grid-cols-3">
            {furtherWork.map((item, index) => (
              <article key={item.title} className={`reveal ${delay(index)}`}>
                <Picture
                  src={item.image}
                  alt={item.alt}
                  brief={item.brief}
                  aspect="aspect-[3/2]"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
                <h3 className="mt-5">{item.title}</h3>
                <p className="mt-3 text-ink-muted">{item.text}</p>
                <p className="mt-4 text-sm text-ink-subtle">{item.meta}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <figure className="reveal">
              <p className="eyebrow">Voices</p>
              <blockquote className="prose-measure mt-5 font-heading text-2xl font-bold leading-snug text-ink md:text-3xl">
                “{leadTestimonial.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-ink-subtle">— {leadTestimonial.author}</figcaption>
            </figure>

            <div className="space-y-8">
              {testimonials.map((testimonial, index) => (
                <figure key={testimonial.author} className={`reveal ${delay(index)} border-l-2 border-brand pl-5`}>
                  <blockquote className="text-ink-muted">“{testimonial.quote}”</blockquote>
                  <figcaption className="mt-2 text-sm font-semibold text-ink">{testimonial.author}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface-sunken py-16 md:py-24">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="reveal prose-measure">
            <p className="eyebrow">The long version</p>
            <h2 className="mt-4">A year of programming, partnerships and figures, in one document.</h2>
            <p className="mt-5 text-lg text-ink-muted">
              The academy profile sets out every programme, partner and outcome in full, with the
              methodology behind each number.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* TODO: this PDF is not in `public/files/` in this repository — confirm it is
                  on the server, or add it, before the next deploy. A download that 404s
                  costs more trust than the download earns. */}
              <Link href="/files/TOKO-Academy-Profile-April-2026.pdf" className="btn-primary">
                Download the profile
              </Link>
              <Link href="/partners" className="btn-secondary">
                Work with us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

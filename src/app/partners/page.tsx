import type { Metadata } from 'next';
import Link from 'next/link';
import PartnerLogosWall from '@/components/PartnerLogosWall';
import Picture from '@/components/ui/Picture';
import { pageMetadata, pageEntityJsonLd, jsonLdScript, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/partners',
  title: 'Partner With Us — Collaborate for Impact',
  description:
    'We work with government, NGOs and private sector teams to co-design digital skills programmes with measurable outcomes. Here is how a partnership starts.',
  socialTitle: 'Partner With Toko Academy — Collaborate for Impact',
  socialDescription:
    'Build practical learning pathways with us across government, development organisations and industry, from discovery call to delivery.',
  image: {
    url: `${SITE_URL}/images/hero/commissioner-for-women-affairs.jpg`,
    alt: 'Toko Academy partners at a joint programme event',
  },
});

/*
 * This page used to declare a second `Organization` whose `url` was /partners
 * — telling a search engine that Toko Academy, the organisation, lives at the
 * partnerships page. That competes with the real entity and splits it in two.
 * The canonical Organization is now declared once, in the root layout, and this
 * page describes itself and points back to it by id.
 *
 * Partners sits under About in the site navigation.
 */
const entityJsonLd = pageEntityJsonLd({
  path: '/partners',
  name: 'Partner With Toko Academy',
  description:
    'Partnership opportunities with Toko Academy for government agencies, development organisations, and private sector collaborators.',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Partners', path: '/partners' },
  ],
});

// Hand-written utilities in globals.css are tree-shaken against the source, so
// a composed `reveal-delay-${i}` would be stripped from the build.
const DELAYS = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5'] as const;
const delay = (index: number) => DELAYS[Math.min(index, DELAYS.length - 1)];

/*
 * The lead collaboration, told properly, and the other two beside it.
 *
 * All three were identical bordered cards with one sentence each. Government
 * work is the largest thing on this page — four federal agencies and a
 * ministry-facing event sit in our own records — so it gets the room.
 */
const leadCollaboration = {
  title: 'Government programmes',
  text: 'Workforce readiness, youth empowerment and digital literacy, delivered at the scale an agency needs and reported in the form it has to submit. We have trained officers across four federal agencies — NSCDC, the Nigeria Police Force, the Federal Road Safety Corps and NMDPRA.',
  image: '/images/hero/training-military-officers.jpg',
  alt: 'Officers in uniform at a Toko Academy digital skills session in Yola',
  brief: 'Wide shot of the hall during an agency session, uniforms readable, trainer at the front',
};

const collaborations = [
  {
    title: 'Development organisations',
    text: 'Practical learning pathways for the communities and beneficiaries you already work with — co-designed, delivered locally, and measured against indicators you can report on.',
    image: '/images/partners/community-workshop.jpg',
    alt: 'A community digital skills workshop run with a partner organisation in Adamawa State',
    brief: 'Community hall workshop, mixed ages seated in a circle or at tables, facilitator standing',
  },
  {
    title: 'Private sector alliances',
    text: 'Talent pipelines, mentorship and joint projects that connect what industry needs to what learners are being taught, while they are still being taught it.',
    image: '/images/hero/practical-mentorship-approach-classes.jpg',
    alt: 'A Toko Academy trainer working through a problem with learners at their laptops',
    brief: 'Trainer leaning over a learner’s laptop mid-class, others watching',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Discovery call',
    text: 'Goals, audience, timelines, and what you will be judged on at the end of it.',
  },
  {
    step: '02',
    title: 'Partnership design',
    text: 'A collaboration model and an execution plan, written down, with who does what.',
  },
  {
    step: '03',
    title: 'Delivery and reporting',
    text: 'We run it, we track it, and you get the figures whether or not they flatter us.',
  },
];

const valuePoints = [
  'Programmes co-designed around local and workforce needs, not lifted from a catalogue',
  'Transparent implementation with outcomes measured against agreed indicators',
  'Models that work for a one-off cohort and for a multi-year engagement',
  'Delivery support from curriculum design through to learner engagement',
];

export default function PartnersPage() {
  return (
    <>
      <script {...jsonLdScript(entityJsonLd)} />

      <section className="relative overflow-hidden bg-surface-sunken pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="reveal">
              <p className="eyebrow">Partnerships</p>
              <h1 className="mt-4">We build programmes with the people already there.</h1>
              <p className="prose-measure mt-6 text-lg text-ink-muted">
                35+ institutions have worked with us so far — federal regulators, universities, INGOs,
                schools and faith-based organisations. Each programme is designed with the partner who
                knows the context, then measured against what they actually need to report.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Start a partnership
                </Link>
                <Link href="/corporate" className="btn-secondary">
                  Corporate training
                </Link>
              </div>
            </div>

            <Picture
              src="/images/hero/commissioner-for-women-affairs.jpg"
              alt="Toko Academy hosts with a guest at a joint programme event in Yola"
              brief="Guests photographed at the event backdrop with partner logos visible behind"
              aspect="aspect-[4/3]"
              className="reveal reveal-delay-1"
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      {/*
        The logo wall is owned elsewhere in src/components and still carries its
        own fixed colours; it is placed here rather than restyled. It already
        names every partner and category from src/data/partners.ts, so nothing
        on this page repeats that list.
      */}
      <PartnerLogosWall />

      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="reveal prose-measure">
            <p className="eyebrow">Where we collaborate</p>
            <h2 className="mt-4">Three kinds of partnership, one way of working.</h2>
          </div>

          <div className="mt-12 grid items-center gap-8 md:grid-cols-2 md:gap-14">
            <Picture
              src={leadCollaboration.image}
              alt={leadCollaboration.alt}
              brief={leadCollaboration.brief}
              aspect="aspect-[3/2]"
              className="reveal"
              sizes="(max-width: 768px) 100vw, 46vw"
            />
            <div className="reveal reveal-delay-1">
              <h3>{leadCollaboration.title}</h3>
              <p className="mt-4 text-ink-muted">{leadCollaboration.text}</p>
              <Link href="/impact" className="mt-5 inline-block font-semibold text-brand">
                See what that produced →
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-10 border-t border-line pt-12 md:grid-cols-2 md:gap-8">
            {collaborations.map((item, index) => (
              <article key={item.title} className={`reveal ${delay(index)}`}>
                <Picture
                  src={item.image}
                  alt={item.alt}
                  brief={item.brief}
                  aspect="aspect-[3/2]"
                  sizes="(max-width: 768px) 100vw, 46vw"
                />
                <h3 className="mt-5">{item.title}</h3>
                <p className="mt-3 text-ink-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="reveal prose-measure">
            <p className="eyebrow">How we work</p>
            <h2 className="mt-4">Three steps, and no surprises in the reporting.</h2>
          </div>

          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {processSteps.map((item, index) => (
              <li key={item.step} className={`reveal ${delay(index)} border-t-2 border-brand pt-5`}>
                <p className="eyebrow">{item.step}</p>
                <p className="mt-2 font-heading font-bold text-ink">{item.title}</p>
                <p className="mt-1.5 text-ink-muted">{item.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="reveal">
              <h3>What a partner can expect of us</h3>
              <ul className="mt-6 space-y-3.5">
                {valuePoints.map((point) => (
                  <li key={point} className="flex gap-3 text-ink-muted">
                    <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Picture
              src="/images/partners/planning-session.jpg"
              alt="Toko Academy staff and a partner organisation planning a programme together"
              brief="Two or three people round a table with a printed plan and a laptop, mid-discussion"
              aspect="aspect-[3/2]"
              className="reveal reveal-delay-1"
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface-sunken py-16 md:py-24">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="reveal prose-measure">
            <h2>Tell us the outcome you are accountable for.</h2>
            <p className="mt-5 text-lg text-ink-muted">
              Send us the context and the constraint — budget, timeline, who has to sign it off — and we
              will come back with a partnership model that fits it or tell you plainly that it does not.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Talk to our team
              </Link>
              <Link href="/events" className="btn-secondary">
                See our events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

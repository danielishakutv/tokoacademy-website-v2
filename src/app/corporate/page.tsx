import type { Metadata } from 'next';
import Link from 'next/link';
import Picture from '@/components/ui/Picture';
import { contactInfo } from '@/data/config';
import { pageMetadata, pageEntityJsonLd, jsonLdScript, SITE_URL } from '@/lib/seo';

// Previously had no canonical and no Twitter card at all.
export const metadata: Metadata = pageMetadata({
  path: '/corporate',
  title: 'Corporate Training & IT Consultation',
  description:
    'Tailored digital skills training for teams, agencies and institutions — delivered on site or remotely, built around your objectives, and certificated.',
  socialTitle: 'Corporate Training & IT Consultation | Toko Academy',
  socialDescription:
    'Upskill your workforce with a curriculum designed around your business objectives, plus strategic IT consulting and digital transformation support.',
  image: {
    url: `${SITE_URL}/images/hero/professional-courses.jpg`,
    alt: 'Professionals in a Toko Academy corporate training session',
  },
});

// "Corporate & Government" sits under the Programs menu in src/data/config.ts,
// and Programs itself resolves to /courses — so this trail is how a visitor
// actually reaches the page, not a hierarchy invented for the markup.
const entityJsonLd = pageEntityJsonLd({
  path: '/corporate',
  name: 'Corporate Training & IT Consultation',
  description:
    'Tailored digital skills training and IT consultation from Toko Academy for companies, government agencies and development organisations.',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/courses' },
    { name: 'Corporate & Government', path: '/corporate' },
  ],
});

// Hand-written utilities in globals.css are tree-shaken against the source, so
// a composed `reveal-delay-${i}` would be stripped from the build.
const DELAYS = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5'] as const;
const delay = (index: number) => DELAYS[Math.min(index, DELAYS.length - 1)];

const services = [
  {
    title: 'Corporate training programmes',
    description:
      'A curriculum written for your team and your objectives, delivered around the working day rather than across it.',
    features: [
      'Tailored curriculum aligned with business objectives',
      'On-site and remote delivery',
      'Scheduling built to minimise disruption',
      'Progress tracking and performance reporting',
      'Post-training support and resources',
      'Certification for every participant',
    ],
  },
  {
    title: 'Workshops & seminars',
    description:
      'Short, intensive sessions on one technology or practice, for teams that need depth in a fortnight rather than a term.',
    features: [
      'Expert-led interactive sessions',
      'Current industry tools and practice',
      'Hands-on practical exercises',
      'Custom topic selection',
    ],
  },
  {
    title: 'IT consultation & strategy',
    description:
      'Advice on what to build, what to buy and what to stop paying for — and a plan your people can actually execute.',
    features: [
      'Technology needs assessment',
      'Digital transformation roadmaps',
      'Implementation planning and support',
      'Change management and ongoing advisory',
    ],
  },
];

const trainingAreas = [
  'Web & mobile development',
  'Data analysis & business intelligence',
  'Cybersecurity fundamentals',
  'Cloud computing & infrastructure',
  'Digital marketing & social media',
  'AI & machine learning basics',
  'Project management & Agile',
  'UI/UX design principles',
];

const process = [
  {
    step: '01',
    title: 'Consultation and needs assessment',
    text: 'We sit with your team, find out what is actually going wrong, and agree what success would look like.',
  },
  {
    step: '02',
    title: 'Curriculum design',
    text: 'We write the programme against those objectives and your timeline — not a catalogue course with your logo on it.',
  },
  {
    step: '03',
    title: 'Delivery',
    text: 'Instructors who do the work teach it, on site or remotely, hands on the keyboard from the first session.',
  },
  {
    step: '04',
    title: 'Assessment and follow-up',
    text: 'Participants are assessed, you get the report, and the resources stay available after we leave.',
  },
];

/*
 * Six benefits, halved in length.
 *
 * Each one was a claim plus a sentence restating the claim ("Increased
 * Productivity — empower your team with skills that translate directly to
 * improved performance and efficiency"). One line each is enough; a decision
 * maker reading this page is scanning for whether we understand the problem,
 * not for adjectives.
 */
const benefits = [
  { title: 'Productivity', text: 'Skills that show up in the work within weeks, not at the next appraisal.' },
  { title: 'Retention', text: 'People stay where they are being developed. Training is cheaper than recruitment.' },
  { title: 'Lower hiring costs', text: 'Upskill the team you have before advertising for the team you think you need.' },
  { title: 'Transformation that lands', text: 'New systems fail on adoption, not on procurement. This is the adoption part.' },
  { title: 'Competitive footing', text: 'A workforce current with the tools your competitors are already buying.' },
  { title: 'Something to report', text: 'Assessments and completion data you can put in front of a board or a funder.' },
];

const sectors = [
  'Financial services',
  'Healthcare',
  'Education',
  'Government agencies',
  'Tech startups',
  'Manufacturing',
  'Retail & e-commerce',
  'NGOs & non-profits',
];

export default function CorporatePage() {
  const telHref = `tel:${contactInfo.phones[0].replace(/\s/g, '')}`;

  return (
    <>
      <script {...jsonLdScript(entityJsonLd)} />

      <section className="relative overflow-hidden bg-surface-sunken pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="reveal">
              <p className="eyebrow">Corporate &amp; government</p>
              <h1 className="mt-4">Your people already do the job. We teach what the job now needs.</h1>
              <p className="prose-measure mt-6 text-lg text-ink-muted">
                We build the curriculum around your objectives, deliver it on site or remotely, assess
                everyone at the end and hand you the results. Teams, agencies, regulators and development
                organisations — the format changes, the approach does not.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Request a consultation
                </Link>
                <a href={telHref} className="btn-secondary">
                  {contactInfo.phones[0]}
                </a>
              </div>
            </div>

            <Picture
              src="/images/hero/professional-courses.jpg"
              alt="Professionals at laptops during a Toko Academy training session in Yola"
              brief="Team around a table with laptops open, trainer presenting from a screen at the end of the room"
              aspect="aspect-[4/3]"
              className="reveal reveal-delay-1"
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      {/*
        Proof before pitch.

        The page went straight from the hero into three cards of service
        descriptions. Naming institutions that have actually sat in the room —
        all four of them in src/data/partners.ts — does more for a procurement
        officer reading this than any list of benefits further down.
      */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Picture
              src="/images/hero/training-military-officers.jpg"
              alt="Officers in uniform at a Toko Academy digital skills session in Yola"
              brief="Wide shot of the hall from the front during an agency training session, uniforms readable"
              aspect="aspect-[3/2]"
              className="reveal"
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
            <div className="reveal reveal-delay-1">
              <p className="eyebrow">Already delivered</p>
              <h2 className="mt-4">Four federal agencies, one November.</h2>
              <p className="mt-5 text-ink-muted">
                In November 2025 we ran structured AI and digital literacy training for officers of the
                Nigeria Security &amp; Civil Defence Corps, the Nigeria Police Force, the Federal Road Safety
                Corps and the Nigerian Midstream &amp; Downstream Petroleum Regulatory Authority.
              </p>
              <p className="mt-4 text-ink-muted">
                Institutional work has its own constraints — shift patterns, clearance, wildly different
                starting levels in one room. We have done it, and we plan for it.
              </p>
              <Link href="/impact" className="mt-6 inline-block font-semibold text-brand">
                See the full record →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="reveal prose-measure">
            <p className="eyebrow">What we deliver</p>
            <h2 className="mt-4">Three ways we work with an organisation.</h2>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {services.map((service, index) => (
              <div key={service.title} className={`reveal ${delay(index)}`}>
                <p className="font-heading text-sm font-bold text-brand">{`0${index + 1}`}</p>
                <h3 className="mt-3">{service.title}</h3>
                <p className="mt-3 text-ink-muted">{service.description}</p>
                <ul className="mt-5 space-y-2 border-t border-line pt-5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm text-ink">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        Eight training areas that used to be eight centred cards with icons —
        five of which did not exist in IconWrapper's set and rendered as empty
        squares. They are a list of subjects; a list of subjects is a sentence.
      */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          {/* A wide plate between two text-heavy sections: the page needs a
              breath here, and a banner does it without a decorative divider. */}
          <Picture
            src="/images/hero/practical-mentorship-approach-classes.jpg"
            alt="A Toko Academy trainer working through a problem with a team at their laptops"
            brief="Wide shot of a training room mid-session, trainer among the tables rather than at the front"
            aspect="aspect-[21/9]"
            className="reveal mb-14"
            sizes="100vw"
          />

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="reveal">
              <p className="eyebrow">Subjects</p>
              <h2 className="mt-4">What we can teach your team.</h2>
              <p className="mt-5 text-ink-muted">
                Not seeing it? Most of our corporate work is written to order — tell us the capability
                you are missing and we will tell you honestly whether we are the right people to teach it.
              </p>
            </div>

            <ul className="reveal reveal-delay-1 flex flex-wrap gap-2.5 self-center">
              {trainingAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-line bg-surface-raised px-4 py-2 text-sm font-medium text-ink"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <div className="reveal">
                <p className="eyebrow">How it works</p>
                <h2 className="mt-4">Four steps, from the first call to the follow-up.</h2>
                {/* TODO: a typical lead time — first call to first session — would be worth
                    stating here. Left out deliberately rather than guessed at. */}
              </div>

              <ol className="mt-10 border-l border-line">
                {process.map((item, index) => (
                  <li key={item.step} className={`reveal ${delay(index)} relative pb-8 pl-8 last:pb-0`}>
                    <span className="absolute -left-[0.4375rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-surface-sunken bg-brand" aria-hidden />
                    <p className="eyebrow">{item.step}</p>
                    <p className="mt-2 font-heading font-bold text-ink">{item.title}</p>
                    <p className="mt-1.5 text-ink-muted">{item.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <Picture
              src="/images/corporate/needs-assessment.jpg"
              alt="A Toko Academy consultant meeting a client team to scope a training programme"
              brief="Four or five people round a meeting table, one at a flip chart mapping out a programme"
              aspect="aspect-[4/5]"
              className="reveal reveal-delay-1 lg:sticky lg:top-32"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="reveal">
              <p className="eyebrow">Why teams do it</p>
              <h2 className="mt-4">What an organisation gets back.</h2>
            </div>

            <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={benefit.title} className={`reveal ${delay(index)}`}>
                  <dt className="font-heading font-bold text-ink">{benefit.title}</dt>
                  <dd className="mt-1.5 text-ink-muted">{benefit.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/*
        "Industries We Serve — trusted by organizations across diverse sectors"
        claimed clients in eight sectors that nothing on this site evidences.
        The same list, framed as what we are set up for, claims nothing we
        cannot stand behind.
      */}
      <section className="bg-surface-sunken py-14 md:py-16">
        <div className="section-container">
          <div className="reveal flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-10">
            <p className="eyebrow flex-shrink-0">Set up for</p>
            <p className="text-ink-muted">{sectors.join(' · ')}</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface py-16 md:py-24">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="reveal prose-measure">
              <h2>Tell us what is not working.</h2>
              <p className="mt-5 text-lg text-ink-muted">
                A first conversation costs nothing. If we are not the right people for the problem, we will
                say so — and usually we know somebody who is.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Request a consultation
                </Link>
                <a href={telHref} className="btn-secondary">
                  Call {contactInfo.phones[0]}
                </a>
              </div>
            </div>

            <Picture
              src="/images/hero/our-ceo-daniel-ishaku-speaking.jpg"
              alt="Daniel Ishaku, founder of Toko Academy, speaking at a training event"
              brief="Founder mid-sentence addressing a room, hands in motion, shot at eye level"
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

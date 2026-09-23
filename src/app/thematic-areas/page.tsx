import type { Metadata } from 'next';
import Link from 'next/link';
import Picture from '@/components/ui/Picture';
import { pageMetadata, pageEntityJsonLd, jsonLdScript, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/thematic-areas',
  title: 'Our Eight Thematic Areas, Aligned to the SDGs',
  description:
    'The eight pillars our programmes are built on, from digital literacy and software engineering to gender inclusion, public sector capacity and green skills.',
  socialTitle: 'Eight Thematic Areas, Aligned to the SDGs | Toko Academy',
  socialDescription:
    'How our work maps to the UN Sustainable Development Goals — the pillars, the focus areas, and the principles that cut across all of them.',
  image: {
    url: `${SITE_URL}/images/hero/practical-mentorship-approach-classes.jpg`,
    alt: 'A Toko Academy mentor working with learners in a practical class',
  },
});

// Thematic Areas sits under About in the site navigation.
const entityJsonLd = pageEntityJsonLd({
  path: '/thematic-areas',
  name: 'Toko Academy Thematic Areas',
  description:
    'The eight thematic pillars behind Toko Academy’s programmes and how each maps to the UN Sustainable Development Goals.',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Thematic Areas', path: '/thematic-areas' },
  ],
});

// Hand-written utilities in globals.css are tree-shaken against the source, so
// a composed `reveal-delay-${i}` would be stripped from the build.
const DELAYS = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5'] as const;
const delay = (index: number) => DELAYS[Math.min(index, DELAYS.length - 1)];

/*
 * Eight areas, each rewritten to about half its length.
 *
 * Nothing has been dropped from the substance: the same audiences, the same
 * focus lists, the same SDG mappings. What has gone is the register — every
 * entry opened with a gerund ("Bridging…", "Building…", "Strengthening…") and
 * ran to forty words before naming a single person it was for. Eight of those
 * in a row is what made the page read as a grant application.
 */
const thematicAreas = [
  {
    number: '1',
    title: 'Digital Literacy & Foundational Skills',
    sdgs: ['SDG 4', 'SDG 10', 'SDG 16'],
    description:
      'The first rung. Individuals, public servants, teachers and whole communities who were never taught the skills that the modern economy — and now every digital public service — quietly assumes everybody has.',
    focus: ['Digital foundations & internet fundamentals', 'Microsoft Office & productivity', 'Digital safety & basic cybersecurity', 'Adult digital literacy'],
    image: '/images/hero/practical-mentorship-approach-classes.jpg',
    alt: 'A Toko Academy trainer helping a learner at a laptop during a class',
    brief: 'Trainer crouched beside an adult learner at a desktop machine, both looking at the screen',
  },
  {
    number: '2',
    title: 'Advanced Technology, Innovation & Software Engineering',
    sdgs: ['SDG 4', 'SDG 8', 'SDG 9'],
    description:
      'Moving developers, graduates and founders from consuming technology to building it — solutions, products and businesses made here rather than imported.',
    focus: ['AI & Machine Learning', 'Blockchain & IoT', 'Web & mobile development', 'Cloud, cybersecurity & UI/UX'],
    image: '/images/thematic/engineering-lab.jpg',
    alt: 'Developers working through code together at a Toko Academy engineering session',
    brief: 'Two developers at one screen, code visible, whiteboard of architecture behind them',
  },
  {
    number: '3',
    title: 'Data, Analytics & Evidence-Based Decision Making',
    sdgs: ['SDG 8', 'SDG 16', 'SDG 17'],
    description:
      'Data literacy, business intelligence and MEAL training for government agencies, NGOs and development organisations — so that a decision rests on the evidence rather than on whoever spoke last.',
    focus: ['Data analysis & visualisation', 'MEAL systems', 'Research methods & survey tools', 'Data-informed governance'],
    image: '/images/thematic/data-workshop.jpg',
    alt: 'Participants working with charts and spreadsheets at a Toko Academy data workshop',
    brief: 'Over-shoulder shot of a participant building a dashboard, projector showing the same chart behind',
  },
  {
    number: '4',
    title: 'Workforce Development, Entrepreneurship & Creative Economy',
    sdgs: ['SDG 4', 'SDG 5', 'SDG 8'],
    description:
      'Training tied directly to income: bootcamps, upskilling, mentorship and enterprise support for SMEs, creatives and young people looking for a job, a first client, or a business of their own.',
    focus: ['Career readiness & employability', 'Entrepreneurship & SME development', 'Digital marketing, content & graphic design', 'Freelancing & the creative economy'],
    image: '/images/hero/professional-courses.jpg',
    alt: 'Professionals at laptops during a Toko Academy training session in Yola',
    brief: 'Working professionals around a table with laptops, trainer presenting from a screen',
  },
  {
    number: '5',
    title: 'Children & Youth Technology Education',
    sdgs: ['SDG 4', 'SDG 5', 'SDG 10'],
    description:
      'Computational thinking while it is still play. Programming, game building and AI foundations for children and young people, in schools and through the holidays.',
    focus: ['Programming for kids (Scratch, HTML, CSS)', 'VR game development', 'AI foundations for youth', 'School-based & holiday bootcamps'],
    image: '/images/hero/kids-coding.jpg',
    alt: 'A young girl presenting her Scratch project on a screen at Toko Academy',
    brief: 'Child standing beside a large screen showing their own Scratch game, mid-presentation',
  },
  {
    number: '6',
    title: 'Gender Equality, Inclusion & Protection of Vulnerable Groups',
    sdgs: ['SDG 5', 'SDG 10', 'SDG 16'],
    description:
      'Closing the gender gap in technology, and making sure women, girls, displacement-affected families and persons with disabilities are not the people a digital transition leaves behind.',
    focus: ['Women & girls in STEM', 'Women in Uniform programming', 'GBV awareness & 16 Days of Activism', 'Scholarships & child-safe standards'],
    image: '/images/hero/commissioner-for-women-affairs.jpg',
    alt: 'Toko Academy hosts with a guest at the Women in Uniform event in Yola',
    brief: 'Guests at the event backdrop, award in hand, partner logos visible behind',
  },
  {
    number: '7',
    title: 'Public Sector Capacity Building & Institutional Strengthening',
    sdgs: ['SDG 8', 'SDG 16', 'SDG 17'],
    description:
      'Digital tools, AI literacy, cybersecurity awareness and data-driven practice for agencies, law enforcement and regulators — aimed at the service a citizen actually receives at the counter.',
    focus: ['AI & digital literacy for government', 'Cybersecurity for law enforcement', 'Data-driven decision-making', 'Institutional digital transformation'],
    image: '/images/hero/training-military-officers.jpg',
    alt: 'Officers in uniform seated at a Toko Academy digital skills session in Yola',
    brief: 'Wide shot of the hall from the front, uniforms readable, mid-session',
  },
  {
    number: '8',
    title: 'Climate Education, Green Digital Skills & Sustainability',
    sdgs: ['SDG 4', 'SDG 9', 'SDG 13', 'SDG 15'],
    description:
      'Climate literacy, sustainable computing and green-economy skills — so that learners and institutions here are ready for a transition largely being designed somewhere else.',
    focus: ['Climate literacy for youth & schools', 'Green digital skills (sustainable computing, climate data, e-waste)', 'Tech for climate adaptation', 'Youth-led climate action'],
    image: '/images/thematic/climate-classroom.jpg',
    alt: 'Young people at a Toko Academy climate and green skills session',
    brief: 'Outdoor or window-lit session with young people, climate data on a laptop or flip chart in frame',
  },
];

const crossCutting = [
  {
    title: 'Equity & Inclusion',
    description:
      'Gender-responsive facilitation, scholarships for low-income learners, and accessibility considered in every programme rather than retrofitted to one.',
  },
  {
    title: 'Community-Centred Delivery',
    description:
      'Programmes co-designed with local partners and rooted in how life is actually lived in North-East Nigeria.',
  },
  {
    title: 'Evidence & Learning',
    description:
      'Pre and post assessments, MEAL systems, and a beneficiary database that follows outcomes over several years.',
  },
  {
    title: 'Safeguarding & Child Protection',
    description:
      'Child-safe standards, a code of conduct binding on every trainer, and zero tolerance for harassment or exploitation.',
  },
  {
    title: 'Partnerships & Multi-Sector Collaboration',
    description:
      'Working across government, academia, INGOs, faith-based organisations and the private sector, because none of this scales alone.',
  },
];

export default function ThematicAreasPage() {
  return (
    <>
      <script {...jsonLdScript(entityJsonLd)} />

      <section className="relative overflow-hidden bg-surface-sunken pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="reveal">
              <p className="eyebrow">What we work on</p>
              <h1 className="mt-4">Eight pillars, and the one question underneath them.</h1>
              <p className="prose-measure mt-6 text-lg text-ink-muted">
                Every programme we run answers a version of the same question: who is being left out of the
                digital economy here, and what would actually change that? These eight areas are how the
                answer has organised itself — each one mapped to the Sustainable Development Goals it
                contributes to.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/partners" className="btn-primary">
                  Design a programme with us
                </Link>
                <Link href="/impact" className="btn-secondary">
                  See the outcomes
                </Link>
              </div>
            </div>

            <Picture
              src="/images/bootcamps/robotics-student.png"
              alt="A young learner assembling a robotics kit at a Toko Academy class"
              brief="Learner concentrating on a hands-on build — robotics kit or laptop — shot close, shallow depth"
              aspect="aspect-[4/3]"
              className="reveal reveal-delay-1"
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      {/*
        The eight areas, told one at a time with the room they happen in.
        Previously a two-column grid of eight near-identical bordered cards —
        by the third one a reader has stopped reading and is scanning for the
        end of the section.
      */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="reveal prose-measure">
            <p className="eyebrow">The areas</p>
            <h2 className="mt-4">Eight of them, in order.</h2>
          </div>

          <div className="mt-12 space-y-16 md:space-y-24">
            {thematicAreas.map((area, index) => (
              <article key={area.number} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                <Picture
                  src={area.image}
                  alt={area.alt}
                  brief={area.brief}
                  aspect="aspect-[3/2]"
                  // Alternating sides on desktop; on a phone the picture always
                  // comes first, because a zig-zag in one column is just noise.
                  className={`reveal ${index % 2 === 1 ? 'md:order-2' : ''}`}
                  sizes="(max-width: 768px) 100vw, 46vw"
                />

                <div className="reveal reveal-delay-1">
                  <p className="eyebrow">Area {area.number}</p>
                  <h3 className="mt-3">{area.title}</h3>
                  <p className="mt-4 text-ink-muted">{area.description}</p>

                  <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                    {area.focus.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-ink">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {area.sdgs.map((sdg) => (
                      <li
                        key={sdg}
                        className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand"
                      >
                        {sdg}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/*
        The SDG alignment matrix is gone.

        It was an eight-row, seven-column grid of ● and — characters, which on a
        360px screen collapsed into a single unreadable column of dots, and it
        restated information already printed on each area above: the goals each
        pillar contributes to. One fact, told twice, the second time as a table
        nobody can read on a phone.
      */}
      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <div className="reveal">
                <p className="eyebrow">Across all eight</p>
                <h2 className="mt-4">Five things that do not vary by programme.</h2>
              </div>
              <Picture
                src="/images/thematic/facilitation-team.jpg"
                alt="Toko Academy facilitators preparing together before a session"
                brief="Facilitators in a short huddle before class — notes, laptop, room being set up behind them"
                aspect="aspect-[4/3]"
                className="reveal reveal-delay-1 mt-10 hidden lg:block"
                sizes="40vw"
              />
            </div>

            <dl className="border-t border-line">
              {crossCutting.map((item, index) => (
                <div key={item.title} className={`reveal ${delay(index)} border-b border-line py-5`}>
                  <dt className="font-heading font-bold text-ink">{item.title}</dt>
                  <dd className="mt-1.5 text-ink-muted">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface py-16 md:py-24">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="reveal prose-measure">
            <h2>Designing something that fits one of these?</h2>
            <p className="mt-5 text-lg text-ink-muted">
              We co-design with government, INGO, academic and private sector partners. Tell us the outcome
              you need and we will scope the work with you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/partners" className="btn-primary">
                Talk to our team
              </Link>
              <Link href="/corporate" className="btn-secondary">
                Corporate &amp; government training
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

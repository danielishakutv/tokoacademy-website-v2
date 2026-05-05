import type { Metadata } from 'next';
import Link from 'next/link';

function InlineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: 'Digital Skills & Professional Growth - Toko Academy',
  description:
    'Explore practical learning pathways for youths, children, and professionals. Build industry-relevant skills with government and organizational partnerships creating measurable impact.',
  keywords: ['digital skills', 'professional training', 'youth education', 'corporate training', 'skills development'],
  alternates: {
    canonical: 'https://tokoacademy.org',
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

const impactStats = [
  { label: 'Learners Trained', value: '2,000+' },
  { label: 'Programmes Delivered', value: '20+' },
  { label: 'Partner Institutions', value: '35+' },
  { label: 'Career Progression', value: '75%' },
];

const pathways = [
  {
    id: 'parents',
    title: 'Children Programs',
    audience: 'For Parents and Guardians',
    summary:
      'Creative, safe, and practical digital learning pathways for children to build confidence early.',
    href: '/kids',
    cta: 'Explore Children Programs',
  },
  {
    id: 'students',
    title: 'Youth Bootcamps',
    audience: 'For Students and Young Adults',
    summary:
      'Project-based training that turns curiosity into practical, career-relevant tech skills.',
    href: '/courses',
    cta: 'Explore Youth Pathways',
  },
  {
    id: 'professionals',
    title: 'Professional Upskilling',
    audience: 'For Working Professionals',
    summary:
      'Flexible training for professionals ready to upgrade digital capabilities and stay competitive.',
    href: '/courses',
    cta: 'Advance Your Skills',
  },
  {
    id: 'organizations',
    title: 'Corporate and Institutional Training',
    audience: 'For Organizations and Government',
    summary:
      'Tailored capacity-building programs co-designed for workforce development and lasting impact.',
    href: '/corporate',
    cta: 'See Training Solutions',
  },
];

const differentiators = [
  {
    title: 'Industry-Relevant Learning',
    description:
      'Every program is structured around practical competencies that learners can apply immediately.',
  },
  {
    title: 'Inclusive Access',
    description:
      'We make quality digital education accessible to diverse audiences and communities.',
  },
  {
    title: 'Measurable Outcomes',
    description:
      'Our approach emphasizes clear progress, performance, and long-term advancement.',
  },
];

const partnerTypes = [
  'Government Agencies',
  'Educational Institutions',
  'Development Organizations',
  'Private Sector Partners',
];

const stories = [
  {
    quote:
      'I moved from beginner to building real projects and presenting my work confidently in just a few months.',
    author: 'Program Graduate',
    impact: 'Built portfolio projects and transitioned into client-facing work.',
  },
  {
    quote:
      'The structure made it easy to balance work and learning, and the outcomes were visible almost immediately.',
    author: 'Working Professional',
    impact: 'Applied new digital skills directly to improve team productivity.',
  },
  {
    quote:
      'Our collaboration produced stronger digital literacy outcomes and better readiness among beneficiaries.',
    author: 'Partner Organization',
    impact: 'Scaled community-facing training through joint implementation.',
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden pb-20 pt-36 text-white md:pb-28 md:pt-48">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,179,66,0.45),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(33,150,243,0.35),transparent_48%),linear-gradient(135deg,#1f2937,#0f172a)]" />
        <div className="section-container relative z-10">
          <div className="mx-auto max-w-5xl text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-yellow mb-4">Skills for Tomorrow</p>
            <h1 className="text-balance text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl lg:max-w-4xl">
              Building Africa&apos;s Digital Future — One Community at a Time.
            </h1>
            <p className="mt-6 max-w-3xl text-balance text-base text-white/90 sm:text-lg md:text-xl lg:text-2xl">
              Toko Academy Ltd. is a Nigerian-incorporated digital skills and workforce development organisation training individuals, institutions, and communities for the digital economy. Headquartered in Yola, Adamawa State, with national virtual reach.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:justify-start">
              <Link href="/courses" className="btn-primary w-full text-center sm:w-auto">
                Explore Programmes →
              </Link>
              <Link
                href="/partners"
                className="inline-flex w-full items-center justify-center rounded border border-white/40 px-8 py-4 text-base font-bold text-white transition-colors duration-300 hover:bg-white/10 sm:w-auto sm:text-lg"
              >
                Partner With Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-toko-gray-200 bg-white py-10 md:py-12 [content-visibility:auto] [contain-intrinsic-size:1px_540px]">
        <div className="section-container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Audience Selector</p>
              <h2 className="mt-3 text-2xl text-toko-gray-900 md:text-3xl">How can we support you today?</h2>
            </div>
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-2 xl:grid-cols-4">
              <a href="#parents" className="rounded-xl border border-toko-gray-300 px-4 py-3 text-center text-sm font-semibold text-toko-gray-800 transition-colors hover:border-toko-green hover:text-toko-green md:text-base">
                Parent / Guardian
              </a>
              <a href="#students" className="rounded-xl border border-toko-gray-300 px-4 py-3 text-center text-sm font-semibold text-toko-gray-800 transition-colors hover:border-toko-green hover:text-toko-green md:text-base">
                Student / Youth
              </a>
              <a href="#professionals" className="rounded-xl border border-toko-gray-300 px-4 py-3 text-center text-sm font-semibold text-toko-gray-800 transition-colors hover:border-toko-green hover:text-toko-green md:text-base">
                Professional
              </a>
              <a href="#organizations" className="rounded-xl border border-toko-gray-300 px-4 py-3 text-center text-sm font-semibold text-toko-gray-800 transition-colors hover:border-toko-green hover:text-toko-green md:text-base">
                Organization / Government
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-gray-50 [content-visibility:auto] [contain-intrinsic-size:1px_640px]">
        <div className="section-container">
          <div className="mb-10 max-w-3xl md:mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Impact Snapshot</p>
            <h2 className="mt-3 text-toko-gray-900">Credibility You Can See Quickly</h2>
            <p className="mt-4 text-base text-toko-gray-600 md:text-lg">
              Built through sustained collaboration, practical training, and measurable outcomes across learners and institutions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
            {impactStats.map((item) => (
              <article key={item.label} className="card rounded-2xl border border-toko-gray-200 p-5 md:p-6">
                <p className="text-2xl font-bold text-toko-green sm:text-3xl md:text-4xl">{item.value}</p>
                <p className="mt-2 text-xs text-toko-gray-600 sm:text-sm md:text-base">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white [content-visibility:auto] [contain-intrinsic-size:1px_760px]">
        <div className="section-container">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Pathways by Audience</p>
            <h2 className="mt-3 text-toko-gray-900">Clear Routes for Every Learner and Partner</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {pathways.map((pathway) => (
              <article id={pathway.id} key={pathway.id} className="card rounded-2xl border border-toko-gray-200 p-6 transition-shadow duration-300 hover:shadow-toko-lg md:p-7">
                <InlineIcon className="h-10 w-10 text-toko-blue" />
                <p className="mt-4 text-sm uppercase tracking-[0.18em] text-toko-gray-500">{pathway.audience}</p>
                <h3 className="mt-3 text-xl text-toko-gray-900 md:text-2xl">{pathway.title}</h3>
                <p className="mt-3 text-sm text-toko-gray-600 md:text-base">{pathway.summary}</p>
                <Link
                  href={pathway.href}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-toko-green transition-colors hover:text-toko-green-dark md:text-base"
                >
                  {pathway.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-gray-900 text-white [content-visibility:auto] [contain-intrinsic-size:1px_620px]">
        <div className="section-container">
          <div className="max-w-3xl mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">Why Toko Academy</p>
            <h2 className="mt-3">Focused, Inclusive, and Results-Driven</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {differentiators.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/15 bg-white/5 p-6 md:p-7">
                <InlineIcon className="h-10 w-10 text-toko-yellow" />
                <h3 className="mt-4 text-xl md:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm text-white/85 md:text-base">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white [content-visibility:auto] [contain-intrinsic-size:1px_640px]">
        <div className="section-container">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Partnership Ecosystem</p>
              <h2 className="mt-3 text-toko-gray-900">Built With Government and Organizations</h2>
              <p className="mt-4 text-base text-toko-gray-600 md:text-lg">
                We co-design and deliver capacity-building programs that align with community needs, workforce demands, and long-term development goals.
              </p>
              <Link href="/contact" className="mt-7 inline-flex items-center rounded-xl bg-toko-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-toko-blue-dark">
                Become a Partner
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {partnerTypes.map((type) => (
                <div key={type} className="rounded-2xl border border-toko-gray-200 bg-toko-gray-50 p-5 text-sm font-semibold text-toko-gray-800 md:text-base">
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-gray-50 [content-visibility:auto] [contain-intrinsic-size:1px_620px]">
        <div className="section-container">
          <div className="max-w-3xl mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Stories and Results</p>
            <h2 className="mt-3 text-toko-gray-900">Proof Through Human Outcomes</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
            {stories.map((story, index) => (
              <article key={index} className="card rounded-2xl border border-toko-gray-200 p-6 md:p-7">
                <p className="text-sm italic text-toko-gray-700 md:text-base">&ldquo;{story.quote}&rdquo;</p>
                <p className="mt-5 font-semibold text-toko-gray-900">{story.author}</p>
                <p className="mt-2 text-sm text-toko-gray-600">{story.impact}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white [content-visibility:auto] [contain-intrinsic-size:1px_460px]">
        <div className="section-container">
          <div className="grid grid-cols-1 items-center gap-8 rounded-2xl border border-toko-gray-200 bg-gradient-to-r from-white via-toko-gray-50 to-white p-6 md:grid-cols-2 md:p-10">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Impact Updates</p>
              <h2 className="mt-3 text-toko-gray-900">Follow Our Latest News and Events</h2>
              <p className="mt-4 text-sm text-toko-gray-600 md:text-base">
                See how our programs, partnerships, and events are creating meaningful change across communities.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/events" className="rounded-xl border border-toko-gray-300 px-5 py-3 text-center font-semibold text-toko-gray-800 transition-colors hover:border-toko-green hover:text-toko-green">
                View Events
              </Link>
              <Link href="/news" className="rounded-xl border border-toko-gray-300 px-5 py-3 text-center font-semibold text-toko-gray-800 transition-colors hover:border-toko-green hover:text-toko-green">
                View Newsroom
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-toko-green to-toko-blue py-20 text-white md:py-24 [content-visibility:auto] [contain-intrinsic-size:1px_420px]">
        <div className="section-container text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">Take the Next Step</p>
          <h2 className="mt-3 text-white">Start Your Journey or Build One With Us</h2>
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-toko-green transition-colors hover:bg-toko-gray-100 sm:text-lg">
              Apply Now
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-white/45 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:text-lg">
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

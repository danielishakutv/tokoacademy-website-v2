import type { Metadata } from 'next';
import Link from 'next/link';
import { IconWrapper } from '@/components/IconWrapper';

export const metadata: Metadata = {
  title: 'Digital Skills & Professional Growth - Toko Academy',
  description:
    'Explore practical learning pathways for youths, children, and professionals. Build industry-relevant skills with government and organizational partnerships creating measurable impact.',
  keywords: ['digital skills', 'professional training', 'youth education', 'corporate training', 'skills development'],
  alternates: {
    canonical: 'https://tokoacademy.org/home-v2-hybrid',
  },
  openGraph: {
    title: 'Digital Skills & Professional Growth - Toko Academy',
    description:
      'Practical learning pathways for youths, children, and professionals delivered with government and organizational partners.',
    url: 'https://tokoacademy.org/home-v2-hybrid',
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
  { label: 'Programs Delivered', value: '120+' },
  { label: 'Partner Institutions', value: '35+' },
  { label: 'Career Progression Outcomes', value: '85%' },
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
    icon: 'material-symbols:child-care-rounded',
  },
  {
    id: 'students',
    title: 'Youth Bootcamps',
    audience: 'For Students and Young Adults',
    summary:
      'Project-based training that turns curiosity into practical, career-relevant tech skills.',
    href: '/courses',
    cta: 'Explore Youth Pathways',
    icon: 'material-symbols:school-rounded',
  },
  {
    id: 'professionals',
    title: 'Professional Upskilling',
    audience: 'For Working Professionals',
    summary:
      'Flexible training for professionals ready to upgrade digital capabilities and stay competitive.',
    href: '/courses',
    cta: 'Advance Your Skills',
    icon: 'material-symbols:badge-rounded',
  },
  {
    id: 'organizations',
    title: 'Corporate and Institutional Training',
    audience: 'For Organizations and Government',
    summary:
      'Tailored capacity-building programs co-designed for workforce development and lasting impact.',
    href: '/corporate',
    cta: 'See Training Solutions',
    icon: 'material-symbols:corporate-fare-rounded',
  },
];

const differentiators = [
  {
    title: 'Industry-Relevant Learning',
    description:
      'Every program is structured around practical competencies that learners can apply immediately.',
    icon: 'material-symbols:target-rounded',
  },
  {
    title: 'Inclusive Access',
    description:
      'We make quality digital education accessible to diverse audiences and communities.',
    icon: 'material-symbols:groups-rounded',
  },
  {
    title: 'Measurable Outcomes',
    description:
      'Our approach emphasizes clear progress, performance, and long-term advancement.',
    icon: 'material-symbols:monitoring-rounded',
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

export default function HomeV2HybridPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-44 md:pt-52 pb-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,179,66,0.45),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(33,150,243,0.35),transparent_48%),linear-gradient(135deg,#1f2937,#0f172a)]" />
        <div className="section-container relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance">
              Empowering Youths, Children, and Professionals for Lasting Change
            </h1>
            <p className="mt-6 text-lg md:text-2xl text-white/90 max-w-3xl text-balance">
              Practical learning pathways delivered with government and organizational partners to create measurable impact.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/courses" className="btn-primary">
                Explore Programs
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded border border-white/40 px-8 py-4 text-lg font-bold text-white hover:bg-white/10 transition-colors duration-300"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-b border-toko-gray-200">
        <div className="section-container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Audience Selector</p>
              <h2 className="mt-2 text-2xl md:text-3xl text-toko-gray-900">How can we support you today?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto">
              <a href="#parents" className="rounded-md border border-toko-gray-300 px-4 py-3 text-toko-gray-800 font-semibold hover:border-toko-green hover:text-toko-green transition-colors">
                Parent / Guardian
              </a>
              <a href="#students" className="rounded-md border border-toko-gray-300 px-4 py-3 text-toko-gray-800 font-semibold hover:border-toko-green hover:text-toko-green transition-colors">
                Student / Youth
              </a>
              <a href="#professionals" className="rounded-md border border-toko-gray-300 px-4 py-3 text-toko-gray-800 font-semibold hover:border-toko-green hover:text-toko-green transition-colors">
                Professional
              </a>
              <a href="#organizations" className="rounded-md border border-toko-gray-300 px-4 py-3 text-toko-gray-800 font-semibold hover:border-toko-green hover:text-toko-green transition-colors">
                Organization / Government
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="max-w-3xl mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Impact Snapshot</p>
            <h2 className="mt-3 text-toko-gray-900">Credibility You Can See Quickly</h2>
            <p className="mt-4 text-lg text-toko-gray-600">
              Built through sustained collaboration, practical training, and measurable outcomes across learners and institutions.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {impactStats.map((item) => (
              <article key={item.label} className="card p-6 border border-toko-gray-200">
                <p className="text-3xl md:text-4xl font-bold text-toko-green">{item.value}</p>
                <p className="mt-2 text-sm md:text-base text-toko-gray-600">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-3xl mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Pathways by Audience</p>
            <h2 className="mt-3 text-toko-gray-900">Clear Routes for Every Learner and Partner</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pathways.map((pathway) => (
              <article id={pathway.id} key={pathway.id} className="card p-7 border border-toko-gray-200 hover:shadow-toko-lg transition-shadow duration-300">
                <IconWrapper icon={pathway.icon} className="w-10 h-10 text-toko-blue" ariaHidden />
                <p className="mt-4 text-sm uppercase tracking-[0.18em] text-toko-gray-500">{pathway.audience}</p>
                <h3 className="mt-2 text-2xl text-toko-gray-900">{pathway.title}</h3>
                <p className="mt-3 text-toko-gray-600">{pathway.summary}</p>
                <Link
                  href={pathway.href}
                  className="mt-5 inline-flex items-center font-semibold text-toko-green hover:text-toko-green-dark transition-colors"
                >
                  {pathway.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-gray-900 text-white">
        <div className="section-container">
          <div className="max-w-3xl mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">Why Toko Academy</p>
            <h2 className="mt-3">Focused, Inclusive, and Results-Driven</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {differentiators.map((item) => (
              <article key={item.title} className="rounded-lg border border-white/15 bg-white/5 p-6">
                <IconWrapper icon={item.icon} className="w-10 h-10 text-toko-yellow" ariaHidden />
                <h3 className="mt-4 text-2xl">{item.title}</h3>
                <p className="mt-3 text-white/85">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Partnership Ecosystem</p>
              <h2 className="mt-3 text-toko-gray-900">Built With Government and Organizations</h2>
              <p className="mt-4 text-lg text-toko-gray-600">
                We co-design and deliver capacity-building programs that align with community needs, workforce demands, and long-term development goals.
              </p>
              <Link href="/contact" className="mt-6 inline-flex items-center rounded bg-toko-blue px-6 py-3 font-semibold text-white hover:bg-toko-blue-dark transition-colors">
                Become a Partner
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {partnerTypes.map((type) => (
                <div key={type} className="rounded-lg border border-toko-gray-200 bg-toko-gray-50 p-5 font-semibold text-toko-gray-800">
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="max-w-3xl mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Stories and Results</p>
            <h2 className="mt-3 text-toko-gray-900">Proof Through Human Outcomes</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <article key={index} className="card p-6 border border-toko-gray-200">
                <p className="text-toko-gray-700 italic">&ldquo;{story.quote}&rdquo;</p>
                <p className="mt-5 font-semibold text-toko-gray-900">{story.author}</p>
                <p className="mt-2 text-sm text-toko-gray-600">{story.impact}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-lg border border-toko-gray-200 bg-gradient-to-r from-white via-toko-gray-50 to-white p-8 md:p-10">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Impact Updates</p>
              <h2 className="mt-3 text-toko-gray-900">Follow Our Latest News and Events</h2>
              <p className="mt-4 text-toko-gray-600">
                See how our programs, partnerships, and events are creating meaningful change across communities.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/events" className="rounded border border-toko-gray-300 px-5 py-3 font-semibold text-toko-gray-800 hover:border-toko-green hover:text-toko-green transition-colors">
                View Events
              </Link>
              <Link href="/news" className="rounded border border-toko-gray-300 px-5 py-3 font-semibold text-toko-gray-800 hover:border-toko-green hover:text-toko-green transition-colors">
                View Newsroom
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-toko-green to-toko-blue text-white">
        <div className="section-container text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">Take the Next Step</p>
          <h2 className="mt-3 text-white">Start Your Journey or Build One With Us</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="inline-flex items-center rounded bg-white px-8 py-4 text-lg font-bold text-toko-green hover:bg-toko-gray-100 transition-colors">
              Apply Now
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded border border-white/45 px-8 py-4 text-lg font-bold text-white hover:bg-white/10 transition-colors">
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

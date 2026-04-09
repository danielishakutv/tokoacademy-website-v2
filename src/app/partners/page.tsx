import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Partners - Collaborate for Lasting Impact',
  description:
    'Partner with Toko Academy to empower youths, children, and professionals through practical digital skills programs and measurable community impact.',
  alternates: {
    canonical: 'https://tokoacademy.org/partners',
  },
  openGraph: {
    title: 'Partners - Collaborate for Lasting Impact | Toko Academy',
    description:
      'Build meaningful partnerships with Toko Academy across government, organizations, and private sector teams.',
    url: 'https://tokoacademy.org/partners',
    type: 'website',
    images: [
      {
        url: 'https://tokoacademy.org/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Toko Academy Partnerships',
      },
    ],
  },
};

const collaborationAreas = [
  {
    title: 'Government Programs',
    text: 'Co-create workforce readiness, youth empowerment, and digital literacy initiatives at scale.',
  },
  {
    title: 'Organization Partnerships',
    text: 'Design practical learning pathways for communities, beneficiaries, and institutional teams.',
  },
  {
    title: 'Private Sector Alliances',
    text: 'Align industry needs with training outcomes through joint projects, mentorship, and talent pipelines.',
  },
];

const valuePoints = [
  'Co-designed programs based on local and workforce needs',
  'Transparent implementation with measurable outcomes',
  'Flexible models for short-term and long-term partnerships',
  'Delivery support from curriculum to learner engagement',
];

const processSteps = [
  {
    step: '01',
    title: 'Discovery Call',
    text: 'We align on goals, audience, timelines, and desired outcomes.',
  },
  {
    step: '02',
    title: 'Partnership Design',
    text: 'We shape a clear collaboration model and execution plan.',
  },
  {
    step: '03',
    title: 'Delivery and Reporting',
    text: 'We execute, track impact, and share progress transparently.',
  },
];

export default function PartnersPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Toko Academy',
    url: 'https://tokoacademy.org/partners',
    description:
      'Partnership opportunities with Toko Academy for government agencies, organizations, and private sector collaborators.',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden bg-gradient-to-br from-toko-gray-900 via-toko-blue to-toko-green pb-20 pt-40 text-white md:pb-24 md:pt-52">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="section-container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex rounded-full border border-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
              Partnership Hub
            </p>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight md:text-6xl">
              Build Lasting Impact With Toko Academy
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-balance text-base text-white/90 md:text-xl">
              We partner with government, organizations, and industry leaders to create practical pathways that empower youths, children, and professionals.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary w-full text-center sm:w-auto">
                Start a Partnership
              </Link>
              <Link
                href="/corporate"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/45 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                View Corporate Training
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white [content-visibility:auto] [contain-intrinsic-size:1px_560px]">
        <div className="section-container">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Where We Collaborate</p>
            <h2 className="mt-3 text-toko-gray-900">Focused Partnerships With Clear Outcomes</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {collaborationAreas.map((item) => (
              <article key={item.title} className="rounded-2xl border border-toko-gray-200 bg-white p-6 shadow-toko transition-shadow hover:shadow-toko-lg">
                <h3 className="text-xl font-bold text-toko-gray-900">{item.title}</h3>
                <p className="mt-3 text-sm text-toko-gray-600 md:text-base">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-gray-50 [content-visibility:auto] [contain-intrinsic-size:1px_520px]">
        <div className="section-container">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Why Partner With Us</p>
              <h2 className="mt-3 text-toko-gray-900">A Practical, Accountable Collaboration Model</h2>
              <ul className="mt-6 space-y-4">
                {valuePoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-toko-gray-700">
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-toko-green" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-toko-gray-200 bg-white p-6 shadow-toko md:p-7">
              <p className="text-sm uppercase tracking-[0.18em] text-toko-gray-500">How We Work</p>
              <div className="mt-5 space-y-5">
                {processSteps.map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-toko-blue text-sm font-bold text-white">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-toko-gray-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-toko-gray-600 md:text-base">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 [content-visibility:auto] [contain-intrinsic-size:1px_320px]">
        <div className="section-container">
          <div className="rounded-2xl border border-toko-gray-200 bg-gradient-to-r from-white via-toko-gray-50 to-white p-7 text-center md:p-10">
            <h2 className="text-toko-gray-900">Ready to Build Something Meaningful Together?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-toko-gray-600 md:text-base">
              Tell us your goals and context. We will work with your team to design a partnership model that creates measurable results.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary w-full text-center sm:w-auto">
                Talk to Our Team
              </Link>
              <Link
                href="/events"
                className="inline-flex w-full items-center justify-center rounded-xl border border-toko-gray-300 px-7 py-3 font-semibold text-toko-gray-800 transition-colors hover:border-toko-green hover:text-toko-green sm:w-auto"
              >
                See Impact Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

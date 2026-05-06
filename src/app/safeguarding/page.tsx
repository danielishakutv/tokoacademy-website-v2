import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Safeguarding Policy - Toko Academy',
  description: 'Learn about Toko Academy\'s safeguarding and child-protection standards for youth and kids technology programmes.',
  alternates: {
    canonical: 'https://tokoacademy.org/safeguarding',
  },
  openGraph: {
    title: 'Safeguarding Policy - Toko Academy',
    description: 'Toko Academy maintains documented safeguarding standards for children, youth, and vulnerable participants.',
    url: 'https://tokoacademy.org/safeguarding',
    type: 'website',
  },
};

export default function SafeguardingPage() {
  return (
    <section className="pt-40 pb-20 bg-white text-toko-gray-900">
      <div className="section-container">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.2em] text-toko-green">Safeguarding Policy</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Protecting Children, Youth, and Vulnerable Participants</h1>
          <p className="mt-6 text-lg text-toko-gray-600">
            Toko Academy is committed to upholding the highest safeguarding standards across all Kids, Youth, and community-facing programmes. Our policy is designed to create safe, respectful, and accountable learning environments.
          </p>

          <div className="mt-12 space-y-10">
            <article className="rounded-3xl border border-toko-gray-200 bg-toko-gray-50 p-8">
              <h2 className="text-2xl font-semibold text-toko-gray-900">Governance and Accountability</h2>
              <p className="mt-4 text-toko-gray-600">
                Our governance framework includes documented policies, a clear reporting structure, and oversight from the CEO and Board. We review safeguarding procedures regularly and update them to align with international best practice.
              </p>
            </article>

            <article className="rounded-3xl border border-toko-gray-200 bg-white p-8">
              <h2 className="text-2xl font-semibold text-toko-gray-900">Child-Friendly Facilitation Standards</h2>
              <p className="mt-4 text-toko-gray-600">
                All Kids & Youth Technology programmes operate with supervision ratios, age-appropriate content, and facilitation methods designed to support learners safely. Trainers are expected to model respectful behaviour and protect participant dignity at all times.
              </p>
            </article>

            <article className="rounded-3xl border border-toko-gray-200 bg-toko-gray-50 p-8">
              <h2 className="text-2xl font-semibold text-toko-gray-900">Reporting and Response</h2>
              <p className="mt-4 text-toko-gray-600">
                We maintain a mandatory reporting protocol for safeguarding concerns, with a confidential reporting line to senior leadership. Any incident is reviewed promptly and handled in accordance with established safeguarding procedures.
              </p>
            </article>

            <article className="rounded-3xl border border-toko-gray-200 bg-white p-8">
              <h2 className="text-2xl font-semibold text-toko-gray-900">Partner and Donor Assurance</h2>
              <p className="mt-4 text-toko-gray-600">
                Our policies are available to partners and donors on request. We also maintain a code of conduct for all trainers, volunteers, and programme staff involved with young people.
              </p>
            </article>
          </div>

          <div className="mt-12 rounded-3xl border border-toko-gray-200 bg-toko-green/5 p-8 text-center">
            <p className="text-base text-toko-gray-700">
              For safeguarding documentation or partnership inquiries, please contact us.
            </p>
            <Link href="mailto:info@tokoacademy.org?subject=Safeguarding%20Documentation%20Request" className="mt-6 inline-flex rounded-xl bg-toko-green px-8 py-3 font-semibold text-white transition-colors hover:bg-toko-green-dark">
              Request Safeguarding Documentation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

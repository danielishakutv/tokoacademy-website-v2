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
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-12 md:pt-40 md:pb-16">
        <div className="aurora" aria-hidden />
        <div className="section-container relative">
          <div className="max-w-3xl">
            <p className="eyebrow">Safeguarding Policy</p>
            {/* No size class. The heading was pinned at `text-4xl sm:text-5xl`
                — 48px against 16px body copy, which is the ratio the whole
                type scale was rebuilt to fix. */}
            <h1 className="mt-3">Protecting Children, Youth, and Vulnerable Participants</h1>
            <p className="prose-measure mt-5 text-lg text-ink-muted">
              Toko Academy is committed to upholding the highest safeguarding standards across all Kids, Youth, and community-facing programmes. Our policy is designed to create safe, respectful, and accountable learning environments.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-6">
              <article className="card p-6 sm:p-8 reveal">
                <h2>Governance and Accountability</h2>
                <p className="mt-4 text-ink-muted">
                  Our governance framework includes documented policies, a clear reporting structure, and oversight from the CEO and Board. We review safeguarding procedures regularly and update them to align with international best practice.
                </p>
              </article>

              <article className="card p-6 sm:p-8 reveal">
                <h2>Child-Friendly Facilitation Standards</h2>
                <p className="mt-4 text-ink-muted">
                  All Kids &amp; Youth Technology programmes operate with supervision ratios, age-appropriate content, and facilitation methods designed to support learners safely. Trainers are expected to model respectful behaviour and protect participant dignity at all times.
                </p>
              </article>

              <article className="card p-6 sm:p-8 reveal">
                <h2>Reporting and Response</h2>
                <p className="mt-4 text-ink-muted">
                  We maintain a mandatory reporting protocol for safeguarding concerns, with a confidential reporting line to senior leadership. Any incident is reviewed promptly and handled in accordance with established safeguarding procedures.
                </p>
              </article>

              <article className="card p-6 sm:p-8 reveal">
                <h2>Partner and Donor Assurance</h2>
                <p className="mt-4 text-ink-muted">
                  Our policies are available to partners and donors on request. We also maintain a code of conduct for all trainers, volunteers, and programme staff involved with young people.
                </p>
              </article>
            </div>

            <div className="mt-12 rounded-2xl border border-line bg-brand-soft p-6 text-center sm:p-8">
              <p className="text-ink-muted">
                For safeguarding documentation or partnership inquiries, please contact us.
              </p>
              <Link
                href="mailto:info@tokoacademy.org?subject=Safeguarding%20Documentation%20Request"
                className="btn-primary mt-6"
              >
                Request Safeguarding Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

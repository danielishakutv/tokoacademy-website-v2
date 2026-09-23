import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Toko Academy terms of service and conditions of use.',
};

export default function TermsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-12 md:pt-40 md:pb-16">
        <div className="aurora" aria-hidden />
        <div className="section-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Legal</p>
            <h1 className="mt-3">Terms of Service</h1>
            <p className="mt-4 text-ink-subtle">Last updated: January 2026</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="prose-measure mx-auto">
            <p className="mb-8 text-lg text-ink-muted">
              Please read these Terms of Service carefully before using Toko Academy&apos;s services.
            </p>

            <h2 className="mb-4 mt-10">Acceptance of Terms</h2>
            <p className="mb-4 text-ink-muted">
              By accessing and using our services, you accept and agree to be bound by these Terms of Service.
            </p>

            <h2 className="mb-4 mt-10">Course Enrollment</h2>
            <p className="mb-4 text-ink-muted">
              When you enroll in a course, you agree to attend classes regularly, complete assignments, and respect other students and instructors.
            </p>

            <h2 className="mb-4 mt-10">Payment Terms</h2>
            <p className="mb-4 text-ink-muted">
              Course fees are due as specified during enrollment. Refund policies vary by course and will be communicated clearly upon registration.
            </p>

            <h2 className="mb-4 mt-10">Intellectual Property</h2>
            <p className="mb-4 text-ink-muted">
              All course materials, content, and resources provided by Toko Academy are protected by intellectual property rights and are for personal educational use only.
            </p>

            <h2 className="mb-4 mt-10">Contact</h2>
            <p className="text-ink-muted">
              For questions about these Terms of Service, contact us at{' '}
              <a href="mailto:info@tokoacademy.org" className="font-semibold text-brand hover:underline">info@tokoacademy.org</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

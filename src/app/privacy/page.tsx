import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Toko Academy privacy policy and data protection information.',
};

export default function PrivacyPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-12 md:pt-40 md:pb-16">
        <div className="aurora" aria-hidden />
        <div className="section-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Legal</p>
            <h1 className="mt-3">Privacy Policy</h1>
            <p className="mt-4 text-ink-subtle">Last updated: January 2026</p>
          </div>
        </div>
      </section>

      {/* `prose-measure` rather than `max-w-4xl`: policy text is read, not
          scanned, and a 68-character column is where that stops being work.
          (`prose prose-lg` stood here and did nothing — the typography plugin
          is not installed.) */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="prose-measure mx-auto">
            <p className="mb-8 text-lg text-ink-muted">
              At Toko Academy, we are committed to protecting your privacy and ensuring the security of your personal information.
            </p>

            <h2 className="mb-4 mt-10">Information We Collect</h2>
            <p className="mb-4 text-ink-muted">
              We collect information that you provide directly to us when you register for courses, contact us, or use our services.
            </p>

            <h2 className="mb-4 mt-10">How We Use Your Information</h2>
            <p className="mb-4 text-ink-muted">
              We use the information we collect to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.
            </p>

            <h2 className="mb-4 mt-10">Data Security</h2>
            <p className="mb-4 text-ink-muted">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.
            </p>

            <h2 className="mb-4 mt-10">Contact Us</h2>
            <p className="text-ink-muted">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:info@tokoacademy.org" className="font-semibold text-brand hover:underline">info@tokoacademy.org</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

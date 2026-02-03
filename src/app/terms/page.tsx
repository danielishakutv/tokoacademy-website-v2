import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Toko Academy terms of service and conditions of use.',
};

export default function TermsPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-toko-gray-900 text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-4">Terms of Service</h1>
            <p className="text-lg text-white/90">Last updated: January 2026</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p className="text-lg text-toko-gray-600 mb-8">
              Please read these Terms of Service carefully before using Toko Academy&apos;s services.
            </p>

            <h2 className="text-2xl font-bold text-toko-gray-900 mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-toko-gray-600 mb-4">
              By accessing and using our services, you accept and agree to be bound by these Terms of Service.
            </p>

            <h2 className="text-2xl font-bold text-toko-gray-900 mt-8 mb-4">Course Enrollment</h2>
            <p className="text-toko-gray-600 mb-4">
              When you enroll in a course, you agree to attend classes regularly, complete assignments, and respect other students and instructors.
            </p>

            <h2 className="text-2xl font-bold text-toko-gray-900 mt-8 mb-4">Payment Terms</h2>
            <p className="text-toko-gray-600 mb-4">
              Course fees are due as specified during enrollment. Refund policies vary by course and will be communicated clearly upon registration.
            </p>

            <h2 className="text-2xl font-bold text-toko-gray-900 mt-8 mb-4">Intellectual Property</h2>
            <p className="text-toko-gray-600 mb-4">
              All course materials, content, and resources provided by Toko Academy are protected by intellectual property rights and are for personal educational use only.
            </p>

            <h2 className="text-2xl font-bold text-toko-gray-900 mt-8 mb-4">Contact</h2>
            <p className="text-toko-gray-600">
              For questions about these Terms of Service, contact us at info@tokoacademy.org.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

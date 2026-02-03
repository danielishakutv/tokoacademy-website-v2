import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Toko Academy privacy policy and data protection information.',
};

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-toko-gray-900 text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-4">Privacy Policy</h1>
            <p className="text-lg text-white/90">Last updated: January 2026</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p className="text-lg text-toko-gray-600 mb-8">
              At Toko Academy, we are committed to protecting your privacy and ensuring the security of your personal information.
            </p>

            <h2 className="text-2xl font-bold text-toko-gray-900 mt-8 mb-4">Information We Collect</h2>
            <p className="text-toko-gray-600 mb-4">
              We collect information that you provide directly to us when you register for courses, contact us, or use our services.
            </p>

            <h2 className="text-2xl font-bold text-toko-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-toko-gray-600 mb-4">
              We use the information we collect to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.
            </p>

            <h2 className="text-2xl font-bold text-toko-gray-900 mt-8 mb-4">Data Security</h2>
            <p className="text-toko-gray-600 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.
            </p>

            <h2 className="text-2xl font-bold text-toko-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-toko-gray-600">
              If you have any questions about this Privacy Policy, please contact us at info@tokoacademy.org.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

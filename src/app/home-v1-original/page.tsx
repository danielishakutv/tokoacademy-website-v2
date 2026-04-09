import type { Metadata } from 'next';
import HeroSlider from '@/components/home/HeroSlider';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import CoursesSection from '@/components/home/CoursesSection';
import KidsSection from '@/components/home/KidsSection';
import ServicesSection from '@/components/home/ServicesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTABanner from '@/components/home/CTABanner';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Toko Academy - Skills for Tomorrow | Digital Skills Training in Nigeria',
  description: 'Toko Academy empowers individuals and organizations with industry-relevant digital skills. Learn Web Development, Data Analysis, AI, Digital Marketing, and more. Trusted by 2K+ learners globally.',
  keywords: ['digital skills', 'coding bootcamp', 'web development', 'data analysis', 'AI training', 'digital marketing', 'Nigeria tech training', 'online courses', 'kids coding', 'corporate training'],
  alternates: {
    canonical: 'https://tokoacademy.org/home-v1-original',
  },
};

export default function HomeV1Original() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Toko Academy',
    description: 'Empowering individuals and organizations with industry-relevant digital skills to thrive in the digital age.',
    url: 'https://tokoacademy.org',
    logo: 'https://tokoacademy.org/logo/ta_logo_png.png',
    slogan: 'Skills for Tomorrow',
    telephone: ['+2348088256055', '+2348128561493'],
    email: 'info@tokoacademy.org',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressCountry: 'NG'
    },
    sameAs: [
      'https://facebook.com/tokoacademy',
      'https://instagram.com/tokoacademy',
      'https://twitter.com/tokoacademy',
      'https://linkedin.com/company/tokoacademy'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Toko Academy Courses',
      itemListElement: [
        {
          '@type': 'Course',
          name: 'Data Analysis & Visualization',
          description: 'Master Excel, SQL, Power BI, and Python for data-driven decision making.',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'Toko Academy'
          }
        },
        {
          '@type': 'Course',
          name: 'Website Development',
          description: 'Build modern, responsive websites with HTML, CSS, JavaScript, and frameworks.',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'Toko Academy'
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Suspense fallback={null}>
        <HeroSlider />
      </Suspense>
      <Suspense fallback={null}>
        <WhyChooseSection />
      </Suspense>
      <Suspense fallback={null}>
        <CoursesSection />
      </Suspense>
      <Suspense fallback={null}>
        <KidsSection />
      </Suspense>
      <Suspense fallback={null}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={null}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={null}>
        <CTABanner />
      </Suspense>
    </>
  );
}

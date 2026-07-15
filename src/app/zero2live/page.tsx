import type { Metadata } from 'next';
import ZeroToLive from './ZeroToLive';
import { HERO_IMG, SEATS, PRICE_FLASH_NUMBER } from './config';

export const metadata: Metadata = {
  title: 'Zero to Live — Build a Real App With AI in One Weekend',
  description:
    'A 2-day, in-person workshop in Jimeta-Yola. Build a working app with AI, put it live at a real domain, and leave knowing how to charge for it. 25 seats. Limited-time founding rate.',
  alternates: {
    canonical: 'https://tokoacademy.org/zero2live',
  },
  openGraph: {
    title: 'Zero to Live — Build a Real App With AI in One Weekend',
    description:
      'Build a working app with AI, put it online at an address people can actually type, and leave knowing how to charge for it. 25 seats. Jimeta-Yola.',
    url: 'https://tokoacademy.org/zero2live',
    type: 'website',
    siteName: 'Toko Academy',
    images: [{ url: HERO_IMG, alt: 'Daniel Ishaku, Toko Academy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zero to Live — Build a Real App With AI in One Weekend',
    description:
      'Build a working app with AI, put it live at a real domain, and leave knowing how to charge for it. 25 seats.',
    images: [HERO_IMG],
  },
};

export default function ZeroToLivePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Zero to Live — Build a Real App With AI in One Weekend',
    description:
      'A 2-day, in-person workshop. Build a working app with AI, put it live at a real domain, and leave knowing how to charge for it.',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Toko Academy',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jimeta-Yola',
        addressRegion: 'Adamawa',
        addressCountry: 'NG',
      },
    },
    organizer: { '@type': 'Organization', name: 'Toko Academy', url: 'https://tokoacademy.org' },
    offers: {
      '@type': 'Offer',
      price: PRICE_FLASH_NUMBER,
      priceCurrency: 'NGN',
      availability: 'https://schema.org/LimitedAvailability',
      url: 'https://tokoacademy.org/zero2live',
    },
    maximumAttendeeCapacity: SEATS,
    performer: { '@type': 'Person', name: 'Daniel Ishaku' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ZeroToLive />
    </>
  );
}

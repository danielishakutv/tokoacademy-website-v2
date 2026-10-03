import type { Metadata } from 'next';
import ZeroToLive from './ZeroToLive';
import { HERO_IMG, PRICE_NUMBER, PRICE_NAIRA, COURSE_SLUG_CATALOGUE } from './config';
import { getCourse } from '@/lib/dlc';
import { jsonLdHtml } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Zero to Live — Build a Real App With AI in One Weekend',
  description:
    'A 2-day, in-person workshop in Jimeta-Yola. Build a working app with AI, put it live at a real domain, and leave knowing how to charge for it. Places are limited.',
  alternates: {
    canonical: 'https://tokoacademy.org/zero2live',
  },
  openGraph: {
    title: 'Zero to Live — Build a Real App With AI in One Weekend',
    description:
      'Build a working app with AI, put it online at an address people can actually type, and leave knowing how to charge for it. In person in Jimeta-Yola.',
    url: 'https://tokoacademy.org/zero2live',
    type: 'website',
    siteName: 'Toko Academy',
    images: [{ url: HERO_IMG, alt: 'Daniel Ishaku, Toko Academy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zero to Live — Build a Real App With AI in One Weekend',
    description:
      'Build a working app with AI, put it live at a real domain, and leave knowing how to charge for it.',
    images: [HERO_IMG],
  },
};

/**
 * Read the workshop's price from the catalogue rather than from a constant.
 *
 * It was hardcoded, which was fine until a promotion made the platform charge
 * something else: the page would have advertised ₦25,000 while the checkout took
 * ₦12,500. One source of truth, and it is the system that handles the money.
 *
 * Falls back to the constants when the catalogue cannot be reached — a sales
 * page with no price on it would be worse than a slightly stale one, and
 * `getCourse` already returns null rather than throwing.
 */
export default async function ZeroToLivePage() {
  const catalogue = await getCourse(COURSE_SLUG_CATALOGUE);
  const price = catalogue?.price ?? PRICE_NAIRA;
  const originalPrice = catalogue?.originalPrice ?? null;
  const discount = catalogue?.discount ?? null;
  /*
   * Whether this workshop can be bought on the spot.
   *
   * The catalogue has Zero to Live as `blended` — a scheduled, in-person course —
   * and /api/public/enrol refuses those outright, so the "Hold my seat" form was
   * posting a checkout the platform would never open and showing the refusal back
   * to the visitor. A scheduled course takes an application instead, which is the
   * same route every other scheduled course on the site already uses.
   *
   * Defaults to the application route when the catalogue is unreachable: lodging
   * an application nobody expected is recoverable, charging a card for a seat
   * that cannot be sold is not.
   */
  const selfPaced = catalogue?.deliveryMode === 'self_paced';
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
      // What a buyer is charged today, not the list price — structured data that
      // contradicts the checkout is a rich result that lies.
      price: String(price),
      priceCurrency: 'NGN',
      availability: 'https://schema.org/LimitedAvailability',
      url: 'https://tokoacademy.org/zero2live',
    },
    performer: { '@type': 'Person', name: 'Daniel Ishaku' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }} />
      <ZeroToLive
        price={price}
        originalPrice={originalPrice}
        discountEndsAt={discount?.endsAt ?? null}
        discountLabel={discount?.label ?? null}
        selfPaced={selfPaced}
      />
    </>
  );
}

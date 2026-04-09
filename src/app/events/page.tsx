import type { Metadata } from 'next';
import { fetchEventPosts } from '@/lib/wordpress';
import EventsClient from './client';

export const metadata: Metadata = {
  title: 'Events | Toko Academy',
  description:
    'Explore published Toko Academy events with photos, highlights, and direct links to event websites and registration pages.',
  keywords: [
    'Toko Academy events',
    'events in Nigeria',
    'education events',
    'technology events',
    'workshops and conferences',
  ],
  alternates: {
    canonical: 'https://tokoacademy.org/events',
  },
  openGraph: {
    title: 'Events | Toko Academy',
    description:
      'Discover our latest events, view event highlights, and visit official event pages.',
    url: 'https://tokoacademy.org/events',
    type: 'website',
    images: [
      {
        url: 'https://tokoacademy.org/images/hero/professional-courses.jpg',
        width: 1200,
        height: 630,
        alt: 'Toko Academy Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events | Toko Academy',
    description:
      'Discover our latest events, view event highlights, and visit official event pages.',
    images: ['https://tokoacademy.org/images/hero/professional-courses.jpg'],
  },
};

export const revalidate = 3600;

export default async function EventsPage() {
  const events = await fetchEventPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    name: 'Toko Academy Events',
    description:
      'Published events from Toko Academy featuring conferences, workshops, and community sessions.',
    url: 'https://tokoacademy.org/events',
    organizer: {
      '@type': 'EducationalOrganization',
      name: 'Toko Academy',
      url: 'https://tokoacademy.org',
    },
    subEvent: events.slice(0, 12).map((item) => ({
      '@type': 'Event',
      name: item.title,
      startDate: item.date,
      eventStatus: 'https://schema.org/EventScheduled',
      image: item.image,
      description: item.excerpt,
      url: `https://tokoacademy.org/events#${item.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EventsClient events={events} />
    </>
  );
}

import { Metadata } from 'next';
import { fetchGalleryAlbums } from '@/lib/wordpress';
import GalleryClient from './client';

export const metadata: Metadata = {
  title: 'Photo Gallery | Toko Academy',
  description: 'Explore our photo gallery showcasing memorable moments, events, and activities at Toko Academy.',
  keywords: [
    'Toko Academy gallery',
    'photo gallery',
    'academy photos',
    'events gallery',
    'student activities',
    'academy memories',
  ],
  alternates: {
    canonical: 'https://tokoacademy.org/gallery',
  },
  openGraph: {
    title: 'Photo Gallery | Toko Academy',
    description: 'Explore our photo gallery showcasing memorable moments, events, and activities at Toko Academy.',
    url: 'https://tokoacademy.org/gallery',
    type: 'website',
    images: [
      {
        url: 'https://tokoacademy.org/images/og-gallery.jpg',
        width: 1200,
        height: 630,
        alt: 'Toko Academy Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo Gallery | Toko Academy',
    description: 'Explore our photo gallery showcasing memorable moments, events, and activities at Toko Academy.',
    images: ['https://tokoacademy.org/images/og-gallery.jpg'],
  },
};

export default async function GalleryPage() {
  const albums = await fetchGalleryAlbums();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Toko Academy Photo Gallery',
    description: 'Photo albums showcasing events and activities at Toko Academy',
    url: 'https://tokoacademy.org/gallery',
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'Toko Academy',
      url: 'https://tokoacademy.org',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GalleryClient albums={albums} />
    </>
  );
}

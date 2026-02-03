import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchGalleryAlbumBySlug, fetchGalleryAlbums } from '@/lib/wordpress';
import AlbumClient from './client';

type AlbumPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const albums = await fetchGalleryAlbums();
  return albums.map((album) => ({
    slug: album.slug,
  }));
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const album = await fetchGalleryAlbumBySlug(params.slug);

  if (!album) {
    return {
      title: 'Album Not Found | Toko Academy',
    };
  }

  const firstImage = album.images[0]?.url || 'https://tokoacademy.org/images/og-gallery.jpg';

  return {
    title: `${album.title} | Toko Academy Gallery`,
    description: album.description,
    alternates: {
      canonical: `https://tokoacademy.org/gallery/${album.slug}`,
    },
    openGraph: {
      title: `${album.title} | Toko Academy Gallery`,
      description: album.description,
      url: `https://tokoacademy.org/gallery/${album.slug}`,
      type: 'article',
      images: [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: album.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${album.title} | Toko Academy Gallery`,
      description: album.description,
      images: [firstImage],
    },
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const album = await fetchGalleryAlbumBySlug(params.slug);

  if (!album) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: album.title,
    description: album.description,
    datePublished: album.date,
    url: album.shareUrl,
    image: album.images.map(img => img.url),
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
      <AlbumClient album={album} />
    </>
  );
}

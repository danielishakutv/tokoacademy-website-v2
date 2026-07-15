import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchEventPostBySlug, fetchEventPosts } from '@/lib/wordpress';
import EventGalleryLightbox from './gallery-lightbox';

type EventDetailPageProps = {
  params: { slug: string };
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const events = await fetchEventPosts();

  return events.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const item = await fetchEventPostBySlug(params.slug);

  if (!item) {
    return {
      title: 'Event Not Found | Toko Academy',
      description: 'The event you are looking for could not be found.',
    };
  }

  return {
    title: `${item.title} | Toko Academy Events`,
    description: item.excerpt,
    alternates: {
      canonical: `https://tokoacademy.org/events/${item.slug}`,
    },
    openGraph: {
      title: `${item.title} | Toko Academy Events`,
      description: item.excerpt,
      url: `https://tokoacademy.org/events/${item.slug}`,
      type: 'article',
      images: [
        {
          url: item.ogImage,
          width: 1200,
          height: 630,
          alt: item.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.title} | Toko Academy Events`,
      description: item.excerpt,
      images: [item.ogImage],
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const item = await fetchEventPostBySlug(params.slug);

  if (!item) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: item.title,
    description: item.excerpt,
    image: item.image,
    url: `https://tokoacademy.org/events/${item.slug}`,
    organizer: {
      '@type': 'EducationalOrganization',
      name: 'Toko Academy',
      url: 'https://tokoacademy.org',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden bg-toko-gray-900 pb-16 pt-44 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(33,150,243,0.20),transparent_35%),radial-gradient(circle_at_10%_20%,rgba(124,179,66,0.18),transparent_35%)]" />
        <div className="section-container relative z-10">
          <Link
            href="/events"
            className="inline-flex items-center text-sm font-semibold text-white/90 transition-colors hover:text-white"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Events
          </Link>

          <h1 className="mt-8 max-w-4xl">{item.title}</h1>
          <p className="mt-4 text-lg text-white/80">{item.date}</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="mx-auto max-w-5xl">
            <div className="relative mb-12 h-80 overflow-hidden rounded-2xl md:h-[32rem]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover"
                priority
              />
            </div>

            <article
              className="prose prose-lg max-w-none mb-12 space-y-6 text-lg leading-relaxed text-toko-gray-700 [&_a]:font-semibold [&_a]:text-toko-blue [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-toko-gray-900 [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-toko-gray-900 [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: item.contentHtmlWithoutImages }}
            />

            <div className="mt-12 rounded-2xl border border-toko-gray-200 bg-toko-gray-50 p-6">
              <h2 className="text-2xl font-bold text-toko-gray-900">Event Links</h2>
              {item.links.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {item.links.map((linkItem, index) => (
                    <a
                      key={`${item.slug}-external-${index}`}
                      href={linkItem.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg border border-toko-gray-300 bg-white px-4 py-2 text-sm font-semibold text-toko-gray-700 transition-colors hover:border-toko-blue hover:text-toko-blue"
                    >
                      {linkItem.label}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-toko-gray-600">No external event links were provided for this event.</p>
              )}
            </div>

            {item.images.length > 0 && (
              <div className="mt-12">
                <EventGalleryLightbox images={item.images} />
              </div>
            )}

            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/events" className="btn-secondary">
                Back to Events
              </Link>
              <Link href="/contact" className="btn-primary">
                Plan an Event With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

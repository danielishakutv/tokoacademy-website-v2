import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchEventPostBySlug, fetchEventPosts } from '@/lib/wordpress';
import EventGalleryLightbox from './gallery-lightbox';
import { jsonLdHtml } from '@/lib/json-ld';

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
          url: item.image,
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
      images: [item.image],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }} />

      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-12 md:pt-40 md:pb-16">
        <div className="aurora" aria-hidden />
        <div className="section-container relative">
          <Link href="/events" className="link-hover inline-flex items-center text-sm font-semibold text-ink-muted">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Events
          </Link>

          <h1 className="mt-6 max-w-4xl">{item.title}</h1>
          <p className="mt-4 text-lg text-ink-muted">{item.date}</p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="mx-auto max-w-4xl">
            <div className="relative mb-10 h-56 overflow-hidden rounded-2xl sm:h-80 md:mb-12 md:h-[28rem]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover"
                priority
              />
            </div>

            {/*
              WordPress HTML, so its own tags carry no classes: these arbitrary
              variants are the only way the tokens reach inside it. The heading
              sizes that used to be pinned here (`[&_h2]:text-3xl`) are gone —
              the global fluid scale handles them, and pinning one size was
              half the reason headings dwarfed the body copy.
            */}
            <article
              className="mb-12 max-w-none space-y-6 text-lg leading-relaxed text-ink-muted
                         [&_a]:font-semibold [&_a]:text-brand [&_a]:underline-offset-4 hover:[&_a]:underline
                         [&_h2]:mt-10 [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:text-ink
                         [&_strong]:text-ink [&_p]:mb-4
                         [&_blockquote]:border-l-4 [&_blockquote]:border-line-strong [&_blockquote]:pl-4 [&_blockquote]:italic
                         [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2
                         [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl
                         [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-xl
                         [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-surface-sunken [&_pre]:p-4
                         [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: item.contentHtmlWithoutImages }}
            />

            <div className="mt-12 rounded-2xl border border-line bg-surface-sunken p-5 sm:p-6">
              <h2>Event Links</h2>
              {item.links.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {item.links.map((linkItem, index) => (
                    <a
                      key={`${item.slug}-external-${index}`}
                      href={linkItem.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center rounded-lg border border-line-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand"
                    >
                      {linkItem.label}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-ink-muted">No external event links were provided for this event.</p>
              )}
            </div>

            {item.images.length > 0 && (
              <div className="mt-12">
                <EventGalleryLightbox images={item.images} />
              </div>
            )}

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
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

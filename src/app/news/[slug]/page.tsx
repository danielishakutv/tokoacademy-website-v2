import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchNewsArticleBySlug, fetchNewsArticles } from '@/lib/wordpress';
import { jsonLdHtml } from '@/lib/json-ld';

// Dark-theme partners, and a fallback so an unrecognised category cannot put
// the literal string "undefined" into the class attribute. See `/news`.
const categoryStyles: Record<string, string> = {
  'Press Release': 'bg-toko-green/10 text-toko-green dark:text-toko-green-light',
  'Toko in the News': 'bg-toko-blue/10 text-toko-blue-dark dark:text-toko-blue-light',
  'Newsroom': 'bg-toko-magenta/10 text-toko-magenta-dark dark:text-toko-magenta-light',
  'Tips': 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

function categoryStyle(category: string) {
  return categoryStyles[category] ?? 'bg-surface-sunken text-ink-muted';
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await fetchNewsArticles();
  return articles.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await fetchNewsArticleBySlug(params.slug);

  if (!item) {
    return {
      title: 'News - Toko Academy',
      description: 'Read the latest news and insights from Toko Academy.'
    };
  }

  return {
    title: `${item.title} - Toko Academy`,
    description: item.excerpt,
    keywords: [item.category, 'Toko Academy', 'digital skills training', 'education news Nigeria'],
    alternates: {
      canonical: `https://tokoacademy.org/news/${item.slug}`,
    },
    openGraph: {
      title: item.title,
      description: item.excerpt,
      url: `https://tokoacademy.org/news/${item.slug}`,
      type: 'article',
      images: [{
        url: item.image,
        width: 1200,
        height: 630,
        alt: item.imageAlt
      }],
      siteName: 'Toko Academy',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.excerpt,
      images: [item.image],
    },
  };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const item = await fetchNewsArticleBySlug(params.slug);

  if (!item) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': item.title,
    'description': item.excerpt,
    'image': item.image,
    'datePublished': item.date,
    'dateModified': item.date,
    'author': {
      '@type': 'Organization',
      'name': 'Toko Academy',
      'url': 'https://tokoacademy.org'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Toko Academy',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://tokoacademy.org/logo/toko-academy.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://tokoacademy.org/news/${item.slug}`
    },
    'articleSection': item.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
      
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-14 md:pt-40 md:pb-16">
        <div className="aurora" aria-hidden />
        <div className="section-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryStyle(item.category)}`}>
                {item.category}
              </span>
              <span className="text-sm text-ink-subtle">{item.date}</span>
              <span className="text-sm text-ink-subtle">{item.readTime}</span>
            </div>
            <h1>{item.title}</h1>
            <p className="prose-measure mx-auto mt-5 text-lg text-ink-muted">{item.excerpt}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <div className="relative mb-10 h-56 w-full overflow-hidden rounded-2xl sm:h-72 md:h-96">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>

            {/*
              The body is WordPress HTML, so its tags cannot carry classes of
              their own. These arbitrary variants are how the tokens reach
              inside it — without them the article would be readable in the
              light theme and invisible in the dark, and any image or table in
              it would run past the edge of a 360px screen.
            */}
            <article
              className="space-y-6 text-lg leading-relaxed text-ink-muted
                         [&_a]:font-semibold [&_a]:text-brand [&_a]:underline-offset-4 hover:[&_a]:underline
                         [&_h2]:mt-10 [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:text-ink
                         [&_strong]:text-ink
                         [&_blockquote]:border-l-4 [&_blockquote]:border-line-strong [&_blockquote]:pl-4 [&_blockquote]:italic
                         [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2
                         [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl
                         [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-xl
                         [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-surface-sunken [&_pre]:p-4
                         [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: item.contentHtml }}
            />

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/news" className="btn-secondary w-full sm:w-fit">
                Back to News
              </Link>
              <Link href="/contact" className="btn-primary w-full sm:w-fit">
                Talk to Toko Academy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

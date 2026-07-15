import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchNewsArticleBySlug, fetchNewsArticles } from '@/lib/wordpress';

const categoryStyles: Record<string, string> = {
  'Press Release': 'bg-toko-green/10 text-toko-green',
  'Toko in the News': 'bg-toko-blue/10 text-toko-blue',
  'Newsroom': 'bg-toko-magenta/10 text-toko-magenta',
  'Tips': 'bg-orange-500/10 text-orange-600',
};

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
        url: item.ogImage,
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
      images: [item.ogImage],
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
        'url': 'https://tokoacademy.org/logo/ta_logo_png.png'
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero */}
      <section className="pt-48 md:pt-56 pb-16 md:pb-20 bg-toko-gray-900 text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyles[item.category]}`}>
                {item.category}
              </span>
              <span className="text-sm text-white/80">{item.date}</span>
              <span className="text-sm text-white/80">{item.readTime}</span>
            </div>
            <h1 className="mb-6">{item.title}</h1>
            <p className="text-xl text-white/90">{item.excerpt}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-10">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>

            <article
              className="space-y-6 text-lg text-toko-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.contentHtml }}
            />

            <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <Link href="/news" className="btn-secondary w-fit">
                Back to News
              </Link>
              <Link href="/contact" className="btn-primary w-fit">
                Talk to Toko Academy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

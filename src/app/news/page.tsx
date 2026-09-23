import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { fetchNewsArticles, getNewsCategories } from '@/lib/wordpress';
import { jsonLdHtml } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'News & Insights - Toko Academy',
  description: 'Read the latest press releases, newsroom updates, Toko Academy news coverage, and practical tips from our team.',
  keywords: ['Toko Academy news', 'press releases', 'educational news Nigeria', 'tech training updates', 'digital skills news', 'learning tips'],
  alternates: {
    canonical: 'https://tokoacademy.org/news',
  },
  openGraph: {
    title: 'News & Insights - Toko Academy',
    description: 'Press releases, newsroom updates, Toko in the news, and tips from Toko Academy.',
    url: 'https://tokoacademy.org/news',
    type: 'website',
    images: [{
      url: 'https://tokoacademy.org/images/hero/professional-courses.jpg',
      width: 1200,
      height: 630,
      alt: 'Toko Academy News'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News & Insights - Toko Academy',
    description: 'Press releases, newsroom updates, Toko in the news, and tips from Toko Academy.',
    images: ['https://tokoacademy.org/images/hero/professional-courses.jpg'],
  },
};

export const revalidate = 3600;

/*
 * Each accent carries a dark-theme partner: the light-theme greens and blues
 * were picked for contrast against white and go muddy on a tinted block in the
 * dark. The fallback matters too — an unrecognised category used to put the
 * string "undefined" in the class attribute and render an unstyled chip.
 */
const categoryStyles: Record<string, string> = {
  'Press Release': 'bg-toko-green/10 text-toko-green dark:text-toko-green-light',
  'Toko in the News': 'bg-toko-blue/10 text-toko-blue-dark dark:text-toko-blue-light',
  'Newsroom': 'bg-toko-magenta/10 text-toko-magenta-dark dark:text-toko-magenta-light',
  'Tips': 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

const FALLBACK_CATEGORY_STYLE = 'bg-surface-sunken text-ink-muted';

function categoryStyle(category: string) {
  return categoryStyles[category] ?? FALLBACK_CATEGORY_STYLE;
}

export default async function NewsPage() {
  const articles = await fetchNewsArticles();
  const featured = articles[0];
  const others = articles.slice(1);
  const categories = getNewsCategories(articles);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Toko Academy News & Insights',
    'description': 'Latest press releases, newsroom updates, and educational tips from Toko Academy',
    'url': 'https://tokoacademy.org/news',
    'publisher': {
      '@type': 'Organization',
      'name': 'Toko Academy',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://tokoacademy.org/logo/toko-academy.png'
      }
    },
    'blogPost': articles.slice(0, 10).map(article => ({
      '@type': 'BlogPosting',
      'headline': article.title,
      'description': article.excerpt,
      'datePublished': article.date,
      'url': `https://tokoacademy.org/news/${article.slug}`,
      'image': article.image,
      'author': {
        '@type': 'Organization',
        'name': 'Toko Academy'
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
      
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-14 md:pt-40 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative">
          <div className="mx-auto max-w-3xl text-center reveal">
            <p className="eyebrow">Newsroom</p>
            <h1 className="mt-3">News &amp; Insights</h1>
            <p className="prose-measure mx-auto mt-5 text-lg text-ink-muted md:text-xl">
              Press releases, Toko in the news, newsroom updates, and practical tips to help you grow.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${categoryStyle(category)}`}
              >
                {category}
              </span>
            ))}
          </div>

          {/* Featured */}
          {featured && (
            <Link
              href={`/news/${featured.slug}`}
              className="card group grid grid-cols-1 items-center overflow-hidden p-0 lg:grid-cols-2 reveal"
            >
              <div className="relative h-56 sm:h-72 lg:h-full lg:min-h-[20rem]">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-transparent" />
              </div>
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryStyle(featured.category)}`}>
                    {featured.category}
                  </span>
                  <span className="text-sm text-ink-subtle">{featured.date}</span>
                  <span className="text-sm text-ink-subtle">{featured.readTime}</span>
                </div>
                <h2 className="mb-4 transition-colors group-hover:text-brand">
                  {featured.title}
                </h2>
                <p className="mb-6 text-lg text-ink-muted">{featured.excerpt}</p>
                <span className="inline-flex items-center font-semibold text-brand">
                  Read full story
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          )}

          {/* News Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="card group overflow-hidden p-0 reveal"
              >
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryStyle(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-ink-subtle">{item.date}</span>
                    <span className="text-xs text-ink-subtle">{item.readTime}</span>
                  </div>
                  <h3 className="mb-3 transition-colors group-hover:text-brand">
                    {item.title}
                  </h3>
                  <p className="mb-4 text-ink-muted">{item.excerpt}</p>
                  <span className="text-sm font-semibold text-brand">Read full gist</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

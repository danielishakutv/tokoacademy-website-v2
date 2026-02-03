import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { fetchNewsArticles, getNewsCategories } from '@/lib/wordpress';

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

const categoryStyles: Record<string, string> = {
  'Press Release': 'bg-toko-green/10 text-toko-green',
  'Toko in the News': 'bg-toko-blue/10 text-toko-blue',
  'Newsroom': 'bg-toko-magenta/10 text-toko-magenta',
  'Tips': 'bg-orange-500/10 text-orange-600',
};

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
        'url': 'https://tokoacademy.org/logo/ta_logo_png.png'
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero */}
      <section className="pt-48 md:pt-56 pb-16 md:pb-20 bg-gradient-to-br from-toko-green to-toko-blue text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">News & Insights</h1>
            <p className="text-xl md:text-2xl text-white/95">
              Press releases, Toko in the news, newsroom updates, and practical tips to help you grow.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {categories.map((category) => (
              <span
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${categoryStyles[category]}`}
              >
                {category}
              </span>
            ))}
          </div>

          {/* Featured */}
          {featured && (
            <Link
              href={`/news/${featured.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-10 items-center card p-0 overflow-hidden hover:shadow-toko-lg transition-shadow duration-300"
            >
              <div className="relative h-72 lg:h-full min-h-[18rem]">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-transparent" />
              </div>
              <div className="p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyles[featured.category]}`}>
                    {featured.category}
                  </span>
                  <span className="text-sm text-toko-gray-500">{featured.date}</span>
                  <span className="text-sm text-toko-gray-500">{featured.readTime}</span>
                </div>
                <h2 className="text-3xl font-bold text-toko-gray-900 mb-4 group-hover:text-toko-green transition-colors">
                  {featured.title}
                </h2>
                <p className="text-lg text-toko-gray-600 mb-6">{featured.excerpt}</p>
                <span className="inline-flex items-center text-toko-green font-semibold">
                  Read full story
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          )}

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group card p-0 overflow-hidden hover:shadow-toko-lg transition-shadow duration-300"
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
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyles[item.category]}`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-toko-gray-500">{item.date}</span>
                    <span className="text-xs text-toko-gray-500">{item.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-toko-gray-900 mb-3 group-hover:text-toko-green transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-toko-gray-600 mb-4">{item.excerpt}</p>
                  <span className="text-sm font-semibold text-toko-green">Read full gist</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

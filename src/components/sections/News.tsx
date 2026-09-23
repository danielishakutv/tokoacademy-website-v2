import Link from 'next/link';
import { fetchNewsArticles, type NewsArticle } from '@/lib/wordpress';
import { count, stagger, text, type SectionProps } from './fields';
import Band, { Intro, toneOf } from './tone';

/**
 * The latest articles from the newsroom.
 *
 * WordPress, but never at the cost of the page. `fetchNewsArticles` throws
 * when wp.tokoacademy.org is unreachable — and it has been, because the build
 * runs on a GitHub runner and that host's firewall has blocked it before. A
 * composed page losing its news strip is a shorter page; a composed page
 * taking the whole site's deployment down with it is an outage.
 */
async function newsOrNothing(limit: number): Promise<NewsArticle[]> {
  try {
    return (await fetchNewsArticles(limit)).slice(0, limit);
  } catch (error) {
    console.warn('News section: the newsroom was unreachable, leaving the band out.', error);
    return [];
  }
}

const readableDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default async function News({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const limit = count(data, 'limit', 3);
  const articles = await newsOrNothing(limit);

  // Nothing to show is nothing to announce: an empty newsroom should leave no
  // heading promising articles that are not there.
  if (articles.length === 0) return null;

  return (
    <Band tone={tone} first={first}>
      <Intro
        tone={tone}
        eyebrow={text(data, 'eyebrow')}
        heading={text(data, 'heading')}
        className="reveal"
        action={
          <Link href="/news" className="link-hover inline-flex items-center gap-1.5 font-semibold text-brand">
            All news
            <span aria-hidden>&rarr;</span>
          </Link>
        }
      />

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {articles.map((article, index) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className={`card reveal ${stagger(index)} group flex flex-col overflow-hidden`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.imageAlt || ''}
              className="h-44 w-full object-cover"
              loading="lazy"
              decoding="async"
              width={640}
              height={360}
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-brand">
                  {article.category}
                </span>
                {readableDate(article.date) && <span>{readableDate(article.date)}</span>}
                {article.readTime && <span>· {article.readTime}</span>}
              </div>
              <h3 className="mt-3 transition-colors group-hover:text-brand">{article.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </Band>
  );
}

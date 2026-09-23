import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ManagedSections from '@/components/sections';
import { managedPage, managedPages } from '@/lib/managed';

/**
 * A page composed in ta_admin.
 *
 * Everything under `/p/` is drawn from an ordered list of sections held in the
 * admin, rather than from a file in this repository. That is the whole point:
 * the owner can publish a new page — an appeal, a programme, a partner
 * landing page — without a developer, a commit or a release.
 *
 * It lives under `/p/` rather than at the root deliberately. The site is a
 * static export, so every route becomes an `index.html` on disk: a composed
 * page called "about" sharing the root namespace with `src/app/about` would
 * emit the same file twice and break the build outright. The prefix keeps the
 * two namespaces from ever touching, and it also makes the distinction visible
 * — a URL under `/p/` is a page somebody made, and the hand-built pages keep
 * the short addresses that are already printed on things.
 *
 * Resolved entirely at build time. Nothing here runs in a visitor's browser,
 * and a change in the admin is live after the next publish.
 */

/**
 * Zero pages must not be a failed build.
 *
 * Next 14 reads a dynamic route's `generateStaticParams` and, under
 * `output: export`, treats an **empty** result as a missing function: it
 * throws "Page /p/[slug] is missing generateStaticParams()" and the whole site
 * stops building. That is exactly the state this repository is in before
 * anybody has composed a page, and the state it falls back to whenever
 * ta_admin is unreachable — so as written it would turn an unrelated admin
 * server restarting into a site that cannot deploy, which is the one thing
 * `lib/managed.ts` exists to prevent.
 *
 * `revalidate = 0` moves that check out of the way, but it is the wrong cure:
 * it also marks the route dynamic, and a dynamic route under `output: export`
 * is listed in the build table and then never written to disk. The composed
 * pages silently did not ship.
 *
 * So the empty case returns one placeholder slug instead. It costs a single
 * tiny HTML file that nothing links to, and it keeps both promises at once —
 * the build survives an unreachable admin, and a real composed page is
 * actually exported.
 */
const PLACEHOLDER_SLUG = 'index';

/** One safe path segment. Anything else cannot become a directory on disk. */
const SAFE_SLUG = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export async function generateStaticParams() {
  const pages = await managedPages();
  const seen = new Set<string>();

  const params = pages
    .filter((page) => SAFE_SLUG.test(page.slug))
    .filter((page) => {
      // Two pages answering to one slug would write the same `index.html`
      // twice and fail the export. The first one wins; the second is a
      // mistake in the admin rather than a reason not to deploy.
      if (seen.has(page.slug)) return false;
      seen.add(page.slug);
      return true;
    })
    .map((page) => ({ slug: page.slug }));

  return params.length ? params : [{ slug: PLACEHOLDER_SLUG }];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await managedPage(params.slug);
  if (!page) return {};

  const title = page.title ? `${page.title} - Toko Academy` : 'Toko Academy';
  // With a trailing slash: `trailingSlash: true` means the server 301s the
  // slashless form, so a canonical without it points at a redirect.
  const url = `https://tokoacademy.org/p/${page.slug}/`;

  return {
    title,
    // Undefined rather than an invented sentence: a description nobody wrote
    // is worse in a search result than none, because Google will otherwise
    // take a real one from the page.
    description: page.description || undefined,
    alternates: { canonical: url },
    openGraph: {
      title: page.title || 'Toko Academy',
      description: page.description || undefined,
      url,
      type: 'website',
      siteName: 'Toko Academy',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title || 'Toko Academy',
      description: page.description || undefined,
    },
  };
}

export default async function ComposedPage({ params }: { params: { slug: string } }) {
  const page = await managedPage(params.slug);

  // Reached by the placeholder slug when no page has been composed yet, and by
  // an unknown slug on the day this site gains a server. Both should be a 404
  // rather than a blank page returned with a 200.
  if (!page) notFound();

  return (
    <>
      {/*
        `.reveal` starts at zero opacity and is switched on by the observer in
        the root layout. That is the right trade for a page with JavaScript and
        the wrong one for a page without it — a visitor whose script never
        arrives would get a blank page. Two lines of CSS that only a scriptless
        browser ever parses close that hole.
      */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: '.reveal{opacity:1 !important;transform:none !important}',
          }}
        />
      </noscript>

      <ManagedSections sections={page.sections} />
    </>
  );
}

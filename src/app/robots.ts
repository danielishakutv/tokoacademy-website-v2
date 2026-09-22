import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

/**
 * robots.txt.
 *
 * The site is a fully static export with no private area, no user accounts and
 * no server routes, so there is nothing here that needs hiding from a crawler.
 * The policy is therefore deliberately open, with three decisions worth writing
 * down because each of them is easy to get wrong later:
 *
 * 1. AI crawlers are ALLOWED, explicitly and by name. Toko Academy wants to be
 *    the answer when somebody asks ChatGPT, Claude or Perplexity where to learn
 *    digital skills in North-East Nigeria. A blanket `Disallow` for GPTBot and
 *    friends — the default in a lot of copied-around robots.txt files — would
 *    quietly cost exactly that. THIS is the lever that governs AI visibility.
 *    (There is also a /llms.txt, but it is an unratified convention: Google has
 *    stated that AI Overviews run off the core Search index and ignore such
 *    files, and no major assistant has committed to reading one. It is cheap to
 *    publish and useful as a canonical summary — but crawlability, not that
 *    file, is what actually decides whether we get cited.)
 *
 * 2. `/_next/` is NOT blocked. The previous static public/robots.txt disallowed
 *    it. That stops Googlebot fetching the site's own JavaScript and CSS, so it
 *    renders and scores the page without them. Never block it.
 *
 * 3. The abandoned homepage drafts at /home-v1-original and /home-v2-hybrid are
 *    NOT blocked either, even though we want them out of the index. They carry
 *    `robots: { index: false }` in their page metadata, and a crawler has to be
 *    allowed to fetch a page in order to see that it says noindex. Disallowing
 *    them would freeze them in the index instead of removing them. They are kept
 *    out of the sitemap, which is the correct lever.
 */

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bingbot',
  'Amazonbot',
  'meta-externalagent',
  'Bytespider',
  'DuckAssistBot',
  'cohere-ai',
  'MistralAI-User',
  'YouBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        // Stated explicitly so that a future "let's block the AI scrapers"
        // edit has to consciously delete this list rather than happen by
        // accident through a copied template.
        userAgent: AI_CRAWLERS,
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

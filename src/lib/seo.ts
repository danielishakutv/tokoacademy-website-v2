import { jsonLdHtml } from '@/lib/json-ld';
/**
 * Shared SEO primitives.
 *
 * Two things live here that were previously copied, inconsistently, into every
 * page file:
 *
 *  1. Canonical URL construction. `next.config.js` sets `trailingSlash: true`,
 *     so the *served* address of every page ends in a slash — the live site
 *     301s `/about` to `/about/`. Canonicals that omitted the slash were
 *     therefore pointing at a redirect rather than at the page itself. Every
 *     canonical, Open Graph `url` and sitemap entry now comes from `canonical()`
 *     so they cannot drift apart again.
 *
 *  2. The organisation's identity, in one place, built from `src/data/config.ts`
 *     so the phone numbers, e-mail, address and social profiles in our
 *     structured data are the same ones on the contact page. Nothing in here is
 *     invented: if a value is not in config or visibly on the site, it is not
 *     asserted to a search engine.
 */
import type { Metadata } from 'next';
import { contactInfo } from '@/data/config';

export const SITE_URL = 'https://tokoacademy.org';
export const SITE_NAME = 'Toko Academy';
export const SITE_TAGLINE = 'Skills for Tomorrow';

/**
 * The logo this repository actually ships, in `public/logo/`.
 *
 * The header and footer previously loaded a 131KB, 2,991px-wide PNG from the
 * WordPress webroot by absolute URL — to draw it 48 pixels tall. That file is
 * now a 20KB copy in this export, and the whole site, structured data
 * included, points at the version this build controls.
 */
export const LOGO_URL = `${SITE_URL}/logo/toko-academy.png`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/** Stable ids so separate JSON-LD graphs refer to one entity, not several. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * The absolute, canonical address of a page — always with the trailing slash
 * the server actually serves.
 */
export function canonical(path: string): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  const trimmed = `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
  return `${SITE_URL}${trimmed}/`;
}

type OgImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

type PageMetaInput = {
  /** Route path, e.g. `/about`. Drives the canonical and the og:url. */
  path: string;
  /**
   * The page title WITHOUT the site name — the root layout's template appends
   * " | Toko Academy". Keep it under ~45 characters so the rendered title
   * stays under ~60.
   */
  title: string;
  /** 140–160 characters, written for a person reading a results page. */
  description: string;
  /** Social-card title. Defaults to `"<title> | Toko Academy"`. */
  socialTitle?: string;
  /** Social-card description. Defaults to `description`. */
  socialDescription?: string;
  image?: OgImage;
  keywords?: string[];
};

const FALLBACK_IMAGE: OgImage = {
  url: DEFAULT_OG_IMAGE,
  alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
  width: 1200,
  height: 630,
};

/**
 * Build a complete, consistent metadata block: canonical, Open Graph and
 * Twitter card, all pointing at the same URL and the same real image.
 */
export function pageMetadata(input: PageMetaInput): Metadata {
  const url = canonical(input.path);
  const image = input.image ?? FALLBACK_IMAGE;
  const socialTitle = input.socialTitle ?? `${input.title} | ${SITE_NAME}`;
  const socialDescription = input.socialDescription ?? input.description;

  return {
    title: input.title,
    description: input.description,
    ...(input.keywords ? { keywords: input.keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_NG',
      siteName: SITE_NAME,
      url,
      title: socialTitle,
      description: socialDescription,
      images: [
        {
          url: image.url,
          width: image.width ?? 1200,
          height: image.height ?? 630,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: socialDescription,
      images: [image.url],
    },
  };
}

/**
 * Toko Academy as an entity.
 *
 * `EducationalOrganization` rather than plain `Organization`: the body's
 * purpose is teaching, which is what the type means. Every field traces to
 * `src/data/config.ts` or to copy visible on the site. Deliberately absent:
 * learner counts, placement rates and partner counts. Those come from internal
 * records the owner stands behind, and they belong in page copy — but putting
 * an unaudited figure into `aggregateRating` or `numberOfStudents` states it to
 * a search engine as a verified fact, which it is not.
 */
export const organizationJsonLd = {
  '@type': 'EducationalOrganization',
  '@id': ORG_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  slogan: SITE_TAGLINE,
  description:
    'Toko Academy is a digital skills training academy in Jimeta-Yola, Adamawa State, Nigeria, teaching software engineering, data analysis, AI, cybersecurity, digital marketing and digital literacy to young people, professionals, children and public institutions.',
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
  },
  image: DEFAULT_OG_IMAGE,
  email: contactInfo.email,
  telephone: contactInfo.phones[0],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No. 1A Bekaji Road, Adjacent to YEDC S/C Office',
    addressLocality: 'Jimeta, Yola',
    addressRegion: 'Adamawa',
    addressCountry: 'NG',
  },
  contactPoint: contactInfo.phones.map((telephone) => ({
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone,
    email: contactInfo.email,
    areaServed: 'NG',
    availableLanguage: ['en'],
  })),
  areaServed: {
    '@type': 'Country',
    name: 'Nigeria',
  },
  knowsAbout: [
    'Digital literacy',
    'Software engineering',
    'Web development',
    'Python programming',
    'Data analysis and visualisation',
    'Artificial intelligence',
    'Cybersecurity',
    'Digital marketing and content creation',
    'Coding for children',
    'Corporate and public sector digital training',
  ],
  sameAs: [
    contactInfo.socialMedia.facebook,
    contactInfo.socialMedia.instagram,
    contactInfo.socialMedia.twitter,
    contactInfo.socialMedia.linkedin,
  ],
};

/**
 * The site itself.
 *
 * No `potentialAction` / `SearchAction`: tokoacademy.org has no search page, and
 * declaring a search endpoint that does not exist is a claim Google will try,
 * fail to honour and discount. If a `/search` route is ever built, add it here.
 */
export const websiteJsonLd = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  description: `${SITE_NAME} — ${SITE_TAGLINE}. Digital skills training in Nigeria.`,
  inLanguage: 'en-NG',
  publisher: { '@id': ORG_ID },
};

/** The two above, as one graph, for the root layout. */
export const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [organizationJsonLd, websiteJsonLd],
};

/**
 * A breadcrumb trail. Only call this where the trail is genuinely how the site
 * is organised and the page is reachable that way from the navigation.
 */
export function breadcrumbJsonLd(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: canonical(crumb.path),
    })),
  };
}

/**
 * FAQ markup. Only for questions and answers a visitor can actually read on the
 * page — marking up FAQs that are not visible is a spam signal and a manual
 * action waiting to happen.
 */
export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * A page's own node, tied back to the one organisation and the one website by
 * `@id`, plus its breadcrumb trail — as a single graph.
 *
 * This is deliberately a reference (`{ '@id': ORG_ID }`) rather than a second
 * copy of the organisation on every page. Repeating the full Organization block
 * page by page invites them to drift apart and gives a crawler several
 * candidate entities to reconcile instead of one.
 *
 * Worth being honest about the expected return: this is entity infrastructure
 * for search — it helps a crawler understand that these pages describe one
 * body, and it feeds breadcrumb display in results. It is not an AI-citation
 * tactic; the available evidence finds no measurable lift in AI citations from
 * schema. Keep it correct, keep it cheap, do not build strategy on it.
 */
export function pageEntityJsonLd(input: {
  path: string;
  name: string;
  description: string;
  /** `AboutPage` for an about page, `CollectionPage` for an index, else `WebPage`. */
  type?: 'WebPage' | 'AboutPage' | 'CollectionPage';
  /** True when the page's subject IS the organisation itself. */
  isAboutOrganisation?: boolean;
  breadcrumbs: Array<{ name: string; path: string }>;
}) {
  const url = canonical(input.path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': input.type ?? 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: input.name,
        description: input.description,
        isPartOf: { '@id': WEBSITE_ID },
        inLanguage: 'en-NG',
        ...(input.isAboutOrganisation
          ? { about: { '@id': ORG_ID }, mainEntity: { '@id': ORG_ID } }
          : { about: { '@id': ORG_ID } }),
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: input.breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: canonical(crumb.path),
        })),
      },
    ],
  };
}

/**
 * Render a JSON-LD blob into a script tag's props.
 *
 * The escaping lives in one place — `@/lib/json-ld` — rather than being
 * written out again here. Two implementations of the same security control
 * drift, and the one that drifts is the one nobody is looking at: this copy
 * handled `<` but not U+2028 and U+2029, which are legal in JSON and are line
 * terminators to a JavaScript parser.
 */
export function jsonLdScript(data: unknown) {
  return {
    type: 'application/ld+json' as const,
    dangerouslySetInnerHTML: { __html: jsonLdHtml(data) },
  };
}

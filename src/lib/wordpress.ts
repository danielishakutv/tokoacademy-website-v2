import ogManifest from './og-manifest.json';

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

// Optimized Open Graph images (1200x630 JPEG, <300KB, same-domain) are produced at
// build time by scripts/generate-og-images.mjs, which writes this manifest. If an
// item has no generated image the app falls back to the original, so link previews
// never regress when generation is skipped or fails.
const OG_MANIFEST = ogManifest as Record<string, string>;

function ogImageFor(type: 'news' | 'event' | 'gallery', slug: string, fallback: string): string {
  return OG_MANIFEST[`${type}:${slug}`] ?? fallback;
}

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ??
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ??
  'https://wp.tokoacademy.org/graphql';

export type WordPressPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  status?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    } | null;
  } | null;
  categories?: {
    nodes?: Array<{ name?: string | null; slug?: string | null }>;
  } | null;
};

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: 'Press Release' | 'Toko in the News' | 'Newsroom' | 'Tips';
  readTime: string;
  image: string;
  imageAlt: string;
  ogImage: string;
  contentHtml: string;
};

const DEFAULT_IMAGE = '/images/hero/professional-courses.jpg';
const ALLOWED_NEWS_CATEGORY_SLUGS = ['in-the-news', 'newsroom', 'press-release'] as const;

function hasAllowedNewsCategory(categories?: WordPressPost['categories']) {
  return Boolean(
    categories?.nodes?.some((category) =>
      ALLOWED_NEWS_CATEGORY_SLUGS.includes((category.slug ?? '').toLowerCase() as (typeof ALLOWED_NEWS_CATEGORY_SLUGS)[number])
    )
  );
}

function getPrimaryNewsCategory(categories?: WordPressPost['categories']): NewsArticle['category'] {
  if (!categories?.nodes?.length) {
    return 'Newsroom';
  }

  if (categories.nodes.some((category) => (category.slug ?? '').toLowerCase() === 'press-release')) {
    return 'Press Release';
  }

  if (categories.nodes.some((category) => (category.slug ?? '').toLowerCase() === 'in-the-news')) {
    return 'Toko in the News';
  }

  if (categories.nodes.some((category) => (category.slug ?? '').toLowerCase() === 'newsroom')) {
    return 'Newsroom';
  }

  return 'Newsroom';
}

export async function graphqlRequest<T>(query: string, variables: Record<string, unknown> = {}) {
  if (!WORDPRESS_API_URL) {
    throw new Error('WORDPRESS_API_URL or NEXT_PUBLIC_WORDPRESS_API_URL is not set');
  }

  const response = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`WordPress GraphQL request failed: ${response.status}`);
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((err) => err.message).join('\n'));
  }

  if (!json.data) {
    throw new Error('WordPress GraphQL response missing data');
  }

  return json.data;
}

// WordPress returns plain-text fields (title, excerpt) with HTML entities encoded
// (e.g. &#8217; &#8211; &hellip; &amp;). When those strings are rendered as React
// text nodes they are NOT decoded by the browser, so the raw codes show on screen.
// Decode them here. NOTE: never run this on HTML that will be passed to
// dangerouslySetInnerHTML — the browser decodes that itself, and decoding it here
// would turn escaped markup back into live tags.
const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  nbsp: ' ', ensp: ' ', emsp: ' ', thinsp: ' ', shy: '',
  hellip: '…', mdash: '—', ndash: '–', minus: '−',
  lsquo: '‘', rsquo: '’', sbquo: '‚',
  ldquo: '“', rdquo: '”', bdquo: '„',
  laquo: '«', raquo: '»', lsaquo: '‹', rsaquo: '›',
  copy: '©', reg: '®', trade: '™', deg: '°',
  plusmn: '±', times: '×', divide: '÷',
  frac12: '½', frac14: '¼', frac34: '¾',
  sup1: '¹', sup2: '²', sup3: '³',
  micro: 'µ', para: '¶', middot: '·', bull: '•',
  dagger: '†', Dagger: '‡', permil: '‰',
  prime: '′', Prime: '″', euro: '€', pound: '£',
  cent: '¢', yen: '¥', curren: '¤', sect: '§',
  iexcl: '¡', iquest: '¿', brvbar: '¦', not: '¬',
  ordf: 'ª', ordm: 'º', acute: '´', cedil: '¸',
  uml: '¨', macr: '¯', szlig: 'ß',
  agrave: 'à', aacute: 'á', acirc: 'â', atilde: 'ã', auml: 'ä', aring: 'å', aelig: 'æ',
  ccedil: 'ç',
  egrave: 'è', eacute: 'é', ecirc: 'ê', euml: 'ë',
  igrave: 'ì', iacute: 'í', icirc: 'î', iuml: 'ï',
  ntilde: 'ñ',
  ograve: 'ò', oacute: 'ó', ocirc: 'ô', otilde: 'õ', ouml: 'ö', oslash: 'ø', oelig: 'œ',
  ugrave: 'ù', uacute: 'ú', ucirc: 'û', uuml: 'ü',
  yacute: 'ý', yuml: 'ÿ',
  Agrave: 'À', Aacute: 'Á', Acirc: 'Â', Atilde: 'Ã', Auml: 'Ä', Aring: 'Å', AElig: 'Æ',
  Ccedil: 'Ç',
  Egrave: 'È', Eacute: 'É', Ecirc: 'Ê', Euml: 'Ë',
  Igrave: 'Ì', Iacute: 'Í', Icirc: 'Î', Iuml: 'Ï',
  Ntilde: 'Ñ',
  Ograve: 'Ò', Oacute: 'Ó', Ocirc: 'Ô', Otilde: 'Õ', Ouml: 'Ö', Oslash: 'Ø', OElig: 'Œ',
  Ugrave: 'Ù', Uacute: 'Ú', Ucirc: 'Û', Uuml: 'Ü',
  Yacute: 'Ý',
  hearts: '♥', spades: '♠', clubs: '♣', diams: '♦',
  larr: '←', uarr: '↑', rarr: '→', darr: '↓', harr: '↔',
};

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, entity: string) => {
    if (entity.charAt(0) === '#') {
      const isHex = entity.charAt(1) === 'x' || entity.charAt(1) === 'X';
      const codePoint = isHex ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      if (!Number.isFinite(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
        return match;
      }
      try {
        return String.fromCodePoint(codePoint);
      } catch {
        return match;
      }
    }
    const decoded = NAMED_HTML_ENTITIES[entity];
    return decoded !== undefined ? decoded : match;
  });
}

function stripHtml(value: string) {
  const withoutTags = value.replace(/<[^>]*>/g, '');
  return decodeHtmlEntities(withoutTags).replace(/\s+/g, ' ').trim();
}

function stripImagesFromHtml(value: string) {
  return value.replace(/<figure[^>]*>.*?<\/figure>/gi, '').replace(/<img[^>]*>/gi, '').trim();
}

function normalizeCategory(categories?: WordPressPost['categories']): NewsArticle['category'] {
  return getPrimaryNewsCategory(categories);
}

function calculateReadTime(content: string) {
  const words = stripHtml(content).split(' ').filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function mapPostToArticle(post: WordPressPost): NewsArticle {
  const imageUrl = post.featuredImage?.node?.sourceUrl || DEFAULT_IMAGE;
  const imageAlt = stripHtml(post.featuredImage?.node?.altText || post.title);
  const image = imageUrl.startsWith('http') ? imageUrl : DEFAULT_IMAGE;

  return {
    slug: post.slug,
    title: stripHtml(post.title),
    excerpt: stripHtml(post.excerpt || ''),
    date: new Date(post.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    category: normalizeCategory(post.categories),
    readTime: calculateReadTime(post.content || post.excerpt || ''),
    image,
    imageAlt,
    ogImage: ogImageFor('news', post.slug, image),
    contentHtml: post.content || '',
  };
}

export async function fetchNewsArticles(limit = 30): Promise<NewsArticle[]> {
  const query = `
    query NewsPosts($first: Int!) {
      posts(
        first: $first
        where: {
          status: PUBLISH
          orderby: { field: DATE, order: DESC }
        }
      ) {
        nodes {
          slug
          title
          excerpt
          date
          content
          status
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const data = await graphqlRequest<{ posts: { nodes: WordPressPost[] } }>(query, { first: limit });
  return data.posts.nodes
    .filter((post) => (post.status ?? '').toLowerCase() === 'publish' && hasAllowedNewsCategory(post.categories))
    .map(mapPostToArticle);
}

export async function fetchNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const query = `
    query NewsPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        slug
        title
        excerpt
        date
        content
        status
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  `;

  const data = await graphqlRequest<{ post: WordPressPost | null }>(query, { slug });

  if (!data.post) {
    return null;
  }

  if ((data.post.status ?? '').toLowerCase() !== 'publish') {
    return null;
  }

  if (!hasAllowedNewsCategory(data.post.categories)) {
    return null;
  }

  return mapPostToArticle(data.post);
}

export function getNewsCategories(articles: NewsArticle[]) {
  const categories = new Set<NewsArticle['category']>();
  articles.forEach((article) => categories.add(article.category));

  return Array.from(categories);
}

export type GalleryAlbum = {
  slug: string;
  title: string;
  description: string;
  date: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  ogImage: string;
  shareUrl: string;
};

export type EventPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  imageAlt: string;
  ogImage: string;
  contentHtml: string;
  contentHtmlWithoutImages: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  links: Array<{
    href: string;
    label: string;
  }>;
};

function extractLinksFromContent(content: string): Array<{ href: string; label: string }> {
  const links: Array<{ href: string; label: string }> = [];
  const anchorRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorRegex.exec(content)) !== null) {
    const href = (match[1] ?? '').trim();
    const label = stripHtml(match[2] ?? '').trim();

    if (!href || (!href.startsWith('http://') && !href.startsWith('https://'))) {
      continue;
    }

    links.push({
      href,
      label: label || 'Event website',
    });
  }

  return links.slice(0, 3);
}

function isPublishedEventPost(post: WordPressPost) {
  if ((post.status ?? '').toLowerCase() !== 'publish') {
    return false;
  }

  return Boolean(post.categories?.nodes?.some((category) => (category.slug ?? '').toLowerCase() === 'events'));
}

function mapPostToEvent(post: WordPressPost): EventPost {
  const imageUrl = post.featuredImage?.node?.sourceUrl || DEFAULT_IMAGE;
  const imageAlt = stripHtml(post.featuredImage?.node?.altText || post.title);
  const image = imageUrl.startsWith('http') ? imageUrl : DEFAULT_IMAGE;
  const excerpt = stripHtml(post.excerpt || post.content || '');
  const extractedImages = extractImagesFromContent(post.content || '');
  const contentHtml = post.content || '';
  const contentHtmlWithoutImages = stripImagesFromHtml(contentHtml);

  return {
    slug: post.slug,
    title: stripHtml(post.title),
    excerpt,
    date: new Date(post.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    image,
    imageAlt,
    ogImage: ogImageFor('event', post.slug, image),
    contentHtml,
    contentHtmlWithoutImages,
    images: extractedImages,
    links: extractLinksFromContent(contentHtml),
  };
}

function extractImagesFromContent(content: string): Array<{ url: string; alt: string }> {
  const images: Array<{ url: string; alt: string }> = [];
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^"]*)"[^>]*>/gi;
  const imgRegexNoAlt = /<img[^>]+src="([^">]+)"[^>]*>/gi;

  let match;
  
  // First try to get images with alt text
  while ((match = imgRegex.exec(content)) !== null) {
    images.push({
      url: match[1],
      alt: match[2] || 'Gallery image',
    });
  }

  // If no images with alt, try without alt requirement
  if (images.length === 0) {
    while ((match = imgRegexNoAlt.exec(content)) !== null) {
      images.push({
        url: match[1],
        alt: 'Gallery image',
      });
    }
  }

  return images;
}

export async function fetchEventPosts(limit = 24): Promise<EventPost[]> {
  // Import static events
  const { staticEvents } = await import('@/data/events');

  const query = `
    query EventPosts($first: Int!) {
      posts(
        first: $first
        where: {
          status: PUBLISH
          categoryName: "events"
          orderby: { field: DATE, order: DESC }
        }
      ) {
        nodes {
          slug
          title
          excerpt
          date
          content
          status
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const data = await graphqlRequest<{ posts: { nodes: WordPressPost[] } }>(query, { first: limit });
    const wordPressEvents = data.posts.nodes
      .filter(isPublishedEventPost)
      .map(mapPostToEvent);

    // Convert static events to EventPost format
    const staticEventPosts: EventPost[] = staticEvents.map((event) => ({
      slug: event.slug,
      title: event.title,
      excerpt: event.excerpt,
      date: new Date(event.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      image: event.image,
      imageAlt: event.imageAlt,
      ogImage: ogImageFor('event', event.slug, event.image),
      contentHtml: event.description,
      contentHtmlWithoutImages: event.description,
      images: [],
      links: [],
    }));

    // Merge and sort by date (newest first)
    const allEvents = [...wordPressEvents, ...staticEventPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return allEvents.slice(0, limit);
  } catch (error) {
    console.warn('Failed to fetch WordPress events, using static events only:', error);

    // Fallback to static events if WordPress fails
    const { staticEvents } = await import('@/data/events');
    return staticEvents
      .map((event) => ({
        slug: event.slug,
        title: event.title,
        excerpt: event.excerpt,
        date: new Date(event.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        image: event.image,
        imageAlt: event.imageAlt,
        ogImage: ogImageFor('event', event.slug, event.image),
        contentHtml: event.description,
        contentHtmlWithoutImages: event.description,
        images: [],
        links: [],
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
}

export async function fetchEventPostBySlug(slug: string): Promise<EventPost | null> {
  // Check static events first
  const { staticEvents } = await import('@/data/events');
  const staticEvent = staticEvents.find((e) => e.slug === slug);

  if (staticEvent) {
    return {
      slug: staticEvent.slug,
      title: staticEvent.title,
      excerpt: staticEvent.excerpt,
      date: new Date(staticEvent.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      image: staticEvent.image,
      imageAlt: staticEvent.imageAlt,
      ogImage: ogImageFor('event', staticEvent.slug, staticEvent.image),
      contentHtml: staticEvent.description,
      contentHtmlWithoutImages: staticEvent.description,
      images: [],
      links: [],
    };
  }

  const query = `
    query EventPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        slug
        title
        excerpt
        date
        content
        status
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  `;

  const data = await graphqlRequest<{ post: WordPressPost | null }>(query, { slug });

  if (!data.post) {
    return null;
  }

  if (!isPublishedEventPost(data.post)) {
    return null;
  }

  return mapPostToEvent(data.post);
}

export async function fetchGalleryAlbums(): Promise<GalleryAlbum[]> {
  const query = `
    query GalleryPosts {
      posts(first: 100, where: { categoryName: "Gallery", orderby: { field: DATE, order: DESC } }) {
        nodes {
          slug
          title
          excerpt
          date
          content
          categories {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const data = await graphqlRequest<{ posts: { nodes: WordPressPost[] } }>(query);
  
  return data.posts.nodes
    .filter(post => {
      // Ensure post is in Gallery category
      const hasGalleryCategory = post.categories?.nodes?.some(
        cat => cat.name?.toLowerCase() === 'gallery'
      );
      return hasGalleryCategory;
    })
    .map(post => {
      const images = extractImagesFromContent(post.content || '');
      
      return {
        slug: post.slug,
        title: stripHtml(post.title),
        description: stripHtml(post.excerpt || ''),
        date: new Date(post.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        images,
        ogImage: ogImageFor('gallery', post.slug, images[0]?.url || 'https://tokoacademy.org/images/og-gallery.jpg'),
        shareUrl: `https://tokoacademy.org/gallery/${post.slug}`,
      };
    })
    .filter(album => album.images.length > 0); // Only return albums with images
}

export async function fetchGalleryAlbumBySlug(slug: string): Promise<GalleryAlbum | null> {
  const query = `
    query GalleryPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        slug
        title
        excerpt
        date
        content
        categories {
          nodes {
            name
          }
        }
      }
    }
  `;

  const data = await graphqlRequest<{ post: WordPressPost | null }>(query, { slug });

  if (!data.post) {
    return null;
  }

  const images = extractImagesFromContent(data.post.content || '');

  if (images.length === 0) {
    return null;
  }

  return {
    slug: data.post.slug,
    title: stripHtml(data.post.title),
    description: stripHtml(data.post.excerpt || ''),
    date: new Date(data.post.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    images,
    ogImage: ogImageFor('gallery', data.post.slug, images[0]?.url || 'https://tokoacademy.org/images/og-gallery.jpg'),
    shareUrl: `https://tokoacademy.org/gallery/${data.post.slug}`,
  };
}

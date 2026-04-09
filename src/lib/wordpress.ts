type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

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

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
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
  const imageAlt = post.featuredImage?.node?.altText || post.title;

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
    image: imageUrl.startsWith('http') ? imageUrl : DEFAULT_IMAGE,
    imageAlt,
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
  shareUrl: string;
};

export type EventPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  imageAlt: string;
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
  const imageAlt = post.featuredImage?.node?.altText || stripHtml(post.title);
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
    image: imageUrl.startsWith('http') ? imageUrl : DEFAULT_IMAGE,
    imageAlt,
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

  const data = await graphqlRequest<{ posts: { nodes: WordPressPost[] } }>(query, { first: limit });

  return data.posts.nodes
    .filter(isPublishedEventPost)
    .map(mapPostToEvent);
}

export async function fetchEventPostBySlug(slug: string): Promise<EventPost | null> {
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
    shareUrl: `https://tokoacademy.org/gallery/${data.post.slug}`,
  };
}

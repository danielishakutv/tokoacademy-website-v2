type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export type WordPressPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    } | null;
  } | null;
  categories?: {
    nodes?: Array<{ name?: string | null }>;
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

export async function graphqlRequest<T>(query: string, variables: Record<string, unknown> = {}) {
  if (!WORDPRESS_API_URL) {
    throw new Error('NEXT_PUBLIC_WORDPRESS_API_URL is not set');
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

function normalizeCategory(categories?: WordPressPost['categories']): NewsArticle['category'] {
  const name = categories?.nodes?.[0]?.name?.toLowerCase() ?? '';

  if (name.includes('press')) return 'Press Release';
  if (name.includes('toko') && name.includes('news')) return 'Toko in the News';
  if (name.includes('tips')) return 'Tips';
  if (name.includes('newsroom')) return 'Newsroom';

  return 'Newsroom';
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
      posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          slug
          title
          excerpt
          date
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const data = await graphqlRequest<{ posts: { nodes: WordPressPost[] } }>(query, { first: limit });
  return data.posts.nodes.map(mapPostToArticle);
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
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
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

export type EventItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  status: 'Delivered' | 'Upcoming';
  image: string;
  imageAlt: string;
  audience: string;
  description: string;
  beneficiaries: string;
  sdgTags: number[];
};

export const staticEvents: EventItem[] = [
  {
    slug: 'yola-upskill-programme',
    title: 'Yola Upskill Programme',
    date: '2023-10-01',
    status: 'Delivered',
    excerpt: 'A five-week intensive programme covering Excel, data analysis, web design, and core business tools.',
    image: '/images/hero/professional-courses.jpg',
    imageAlt: 'Professional upskilling programme at Toko Academy',
    audience: 'Youth and early professionals',
    description: 'A five-week intensive programme covering Excel, data analysis, web design, and core business tools — built to drive employability and income generation among youth and early-career professionals in Adamawa State.',
    beneficiaries: '~25 participants',
    sdgTags: [4, 8]
  },
  {
    slug: 'kids-summer-coding-classes',
    title: 'Kids Summer Coding Classes',
    date: '2025-08-01',
    status: 'Delivered',
    excerpt: 'Hands-on coding sessions using Scratch, HTML, and CSS for children ages 7–15.',
    image: '/images/hero/kids-coding.jpg',
    imageAlt: 'Children learning to code at Toko Academy summer class',
    audience: 'Children aged 7–15',
    description: 'Hands-on coding sessions using Scratch, HTML, and CSS. Designed to build computational thinking, creativity, and early exposure to digital careers among children in Yola.',
    beneficiaries: 'Children aged 7–15',
    sdgTags: [4]
  },
  {
    slug: 'ai-digital-literacy-government-agencies',
    title: 'AI & Digital Literacy for Government Agencies',
    date: '2025-11-01',
    status: 'Delivered',
    excerpt: 'Structured capacity-building for four national institutions on AI tools, cybersecurity, and data-driven decision-making.',
    image: '/images/hero/professional-courses.jpg',
    imageAlt: 'Government personnel training at Toko Academy',
    audience: 'Federal agency personnel',
    description: 'Structured capacity-building for four national institutions, equipping personnel with practical AI tools, cybersecurity awareness, and data-driven decision-making to improve service delivery.',
    beneficiaries: 'Officers from NSCDC, FRSC, NPF, and NMDPRA',
    sdgTags: [4, 8, 16]
  },
  {
    slug: '16-days-activism-safe-spaces-strong-voices',
    title: '16 Days of Activism: Safe Spaces, Strong Voices',
    date: '2025-12-01',
    status: 'Delivered',
    excerpt: 'Workshop on GBV awareness, digital safety, and youth advocacy in partnership with Tent2School Initiative.',
    image: '/images/hero/professional-courses.jpg',
    imageAlt: 'Youth advocacy workshop at 16 Days of Activism',
    audience: 'Youth and women participants',
    description: 'A workshop in partnership with Tent2School Initiative, creating a safe space for GBV awareness, digital safety, and youth advocacy. Directly contributing to the Generation Equality Forum gender inclusion agenda.',
    beneficiaries: 'Youth and women participants',
    sdgTags: [5, 10]
  },
  {
    slug: 'from-ai-users-to-ai-builders',
    title: 'From AI Users to AI Builders',
    date: '2026-02-01',
    status: 'Delivered',
    excerpt: 'Community-driven event shifting participants from passive AI consumption to active creation.',
    image: '/images/hero/professional-courses.jpg',
    imageAlt: 'AI builders workshop at Toko Academy',
    audience: 'Students, professionals, and tech enthusiasts',
    description: 'A community-driven event shifting participants from passive AI consumption to active creation — inspiring local innovation and real-world application of emerging technologies in North-East Nigeria.',
    beneficiaries: 'Students, professionals, tech enthusiasts',
    sdgTags: [4, 8, 9]
  },
  {
    slug: 'kids-coding-bootcamp-april-2026',
    title: 'Kids Coding Bootcamp',
    date: '2026-04-01',
    status: 'Delivered',
    excerpt: 'Immersive bootcamp in programming, digital creativity, and problem-solving with public project showcase.',
    image: '/images/hero/kids-coding.jpg',
    imageAlt: 'Young learners showcasing coding projects at Toko Academy',
    audience: 'Young learners',
    description: 'An immersive bootcamp in programming, digital creativity, and problem-solving. Participants built real applications and games through project-based learning — culminating in a public project showcase.',
    beneficiaries: 'Young learners (ages 7–15)',
    sdgTags: [4]
  }
];

export const staticEventToWordPress = (event: EventItem) => ({
  slug: event.slug,
  title: event.title,
  excerpt: event.excerpt,
  date: event.date,
  image: event.image,
  imageAlt: event.imageAlt,
  content: event.description,
});

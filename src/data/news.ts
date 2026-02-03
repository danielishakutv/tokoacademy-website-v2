export type NewsCategory = 'Press Release' | 'Toko in the News' | 'Newsroom' | 'Tips';

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: NewsCategory;
  readTime: string;
  image: string;
  imageAlt: string;
  content: string[];
};

export const newsItems: NewsItem[] = [
  {
    slug: 'toko-academy-launches-ai-literacy-bootcamp',
    title: 'Toko Academy Launches AI Literacy Bootcamp for Young Innovators',
    excerpt: 'A new 6-week AI literacy bootcamp opens enrollment for secondary school students across Nigeria.',
    date: '2026-01-28',
    category: 'Press Release',
    readTime: '4 min read',
    image: '/images/hero/kids-coding.jpg',
    imageAlt: 'Students learning to code at Toko Academy',
    content: [
      'Toko Academy today announced the launch of its AI Literacy Bootcamp, a six-week program designed to introduce secondary school students to the fundamentals of artificial intelligence, ethical AI, and real-world applications.',
      'The bootcamp blends hands-on projects with mentor-led sessions, helping students build practical AI solutions using age-appropriate tools and datasets. Participants will work in small teams to solve community-centered challenges.',
      'Enrollment opens immediately with a limited cohort size to ensure high-quality mentorship. The program is available in hybrid format with live virtual sessions and optional in-person labs at the Yola campus.'
    ]
  },
  {
    slug: 'toko-academy-partners-with-local-schools-for-digital-skills',
    title: 'Toko Academy Partners with Local Schools to Expand Digital Skills',
    excerpt: 'New partnership brings structured digital skills training into classrooms in Adamawa and Abuja.',
    date: '2026-01-22',
    category: 'Newsroom',
    readTime: '3 min read',
    image: '/images/hero/professional-courses.jpg',
    imageAlt: 'Professional digital skills classroom session',
    content: [
      'Toko Academy has signed a multi-school partnership to embed digital skills learning in secondary school curricula across Adamawa and Abuja.',
      'The collaboration includes teacher training, curriculum resources, and student workshops focused on web development, data literacy, and digital creativity.',
      'The initiative aims to prepare learners for future-ready careers while equipping schools with sustainable digital learning tools.'
    ]
  },
  {
    slug: 'toko-academy-featured-on-regional-education-panel',
    title: 'Toko Academy Featured on Regional Education Innovation Panel',
    excerpt: 'Our leadership shared insights on how to scale inclusive tech education in underserved communities.',
    date: '2026-01-18',
    category: 'Toko in the News',
    readTime: '2 min read',
    image: '/images/hero/our-ceo-daniel-ishaku-speaking.jpg',
    imageAlt: 'Toko Academy CEO speaking on stage',
    content: [
      'Toko Academy was spotlighted on a regional education innovation panel focused on expanding access to digital skills in underserved communities.',
      'Our leadership discussed the importance of contextual learning, mentorship, and industry partnerships in building sustainable talent pipelines.',
      'The panel emphasized the role of local institutions in preparing youth for the digital economy while keeping learning outcomes community-centered.'
    ]
  },
  {
    slug: 'press-release-toko-academy-expands-yola-campus',
    title: 'Press Release: Toko Academy Expands Yola Campus Capacity',
    excerpt: 'An expanded facility increases learning spaces and launches new creator studios for multimedia training.',
    date: '2026-01-12',
    category: 'Press Release',
    readTime: '3 min read',
    image: '/images/hero/practical-mentorship-approach-classes.jpg',
    imageAlt: 'Mentorship and training session at Toko Academy',
    content: [
      'Toko Academy has completed an expansion of its Yola campus to meet growing demand for digital skills training.',
      'The new space includes collaborative labs, creator studios for multimedia learning, and upgraded mentorship rooms for small-group sessions.',
      'The expansion supports additional cohorts for data analytics, web development, and digital marketing programs.'
    ]
  },
  {
    slug: 'newsroom-toko-academy-hosts-community-tech-day',
    title: 'Newsroom: Toko Academy Hosts Community Tech Day',
    excerpt: 'Community members explored hands-on demos, mentorship clinics, and youth showcase projects.',
    date: '2026-01-08',
    category: 'Newsroom',
    readTime: '3 min read',
    image: '/images/hero/commissioner-for-women-affairs.jpg',
    imageAlt: 'Community event with Toko Academy',
    content: [
      'Toko Academy hosted a Community Tech Day to celebrate student projects and connect learners with local employers and mentors.',
      'The event featured interactive demos, mentorship clinics, and short workshops on AI, data storytelling, and product design.',
      'Visitors also learned about scholarship opportunities and upcoming cohorts across Toko Academy programs.'
    ]
  },
  {
    slug: 'tips-building-a-strong-portfolio',
    title: 'Tips: Building a Strong Portfolio as a Beginner',
    excerpt: 'Simple steps to showcase your skills, projects, and growth journey effectively.',
    date: '2026-01-06',
    category: 'Tips',
    readTime: '5 min read',
    image: '/images/hero/professional-courses.jpg',
    imageAlt: 'Laptop with portfolio project open',
    content: [
      'Start with small, complete projects that demonstrate real-world problem solving. A few well-finished projects are stronger than many unfinished ideas.',
      'Write short case studies for each project: the problem, your approach, tools used, and the impact or result.',
      'Highlight your growth by adding what you learned and how you would improve the project in the future.'
    ]
  },
  {
    slug: 'tips-how-to-prepare-for-tech-interviews',
    title: 'Tips: How to Prepare for Tech Interviews',
    excerpt: 'A practical checklist for technical interviews, portfolio reviews, and soft skill readiness.',
    date: '2026-01-03',
    category: 'Tips',
    readTime: '4 min read',
    image: '/images/hero/training-military-officers.jpg',
    imageAlt: 'Professional training session',
    content: [
      'Review the job description and align your story to the role. Focus on projects that demonstrate the skills the employer values most.',
      'Practice explaining your projects clearly: your contribution, decisions you made, and measurable outcomes.',
      'Prepare a short learning story—how you handled a challenge and what you learned—to show resilience and growth mindset.'
    ]
  },
  {
    slug: 'toko-in-the-news-digital-skills-recognition',
    title: 'Toko in the News: Digital Skills Impact Recognized by Local Leaders',
    excerpt: 'Local leaders acknowledged Toko Academy’s role in building youth employment pathways.',
    date: '2025-12-28',
    category: 'Toko in the News',
    readTime: '3 min read',
    image: '/images/hero/commissioner-for-women-affairs.jpg',
    imageAlt: 'Recognition event for Toko Academy',
    content: [
      'Community leaders recognized Toko Academy for its contribution to youth employment and digital transformation efforts.',
      'The recognition highlights the academy’s focus on skills-first education, mentorship, and local industry collaboration.',
      'Toko Academy remains committed to expanding access to quality training across Nigeria.'
    ]
  }
];

export const newsCategories: NewsCategory[] = [
  'Press Release',
  'Toko in the News',
  'Newsroom',
  'Tips'
];

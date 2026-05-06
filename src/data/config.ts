export const contactInfo = {
  phones: ['+234 808 825 6055', '+234 812 856 1493'],
  email: 'info@tokoacademy.org',
  address: 'No. 1A Bekaji Road, Adjacent to YEDC S/C Office, Jimeta, Yola, Adamawa State, Nigeria.',
  socialMedia: {
    facebook: 'https://facebook.com/tokoacademy',
    instagram: 'https://instagram.com/tokoacademy',
    twitter: 'https://twitter.com/tokoacademy',
    linkedin: 'https://linkedin.com/company/tokoacademy',
    whatsapp: 'https://wa.me/2348088256055'
  }
};

export const externalLinks = {
  applyNow: 'https://tokoacademy.org/register',
  blog: 'https://tokoacademy.org/category/newsroom/',
  wordpressForm: 'https://tokoacademy.org/register'
};

export type NavigationItem = {
  name: string;
  href: string;
  external?: boolean;
  dropdown?: Array<{
    name: string;
    href: string;
    megaMenu?: Array<{
      name: string;
      href: string;
      description: string;
      image: string;
    }>;
  }>;
};

export const navigation: NavigationItem[] = [
  { name: 'About', href: '/about' },
  {
    name: 'Programs',
    href: '#',
    dropdown: [
      { name: 'All Programs', href: '/courses' },
      {
        name: 'By School',
        href: '/courses',
        megaMenu: [
          {
            name: 'Digital Literacy & Productivity',
            href: '/courses?school=digital-literacy',
            description: 'Practical digital skills for everyday work and government functions.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'Software Engineering',
            href: '/courses?school=software-engineering',
            description: 'Development programmes for aspiring software creators and builders.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'AI & Emerging Technologies',
            href: '/courses?school=ai-emerging-tech',
            description: 'AI, automation, and innovation training for the future of work.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'Data Science & Analytics',
            href: '/courses?school=data-science',
            description: 'Data-driven skills for decision-making and evidence-based insights.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'Digital Media & Creative Tech',
            href: '/courses?school=digital-media',
            description: 'Creative technology training for digital marketing and design.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'Kids & Youth Technology',
            href: '/kids',
            description: 'Engaging technology programmes built for children and young learners.',
            image: 'https://tokoacademy.org/og-image.png',
          },
        ],
      },
      {
        name: 'By Audience',
        href: '/courses',
        megaMenu: [
          {
            name: 'Kids',
            href: '/kids',
            description: 'Programs designed for children, parents, and early learners.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'Youth Bootcamps',
            href: '/courses?audience=youth-bootcamps',
            description: 'Intensive bootcamps for young learners ready to jumpstart their tech journey.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'Professional Upskilling',
            href: '/courses?audience=professionals',
            description: 'Flexible upskilling courses for working professionals.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'Corporate & Government',
            href: '/corporate',
            description: 'Institutional training solutions for organizations and government agencies.',
            image: 'https://tokoacademy.org/og-image.png',
          },
        ],
      },
      { name: 'Class Schedules', href: '/schedules' },
    ],
  },
  { name: 'Thematic Areas', href: '/thematic-areas' },
  { name: 'Impact', href: '/impact' },
  {
    name: 'News & Media',
    href: '#',
    dropdown: [
      { name: 'Newsroom', href: '/news' },
      { name: 'Press Releases', href: '/news?category=press-release' },
      { name: 'Toko in the News', href: '/news?category=in-the-news' },
      { name: 'Events', href: '/events' },
      { name: 'Gallery', href: '/gallery' },
    ],
  },
  { name: 'Partners', href: '/partners' },
  { name: 'Contact', href: '/contact' },
];

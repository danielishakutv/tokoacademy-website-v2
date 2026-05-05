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
      { name: 'Kids', href: '/kids' },
      {
        name: 'Bootcamps',
        href: 'https://bootcamp.tokoacademy.org/signup',
      },
      { name: 'Corporate Training', href: '/corporate' },
      { name: 'Class Schedules', href: '/schedules' },
    ]
  },
  {
    name: 'Impact',
    href: '#',
    dropdown: [
      { name: 'Events', href: '/events' },
      { name: 'Newsroom', href: '/news' },
      { name: 'Press Releases', href: '/news?category=press-release' },
      { name: 'Toko in the News', href: '/news?category=in-the-news' },
      { name: 'Gallery', href: '/gallery' },
    ]
  },
  { name: 'Partners', href: '/partners' },
  { name: 'Contact', href: '/contact' },
];

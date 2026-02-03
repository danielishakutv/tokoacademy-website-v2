export const contactInfo = {
  phones: ['+234 808 825 6055', '+234 812 856 1493'],
  email: 'info@tokoacademy.org',
  address: 'Yola, Nigeria',
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
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Courses', href: '/courses' },
  { name: 'Kids', href: '/kids' },
  { name: 'Corporate Training', href: '/corporate' },
  { name: 'Contact', href: '/contact' },
  { name: 'News', href: '/news' },
  {
    name: 'More',
    href: '#',
    dropdown: [
      {
        name: 'Bootcamps',
        href: '/bootcamps',
        megaMenu: [
          {
            name: 'TechForge Bootcamp',
            href: 'https://bootcamp.tokoacademy.org/signup',
            description: 'Intensive coding bootcamp',
            image: '/images/bootcamps/techforge.jpg'
          },
          {
            name: 'Kids AI Camp',
            href: 'https://tokoacademy.org/kids/',
            description: 'Annual Spring AI Bootcamp for kids ages 5-16',
            image: '/images/bootcamps/robotics-student.png'
          }
        ]
      },
      { name: 'Workshops', href: '/workshops' },
      {
        name: 'Events',
        href: '/events',
        megaMenu: [
          {
            name: 'TEDxYola',
            href: 'https://tedxyola.com/',
            description: 'Annual TEDx Conference to spark innovation and ideas',
            image: '/images/events/tedxyola.png'
          },
          {
            name: 'KSCC Graduation',
            href: 'https://www.facebook.com/share/v/17zVww3zLE/',
            description: 'Kids Summer Coding Class Graduation Ceremony',
            image: '/images/events/kscc-graduation.jpg'
          },
          {
            name: 'Women in Uniform',
            href: 'https://tokoacademy.org/iwd/',
            description: 'Empowering women in service in commemoration of IWD',
            image: '/images/events/iwd.png'
          }
        ]
      },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Class Schedules', href: '/schedules' },
      { name: 'Press Releases', href: '/press' },
      { name: 'Toko in the News', href: '/news' }
    ]
  }
];

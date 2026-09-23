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
  /*
   * The courses page, not the old PHP registration app.
   *
   * `/register` belongs to the legacy app that has been retired: its catalogue
   * no longer matches what is taught, and enrolment now happens on the
   * learning platform — instantly for a self-paced course, by application for a
   * scheduled one. Sending somebody who pressed "Apply Now" to a form listing
   * courses that no longer run was the last route into the old system.
   *
   * It points at the catalogue rather than straight at a form on purpose:
   * "apply" means nothing until you have chosen what you are applying for, and
   * each course page carries the right action for that course.
   */
  applyNow: '/courses',
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

/**
 * The main menu.
 *
 * Restructured from seven top-level items to four, for two reasons.
 *
 * Seven is more than anyone reads. "Thematic Areas", "Impact" and "Partners"
 * each sat at the top level competing with "Programs", which is what people
 * actually come for — and all three answer the same question, which is "who
 * are these people and are they any good". They now sit under About, where
 * somebody looking for them will look.
 *
 * And four of the old links went nowhere useful. "Press Releases" and "Toko in
 * the News" pointed at `/news?category=…`, but the site is a static export and
 * `/news` reads no query parameters at all — so both landed on the same
 * unfiltered page as "Newsroom". Three menu entries for one page is not a
 * choice, it is a maze. The newsroom already merges those categories, so the
 * menu now says so.
 *
 * The two dropdown parents also carried `href: '#'`. The header renders a
 * parent as a toggle button rather than a link, so nothing was broken by it —
 * but a placeholder sitting in the data invites somebody to render it one day
 * and ship a dead link. Each parent now names the page its children belong to,
 * and each group opens with a link to that page so the section is reachable in
 * one tap.
 */
export const navigation: NavigationItem[] = [
  {
    name: 'About',
    href: '/about',
    dropdown: [
      { name: 'Who we are', href: '/about' },
      { name: 'Our impact', href: '/impact' },
      { name: 'Thematic areas', href: '/thematic-areas' },
      { name: 'Partners', href: '/partners' },
    ],
  },
  {
    name: 'Programs',
    href: '/courses',
    dropdown: [
      { name: 'All Programs', href: '/courses' },
      {
        name: 'By School',
        href: '/courses',
        megaMenu: [
          {
            name: 'Digital Literacy & Productivity',
            href: '/courses#school-digital-literacy',
            description: 'Practical digital skills for everyday work and government functions.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'Software Engineering',
            href: '/courses#school-software-engineering',
            description: 'Development programmes for aspiring software creators and builders.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'AI & Emerging Technologies',
            href: '/courses#school-ai-emerging-technologies',
            description: 'AI, automation, and innovation training for the future of work.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'Data Science & Analytics',
            href: '/courses#school-data-science',
            description: 'Data-driven skills for decision-making and evidence-based insights.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'Digital Media & Creative Tech',
            href: '/courses#school-digital-media-creative-tech',
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
            href: '/courses#school-kids-youth',
            description: 'Intensive bootcamps for young learners ready to jumpstart their tech journey.',
            image: 'https://tokoacademy.org/og-image.png',
          },
          {
            name: 'Professional Upskilling',
            href: '/courses',
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
      { name: 'Kids & Youth', href: '/kids' },
      { name: 'Corporate & Government', href: '/corporate' },
      { name: 'Class Schedules', href: '/schedules' },
    ],
  },
  {
    name: 'Newsroom',
    href: '/news',
    dropdown: [
      // One entry, because there is one page. Press releases and press
      // coverage are categories the newsroom already shows together.
      { name: 'Latest news', href: '/news' },
      { name: 'Events', href: '/events' },
      { name: 'Gallery', href: '/gallery' },
    ],
  },
  { name: 'Contact', href: '/contact' },
];

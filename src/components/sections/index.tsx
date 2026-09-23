import type { ReactNode } from 'react';
import type { ManagedSection } from '@/lib/managed';
import Cards from './Cards';
import ContactDetails from './ContactDetails';
import Courses from './Courses';
import Cta from './Cta';
import Events from './Events';
import Faq from './Faq';
import Gallery from './Gallery';
import Hero from './Hero';
import HeroSlider from './HeroSlider';
import Logos from './Logos';
import News from './News';
import Prose from './Prose';
import Quote from './Quote';
import Stats from './Stats';
import Steps from './Steps';
import TextImage from './TextImage';

/**
 * Type to renderer: the website's half of the contract.
 *
 * The other half is `SECTION_TYPES` in ta_admin
 * (`backend/src/modules/website/sections.ts`), which is what the editor builds
 * its form from and what the API validates against. Every `type` there has a
 * case here, consuming exactly the fields its `defaults` declare. Adding a
 * component to the site is two edits: an entry there, and a renderer of the
 * same name here.
 *
 * A `type` with no case falls through to nothing rather than throwing. The two
 * repositories deploy separately, so the admin will sometimes be a release
 * ahead — and the honest behaviour then is that the new section is invisible
 * until this side ships, not that every page using it stops building.
 */
function renderSection(section: ManagedSection, index: number): ReactNode {
  // The top band clears the fixed header; the rest do not need to.
  const props = { data: section.data, first: index === 0 };
  const key = `${index}-${section.type}`;

  switch (section.type) {
    /* Opening */
    case 'hero':
      return <Hero key={key} {...props} />;
    case 'hero-slider':
      return <HeroSlider key={key} {...props} />;

    /* Telling the story */
    case 'prose':
      return <Prose key={key} {...props} />;
    case 'text-image':
      return <TextImage key={key} {...props} />;
    case 'cards':
      return <Cards key={key} {...props} />;
    case 'steps':
      return <Steps key={key} {...props} />;
    case 'faq':
      return <Faq key={key} {...props} />;

    /* Proof */
    case 'stats':
      return <Stats key={key} {...props} />;
    case 'quote':
      return <Quote key={key} {...props} />;
    case 'logos':
      return <Logos key={key} {...props} />;
    case 'gallery':
      return <Gallery key={key} {...props} />;

    /* Live data */
    case 'courses':
      return <Courses key={key} {...props} />;
    case 'news':
      return <News key={key} {...props} />;
    case 'events':
      return <Events key={key} {...props} />;

    /* Closing */
    case 'cta':
      return <Cta key={key} {...props} />;
    case 'contact-details':
      return <ContactDetails key={key} {...props} />;

    default:
      return null;
  }
}

/** A page's sections, in the order they were placed. */
export default function ManagedSections({ sections }: { sections: ManagedSection[] }) {
  // Switched-off sections are dropped before the numbering, so the first
  // *visible* band is the one that clears the header — not the first row in
  // the database, which somebody may have hidden while drafting.
  const visible = sections.filter((section) => section.enabled);

  return <>{visible.map((section, index) => renderSection(section, index))}</>;
}

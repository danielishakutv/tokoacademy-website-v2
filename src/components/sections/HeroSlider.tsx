import { rows, text, type SectionProps } from './fields';
import SectionImage from './SectionImage';
import HeroSliderClient, { type Slide } from './HeroSliderClient';

/**
 * The band around the rotating hero.
 *
 * Its only job is to be the server half: it resolves each slide's photograph
 * through `Picture` — upload, then committed file, then labelled placeholder —
 * and hands the finished elements to the client component, which cannot import
 * a server component itself.
 *
 * This section has no `tone`: it opens a page, and it opens it on the plain
 * surface. It also supplies its own top padding for the fixed header, so it is
 * never wrapped in a `Band`.
 */
export default function HeroSlider({ data }: SectionProps) {
  const slides: Slide[] = rows(data, 'slides').map((row, index) => {
    const heading = text(row, 'heading');
    const image = text(row, 'image');

    return {
      id: `slide-${index}`,
      eyebrow: text(row, 'eyebrow'),
      heading,
      body: text(row, 'body'),
      actionLabel: text(row, 'actionLabel'),
      actionHref: text(row, 'actionHref'),
      media: image ? (
        <SectionImage
          value={image}
          alt={heading}
          aspect="aspect-[4/3]"
          sizes="(max-width: 1024px) 100vw, 560px"
          // Every slide is in the HTML from the first paint, so the first one
          // is what a visitor sees and the rest are genuinely lazy.
          priority={index === 0}
        />
      ) : null,
    };
  });

  // A slider with nothing in it is not an empty slider, it is no slider.
  if (slides.length === 0) return null;

  return <HeroSliderClient slides={slides} />;
}

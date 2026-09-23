import { actions, text, type SectionProps } from './fields';
import SectionImage from './SectionImage';
import Band, { Actions, bodyInk, eyebrowInk, headingInk, toneOf } from './tone';

/**
 * The top of a page: a headline, a sentence, buttons and one photograph.
 *
 * The heading is an `h1` — this is the section built to open a page, and a
 * page whose largest statement is an `h2` has no first-level heading at all.
 * Whether it is genuinely first is the composer's business; the renderer draws
 * what it is for.
 *
 * With no photograph the whole thing becomes one column rather than a
 * two-column grid with an empty half. The column classes are applied only when
 * there is something to put in the second one, which is also why the copy
 * keeps its measure: a headline running the full width of a desktop screen is
 * unreadable.
 */
export default function Hero({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const eyebrow = text(data, 'eyebrow');
  const heading = text(data, 'heading');
  const body = text(data, 'body');
  const image = text(data, 'image');
  const buttons = actions(data);

  const copy = (
    <div className="reveal">
      {eyebrow && <p className={eyebrowInk[tone]}>{eyebrow}</p>}
      {heading && <h1 className={`${eyebrow ? 'mt-3' : ''} ${headingInk[tone]}`.trim()}>{heading}</h1>}
      {body && (
        <p className={`prose-measure mt-5 whitespace-pre-line text-base sm:text-lg ${bodyInk[tone]}`}>
          {body}
        </p>
      )}
      <Actions items={buttons} tone={tone} className="mt-8" />
    </div>
  );

  return (
    <Band tone={tone} first={first} className="relative overflow-hidden">
      {/*
        The decorative wash, on the two light bands only. On the dark and brand
        bands it is a green blur on a coloured ground, which reads as a printing
        fault rather than as atmosphere.
      */}
      {(tone === 'plain' || tone === 'sunken') && <div className="aurora" aria-hidden />}

      {image ? (
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
          {copy}
          <SectionImage
            value={image}
            alt={heading}
            aspect="aspect-[4/3]"
            className="reveal reveal-delay-1"
            sizes="(max-width: 1024px) 100vw, 560px"
            // The hero photograph is almost always what decides the Largest
            // Contentful Paint, so it is never lazy.
            priority={first}
          />
        </div>
      ) : (
        <div className="relative">{copy}</div>
      )}
    </Band>
  );
}

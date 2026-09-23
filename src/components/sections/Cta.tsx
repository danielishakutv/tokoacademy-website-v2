import { actions, text, type SectionProps } from './fields';
import SectionImage from './SectionImage';
import Band, { Actions, bodyInk, headingInk, toneOf } from './tone';

/**
 * The band at the end of a page, asking the reader to do one thing.
 *
 * The band's own colour carries it rather than a panel floating inside it. The
 * home page uses a panel because its call to action sits on the plain surface
 * and needs something to lift it off the page; here the tone already is that
 * something, and a coloured panel on a coloured band is two boxes saying the
 * same thing.
 *
 * With no photograph the whole thing centres, which is what a closing band
 * without an image wants to be — a single sentence and a button, not a column
 * of text against an empty half.
 */
export default function Cta({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const heading = text(data, 'heading');
  const body = text(data, 'body');
  const image = text(data, 'image');
  const buttons = actions(data);

  if (!heading && !body && buttons.length === 0 && !image) return null;

  const copy = (align: 'left' | 'centre') => (
    <div className={`reveal ${align === 'centre' ? 'mx-auto max-w-2xl text-center' : ''}`.trim()}>
      {heading && <h2 className={headingInk[tone]}>{heading}</h2>}
      {body && (
        <p
          className={`prose-measure mt-4 whitespace-pre-line text-base sm:text-lg ${bodyInk[tone]} ${
            align === 'centre' ? 'mx-auto' : ''
          }`.trim()}
        >
          {body}
        </p>
      )}
      <Actions
        items={buttons}
        tone={tone}
        className={`mt-8 ${align === 'centre' ? 'sm:justify-center' : ''}`.trim()}
      />
    </div>
  );

  return (
    <Band tone={tone} first={first}>
      {image ? (
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
          {copy('left')}
          <SectionImage
            value={image}
            alt={heading}
            aspect="aspect-[4/3]"
            className="reveal reveal-delay-1"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
        </div>
      ) : (
        copy('centre')
      )}
    </Band>
  );
}

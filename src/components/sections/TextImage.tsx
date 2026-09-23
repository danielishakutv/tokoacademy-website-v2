import { actions, choice, paragraphs, text, type SectionProps } from './fields';
import SectionImage from './SectionImage';
import Band, { Actions, bodyInk, eyebrowInk, headingInk, toneOf } from './tone';

/**
 * A block of writing with a picture beside it.
 *
 * `imageSide` is what stops a page of these reading as a list: alternating the
 * photograph left and right down the page turns four identical bands into a
 * rhythm. It only applies from `lg` upwards — below that the picture always
 * follows the words, because on a phone a column of pictures interrupting
 * sentences is just noise, and the words are what was being read.
 */
export default function TextImage({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const eyebrow = text(data, 'eyebrow');
  const heading = text(data, 'heading');
  const blocks = paragraphs(text(data, 'body'));
  const image = text(data, 'image');
  const side = choice(data, 'imageSide', ['right', 'left'] as const);
  const buttons = actions(data);

  if (!eyebrow && !heading && blocks.length === 0 && !image) return null;

  const copy = (
    <div className={`reveal ${side === 'left' ? 'lg:order-2' : ''}`.trim()}>
      {eyebrow && <p className={eyebrowInk[tone]}>{eyebrow}</p>}
      {heading && <h2 className={`${eyebrow ? 'mt-3' : ''} ${headingInk[tone]}`.trim()}>{heading}</h2>}
      {blocks.length > 0 && (
        <div className={`prose-measure mt-4 space-y-4 text-base sm:text-lg ${bodyInk[tone]}`}>
          {blocks.map((block, index) => (
            <p key={index} className="whitespace-pre-line">
              {block}
            </p>
          ))}
        </div>
      )}
      <Actions items={buttons} tone={tone} className="mt-8" />
    </div>
  );

  return (
    <Band tone={tone} first={first}>
      {image ? (
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {copy}
          <SectionImage
            value={image}
            alt={heading}
            aspect="aspect-[4/3]"
            className={`reveal reveal-delay-1 ${side === 'left' ? 'lg:order-1' : ''}`.trim()}
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        </div>
      ) : (
        copy
      )}
    </Band>
  );
}

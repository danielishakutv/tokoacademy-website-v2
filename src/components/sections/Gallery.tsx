import { rows, stagger, text, type SectionProps } from './fields';
import SectionImage from './SectionImage';
import Band, { Intro, subtleInk, toneOf } from './tone';

/**
 * A row of photographs.
 *
 * Two across on a phone rather than one: these are supporting pictures, and a
 * column of full-width photographs turns a short section into a long scroll
 * past things nobody came for. An item with no photograph chosen is dropped
 * entirely — a caption with no picture above it is a caption for nothing.
 */
export default function Gallery({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const heading = text(data, 'heading');

  const items = rows(data, 'items')
    .map((row) => ({ image: text(row, 'image'), caption: text(row, 'caption') }))
    .filter((item) => item.image !== '');

  if (!heading && items.length === 0) return null;

  return (
    <Band tone={tone} first={first}>
      <Intro tone={tone} heading={heading} className="reveal" />

      {items.length > 0 && (
        <div
          className={`${heading ? 'mt-10 md:mt-12' : ''} grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4`.trim()}
        >
          {items.map((item, index) => (
            <figure key={index} className={`reveal ${stagger(index)}`}>
              <SectionImage
                value={item.image}
                alt={item.caption}
                aspect="aspect-[4/3]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              />
              {item.caption && (
                <figcaption className={`mt-3 text-sm ${subtleInk[tone]}`}>{item.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </Band>
  );
}

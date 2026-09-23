import { rows, text, type SectionProps } from './fields';
import SectionImage from './SectionImage';
import Band, { Intro, bodyInk, headingInk, lineInk, subtleInk, toneOf } from './tone';

/**
 * Stages or principles, numbered.
 *
 * An `ol` with hairlines between the items rather than a grid of boxes,
 * because the numbers already say "these are in order" and a grid says the
 * opposite. The counters are drawn from the list index rather than typed into
 * the content, so inserting a step in the middle does not leave the page
 * numbered 1, 2, 2, 3.
 */
export default function Steps({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const eyebrow = text(data, 'eyebrow');
  const heading = text(data, 'heading');
  const image = text(data, 'image');
  const items = rows(data, 'items');

  if (!eyebrow && !heading && items.length === 0) return null;

  const list = (
    <div>
      <Intro tone={tone} eyebrow={eyebrow} heading={heading} className="reveal" />

      {items.length > 0 && (
        <ol className={`reveal reveal-delay-1 ${eyebrow || heading ? 'mt-8' : ''} border-t ${lineInk[tone]}`.trim()}>
          {items.map((item, index) => {
            const title = text(item, 'title');
            const body = text(item, 'body');

            return (
              <li key={index} className={`flex gap-5 border-b ${lineInk[tone]} py-6`}>
                <span className={`mt-1 text-sm font-semibold tabular-nums ${subtleInk[tone]}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  {title && <h3 className={headingInk[tone]}>{title}</h3>}
                  {body && (
                    <p className={`${title ? 'mt-2 ' : ''}whitespace-pre-line ${bodyInk[tone]}`}>{body}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );

  return (
    <Band tone={tone} first={first}>
      {image ? (
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <SectionImage
            value={image}
            alt={heading}
            aspect="aspect-[4/3]"
            className="reveal"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
          {list}
        </div>
      ) : (
        list
      )}
    </Band>
  );
}

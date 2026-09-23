import { choice, rows, stagger, text, type SectionProps } from './fields';
import SectionImage from './SectionImage';
import Band, { Intro, SectionLink, toneOf } from './tone';

/** Static class strings: Tailwind reads the source, not the running page. */
const COLUMNS: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * A row of items, each with a title, a line of text and optionally a picture.
 *
 * A card's picture is genuinely optional, so an item without one renders as
 * text alone rather than as a labelled placeholder: the placeholder exists to
 * hold a photograph's space open until it arrives, and on a card nobody asked
 * for a photograph at all.
 *
 * A card with a `href` becomes one large tap target rather than a card
 * containing a small link — on a phone the difference is whether the thing can
 * be pressed with a thumb.
 */
export default function Cards({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const eyebrow = text(data, 'eyebrow');
  const heading = text(data, 'heading');
  const body = text(data, 'body');
  const items = rows(data, 'items');
  const columns = COLUMNS[choice(data, 'columns', ['3', '2', '4'] as const)] ?? COLUMNS['3'];

  if (!eyebrow && !heading && !body && items.length === 0) return null;

  return (
    <Band tone={tone} first={first}>
      <Intro tone={tone} eyebrow={eyebrow} heading={heading} body={body} className="reveal" />

      {items.length > 0 && (
        <div className={`mt-12 grid gap-6 ${columns}`}>
          {items.map((item, index) => {
            const title = text(item, 'title');
            const itemBody = text(item, 'body');
            const image = text(item, 'image');
            const href = text(item, 'href');

            const inner = (
              <>
                {image && (
                  <SectionImage
                    value={image}
                    alt={title}
                    aspect="aspect-[16/10]"
                    rounded={false}
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 380px"
                  />
                )}
                <div className={`flex flex-1 flex-col ${image ? 'p-6 sm:p-7' : 'p-6 sm:p-8'}`}>
                  {title && <h3 className="transition-colors group-hover:text-brand">{title}</h3>}
                  {itemBody && <p className={`${title ? 'mt-3 ' : ''}text-ink-muted`}>{itemBody}</p>}
                  {/*
                    An arrow, not the words "Read more". There is no label
                    field on a card, and inventing one would put copy on the
                    page that nobody composing it ever wrote or could change.
                    The whole card is the link; the arrow and the hover state
                    say so.
                  */}
                  {href && (
                    <span
                      className="mt-auto pt-6 text-lg font-semibold text-brand transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    >
                      &rarr;
                    </span>
                  )}
                </div>
              </>
            );

            /*
              The card keeps `.card`'s own raised surface on every tone — a
              pale card on the dark band, a pale card on the brand band — so
              the text inside it needs no per-tone colours of its own. Only the
              intro above sits directly on the band's colour.
            */
            const shell = `card reveal ${stagger(index)} group flex flex-col overflow-hidden`;

            return href ? (
              <SectionLink key={index} href={href} className={shell}>
                {inner}
              </SectionLink>
            ) : (
              <article key={index} className={shell}>
                {inner}
              </article>
            );
          })}
        </div>
      )}
    </Band>
  );
}

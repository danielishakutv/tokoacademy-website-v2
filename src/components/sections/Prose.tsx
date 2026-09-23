import { choice, paragraphs, text, type SectionProps } from './fields';
import Band, { bodyInk, eyebrowInk, headingInk, toneOf } from './tone';

/**
 * A heading and some paragraphs — the section for anything that is simply
 * writing.
 *
 * `align` is a reading decision rather than a layout one. Narrow holds the
 * line length at the measure the rest of the site uses, which is what makes a
 * long passage readable; full width exists for the occasional block that has
 * to line up with a wider section above it.
 */
export default function Prose({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const eyebrow = text(data, 'eyebrow');
  const heading = text(data, 'heading');
  const blocks = paragraphs(text(data, 'body'));
  const align = choice(data, 'align', ['narrow', 'wide'] as const);
  const measure = align === 'narrow' ? 'prose-measure' : 'max-w-none';

  if (!eyebrow && !heading && blocks.length === 0) return null;

  return (
    <Band tone={tone} first={first}>
      <div className="reveal">
        {eyebrow && <p className={eyebrowInk[tone]}>{eyebrow}</p>}
        {heading && <h2 className={`${eyebrow ? 'mt-3' : ''} ${headingInk[tone]}`.trim()}>{heading}</h2>}

        {blocks.length > 0 && (
          <div className={`${measure} ${heading || eyebrow ? 'mt-6' : ''} space-y-4 ${bodyInk[tone]}`.trim()}>
            {blocks.map((block, index) => (
              // `whitespace-pre-line`: a single newline inside a paragraph was
              // typed deliberately — an address, a short list — and is kept as
              // a line break rather than being collapsed or promoted into a
              // paragraph of its own.
              <p key={index} className="whitespace-pre-line">
                {block}
              </p>
            ))}
          </div>
        )}
      </div>
    </Band>
  );
}

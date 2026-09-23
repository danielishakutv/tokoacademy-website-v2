import { rows, text, type SectionProps } from './fields';
import Band, { Intro, bandFill, headingInk, ruleFill, subtleInk, toneOf } from './tone';

/** Two across on a phone, then as many as there are figures. */
const ACROSS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-2 lg:grid-cols-5',
  6: 'grid-cols-2 lg:grid-cols-3',
};

/**
 * A band of numbers.
 *
 * Hairlines rather than a row of floating cards: the figures belong to one
 * claim, and a 1px grid says that where four separate boxes with four shadows
 * say "spreadsheet". The grid is drawn by a background colour showing through
 * a one-pixel gap, which is why the cells are filled with the band's own
 * colour rather than being transparent.
 *
 * The note underneath is rendered whenever it is filled in and never invented.
 * An unexplained figure invites doubt about every other figure on the page,
 * and the honest sentence — these are our own records, not independently
 * audited — costs nothing and buys the rest of them.
 */
export default function Stats({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const eyebrow = text(data, 'eyebrow');
  const heading = text(data, 'heading');
  const note = text(data, 'note');

  const items = rows(data, 'items')
    .map((row) => ({ value: text(row, 'value'), label: text(row, 'label') }))
    .filter((item) => item.value !== '' || item.label !== '');

  if (!eyebrow && !heading && !note && items.length === 0) return null;

  const across = ACROSS[Math.min(items.length, 6)] ?? 'grid-cols-2';

  return (
    <Band tone={tone} first={first}>
      <Intro tone={tone} eyebrow={eyebrow} heading={heading} className="reveal" />

      {items.length > 0 && (
        <dl
          className={`reveal ${eyebrow || heading ? 'mt-12' : ''} grid ${across} gap-px overflow-hidden rounded-2xl ${ruleFill[tone]}`.trim()}
        >
          {items.map((item, index) => (
            <div key={index} className={`${bandFill[tone]} p-6 sm:p-8`}>
              {item.label && <dt className={`text-sm ${subtleInk[tone]}`}>{item.label}</dt>}
              {item.value && (
                <dd
                  className={`mt-2 text-3xl font-bold tabular-nums tracking-tight sm:text-4xl ${
                    tone === 'brand' || tone === 'inverted' ? headingInk[tone] : 'text-brand'
                  }`}
                >
                  {item.value}
                </dd>
              )}
            </div>
          ))}
        </dl>
      )}

      {note && (
        <p className={`reveal prose-measure mt-6 text-sm ${subtleInk[tone]}`}>{note}</p>
      )}
    </Band>
  );
}

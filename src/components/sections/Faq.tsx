import { jsonLdHtml } from '@/lib/json-ld';
import { paragraphs, rows, stagger, text, type SectionProps } from './fields';
import Band, { Intro, toneOf } from './tone';

/**
 * Questions and answers, expandable, and readable by a search engine.
 *
 * Built on `<details>` and `<summary>`: the open and closed states, the
 * keyboard behaviour and the announcement to a screen reader are all the
 * browser's, so there is no JavaScript here at all — which matters because a
 * question whose answer only appears once a script has loaded is a question
 * with no answer on a slow connection.
 *
 * The `FAQPage` block is the other half. It is what lets an answer appear
 * directly in a search result, and it is escaped through `jsonLdHtml` because
 * this text is typed by whoever composes the page: `JSON.stringify` does not
 * escape `<`, so an answer containing a closing script tag would end the block
 * early and put live markup on the apex domain.
 */
export default function Faq({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const heading = text(data, 'heading');

  // A question with no answer helps nobody and would publish an empty entry
  // into the structured data, so both halves are required.
  const items = rows(data, 'items')
    .map((row) => ({ question: text(row, 'question'), answer: text(row, 'answer') }))
    .filter((item) => item.question !== '' && item.answer !== '');

  if (!heading && items.length === 0) return null;

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <Band tone={tone} first={first}>
      {items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(faqPage) }}
        />
      )}

      <Intro tone={tone} heading={heading} className="reveal" />

      {items.length > 0 && (
        <div className={`${heading ? 'mt-10' : ''} mx-auto max-w-3xl space-y-3`.trim()}>
          {items.map((item, index) => (
            /*
              `.card` keeps its own raised surface whatever the band is behind
              it, so the question and answer stay dark-on-light on all four
              tones without a colour of their own.
            */
            <details key={index} className={`card reveal ${stagger(index)} group p-5 sm:p-6`}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">{item.question}</span>
                <svg
                  className="mt-1 size-5 shrink-0 text-brand transition-transform duration-300 group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </summary>

              <div className="mt-4 space-y-3 text-ink-muted">
                {paragraphs(item.answer).map((block, blockIndex) => (
                  <p key={blockIndex} className="whitespace-pre-line">
                    {block}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </Band>
  );
}

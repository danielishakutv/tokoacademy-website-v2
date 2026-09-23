import { text, type SectionProps } from './fields';
import SectionImage from './SectionImage';
import Band, { bodyInk, headingInk, subtleInk, toneOf } from './tone';

/**
 * Something somebody said, with their name.
 *
 * Nothing is rendered until there is a quotation, and the attribution is
 * whatever was actually filled in — never "a satisfied learner". An anonymous
 * testimonial persuades nobody and quietly devalues the real ones beside it,
 * so the absence of a name is shown as the absence of a name.
 */
export default function Quote({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const quote = text(data, 'quote');
  const name = text(data, 'name');
  const role = text(data, 'role');
  const image = text(data, 'image');

  if (!quote) return null;

  return (
    <Band tone={tone} first={first}>
      <figure className="reveal mx-auto max-w-3xl text-center">
        <svg
          className={`mx-auto size-8 ${tone === 'plain' || tone === 'sunken' ? 'text-brand/40' : subtleInk[tone]}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.5 5C6.5 6.5 5 9.3 5 13v6h6v-6H8c0-2.4.8-4 2.6-5L9.5 5Zm9 0C15.5 6.5 14 9.3 14 13v6h6v-6h-3c0-2.4.8-4 2.6-5L18.5 5Z" />
        </svg>

        {/*
          A blockquote, not a heading. It is set larger than body copy because
          it is a quotation and that is how a quotation reads — but the size
          comes from the body scale, never from a heading with its size
          overridden.
        */}
        <blockquote
          className={`mt-6 whitespace-pre-line text-lg leading-relaxed sm:text-xl ${headingInk[tone] || 'text-ink'}`}
        >
          {quote}
        </blockquote>

        {(name || role || image) && (
          <figcaption className="mt-8 flex flex-col items-center gap-3">
            {image && (
              <SectionImage
                value={image}
                alt={name}
                aspect="aspect-square"
                rounded={false}
                className="size-16 rounded-full"
                sizes="64px"
              />
            )}
            <span className="block">
              {name && (
                <span className={`block font-semibold ${headingInk[tone] || 'text-ink'}`}>{name}</span>
              )}
              {role && <span className={`mt-0.5 block text-sm ${bodyInk[tone]}`}>{role}</span>}
            </span>
          </figcaption>
        )}
      </figure>
    </Band>
  );
}

import Image from 'next/image';
import { partners } from '@/data/partners';
import { count, text, type SectionProps } from './fields';
import Band, { Intro, toneOf } from './tone';

/**
 * The partner logo strip, drawn from the partner list.
 *
 * The logos, their alt text and the tile treatment are all
 * `components/PartnerLogosStrip`'s, and this deliberately matches it rather
 * than inventing a second look for the same content. What it does not do is
 * render that component: it carries its own heading, its own standfirst and
 * its own background, all written for the home page — so nesting it inside a
 * composed band would print two headings, one of which nobody on this page
 * wrote and nobody can edit. The band supplies those three things from the
 * section's own fields; the tiles below are the part worth sharing.
 */
export default function Logos({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const heading = text(data, 'heading');
  const body = text(data, 'body');
  const limit = count(data, 'limit', 12);
  const shown = partners.slice(0, limit);

  if (!heading && !body && shown.length === 0) return null;

  return (
    <Band tone={tone} first={first}>
      <Intro tone={tone} heading={heading} body={body} className="reveal" />

      {shown.length > 0 && (
        <div className={`${heading || body ? 'mt-10 md:mt-12' : ''} grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4`.trim()}>
          {shown.map((partner) => (
            /*
              The tile stays white on every tone and in both themes. These are
              other organisations' marks — mostly dark artwork on a transparent
              background — and a dark or coloured tile would swallow half of
              them. A white card under a logo is what every brand guideline
              asks for anyway.
            */
            <div
              key={partner.id}
              className="flex items-center justify-center rounded-xl border border-line bg-white p-4 transition-all duration-300 hover:border-brand/30 hover:shadow-md md:p-6"
            >
              <div className="relative h-16 w-full md:h-20">
                <Image
                  src={partner.logo}
                  alt={partner.logoAlt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100px, 150px"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Band>
  );
}

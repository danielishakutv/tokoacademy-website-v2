import Link from 'next/link';
import type { ReactNode } from 'react';
import { type Action, type SectionData, choice } from './fields';

/**
 * The band a section sits in, and the colours that follow from it.
 *
 * `tone` is the only visual choice the editor is given, and it is deliberately
 * named for meaning rather than for a colour: the design system decides what
 * "dark" looks like, in both themes, and nobody composing a page can set a hex
 * value. Everything a renderer needs to stay legible on its band — heading
 * colour, muted body, hairline, which button style reads as primary — is
 * looked up here, so a new section cannot quietly get it wrong.
 *
 * The inverted and brand cases are the reason this file exists rather than a
 * pair of ternaries at each call site. `globals.css` colours every heading
 * with `--ink` in the base layer, and a base-layer rule on the element beats
 * inherited colour from an ancestor — so a heading on a dark band is dark on
 * dark unless it is told otherwise, explicitly, every time.
 */

export type Tone = 'plain' | 'sunken' | 'inverted' | 'brand';

export const TONES = ['plain', 'sunken', 'inverted', 'brand'] as const;

export function toneOf(data: SectionData): Tone {
  return choice(data, 'tone', TONES);
}

const BAND: Record<Tone, string> = {
  plain: 'bg-surface',
  sunken: 'bg-surface-sunken',
  inverted: 'bg-surface-inverted text-ink-inverted',
  brand: 'bg-brand text-brand-ink',
};

/** Headings need this spelled out — see the note above. */
export const headingInk: Record<Tone, string> = {
  plain: '',
  sunken: '',
  inverted: 'text-ink-inverted',
  brand: 'text-brand-ink',
};

/** Body copy: quieter than the heading, still comfortably readable. */
export const bodyInk: Record<Tone, string> = {
  plain: 'text-ink-muted',
  sunken: 'text-ink-muted',
  inverted: 'text-ink-inverted/75',
  brand: 'text-brand-ink/85',
};

/** Captions, dates, notes — the quietest text on the band. */
export const subtleInk: Record<Tone, string> = {
  plain: 'text-ink-subtle',
  sunken: 'text-ink-subtle',
  inverted: 'text-ink-inverted/60',
  brand: 'text-brand-ink/70',
};

export const eyebrowInk: Record<Tone, string> = {
  plain: 'eyebrow text-brand',
  sunken: 'eyebrow text-brand',
  inverted: 'text-xs font-semibold uppercase tracking-[0.16em] text-ink-inverted/60',
  brand: 'text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink/70',
};

export const lineInk: Record<Tone, string> = {
  plain: 'border-line',
  sunken: 'border-line',
  inverted: 'border-ink-inverted/15',
  brand: 'border-brand-ink/25',
};

/** A hairline drawn as a background showing through a 1px grid gap. */
export const ruleFill: Record<Tone, string> = {
  plain: 'bg-line',
  sunken: 'bg-line',
  inverted: 'bg-ink-inverted/15',
  brand: 'bg-brand-ink/25',
};

/** What fills the cells of such a grid: the band's own colour. */
export const bandFill: Record<Tone, string> = {
  plain: 'bg-surface',
  sunken: 'bg-surface-sunken',
  inverted: 'bg-surface-inverted',
  brand: 'bg-brand',
};

export default function Band({
  tone,
  first = false,
  className = '',
  children,
}: {
  tone: Tone;
  /**
   * The top band on a page. The header is fixed and overlays the page, so the
   * first section needs clearance or its heading sits underneath the menu.
   */
  first?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`section-padding ${BAND[tone]} ${first ? 'pt-28 md:pt-36' : ''} ${className}`.trim()}
    >
      <div className="section-container">{children}</div>
    </section>
  );
}

/**
 * The three lines that open a section: label, heading, standfirst.
 *
 * `SectionHeading` in `components/home` does this for the hand-written pages,
 * but it requires both an eyebrow and a heading and knows only two of the four
 * tones. A composed section may have any of the three lines missing — and must
 * then render nothing at all for it rather than an empty element holding open
 * the space — and may sit on the brand colour. Same three lines, same spacing,
 * driven by the tone map.
 */
export function Intro({
  tone,
  eyebrow,
  heading,
  body,
  level = 2,
  align = 'left',
  action,
  className = '',
}: {
  tone: Tone;
  eyebrow?: string;
  heading?: string;
  body?: string;
  /** 1 for the top of a page, 2 for a band within it. */
  level?: 1 | 2;
  align?: 'left' | 'centre';
  action?: ReactNode;
  className?: string;
}) {
  if (!eyebrow && !heading && !body && !action) return null;

  const centred = align === 'centre';
  // No size class on either: the fluid scale in `globals.css` is the only
  // place a heading size is decided.
  const title = heading
    ? level === 1
      ? <h1 className={headingInk[tone]}>{heading}</h1>
      : <h2 className={headingInk[tone]}>{heading}</h2>
    : null;

  return (
    <div
      className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10 ${className}`.trim()}
    >
      <div className={`max-w-2xl ${centred ? 'mx-auto text-center' : ''}`.trim()}>
        {eyebrow && <p className={eyebrowInk[tone]}>{eyebrow}</p>}
        {title && <div className={eyebrow ? 'mt-3' : ''}>{title}</div>}
        {body && (
          <p
            className={`prose-measure mt-4 whitespace-pre-line text-base sm:text-lg ${bodyInk[tone]} ${
              centred ? 'mx-auto' : ''
            }`.trim()}
          >
            {body}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 md:pb-1">{action}</div>}
    </div>
  );
}

/**
 * A link that knows whether it is leaving the site.
 *
 * `href` is typed by whoever composed the page, so it can be a path, a full
 * address, a phone number or an email. Next's `Link` prefetches and routes
 * client-side, which is right for our own pages and wrong for everything else.
 */
export function SectionLink({
  href,
  className,
  tabIndex,
  children,
}: {
  href: string;
  className?: string;
  /** -1 takes the link out of the tab order — for a hidden carousel slide. */
  tabIndex?: number;
  children: ReactNode;
}) {
  const external = /^(https?:|mailto:|tel:)/i.test(href);

  if (external) {
    const newTab = /^https?:/i.test(href);
    return (
      <a
        href={href}
        className={className}
        tabIndex={tabIndex}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} tabIndex={tabIndex}>
      {children}
    </Link>
  );
}

/**
 * The buttons under a heading.
 *
 * The first one is the primary action — except on the brand band, where a
 * brand-coloured button on a brand-coloured ground is invisible. There the
 * roles shift down one: the solid card reads as primary and the outlined one
 * as secondary, which is the same hierarchy drawn with the colours available.
 */
export function Actions({
  items,
  tone,
  className = '',
}: {
  items: Action[];
  tone: Tone;
  className?: string;
}) {
  if (items.length === 0) return null;

  const styleFor = (index: number) => {
    if (tone === 'brand') {
      return index === 0
        ? 'btn-secondary'
        : 'inline-flex items-center justify-center gap-2 rounded-xl border border-brand-ink/40 px-7 py-3.5 text-base font-semibold tracking-tight text-brand-ink transition-colors duration-200 hover:bg-brand-ink/10';
    }
    return index === 0 ? 'btn-primary' : 'btn-secondary';
  };

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center ${className}`.trim()}>
      {items.map((action, index) => (
        <SectionLink key={`${action.href}-${action.label}`} href={action.href} className={styleFor(index)}>
          {action.label}
        </SectionLink>
      ))}
    </div>
  );
}

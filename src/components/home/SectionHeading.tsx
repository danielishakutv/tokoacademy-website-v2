import type { ReactNode } from 'react';

/**
 * The three lines that open a section: label, heading, standfirst.
 *
 * Written once because the home page opens seven sections the same way, and
 * because the spacing between those three lines is the thing most likely to
 * drift if each section sets it by hand. The heading carries no size class —
 * `h2` is already the right size in `globals.css`, and the whole point of the
 * new type scale is that nobody overrides it locally.
 *
 * `inverted` exists for the one dark slab on the page. The muted greys are
 * tuned for ink on a light surface and vanish against a dark one, so on that
 * section the text is drawn from `--ink-inverted` at reduced opacity instead.
 */

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** The sentence under the heading. Optional — some sections do not need one. */
  lead?: string;
  /** Sits opposite the heading on wide screens; a "see all" link, usually. */
  action?: ReactNode;
  inverted?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  inverted = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10 ${className}`}>
      <div className="max-w-2xl">
        <p
          className={
            inverted
              ? 'text-xs font-semibold uppercase tracking-[0.16em] text-ink-inverted/60'
              : 'eyebrow text-brand'
          }
        >
          {eyebrow}
        </p>
        <h2 className={`mt-3 ${inverted ? 'text-ink-inverted' : ''}`}>{title}</h2>
        {lead && (
          <p
            className={`prose-measure mt-4 text-base sm:text-lg ${
              inverted ? 'text-ink-inverted/75' : 'text-ink-muted'
            }`}
          >
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 md:pb-1">{action}</div>}
    </div>
  );
}

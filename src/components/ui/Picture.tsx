import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * A photograph, or a clearly-marked space waiting for one.
 *
 * The site had almost no imagery, and the usual way that gets fixed is badly:
 * someone drops in stock photographs of foreign offices, or the layout is
 * designed around pictures that never arrive and ships with broken frames.
 *
 * So this checks, at build time, whether the file is actually in `public/`.
 * If it is, you get the photograph. If it is not, you get a placeholder in the
 * brand's colours that states plainly what belongs there — and the layout is
 * already correct, because the placeholder occupies exactly the space the
 * photograph will.
 *
 * That means the design can be finished tonight and the photographs can arrive
 * next week, one at a time, with no further work: drop `public/images/…/x.jpg`
 * into place and the next build shows it. `docs/IMAGE-GUIDE.md` lists every
 * slot, what to shoot and what size it needs to be.
 *
 * A server component on purpose — `existsSync` is the whole point, and it can
 * only run where there is a filesystem.
 */

export interface PictureProps {
  /** Path under `public/`, e.g. `/images/hero/classroom.jpg`. */
  src: string;
  /** What the photograph shows. Required: a decorative image should not use this. */
  alt: string;
  /** What to shoot, shown on the placeholder. Keep it concrete. */
  brief?: string;
  /** Tailwind aspect ratio class. Defaults to 16:9. */
  aspect?: string;
  className?: string;
  /** The first image on a page should not be lazy. */
  priority?: boolean;
  /** Sizes hint for responsive loading. */
  sizes?: string;
  /** Rounds the corners. Off for full-bleed sections. */
  rounded?: boolean;
}

function fileExists(src: string): boolean {
  if (/^https?:\/\//i.test(src)) return true; // remote: we cannot check, assume it is there
  try {
    return existsSync(path.join(process.cwd(), 'public', src.replace(/^\//, '')));
  } catch {
    return false;
  }
}

export default function Picture({
  src,
  alt,
  brief,
  aspect = 'aspect-[16/9]',
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px',
  rounded = true,
}: PictureProps) {
  const present = fileExists(src);
  const shape = `${aspect} ${rounded ? 'rounded-2xl' : ''} overflow-hidden`;

  if (present) {
    return (
      <div className={`relative ${shape} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchPriority: 'high' as const } : {})}
          className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${shape} ${className} border border-dashed border-line-strong bg-brand-soft`}
      // Not aria-hidden: a sighted visitor sees a marked gap, and this says the
      // same thing to anyone who cannot.
      role="img"
      aria-label={`Photograph to come: ${alt}`}
    >
      <div className="absolute inset-0 grid-field opacity-40" aria-hidden />
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 p-5 text-center">
        <svg
          className="size-7 text-brand/60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m21 16-5-5L7 20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm font-semibold text-ink">{alt}</p>
        {brief && <p className="max-w-[28ch] text-xs leading-relaxed text-ink-subtle">{brief}</p>}
        <code className="mt-1 rounded bg-surface-raised/70 px-1.5 py-0.5 text-[10px] text-ink-subtle">{src}</code>
      </div>
    </div>
  );
}

import { existsSync } from 'node:fs';
import path from 'node:path';
import { managedImage } from '@/lib/managed';

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

/** The widths `npm run images` produces beside each photograph. */
const WIDTHS = [480, 960, 1600];

/**
 * The WebP copies that actually exist for this source.
 *
 * Checked rather than assumed: a photograph dropped in this afternoon has no
 * variants until the script runs, and a srcset pointing at files that are not
 * there is a broken image on the phones we are trying to help. When there are
 * none, the original is served and everything still works — just heavier.
 */
function webpSrcSet(src: string): string | null {
  if (/^https?:\/\//i.test(src)) return null;
  const parts = WIDTHS.map((width) => {
    const variant = src.replace(/\.(jpe?g|png)$/i, `-${width}.webp`);
    return fileExists(variant) ? `${variant} ${width}w` : null;
  }).filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

export default async function Picture({
  src,
  alt,
  brief,
  aspect = 'aspect-[16/9]',
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px',
  rounded = true,
}: PictureProps) {
  /*
   * An upload from the Website screen in ta_admin wins over whatever this
   * repository ships for the same slot. That is the whole mechanism: a
   * photograph replaced in the admin appears here on the next publish, and
   * reverting it in the admin brings the built-in one back — nothing is
   * committed, nothing is deleted.
   *
   * Resolved at build time, so a visitor never waits on it.
   */
  const override = await managedImage(src);
  const present = Boolean(override) || fileExists(src);
  const shape = `${aspect} ${rounded ? 'rounded-2xl' : ''} overflow-hidden`;

  if (present) {
    // An uploaded file is already WebP at a sensible width, so it needs no
    // srcset of its own — and it is on another origin, where our generated
    // variants do not exist.
    const resolvedSrc = override?.url ?? src;
    const srcSet = override ? null : webpSrcSet(src);
    return (
      <div className={`relative ${shape} ${className}`}>
        {/*
          A preload for the one image that decides the Largest Contentful
          Paint. Without it the browser cannot discover this file until it has
          parsed, downloaded and run enough of the page to reach it —
          Lighthouse measured 2.1 seconds of that delay on mobile, more than a
          third of the whole paint. `imageSrcSet` is what makes the hint pick
          the same small file the <img> will.
        */}
        {priority && srcSet && (
          // eslint-disable-next-line @next/next/no-head-element
          <link rel="preload" as="image" imageSrcSet={srcSet} imageSizes={sizes} fetchPriority="high" />
        )}
        <picture>
          {/* WebP first for anything that reads it; the original is the
              fallback, so an old browser still gets the photograph. */}
          {srcSet && <source type="image/webp" srcSet={srcSet} sizes={sizes} />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolvedSrc}
            alt={alt}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...(priority ? { fetchPriority: 'high' as const } : {})}
            className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform hover:scale-[1.03]"
          />
        </picture>
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

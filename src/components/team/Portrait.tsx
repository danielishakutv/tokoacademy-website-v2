/**
 * A team member's photograph, or their initials.
 *
 * Deliberately not `Picture`. That component's job is to check whether a file
 * this repository ships has actually been dropped into `public/` yet, and to
 * draw a labelled gap saying what to shoot when it has not — right for a
 * designed layout waiting on a photographer. A portrait here is neither: it is
 * an upload from ta_admin at an absolute URL on another origin, so there is no
 * local file to check and no brief to print.
 *
 * And when there is no photograph the answer is initials, never a silhouette.
 * A grey outline of a person is a picture of somebody who is not them, and on a
 * page whose whole purpose is to say who these people are that reads as a
 * broken image. Initials on the brand tint are plainly a stand-in, and the grid
 * stays even because the shape is identical either way.
 *
 * ta_admin squares and re-encodes the upload at 800px before it is stored, so
 * there is no srcset to build: one file, already the right shape and weight.
 */

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase() || '?'
  );
}

export default function Portrait({
  name,
  photo,
  className = '',
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px',
  priority = false,
}: {
  name: string;
  photo: { url: string; width: number | null; height: number | null } | null;
  className?: string;
  sizes?: string;
  /** The first few portraits on a page should not be lazy. */
  priority?: boolean;
}) {
  const shape = `relative aspect-square overflow-hidden rounded-2xl ${className}`.trim();

  if (photo) {
    return (
      <div className={shape}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={`${name}, Toko Academy`}
          {...(photo.width ? { width: photo.width } : {})}
          {...(photo.height ? { height: photo.height } : {})}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchPriority: 'high' as const } : {})}
          className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className={`${shape} bg-brand-soft`}
      // Not aria-hidden: a sighted visitor sees initials standing in for a
      // photograph, and this says the same thing to anybody who cannot.
      role="img"
      aria-label={`${name} — no photograph yet`}
    >
      <div className="absolute inset-0 grid-field opacity-40" aria-hidden />
      <div className="relative grid h-full w-full place-items-center">
        <span className="text-4xl font-bold tracking-tight text-brand/70 sm:text-5xl" aria-hidden>
          {initialsOf(name)}
        </span>
      </div>
    </div>
  );
}

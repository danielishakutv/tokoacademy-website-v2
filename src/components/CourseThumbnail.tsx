import { existsSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { tileGradient } from '@/lib/dlc';

/**
 * A course's picture, or a decent-looking stand-in for one.
 *
 * What this used to do, and why every card looked identical: it ignored the
 * course's actual thumbnail and guessed at a filename — `/images/courses/
 * <id>.jpg`, then on error `.png`, then on error again a single shared
 * `default_course_image.webp`. Almost no course had a matching file, so
 * almost every card fired two 404s and then drew the same generic
 * illustration. The real thumbnails, uploaded in the admin, were never asked
 * for at all.
 *
 * Worse, those 404s were what made images "broken until you hard refresh".
 * The service worker cached failed responses and served them back for ever,
 * so a picture added later never appeared. That is fixed in `public/sw.js`
 * as well, but the honest repair is here: stop requesting files that are not
 * there.
 *
 * Now it draws, in this order:
 *
 *   1. the thumbnail uploaded in the admin, when the course has one;
 *   2. `public/images/courses/<slug>.jpg` from this repository, when it exists;
 *   3. a coloured tile with the title on it.
 *
 * The middle step is new, and the order is the point. Six of the twelve
 * published courses have no thumbnail in the admin, so they drew a gradient
 * tile — correct, and still a card with no picture on it. The repository can
 * now supply one without pretending to be the catalogue: the moment somebody
 * uploads a real thumbnail in the admin, step 1 wins and the repository's copy
 * is ignored. Nothing has to be removed, and the admin stays the source of
 * truth for course data.
 *
 * The existence check is `existsSync`, not a guess at a filename — the guessing
 * is exactly what this component used to do, and what fired two 404s per card
 * that the service worker then cached for ever.
 *
 * Deliberately a server component — no `onError`, no client JavaScript, and
 * therefore nothing to hydrate. The fallback is decided at build time from
 * data we already have, rather than in the browser after a failure.
 */

/** A repository thumbnail for this course, if one has been added. */
function repoThumbnail(slug: string): string | null {
  // A slug comes from the catalogue, but it reaches here as a plain string and
  // is about to be joined onto a filesystem path. Anything that is not a slug
  // is refused rather than resolved.
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const url = `/images/courses/${slug}.jpg`;
  try {
    return existsSync(path.join(process.cwd(), 'public', 'images', 'courses', `${slug}.jpg`)) ? url : null;
  } catch {
    return null;
  }
}

type Props = {
  /** The course's own slug — identifies it, and picks the fallback colour. */
  id: string;
  title: string;
  /** Already absolute. Pass `thumbnailUrl(course.thumbnailUrl)` from `@/lib/dlc`. */
  src?: string | null;
  duration?: string;
  /** When given, the whole tile links to the course. */
  courseId?: string;
  /** The first tile on a page should not be lazy — it is what people see first. */
  priority?: boolean;
};

export default function CourseThumbnail({ id, title, src, duration, courseId, priority }: Props) {
  const resolved = src ?? repoThumbnail(id);
  const thumbnail = (
    <div
      className={`relative w-full aspect-video overflow-hidden rounded-md bg-gradient-to-br ${tileGradient(id)}`}
    >
      {resolved ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt=""
          className="h-full w-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // Tells the browser the shape before the bytes arrive, so the card
          // does not jump as images load.
          width={640}
          height={360}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {/*
            `text-ink`, which flips — not a fixed dark.

            The reasoning for fixing it was that the tile is a brand gradient
            "chosen for a light ground", but the gradient is translucent
            (`from-toko-green/20`) and sits on `surface-raised`, which is dark
            in the dark theme. So the tile flips too, and fixed dark text on it
            measured 1.86:1 — a course title that cannot be read. Caught by
            scripts/visual-check.mjs rather than by looking at the source,
            which is the point of that script.
          */}
          <span className="text-center text-base font-bold leading-tight text-ink/85">
            {title}
          </span>
        </div>
      )}

      {duration && (
        <span className="absolute left-2 top-2 rounded bg-toko-green px-2.5 py-1 text-[11px] font-semibold text-white shadow">
          {duration}
        </span>
      )}
    </div>
  );

  if (courseId) {
    return (
      <Link href={`/courses/${courseId}`} aria-label={title}>
        {thumbnail}
      </Link>
    );
  }

  return thumbnail;
}

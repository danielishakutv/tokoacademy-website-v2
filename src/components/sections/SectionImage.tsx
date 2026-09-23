import Picture from '@/components/ui/Picture';

/**
 * A photograph chosen in ta_admin.
 *
 * The `image` field holds one of two things: a **slot id** such as
 * `hero/professional-courses`, or the **URL of a file uploaded** on the
 * Website screen. Both end up going through `Picture`, and that is the whole
 * trick.
 *
 * A slot id is turned back into the path this repository would have used for
 * it — `/images/<slot>.jpg` — because `Picture` derives the slot from the path
 * again on the way in. So one value resolves through three fallbacks in order:
 * an upload in ta_admin, then the photograph committed to `public/`, and
 * finally the labelled placeholder that states what belongs there. A slot
 * nobody has filled yet therefore shows a marked gap of exactly the right
 * shape, rather than a broken image or a hole in the layout.
 *
 * An uploaded URL is absolute and passes straight through: `Picture` cannot
 * check a remote file exists, assumes it does, and skips the WebP srcset it
 * generates for local ones.
 *
 * An empty field renders nothing at all. That is not the same case as an
 * unfilled slot — nobody has asked for a photograph here, so the layout should
 * close up rather than advertise a gap.
 */

/** The path `Picture` should be given for a slot id or an uploaded URL. */
export function imagePath(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Already a URL or an absolute path: leave it alone.
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) return trimmed;
  return `/images/${trimmed}.jpg`;
}

export default function SectionImage({
  value,
  alt,
  aspect = 'aspect-[4/3]',
  className = '',
  sizes = '(max-width: 1024px) 100vw, 560px',
  priority = false,
  rounded = true,
}: {
  value: string;
  /**
   * There is no alt field in the schema — describing a photograph is not
   * something an editor should have to do twice — so the nearest heading,
   * title or caption is used. It is the text the picture was chosen to sit
   * beside, which is the honest description of what it is doing there.
   */
  alt: string;
  aspect?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: boolean;
}) {
  const src = imagePath(value);
  if (!src) return null;

  return (
    <Picture
      src={src}
      alt={alt}
      aspect={aspect}
      className={className}
      sizes={sizes}
      priority={priority}
      rounded={rounded}
    />
  );
}

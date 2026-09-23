/**
 * Reading a section's fields without ever trusting them.
 *
 * Section data arrives as JSON from ta_admin, which cleans it against the
 * schema before storing it — but this side cannot verify that, and it is a
 * separate application on a separate release cycle. One page half-migrated by
 * a schema change would otherwise take the whole build down: `data.items.map`
 * on a null is a thrown exception, and a static export has no runtime to
 * recover in. A marketing page missing one band is a small problem; a site
 * that cannot deploy is not.
 *
 * So every field is read through one of these, each of which answers with the
 * empty version of what the caller asked for. Renderers then decide what an
 * empty field means — which is almost always "draw nothing", never "draw a
 * sentence apologising for the missing content".
 */

export type SectionData = Record<string, unknown>;

/** What every renderer is handed. */
export interface SectionProps {
  data: SectionData;
  /** True for the top band on a page, which must clear the fixed header. */
  first?: boolean;
}

/** A trimmed string, or ''. */
export function text(data: SectionData, key: string): string {
  const value = data[key];
  return typeof value === 'string' ? value.trim() : '';
}

/** A finite, non-negative count, or the fallback. */
export function count(data: SectionData, key: string, fallback: number): number {
  const value = Number(data[key]);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.floor(value);
}

export function flag(data: SectionData, key: string): boolean {
  return data[key] === true;
}

/** One of a fixed set, falling back to the first. */
export function choice<T extends string>(data: SectionData, key: string, allowed: readonly T[]): T {
  const value = data[key];
  return (allowed as readonly string[]).includes(value as string) ? (value as T) : allowed[0];
}

/** The rows of a `list` field, each one guaranteed to be an object. */
export function rows(data: SectionData, key: string): SectionData[] {
  const value = data[key];
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is SectionData => Boolean(entry) && typeof entry === 'object' && !Array.isArray(entry));
}

export interface Action {
  label: string;
  href: string;
}

/**
 * The buttons on a section.
 *
 * A button with no label or nowhere to go is dropped rather than rendered as
 * an empty box — which is what a half-filled row in the editor produces, and
 * an empty button is indistinguishable from a broken page.
 */
export function actions(data: SectionData, key = 'actions'): Action[] {
  return rows(data, key)
    .map((row) => ({ label: text(row, 'label'), href: text(row, 'href') }))
    .filter((action) => action.label !== '' && action.href !== '');
}

/**
 * Paragraphs from a `longtext` field.
 *
 * Blank line means new paragraph, which is the rule the editor's help text
 * states. A single newline inside a paragraph is preserved by
 * `whitespace-pre-line` at the call site rather than being turned into a
 * paragraph of its own, so an address or a short list still reads as written.
 */
export function paragraphs(value: string): string[] {
  if (!value) return [];
  return value
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

/**
 * Stagger classes, looked up rather than built.
 *
 * `reveal-delay-1` and friends are hand-written inside `@layer utilities` in
 * `globals.css`, so Tailwind strips any of them it cannot find spelled out in
 * the source. A template literal would produce the right class at runtime and
 * an empty stylesheet at build time.
 */
const STAGGER = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5'];

export function stagger(index: number): string {
  return STAGGER[index % STAGGER.length];
}

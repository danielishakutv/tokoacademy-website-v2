/**
 * Serialising structured data into a `<script>` tag, safely.
 *
 * `JSON.stringify` escapes quotes and backslashes but not `<`. So a value
 * containing a closing script tag ends the block early and everything after
 * it is parsed as markup — which on this site is reachable, because most of
 * the structured data is built from WordPress post titles and excerpts.
 * Anyone able to publish a post could put a script on the apex domain.
 *
 * It was worse than it first looks, because of an ordering bug in
 * `stripHtml()`: it removed tags and *then* decoded HTML entities, so an
 * encoded closing tag survived the strip untouched — there was no tag there
 * to remove — and was decoded into real markup on the way out. The step meant
 * to make it safe was the step that armed it. That ordering is fixed in
 * `wordpress.ts`; this escapes the output regardless, because defence in
 * depth costs nothing here.
 *
 * U+2028 and U+2029 are handled too. They are legal inside a JSON string but
 * are line terminators to a JavaScript parser, which matters if a block is
 * ever read as JS rather than as ld+json.
 *
 * Every escape sequence below is built from character codes rather than
 * written as a literal. A ` ` typed into this file is a real separator
 * character, not the six characters we want to emit — which is exactly the
 * bug an earlier version of this file shipped with.
 */

/** The character itself, as it may appear in the input. */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/** The six-character escape we want to appear in the output. */
const BACKSLASH = String.fromCharCode(0x5c);
const ESCAPED_LT = BACKSLASH + 'u003c';
const ESCAPED_LINE_SEPARATOR = BACKSLASH + 'u2028';
const ESCAPED_PARAGRAPH_SEPARATOR = BACKSLASH + 'u2029';

export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data)
    .split('<')
    .join(ESCAPED_LT)
    .split(LINE_SEPARATOR)
    .join(ESCAPED_LINE_SEPARATOR)
    .split(PARAGRAPH_SEPARATOR)
    .join(ESCAPED_PARAGRAPH_SEPARATOR);
}

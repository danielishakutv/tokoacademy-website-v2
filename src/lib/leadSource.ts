/**
 * Which page a form was filled in on, as something somebody can click.
 *
 * Every form on this site sends this, and it travels through to the Telegram
 * message, the leads forum and the email that reach the people who ring the
 * lead back. It used to send `window.location.pathname` — so a notification
 * said `From: /courses/data-analysis`, which is half an address: enough to work
 * out which page they meant, not enough to open it. On a phone, reassembling it
 * means typing the domain in by hand, which nobody does.
 *
 * Origin and path only. No query string and no hash: the useful part is which
 * course page they were reading, the rest is tracking parameters that would
 * push the address past the length the receiving APIs accept — and a truncated
 * URL is worse than a short one, because it still looks like a link.
 */
export function leadSource(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}`.slice(0, 200);
}

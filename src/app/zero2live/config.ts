// Shared config for the Zero to Live landing page.
//
// The page shows the workshop price, plainly and unchanging. The CTAs open an
// enrolment form that POSTs to the Toko Academy public API (ENROL_ENDPOINT)
// and, on success, redirects the buyer to Paystack — Toko creates the account
// after payment.
// IMAGES: swap the two files below to use your own photos (same filenames).

/**
 * The list price, as a fallback only.
 *
 * The real figure now comes from the platform at build time (see page.tsx),
 * because the platform is what actually charges the card — and while a
 * promotion is running it charges less than this. These constants are what the
 * page falls back to if the catalogue cannot be reached during a build, so that
 * a sales page never renders with a blank price.
 */
export const PRICE = '₦25,000';
export const PRICE_NUMBER = '25000'; // for structured data / analytics
/** The same list price as a number, for comparing against the promotional one. */
export const PRICE_NAIRA = 25000;
/** The slug this workshop has in the platform's catalogue. */
export const COURSE_SLUG_CATALOGUE = 'zero-to-live';

export const HERO_IMG = '/images/zero2live/daniel-hero.jpg';
export const NOTE_IMG = '/images/zero2live/daniel-note.jpg';

// Toko Academy public enrolment API (no auth, CORS open — do NOT send credentials).
export const ENROL_ENDPOINT = 'https://learn.tokoacademy.org/api/public/enrol';
/** Where a scheduled workshop's seat request goes — the same queue every other
 *  scheduled course on the site uses, so admissions has one place to look. */
export const APPLY_ENDPOINT = 'https://learn.tokoacademy.org/api/public/apply';
export const COURSE_SLUG = 'zero-to-live';
export const LOGIN_URL = 'https://learn.tokoacademy.org/login';

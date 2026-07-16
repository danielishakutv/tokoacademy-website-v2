// Shared config for the Zero to Live landing page.
//
// The page shows the workshop price (PRICE_FLASH during the visitor's first
// FLASH_WINDOW_HOURS, then PRICE_FULL). The CTAs open an enrolment form that
// POSTs to the Toko Academy public API (ENROL_ENDPOINT) and, on success,
// redirects the buyer to Paystack — Toko creates the account after payment.
// IMAGES: swap the two files below to use your own photos (same filenames).

export const PRICE_FLASH = '₦25,000';
export const PRICE_FULL = '₦50,000';
export const PRICE_SAVINGS = '₦25,000';
export const PRICE_FLASH_NUMBER = '25000'; // for structured data / analytics

export const SEATS = 25;
export const FLASH_WINDOW_HOURS = 8;

export const HERO_IMG = '/images/zero2live/daniel-hero.jpg';
export const NOTE_IMG = '/images/zero2live/daniel-note.jpg';

// Toko Academy public enrolment API (no auth, CORS open — do NOT send credentials).
export const ENROL_ENDPOINT = 'https://learn.tokoacademy.org/api/public/enrol';
export const COURSE_SLUG = 'zero-to-live';
export const LOGIN_URL = 'https://learn.tokoacademy.org/login';

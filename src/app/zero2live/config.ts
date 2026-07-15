// Shared config for the Zero to Live landing page.
//
// PLACEHOLDER: replace PAYSTACK_URL with the real Paystack link (which charges the
// flash price). The page shows PRICE_FLASH during the visitor's first
// FLASH_WINDOW_HOURS, then displays PRICE_FULL — but the link is unchanged.
// IMAGES: swap the two files below to use your own photos (same filenames).
export const PAYSTACK_URL = 'https://paystack.com/pay/REPLACE-ME';

export const PRICE_FLASH = '₦25,000';
export const PRICE_FULL = '₦50,000';
export const PRICE_SAVINGS = '₦25,000';
export const PRICE_FLASH_NUMBER = '25000'; // for structured data / analytics

export const SEATS = 25;
export const FLASH_WINDOW_HOURS = 8;

export const HERO_IMG = '/images/zero2live/daniel-hero.jpg';
export const NOTE_IMG = '/images/zero2live/daniel-note.jpg';

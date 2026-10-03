'use client';

import { useEffect, useState } from 'react';

/**
 * A course price that stops being a promotional price the moment it should.
 *
 * This is a client component for one reason, and it is the whole reason it
 * exists. The site is a static export: the HTML a visitor gets was rendered
 * whenever the build last ran, and the build runs on a push plus once a day at
 * 06:17 UTC. The promotion ends at 22:59:59 UTC on 19 October, so a purely
 * build-time price would keep advertising half price for the seven hours until
 * the next scheduled build — while the platform, which is the thing that
 * actually takes the money, had already gone back to the full price.
 *
 * Somebody seeing ₦90,000 and being charged ₦180,000 is the worst outcome this
 * change could produce, so the browser re-checks the deadline against its own
 * clock and corrects itself. The static HTML can be stale; what is on screen
 * cannot.
 *
 * The first render deliberately matches what the server rendered — discounted —
 * so there is no hydration mismatch. The correction happens on mount, and again
 * every minute, which also means a tab left open across the deadline updates
 * without a reload.
 */

const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

/** Deliberately duplicated from `@/lib/dlc` rather than imported: that module
 *  reads `process.env` and owns the build-time fetching, and none of it belongs
 *  in a client bundle for the sake of four lines of formatting. */
export function naira0(price: number): string {
  return price > 0 ? naira.format(price) : 'Free';
}

export type PriceProps = {
  /** What it costs today — already discounted by the API when a promotion runs. */
  price: number;
  /** The undiscounted price. Null when nothing is being taken off. */
  originalPrice?: number | null;
  /** ISO timestamp at which the promotion ends. */
  endsAt?: string | null;
  className?: string;
  /** Show the old price struck through beside the new one. */
  showOriginal?: boolean;
};

/** Whether the promotion has run out, judged by the browser's own clock. */
function useExpired(endsAt?: string | null): boolean {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!endsAt) return;
    const deadline = Date.parse(endsAt);
    if (Number.isNaN(deadline)) return;

    const check = () => setExpired(Date.now() > deadline);
    check();
    // A minute is fine: this is a price label, not a countdown, and the point is
    // that a long-open tab cannot sit on a stale one indefinitely.
    const timer = setInterval(check, 60_000);
    return () => clearInterval(timer);
  }, [endsAt]);

  return expired;
}

/**
 * The price to quote right now, and how to write it.
 *
 * For callers that need the figure itself rather than a rendered element — the
 * enrol buttons, which say "Pay ₦90,000 and start now" and must not still say
 * that once the promotion has ended.
 */
export function useLivePrice(price: number, originalPrice?: number | null, endsAt?: string | null) {
  const expired = useExpired(endsAt);
  const amount = originalPrice !== null && originalPrice !== undefined && expired ? originalPrice : price;
  return {
    amount,
    label: naira0(amount),
    discounted:
      originalPrice !== null && originalPrice !== undefined && originalPrice > price && !expired,
  };
}

export default function Price({
  price,
  originalPrice = null,
  endsAt = null,
  className = '',
  showOriginal = true,
}: PriceProps) {
  const expired = useExpired(endsAt);
  const discounted = originalPrice !== null && originalPrice > price && !expired;

  // Once the deadline passes, the original price IS the price. Falling back to
  // `price` here would leave the half-price figure on screen for ever.
  const shown = originalPrice !== null && expired ? originalPrice : price;

  return (
    <span className={className}>
      {naira0(shown)}
      {discounted && showOriginal && (
        <>
          {' '}
          <s className="font-normal text-ink-subtle" aria-label={`Was ${naira0(originalPrice)}`}>
            {naira0(originalPrice)}
          </s>
        </>
      )}
    </span>
  );
}

/**
 * The "50% off until …" flag.
 *
 * Separate from the price so a page can put it where it belongs rather than
 * wherever the number happens to sit, and it disappears on the same clock.
 */
export function PromoBadge({
  endsAt,
  label,
  className = '',
}: {
  endsAt?: string | null;
  label?: string | null;
  className?: string;
}) {
  const expired = useExpired(endsAt);
  if (!endsAt || !label || expired) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-toko-magenta/10 px-3 py-1 text-xs font-bold text-toko-magenta-dark dark:text-toko-magenta-light ${className}`}
    >
      <svg className="h-3.5 w-3.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
        <path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
      </svg>
      {label}
    </span>
  );
}

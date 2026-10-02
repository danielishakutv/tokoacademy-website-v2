'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * One dialog, correct on a phone and on a desktop.
 *
 * Written after the enrol dialog turned out to be unusable in both places, for
 * reasons worth writing down because they are easy to reintroduce.
 *
 * **It is portalled to `<body>`, and that is the whole point.**
 * The old dialog rendered where it was declared — inside the course page's
 * sidebar, which is a `.card`. `.card:hover` sets `transform: translateY(-3px)`,
 * and a non-`none` transform makes an element the containing block for every
 * `position: fixed` descendant. So the moment the pointer crossed into the
 * dialog, `inset-0` stopped meaning "the viewport" and started meaning "that
 * sidebar card": the dialog collapsed into a 300px column, clipped, with a
 * backdrop that darkened only the card — and because `.card` also carries
 * `transition-all`, it *animated* its way there. On a phone `:hover` sticks
 * after a tap, so it was wrong from the first frame. A portal ends that whole
 * class of bug permanently: no ancestor can reposition what is not a
 * descendant, and nobody has to remember this rule when adding the next
 * transform.
 *
 * **Height is `dvh`, not `vh`.** On iOS Safari `vh` is the *largest* viewport —
 * the one you get with the toolbars hidden — so `max-h-[92vh]` is taller than
 * what you can actually see, and the bottom of the panel (the submit button)
 * sat underneath the browser chrome with no way to scroll to it. `dvh` tracks
 * the visible viewport, including when the on-screen keyboard takes half of it.
 * See `.sheet-panel` in globals.css, which keeps a `vh` line first as a
 * fallback for anything too old to know `dvh`.
 *
 * **The action is pinned, not scrolled.** Header and footer are flex-none and
 * only the middle scrolls, so "what is this" and "what do I press" are never
 * the parts that go off-screen. The old dialog scrolled the whole thing, which
 * on a phone with the keyboard up meant typing into a field while the button
 * you were aiming for was somewhere below the fold.
 *
 * **Tab stays inside.** Without a focus trap, tabbing out of the last field
 * walked into the page behind the backdrop — focus somewhere invisible, which
 * is the keyboard equivalent of the dialog vanishing.
 *
 * A caller puts its `<form id="…">` in the body and its submit button in
 * `footer` with a matching `form="…"`, which is how a pinned action can submit
 * a form it does not contain.
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/*
 * Scroll lock, reference-counted.
 *
 * Counted rather than a boolean because two open sheets (or one closing as
 * another opens) would otherwise race: the first to unmount would restore the
 * page's scrolling underneath the one still open.
 *
 * `paddingRight` compensates for the scrollbar the lock removes. Without it the
 * entire page jumps sideways by 15px as the dialog opens, which reads as the
 * layout breaking.
 */
let locks = 0;
let releaseLock: (() => void) | null = null;

function lockPageScroll() {
  locks += 1;
  if (locks > 1) return;

  const { body, documentElement: html } = document;
  const previous = {
    bodyOverflow: body.style.overflow,
    htmlOverflow: html.style.overflow,
    bodyPadding: body.style.paddingRight,
  };
  const scrollbar = window.innerWidth - html.clientWidth;

  body.style.overflow = 'hidden';
  html.style.overflow = 'hidden';
  if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

  releaseLock = () => {
    body.style.overflow = previous.bodyOverflow;
    html.style.overflow = previous.htmlOverflow;
    body.style.paddingRight = previous.bodyPadding;
  };
}

function unlockPageScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  releaseLock?.();
  releaseLock = null;
}

type Props = {
  open: boolean;
  onClose: () => void;
  /**
   * A submit is in flight. Esc, the backdrop and the close button all stop
   * working — closing mid-request would leave the person with no idea whether
   * they had just paid.
   */
  busy?: boolean;
  /** The small tracked label above the heading — usually the course name. */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Pinned below the scrolling body. Where the primary action goes. */
  footer?: ReactNode;
  children: ReactNode;
  /** Ties the heading to `aria-labelledby`. Must be unique on the page. */
  labelId: string;
};

export default function Sheet({
  open,
  onClose,
  busy = false,
  eyebrow,
  title,
  description,
  footer,
  children,
  labelId,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);
  const busyRef = useRef(busy);
  busyRef.current = busy;

  // A portal needs a DOM to aim at, and this site is a static export — the
  // first render happens with no document at all.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const requestClose = useCallback(() => {
    if (!busyRef.current) onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    // Remember who opened it, so closing returns the keyboard where it was
    // rather than at the top of the document.
    openerRef.current = document.activeElement;

    lockPageScroll();

    // One frame, so the panel is laid out before we move focus into it. Focus
    // on an element the browser has not positioned yet scrolls the page.
    const focusFirst = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        requestClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      // Recomputed on every Tab rather than cached on open: the footer's
      // buttons disable while submitting and the error message appears and
      // disappears, so a list captured once goes stale immediately.
      const stops = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
      );
      if (stops.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }

      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(focusFirst);
      document.removeEventListener('keydown', onKeyDown, true);
      unlockPageScroll();
      // Only if focus is still somewhere in the dialog being torn down —
      // if the submit navigated away or moved focus deliberately, leave it.
      const opener = openerRef.current;
      if (opener instanceof HTMLElement && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [open, requestClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center overscroll-contain bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      // mousedown, not click: a click that STARTED inside the panel and ended
      // on the backdrop (a drag-select across a field, releasing outside) would
      // otherwise close the dialog and throw away what was typed.
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className="sheet-panel relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-surface-raised shadow-2xl outline-none sm:max-w-lg sm:rounded-2xl"
      >
        {/* Dark in both themes on purpose. This is a coloured band, not a
            surface: inverting it for the dark theme puts a white slab on a
            black card and leaves the green eyebrow unreadable on it. */}
        <div className="relative flex-none bg-toko-gray-900 px-5 py-4 text-white sm:px-6 sm:py-5">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(124,179,66,0.35),transparent_55%)]"
          />
          {/* A grab handle, so a sheet sitting on the bottom edge of a phone
              reads as something you can dismiss rather than as the page. */}
          <div aria-hidden className="relative mx-auto mb-3 h-1 w-10 rounded-full bg-white/25 sm:hidden" />

          {/* The close button is a flex sibling, not an absolute overlay. As an
              overlay a long course title ran underneath it and the last words
              were unreadable. */}
          <div className="relative flex items-start gap-3">
            <div className="min-w-0 flex-1">
              {eyebrow && (
                <p className="truncate text-xs font-semibold uppercase tracking-widest text-toko-green-light sm:text-sm">
                  {eyebrow}
                </p>
              )}
              <h3 id={labelId} className="mt-1 text-xl text-white sm:text-2xl">
                {title}
              </h3>
              {description && <p className="mt-1 text-sm text-white/70">{description}</p>}
            </div>
            <button
              type="button"
              onClick={requestClose}
              disabled={busy}
              aria-label="Close"
              className="-mr-1 -mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* The only scrolling region. `overscroll-contain` stops a flick at the
            end of this list from scrolling the page behind the backdrop. */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">{children}</div>

        {footer && (
          <div className="flex-none border-t border-line bg-surface-raised px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

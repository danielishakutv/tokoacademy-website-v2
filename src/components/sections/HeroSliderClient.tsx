'use client';

import { useCallback, useEffect, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { SectionLink } from './tone';

/**
 * Several propositions, one at a time.
 *
 * `components/home/HeroSlider` does this for the home page and is not reused
 * here for two reasons that matter to a managed page: every one of its slides
 * must carry a call to action, and it appends a fixed second button reading
 * "Talk to our team". Both are correct for the page it was written for and
 * wrong for a page somebody composes — an owner who leaves the button text
 * empty would get a blank button, and nobody typed the second one at all.
 *
 * The three decisions it made are worth keeping, though, and are kept:
 *
 * **Every slide is rendered, stacked in one grid cell.** Not mounted and
 * unmounted as it becomes current. A carousel that swaps its contents changes
 * height whenever the copy is a line longer, and the whole page below it
 * jumps. Here every slide occupies `row-start-1 col-start-1`, so the container
 * is as tall as the tallest slide from the first paint and never moves. It
 * also means every slide's words are in the HTML — readable by a search
 * engine, and by anyone whose JavaScript never arrives.
 *
 * **It can be stopped, and it stops itself.** Moving content that runs for
 * more than five seconds needs a way to pause it (WCAG 2.2.2), and dots are
 * not that — they change the content, they do not stop it. It also pauses
 * while the pointer is over it or focus is inside it, and where reduced motion
 * has been asked for it never advances at all.
 *
 * **The photographs arrive as rendered nodes, not as paths.** `Picture` is a
 * server component — it decides at build time between an upload, a committed
 * file and a labelled placeholder — and cannot be imported into a client one.
 * The band builds each picture; this only moves them.
 */

export interface Slide {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  actionLabel: string;
  actionHref: string;
  media: ReactNode;
}

const ADVANCE_MS = 6000;

export default function HeroSliderClient({ slides }: { slides: Slide[] }) {
  const count = slides.length;
  const [current, setCurrent] = useState(0);
  /** The visitor's own choice, made with the pause button. */
  const [playing, setPlaying] = useState(true);
  /** Temporary: the pointer is over the hero, or focus is inside it. */
  const [held, setHeld] = useState(false);
  /** Reduced motion. False on the server and on the first client render so the
   *  two agree; the effect corrects it immediately after mount. */
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const go = useCallback((index: number) => setCurrent(((index % count) + count) % count), [count]);

  useEffect(() => {
    if (still || !playing || held || count < 2) return;
    const timer = window.setInterval(() => setCurrent((slide) => (slide + 1) % count), ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [still, playing, held, count]);

  // Arrow keys work wherever focus is inside the hero — a dot, a button, or
  // one of the slide's own links. The event bubbles up to here.
  const onKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (count < 2) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(current + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(current - 1);
    }
  };

  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    <section
      className="relative isolate overflow-hidden bg-surface pb-14 pt-28 sm:pb-20 md:pt-36 lg:pb-24 lg:pt-40"
      {...(count > 1 ? { 'aria-roledescription': 'carousel' } : {})}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      onKeyDown={onKeyDown}
    >
      <div className="aurora" aria-hidden />

      <div className="section-container relative z-10">
        <div className="grid">
          {slides.map((slide, index) => {
            const active = index === current;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}: ${slide.heading}`}
                aria-hidden={!active}
                className={[
                  'col-start-1 row-start-1 grid gap-6 transition-[opacity,transform] duration-700 ease-out',
                  'lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-x-14 lg:gap-y-5',
                  active ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
                ].join(' ')}
              >
                <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
                  {slide.eyebrow && <p className="eyebrow text-brand">{slide.eyebrow}</p>}
                  {slide.heading && <h1 className={slide.eyebrow ? 'mt-3' : ''}>{slide.heading}</h1>}
                </div>

                {slide.media && (
                  <div className="relative lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
                    <div
                      className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-brand/10 blur-2xl"
                      aria-hidden
                    />
                    {slide.media}
                  </div>
                )}

                <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
                  {slide.body && (
                    <p className="prose-measure whitespace-pre-line text-base text-ink-muted sm:text-lg">
                      {slide.body}
                    </p>
                  )}
                  {slide.actionLabel && slide.actionHref && (
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                      {/*
                        A link inside a hidden slide must not be a tab stop.
                        The slide is `aria-hidden`, and a focusable control
                        inside an aria-hidden region is a trap: the focus ring
                        lands somewhere the screen reader cannot describe.
                      */}
                      <SectionLink
                        href={slide.actionHref}
                        className="btn-primary"
                        tabIndex={active ? undefined : -1}
                      >
                        {slide.actionLabel}
                      </SectionLink>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-6 lg:mt-14">
            <p className="text-sm font-semibold tabular-nums text-ink" aria-hidden>
              {pad(current + 1)}
              <span className="font-normal text-ink-muted"> / {pad(count)}</span>
            </p>

            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => go(index)}
                  aria-label={`Show slide ${index + 1}: ${slide.heading}`}
                  aria-current={index === current}
                  // 44px of tappable area around a 6px dot: the target is the
                  // padding, not the mark.
                  className="grid size-11 place-items-center"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      index === current ? 'w-7 bg-brand' : 'w-1.5 bg-line-strong'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Hidden where motion was never going to happen: a pause button
                for something that is not moving is a puzzle, not a control. */}
            {!still && (
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                className="link-hover inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-ink-muted"
              >
                {playing ? 'Pause' : 'Play'}
                <span className="sr-only"> the rotating slides</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

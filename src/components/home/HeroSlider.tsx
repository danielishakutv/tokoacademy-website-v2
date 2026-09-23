'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';

/**
 * The hero: four propositions, one at a time.
 *
 * Three decisions are worth explaining, because each of them is the reason a
 * carousel usually goes wrong.
 *
 * **Every slide is rendered, stacked in one grid cell.** Not mounted and
 * unmounted as it becomes current. A carousel that swaps its contents is a
 * carousel whose container changes height when the copy is a line longer, and
 * the whole page below it jumps. Here all four slides occupy `row-start-1
 * col-start-1`, so the container is as tall as the tallest slide from the very
 * first paint and never moves again. It also means the words of all four
 * slides are in the HTML — readable by a search engine, and by anyone whose
 * JavaScript never arrives.
 *
 * **It can be stopped, and it stops itself.** Moving content that runs for
 * more than five seconds needs a way to pause it (WCAG 2.2.2), and dots are
 * not that — they change the content, they do not stop it. So there is an
 * explicit pause control. It also pauses while the pointer is over the hero or
 * while focus is inside it, because reading something that slides away
 * mid-sentence is the single most irritating thing a carousel does. And where
 * reduced motion has been asked for it never advances at all: the control
 * disappears, and the hero becomes a still image with dots.
 *
 * **The photographs come in as rendered nodes, not as paths.** `Picture` is a
 * server component — it checks at build time whether the file is actually in
 * `public/` and draws a labelled placeholder when it is not — and a server
 * component cannot be imported into a client one. Passing the rendered element
 * through as a prop is how the two live together: the page builds the picture,
 * this component only moves it.
 */

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  blurb: string;
  /** Where the primary button goes. */
  href: string;
  /** What the primary button says. */
  cta: string;
  /** Built by the page with `Picture`, so the placeholder logic still applies. */
  media: ReactNode;
}

const ADVANCE_MS = 6000;

/**
 * The slides used when nobody passes any.
 *
 * `src/app/home-v1-original/page.tsx` — an abandoned draft of this page, kept
 * on disk and marked `noindex` — renders this component with no props, and
 * that file is not ours to edit. Rather than leave its hero blank, the slides
 * it used to carry live on here. The live home page passes its own set and
 * never touches these.
 */
function LegacyFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="aspect-[4/3] overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
    </div>
  );
}

const legacySlides: HeroSlide[] = [
  {
    id: 'legacy-professional',
    eyebrow: 'Industry-leading training',
    title: 'Professional courses for career growth',
    blurb: 'Master in-demand digital skills with our comprehensive professional courses.',
    href: '/courses',
    cta: 'Explore programmes',
    media: <LegacyFrame src="/images/hero/professional-courses.jpg" alt="A professional training session in progress" />,
  },
  {
    id: 'legacy-mentorship',
    eyebrow: 'Learn by doing',
    title: 'A practical mentorship approach',
    blurb: 'Hands-on training with expert mentors guiding you every step of the way.',
    href: '/courses',
    cta: 'See how we teach',
    media: (
      <LegacyFrame
        src="/images/hero/practical-mentorship-approach-classes.jpg"
        alt="An instructor helping a learner at a laptop"
      />
    ),
  },
  {
    id: 'legacy-kids',
    eyebrow: 'Future innovators',
    title: 'Coding programmes for children and teens',
    blurb: 'Interactive classes that build strong technology foundations for young learners.',
    href: '/kids',
    cta: "Explore children's programmes",
    media: <LegacyFrame src="/images/hero/kids-coding.jpg" alt="A child presenting a game she has built" />,
  },
  {
    id: 'legacy-corporate',
    eyebrow: 'Empower your workforce',
    title: 'Specialised corporate training',
    blurb: 'Training programmes designed for government agencies, security services and organisations.',
    href: '/corporate',
    cta: 'See training solutions',
    media: (
      <LegacyFrame
        src="/images/hero/training-military-officers.jpg"
        alt="Uniformed officers seated during a training session"
      />
    ),
  },
];

function Chevron({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d={back ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

export default function HeroSlider({ slides = legacySlides }: { slides?: HeroSlide[] }) {
  const count = slides.length;
  const [current, setCurrent] = useState(0);
  /** The visitor's own choice, made with the pause button. */
  const [playing, setPlaying] = useState(true);
  /** Temporary: the pointer is over the hero, or focus is inside it. */
  const [held, setHeld] = useState(false);
  /** Reduced motion. False on the server and on the first client render, so
   *  the two agree; the effect below corrects it immediately after mount. */
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const go = useCallback(
    (index: number) => setCurrent(((index % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (still || !playing || held || count < 2) return;
    const timer = window.setInterval(() => setCurrent((slide) => (slide + 1) % count), ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [still, playing, held, count]);

  // Arrow keys work whenever focus is anywhere inside the hero — on a dot, an
  // arrow, or one of the slide's own links. The event bubbles up to here.
  const onKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
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
      aria-roledescription="carousel"
      aria-label="What Toko Academy does"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      onKeyDown={onKeyDown}
    >

      <div className="section-container relative z-10">
        <div className="grid">
          {slides.map((slide, index) => {
            const active = index === current;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}: ${slide.title}`}
                aria-hidden={!active}
                className={[
                  // All slides share one grid cell — see the note at the top.
                  'col-start-1 row-start-1 grid gap-6 transition-[opacity,transform] duration-700 ease-out',
                  'lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-x-14 lg:gap-y-5',
                  active ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
                ].join(' ')}
              >
                {/*
                  On a phone this reads like a page of a magazine: kicker,
                  headline, photograph, then the standfirst and the action. It
                  puts a picture within the first screen, which was the whole
                  complaint about the old page. On a wide screen the three
                  blocks resolve into the usual two columns.
                */}
                <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
                  <p className="eyebrow text-brand">{slide.eyebrow}</p>
                  <h1 className="mt-3">{slide.title}</h1>
                </div>

                <div className="relative lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
                  <div
                    className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-brand/10 blur-2xl"
                    aria-hidden
                  />
                  {slide.media}
                </div>

                <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
                  <p className="prose-measure text-base text-ink-muted sm:text-lg">{slide.blurb}</p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/*
                      A link inside a hidden slide must not be a tab stop. The
                      slide is `aria-hidden`, and a focusable control inside an
                      aria-hidden region is a trap: the ring is somewhere the
                      screen reader cannot describe.
                    */}
                    <Link href={slide.href} className="btn-primary" tabIndex={active ? undefined : -1}>
                      {slide.cta}
                    </Link>
                    <Link href="/contact" className="btn-secondary" tabIndex={active ? undefined : -1}>
                      Talk to our team
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
                aria-label={`Show slide ${index + 1}: ${slide.title}`}
                aria-current={index === current}
                /*
                  The dot is 8px; the thing you press is 44px.

                  `before:` casts an invisible box around it — a thumb is about
                  a centimetre across and an 8px target is a control only a
                  mouse can use. The dot itself stays small because a row of
                  fat buttons would compete with the headline it sits under.
                */
                className={`relative h-2 rounded-full transition-all duration-300
                            before:absolute before:left-1/2 before:top-1/2 before:size-11
                            before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] ${
                  index === current ? 'w-9 bg-brand' : 'w-2 bg-ink-subtle hover:bg-ink'
                }`}
              />
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* No point offering to pause something that is not moving. */}
            {!still && (
              <button
                type="button"
                onClick={() => setPlaying((on) => !on)}
                aria-label={playing ? 'Pause the slideshow' : 'Play the slideshow'}
                className="flex size-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-brand hover:text-brand"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden>
                  {playing ? (
                    <path d="M8 5h3v14H8zm5 0h3v14h-3z" />
                  ) : (
                    <path d="M8 5l11 7-11 7z" />
                  )}
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => go(current - 1)}
              aria-label="Previous slide"
              className="flex size-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-brand hover:text-brand"
            >
              <Chevron back />
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              aria-label="Next slide"
              className="flex size-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-brand hover:text-brand"
            >
              <Chevron />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

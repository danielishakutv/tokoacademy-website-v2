'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  PRICE_FLASH,
  PRICE_FULL,
  PRICE_SAVINGS,
  SEATS,
  FLASH_WINDOW_HOURS,
  HERO_IMG,
  NOTE_IMG,
} from './config';
import EnrolModal from './EnrolModal';

const WINDOW_MS = FLASH_WINDOW_HOURS * 60 * 60 * 1000;
const STORAGE_KEY = 'z2l_first_visit_v1';

/**
 * Per-visitor flash countdown. On the first visit we stamp `now` in localStorage;
 * the flash price stands for FLASH_WINDOW_HOURS from that moment, then reverts.
 * SSR / first client render use remaining=null → the "active" (flash) state, so
 * hydration matches; the real value is filled in after mount.
 */
function useFlash() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let first = Number(localStorage.getItem(STORAGE_KEY));
    if (!first || Number.isNaN(first) || first > Date.now()) {
      first = Date.now();
      try {
        localStorage.setItem(STORAGE_KEY, String(first));
      } catch {
        /* private mode — countdown still runs for this session */
      }
    }
    const end = first + WINDOW_MS;
    const tick = () => setRemaining(Math.max(0, end - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const active = remaining === null ? true : remaining > 0;
  const price = active ? PRICE_FLASH : PRICE_FULL;
  const total = Math.floor((remaining === null ? WINDOW_MS : remaining) / 1000);
  const time = {
    h: String(Math.floor(total / 3600)).padStart(2, '0'),
    m: String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
    s: String(total % 60).padStart(2, '0'),
  };
  return { active, price, time };
}

function Check({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TimeSeg({ v, label }: { v: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="min-w-[2.75rem] rounded-lg bg-white/10 px-2.5 py-2 text-center font-heading text-2xl font-bold tabular-nums text-white ring-1 ring-inset ring-white/15 sm:text-3xl">
        {v}
      </span>
      <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/50">{label}</span>
    </div>
  );
}

const arrow = (
  <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const takeaways = [
  {
    title: 'A real, working app',
    body: 'Yours. Live on the internet — not a demo, not a prototype stuck on your laptop.',
    accent: 'text-toko-green',
    ring: 'ring-toko-green/20',
    bg: 'bg-toko-green/10',
    icon: <path d="M4 6h16M4 6a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2M9 20h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: 'A domain people can say out loud',
    body: 'A real address strangers can type into a browser — and remember.',
    accent: 'text-toko-blue',
    ring: 'ring-toko-blue/20',
    bg: 'bg-toko-blue/10',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" strokeWidth="2" />
        <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: 'Free hosting to keep it running',
    body: 'Courtesy of SirsteveHQ — so your app stays online long after the weekend.',
    accent: 'text-toko-magenta',
    ring: 'ring-toko-magenta/20',
    bg: 'bg-toko-magenta/10',
    badge: 'SirsteveHQ',
    icon: <path d="M4 15a4 4 0 004 4h9a4 4 0 000-8 6 6 0 00-11.5-2A4 4 0 004 15z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: 'The workflow to do it again',
    body: 'Build the next one in days, not months — the exact process, not a one-off.',
    accent: 'text-toko-green',
    ring: 'ring-toko-green/20',
    bg: 'bg-toko-green/10',
    icon: <path d="M4 4v6h6M20 20v-6h-6M20 8A8 8 0 006 5.3M4 16a8 8 0 0014 2.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: 'A price and a pitch',
    body: 'Walk out with a number to charge and the words to win your first client.',
    accent: 'text-toko-yellow-dark',
    ring: 'ring-toko-yellow/30',
    bg: 'bg-toko-yellow/10',
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

const forYou = [
  'You have an idea and no idea how to build it.',
  "You can code a little and you're tired of localhost.",
  'You want to sell what you build, not just show it.',
];

const faqs = [
  {
    q: 'Do I need to know how to code?',
    a: 'No. If you can use a laptop and follow along, you can build. AI does the heavy lifting — you learn to direct it. People who already code a little will move even faster.',
  },
  {
    q: 'Will the app really be mine, and really live?',
    a: 'Yes. You leave with a working app on a real domain that anyone can open — not a slide, not a video, not something that only runs on your machine.',
  },
  {
    q: 'What do I need to bring?',
    a: 'A laptop, a charger, and one idea you care about. That is enough. We supply the workflow, the tools, and the hosting.',
  },
  {
    q: 'What happens when the 25 seats fill up?',
    a: 'We close registration. The room only holds 25 so everyone ships. Your seat is confirmed the moment you pay — not before.',
  },
];

export default function ZeroToLive() {
  const { active, price, time } = useFlash();
  const [enrolOpen, setEnrolOpen] = useState(false);
  const openEnrol = () => setEnrolOpen(true);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-toko-gray-900 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(124,179,66,0.22),transparent_42%),radial-gradient(circle_at_8%_85%,rgba(33,150,243,0.18),transparent_40%),radial-gradient(circle_at_50%_120%,rgba(233,30,99,0.12),transparent_45%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="section-container relative z-10 pt-32 pb-16 md:pt-44 md:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            {/* Left: copy */}
            <div className="animate-slide-up">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-toko-green animate-pulse" />
                  Live &amp; in-person · Jimeta-Yola
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-toko-magenta/15 px-4 py-1.5 text-sm font-semibold text-toko-magenta-light ring-1 ring-inset ring-toko-magenta/30">
                  🔥 Only {SEATS} seats
                </span>
              </div>

              <h1 className="mt-6 text-balance font-heading text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                ZERO<span className="text-toko-gray-400"> TO </span>
                <span className="bg-gradient-to-r from-toko-green-light via-toko-green to-toko-blue bg-clip-text text-transparent">LIVE</span>
              </h1>

              <p className="mt-5 max-w-xl text-xl font-medium text-white/90 sm:text-2xl">
                Build a real app with AI. Put it in people&apos;s hands.{' '}
                <span className="whitespace-nowrap text-toko-green-light">One weekend.</span>
              </p>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Most people with a good idea stop at the same wall: they can&apos;t build it, and they
                can&apos;t afford to pay someone who can.{' '}
                <span className="font-semibold text-white">That wall is gone.</span> You just
                haven&apos;t been shown the door.
              </p>

              {/* Flash countdown strip */}
              {active ? (
                <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-toko-yellow/30 bg-toko-yellow/10 px-4 py-3">
                  <span className="text-lg" aria-hidden="true">⚡</span>
                  <span className="text-sm text-white/85">
                    <strong className="font-bold text-white">{PRICE_FLASH}</strong> flash rate —
                    save {PRICE_SAVINGS}. Ends in{' '}
                    <span className="font-bold tabular-nums text-toko-yellow-light">
                      {time.h}:{time.m}:{time.s}
                    </span>
                    , then {PRICE_FULL}.
                  </span>
                </div>
              ) : (
                <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-white/75">
                    Seats are filling fast — lock yours at{' '}
                    <strong className="font-bold text-white">{PRICE_FULL}</strong> before they&apos;re gone.
                  </span>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={openEnrol}
                  className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-toko-green px-8 py-4 text-lg font-bold text-white shadow-toko-lg transition-all duration-300 hover:bg-toko-green-dark hover:shadow-[0_10px_40px_rgba(124,179,66,0.4)] focus:outline-none focus:ring-4 focus:ring-toko-green/50"
                >
                  Hold my seat — {price}
                  {arrow}
                </button>
                <a
                  href="#what-you-leave-with"
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-4 text-base font-semibold text-white/90 transition-colors duration-300 hover:bg-white/10"
                >
                  See what you leave with
                </a>
              </div>

              <p className="mt-4 text-sm text-white/60">
                A real cap of {SEATS} seats — not a marketing one.
              </p>
            </div>

            {/* Right: hero portrait */}
            <div className="relative mx-auto w-full max-w-md animate-fade-in lg:max-w-none">
              <div className="relative">
                <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-toko-green/30 via-transparent to-toko-blue/20 blur-2xl" />
                <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-toko-lg">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={HERO_IMG}
                      alt="Daniel Ishaku, Founder of Toko Academy"
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 45vw"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-toko-gray-900 via-toko-gray-900/70 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-sm leading-relaxed text-white/85">
                      &ldquo;I&apos;ve taken ideas from localhost to real users. In two days, I&apos;ll show you the door.&rdquo;
                    </p>
                    <p className="mt-3 font-heading text-lg font-bold leading-tight">Daniel Ishaku</p>
                    <p className="text-sm text-toko-green-light">Founder · Toko Academy</p>
                  </div>
                </div>

                {/* floating flash-timer chip */}
                <div className="absolute -left-3 top-6 rounded-xl border border-white/15 bg-toko-gray-800/90 px-4 py-3 shadow-toko-lg backdrop-blur sm:-left-6">
                  {active ? (
                    <>
                      <p className="text-lg font-extrabold leading-none tabular-nums text-toko-yellow-light">
                        {time.h}:{time.m}:{time.s}
                      </p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-white/60">
                        {PRICE_FLASH} ends
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-extrabold leading-none text-white">{SEATS}</p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-white/60">seats total</p>
                    </>
                  )}
                </div>

                <div className="absolute -right-3 bottom-24 rounded-xl border border-toko-green/30 bg-toko-green/15 px-4 py-3 shadow-toko-lg backdrop-blur sm:-right-6">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-toko-green-light">
                    <span className="h-2 w-2 rounded-full bg-toko-green-light animate-pulse" />
                    2 days
                  </p>
                  <p className="mt-0.5 text-xs text-white/70">idea → live</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROMISE ================= */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-toko-green">The promise</p>
            <h2 className="mt-4 text-balance text-toko-gray-900">In two days, you ship a live thing that strangers can use.</h2>
            <p className="mt-6 text-lg leading-relaxed text-toko-gray-600">
              You&apos;ll build a working app using AI, put it online at an address people can actually type, and leave knowing how to charge for it.
            </p>
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl bg-toko-gray-50 px-6 py-4 text-toko-gray-500">
              <span className="text-lg font-semibold text-toko-gray-400 line-through">Not a demo.</span>
              <span className="text-lg font-semibold text-toko-gray-400 line-through">Not a prototype on your laptop.</span>
              <span className="text-lg font-bold text-toko-gray-900">A live thing that works.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHAT YOU LEAVE WITH ================= */}
      <section id="what-you-leave-with" className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-toko-green">You leave with</p>
            <h2 className="mt-4 text-toko-gray-900">Five things you can use on Monday.</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {takeaways.map((item) => (
              <div
                key={item.title}
                className="group relative flex flex-col rounded-2xl bg-white p-7 shadow-toko ring-1 ring-toko-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-toko-lg"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.bg} ring-1 ring-inset ${item.ring}`}>
                  <svg className={`h-6 w-6 ${item.accent}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="mt-5 text-xl font-bold text-toko-gray-900">{item.title}</h3>
                <p className="mt-2 flex-1 text-toko-gray-600">{item.body}</p>
                {item.badge && (
                  <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-toko-magenta/10 px-3 py-1 text-xs font-bold text-toko-magenta">
                    <Check className="h-3.5 w-3.5" /> Powered by {item.badge}
                  </span>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={openEnrol}
              className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-toko-gray-900 p-7 text-left text-white shadow-toko-lg"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(124,179,66,0.35),transparent_55%)]" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-widest text-toko-green-light">Ready?</p>
                <p className="mt-3 text-2xl font-extrabold leading-tight">Claim one of {SEATS} seats.</p>
                <p className="mt-2 text-white/70">
                  {active ? `Flash rate ${PRICE_FLASH} — before it's ${PRICE_FULL}.` : `Founding seats at ${PRICE_FULL}.`}
                </p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-2 font-bold text-toko-green-light">
                Hold my seat
                {arrow}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= THE TWO DAYS ================= */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-toko-green">The weekend</p>
            <h2 className="mt-4 text-toko-gray-900">Two days. Two jumps.</h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-toko-gray-200 bg-toko-gray-50 p-8">
              <span className="absolute -right-4 -top-6 select-none text-8xl font-black text-toko-green/10">1</span>
              <p className="text-sm font-bold uppercase tracking-widest text-toko-green">Day 1</p>
              <h3 className="mt-3 text-3xl font-extrabold text-toko-gray-900">Idea → working.</h3>
              <p className="mt-3 text-toko-gray-600">
                Turn the idea in your head into an app that actually runs — directing AI to do the building, with you in control of what gets made.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-toko-blue/20 bg-toko-blue/5 p-8">
              <span className="absolute -right-4 -top-6 select-none text-8xl font-black text-toko-blue/10">2</span>
              <p className="text-sm font-bold uppercase tracking-widest text-toko-blue">Day 2</p>
              <h3 className="mt-3 text-3xl font-extrabold text-toko-gray-900">Localhost → the world.</h3>
              <p className="mt-3 text-toko-gray-600">
                Take it off your laptop and onto the internet — a real domain, live hosting, and the pitch to turn it into your first paid client.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOR YOU / NOT FOR YOU ================= */}
      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-toko ring-1 ring-toko-gray-100">
              <h3 className="text-2xl font-bold text-toko-gray-900">This is for you if…</h3>
              <ul className="mt-6 space-y-4">
                {forYou.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-toko-green/10 text-toko-green">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-toko-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-toko-gray-900 p-8 text-white">
              <h3 className="text-2xl font-bold">This is not for you if…</h3>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-toko-magenta/20 text-toko-magenta-light">
                    <Cross className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-white/80">You want a certificate to frame.</span>
                </li>
              </ul>
              <p className="mt-6 border-t border-white/10 pt-6 text-white/60">
                We&apos;re not handing out paper. You leave with something better: a live app, a domain, and a way to get paid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OFFER / PRICING ================= */}
      <section id="register" className="section-padding bg-white">
        <div className="section-container">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-toko-gray-900 text-white shadow-toko-lg">
            <div className="relative">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,179,66,0.25),transparent_45%),radial-gradient(circle_at_90%_90%,rgba(33,150,243,0.2),transparent_45%)]" />
              <div className="relative grid gap-8 p-8 sm:p-12 md:grid-cols-[1.1fr_1fr] md:items-center">
                <div>
                  {active ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-toko-yellow/15 px-4 py-1.5 text-sm font-bold text-toko-yellow-light ring-1 ring-inset ring-toko-yellow/30">
                      ⚡ Flash rate · {FLASH_WINDOW_HOURS} hours only
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-white/80 ring-1 ring-inset ring-white/15">
                      Limited to {SEATS} seats
                    </span>
                  )}

                  <div className="mt-5 flex items-end gap-3">
                    <span className="font-heading text-6xl font-extrabold leading-none">{price}</span>
                    {active && <span className="mb-1 text-xl font-semibold text-white/40 line-through">{PRICE_FULL}</span>}
                  </div>

                  {active ? (
                    <>
                      <p className="mt-3 text-white/70">
                        Save {PRICE_SAVINGS} today. Your price returns to {PRICE_FULL} when the timer
                        hits zero — {SEATS} seats, a real cap.
                      </p>
                      <div className="mt-6 flex items-center gap-2.5">
                        <TimeSeg v={time.h} label="hrs" />
                        <span className="pb-5 text-2xl font-bold text-white/30">:</span>
                        <TimeSeg v={time.m} label="min" />
                        <span className="pb-5 text-2xl font-bold text-white/30">:</span>
                        <TimeSeg v={time.s} label="sec" />
                      </div>
                    </>
                  ) : (
                    <p className="mt-3 text-white/70">
                      {SEATS} seats total — a real cap, not a marketing one. When they&apos;re gone, they&apos;re gone.
                    </p>
                  )}

                  <dl className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 flex-none text-toko-green-light" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21s-7-4.35-7-10a7 7 0 1114 0c0 5.65-7 10-7 10z" strokeWidth="2" strokeLinejoin="round" /><circle cx="12" cy="11" r="2.5" strokeWidth="2" /></svg>
                      <dd className="text-white/85">Toko Academy, Jimeta-Yola</dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 flex-none text-toko-green-light" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2" strokeWidth="2" /><path d="M16 3v4M8 3v4M3 10h18" strokeWidth="2" strokeLinecap="round" /></svg>
                      <dd className="text-white/85">2 full days · idea to live app</dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 flex-none text-toko-green-light" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="7" r="4" strokeWidth="2" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13A4 4 0 0116 11" strokeWidth="2" strokeLinecap="round" /></svg>
                      <dd className="text-white/85">Small room. {SEATS} seats. Everyone ships.</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-inset ring-white/10">
                  <p className="text-center text-sm text-white/70">Pay to hold your seat</p>
                  <button
                    type="button"
                    onClick={openEnrol}
                    className="group mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-toko-green px-6 py-4 text-lg font-bold text-white shadow-toko-lg transition-all duration-300 hover:bg-toko-green-dark hover:shadow-[0_10px_40px_rgba(124,179,66,0.45)] focus:outline-none focus:ring-4 focus:ring-toko-green/50"
                  >
                    Pay {price} — hold my seat
                    {arrow}
                  </button>
                  {active && (
                    <p className="mt-3 text-center text-xs font-semibold text-toko-yellow-light">
                      <span className="tabular-nums">{time.h}:{time.m}:{time.s}</span> left at {PRICE_FLASH}
                    </p>
                  )}
                  <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-white/55">
                    <svg className="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="10" width="16" height="11" rx="2" strokeWidth="2" /><path d="M8 10V7a4 4 0 118 0v3" strokeWidth="2" strokeLinecap="round" /></svg>
                    Secured by Paystack. Your seat is confirmed the moment you pay.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOUNDER NOTE ================= */}
      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="mx-auto grid max-w-5xl gap-10 rounded-3xl bg-white p-8 shadow-toko ring-1 ring-toko-gray-100 sm:p-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div className="relative mx-auto w-full max-w-xs">
              <div className="overflow-hidden rounded-2xl ring-1 ring-toko-gray-200">
                <div className="relative aspect-[4/5]">
                  <Image src={NOTE_IMG} alt="Daniel Ishaku with a Toko Academy cohort" fill sizes="(max-width: 768px) 80vw, 30vw" className="object-cover object-center" />
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-toko-green px-4 py-1.5 text-sm font-bold text-white shadow-toko">
                Your instructor
              </div>
            </div>

            <div>
              <svg className="h-8 w-8 text-toko-green/30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 7L8 11h3v6H5v-6l2-4h3zm9 0l-2 4h3v6h-6v-6l2-4h3z" /></svg>
              <p className="mt-4 text-lg leading-relaxed text-toko-gray-700">
                The gap between &ldquo;I have an idea&rdquo; and &ldquo;people are using my thing&rdquo; used to take months and money most people don&apos;t have. It doesn&apos;t anymore. In one weekend I&apos;ll walk you across it — and you&apos;ll walk out with a live app, a domain, and the confidence to charge for the next one.
              </p>
              <p className="mt-4 text-lg font-semibold leading-relaxed text-toko-gray-900">
                {SEATS} people get to be in the room. If that&apos;s you, hold your seat while the {PRICE_FLASH} rate is still live.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div>
                  <p className="font-heading text-xl font-bold text-toko-gray-900">Daniel Ishaku</p>
                  <p className="text-toko-gray-500">Founder, Toko Academy</p>
                </div>
                <button type="button" onClick={openEnrol} className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-lg bg-toko-green px-6 py-3 font-bold text-white transition-colors duration-300 hover:bg-toko-green-dark">
                  Hold my seat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-toko-gray-900">Quick questions.</h2>
            <div className="mt-10 divide-y divide-toko-gray-200 border-y border-toko-gray-200">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-toko-gray-900 [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="flex-none text-toko-green transition-transform duration-300 group-open:rotate-45">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" /></svg>
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-toko-gray-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden bg-toko-gray-900 py-20 text-white md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,179,66,0.25),transparent_50%),radial-gradient(circle_at_50%_120%,rgba(33,150,243,0.2),transparent_50%)]" />
        <div className="section-container relative z-10 text-center">
          <h2 className="mx-auto max-w-3xl text-balance">{SEATS} seats. One weekend. A live app with your name on it.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            {active ? (
              <>
                Pay {PRICE_FLASH} if you register in the next{' '}
                <span className="font-bold tabular-nums text-toko-yellow-light">{time.h}:{time.m}:{time.s}</span> — then it&apos;s {PRICE_FULL}.
              </>
            ) : (
              <>Founding seats at {PRICE_FULL}. When the {SEATS} are gone, they&apos;re gone.</>
            )}
          </p>
          <button
            type="button"
            onClick={openEnrol}
            className="group mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-toko-green px-10 py-5 text-xl font-bold text-white shadow-toko-lg transition-all duration-300 hover:bg-toko-green-dark hover:shadow-[0_10px_40px_rgba(124,179,66,0.45)] focus:outline-none focus:ring-4 focus:ring-toko-green/50"
          >
            Pay {price} — hold my seat
            <svg className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <p className="mt-4 text-sm text-white/50">— Daniel Ishaku, Toko Academy · Jimeta-Yola</p>
        </div>
      </section>

      {/* ================= STICKY MOBILE CTA ================= */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-toko-gray-200 bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-none">
            <p className="text-lg font-extrabold leading-none text-toko-gray-900">{price}</p>
            <p className="text-xs text-toko-gray-500">
              {active ? (
                <span className="font-semibold text-toko-magenta">
                  <span className="tabular-nums">{time.h}:{time.m}:{time.s}</span> left
                </span>
              ) : (
                `${SEATS} seats only`
              )}
            </p>
          </div>
          <button type="button" onClick={openEnrol} className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-toko-green px-4 py-3 font-bold text-white">
            Hold my seat
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      <EnrolModal open={enrolOpen} onClose={() => setEnrolOpen(false)} price={price} />
    </>
  );
}

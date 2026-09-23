'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { EventPost } from '@/lib/wordpress';

/**
 * The events board.
 *
 * The hero here was a hand-built dark slab — three stacked radial gradients
 * over a `#0f172a → #1f2937` sweep, with white text on top. It looked
 * deliberate and was, but it is a second design system running beside the real
 * one: it cannot follow the theme, its greys are not our greys, and every
 * colour in it is a number nobody can find again. It is now the same tokened
 * hero the rest of the site uses.
 */

type EventsClientProps = {
  events: EventPost[];
};

export default function EventsClient({ events }: EventsClientProps) {
  const hasEvents = events.length > 0;

  const heroStats = useMemo(
    () => ({
      totalEvents: events.length,
    }),
    [events]
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-14 md:pt-40 md:pb-20">
        <div className="aurora" aria-hidden />

        <div className="section-container relative">
          <div className="max-w-3xl reveal">
            <p className="eyebrow">Published events</p>
            <h1 className="mt-3">Moments Built In Public</h1>
            <p className="prose-measure mt-5 text-lg text-ink-muted md:text-xl">
              A curated board of Toko Academy events with photo highlights and direct links to official event pages.
            </p>

            <p className="mt-7 inline-flex items-center rounded-full border border-line-strong px-4 py-2 text-sm font-semibold text-ink-muted">
              {heroStats.totalEvents} published events
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="section-container">
          {!hasEvents ? (
            <div className="card p-8 text-center sm:p-10">
              <h2>No events are live yet.</h2>
              <p className="mt-3 text-ink-muted">
                As soon as published events are available in WordPress, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 xl:grid-cols-3">
              {events.map((eventItem) => (
                /*
                 * The external links used to sit inside this Link. A link
                 * inside a link is invalid HTML and browsers unpick it in
                 * whatever way they please — which is why each one needed a
                 * `stopPropagation` to behave. They are now siblings of the
                 * card link, in the same visual box, so no nesting and no
                 * handler is required.
                 */
                <article key={eventItem.slug} id={eventItem.slug} className="card group flex flex-col overflow-hidden p-0 reveal">
                  <Link href={`/events/${eventItem.slug}`} className="block">
                    <div className="relative h-52 overflow-hidden sm:h-56">
                      <Image
                        src={eventItem.image}
                        alt={eventItem.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <span className="absolute left-4 top-4 inline-flex rounded-full border border-white/40 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                        Event
                      </span>
                    </div>

                    <div className="px-5 pb-5 pt-5 sm:px-6">
                      <p className="text-sm font-semibold text-toko-blue-dark dark:text-toko-blue-light">{eventItem.date}</p>
                      <h2 className="mt-2 transition-colors group-hover:text-brand">{eventItem.title}</h2>
                      <p className="mt-3 line-clamp-3 text-ink-muted">{eventItem.excerpt}</p>
                    </div>
                  </Link>

                  <div className="mt-auto px-5 pb-5 sm:px-6">
                    <div className="mb-4 h-px w-full bg-gradient-to-r from-toko-green/30 via-toko-blue/40 to-transparent" />
                    <div className="flex flex-wrap gap-2">
                      {eventItem.links.length > 0 ? (
                        eventItem.links.map((linkItem, linkIndex) => (
                          <a
                            key={`${eventItem.slug}-link-${linkIndex}`}
                            href={linkItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex max-w-full items-center rounded-full border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand"
                          >
                            <span className="truncate">{linkItem.label}</span>
                          </a>
                        ))
                      ) : (
                        <span className="rounded-full border border-dashed border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-subtle">
                          Event link coming soon
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

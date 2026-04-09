'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { EventPost } from '@/lib/wordpress';

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
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden pt-44 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(124,179,66,0.22),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(33,150,243,0.22),transparent_38%),linear-gradient(165deg,#0f172a_0%,#1f2937_45%,#111827_100%)]" />
        <div className="absolute -left-16 top-16 h-56 w-56 rounded-full border border-white/20 bg-white/10 blur-xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full border border-toko-yellow/40 bg-toko-yellow/20 blur-2xl" />

        <div className="section-container relative z-10">
          <p className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
            Published Events
          </p>
          <h1 className="mt-6 max-w-4xl text-white">Moments Built In Public</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85 md:text-xl">
            A curated board of Toko Academy events with photo highlights and direct links to official event pages.
          </p>

          <p className="mt-7 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
            {heroStats.totalEvents} published events
          </p>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-white via-toko-gray-50 to-white">
        <div className="section-container">
          {!hasEvents ? (
            <div className="rounded-2xl border border-toko-gray-200 bg-white p-10 text-center shadow-toko">
              <p className="text-2xl font-bold text-toko-gray-800">No events are live yet.</p>
              <p className="mt-2 text-toko-gray-600">As soon as published events are available in WordPress, they will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {events.map((eventItem) => (
                <Link
                  key={eventItem.slug}
                  href={`/events/${eventItem.slug}`}
                  id={eventItem.slug}
                  className="group relative overflow-hidden rounded-2xl border border-toko-gray-200 bg-white shadow-toko transition-all duration-300 hover:-translate-y-1 hover:shadow-toko-lg"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-toko-blue/20 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-toko-green/20 blur-2xl" />

                  <div className="relative block w-full">
                    <div className="relative h-56 overflow-hidden">
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

                    <div className="relative px-6 pb-6 pt-5">
                      <p className="text-sm font-semibold text-toko-blue">{eventItem.date}</p>
                      <h2 className="mt-2 text-2xl font-bold leading-tight text-toko-gray-900">{eventItem.title}</h2>
                      <p className="mt-3 line-clamp-3 text-toko-gray-600">{eventItem.excerpt}</p>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="mb-4 h-px w-full bg-gradient-to-r from-toko-green/20 via-toko-blue/40 to-transparent" />
                    <div className="flex flex-wrap gap-2">
                      {eventItem.links.length > 0 ? (
                        eventItem.links.map((linkItem, linkIndex) => (
                          <a
                            key={`${eventItem.slug}-link-${linkIndex}`}
                            href={linkItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex max-w-full items-center rounded-full border border-toko-gray-300 bg-white px-3 py-1 text-xs font-semibold text-toko-gray-700 transition-colors hover:border-toko-blue hover:text-toko-blue"
                          >
                            <span className="truncate">{linkItem.label}</span>
                          </a>
                        ))
                      ) : (
                        <span className="rounded-full border border-dashed border-toko-gray-300 px-3 py-1 text-xs font-semibold text-toko-gray-500">
                          Event link coming soon
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

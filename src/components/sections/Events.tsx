import Link from 'next/link';
import { fetchEventPosts, type EventPost } from '@/lib/wordpress';
import { count, stagger, text, type SectionProps } from './fields';
import Band, { Intro, toneOf } from './tone';

/**
 * Events from the newsroom.
 *
 * Wrapped for the same reason as the news band: a WordPress outage should cost
 * this page its events strip and nothing else. `fetchEventPosts` already falls
 * back to the static events on its own, so reaching this catch means something
 * more fundamental went wrong than WordPress being slow.
 */
async function eventsOrNothing(limit: number): Promise<EventPost[]> {
  try {
    return (await fetchEventPosts(limit)).slice(0, limit);
  } catch (error) {
    console.warn('Events section: the events feed was unreachable, leaving the band out.', error);
    return [];
  }
}

const readableDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default async function Events({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const limit = count(data, 'limit', 3);
  const events = await eventsOrNothing(limit);

  if (events.length === 0) return null;

  return (
    <Band tone={tone} first={first}>
      <Intro
        tone={tone}
        eyebrow={text(data, 'eyebrow')}
        heading={text(data, 'heading')}
        className="reveal"
        action={
          <Link href="/events" className="link-hover inline-flex items-center gap-1.5 font-semibold text-brand">
            All events
            <span aria-hidden>&rarr;</span>
          </Link>
        }
      />

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {events.map((event, index) => (
          <Link
            key={event.slug}
            href={`/events/${event.slug}`}
            className={`card reveal ${stagger(index)} group flex gap-4 p-5`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.image}
              alt={event.imageAlt || ''}
              className="h-20 w-20 shrink-0 rounded-xl object-cover"
              loading="lazy"
              decoding="async"
              width={160}
              height={160}
            />
            {/* `min-w-0` is what stops a long title pushing this card wider
                than a 360px screen instead of wrapping inside it. */}
            <div className="min-w-0">
              {readableDate(event.date) && <p className="text-xs text-ink-muted">{readableDate(event.date)}</p>}
              <h3 className="mt-1 transition-colors group-hover:text-brand">{event.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{event.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </Band>
  );
}

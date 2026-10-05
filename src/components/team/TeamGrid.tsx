import Link from 'next/link';
import { hasProfilePage, type TeamMember } from '@/lib/managed';
import Portrait from './Portrait';
import SocialIcon from './SocialIcon';

/** Static class strings: Tailwind reads the source, not the running page. */
const DELAYS = [
  '',
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
  'reveal-delay-4',
  'reveal-delay-5',
] as const;

const stagger = (index: number) => DELAYS[Math.min(index, DELAYS.length - 1)];

/**
 * One band of the team page.
 *
 * `prominent` is for the leadership band: the same card at three to a row
 * rather than four, which is the whole of the difference. Giving the first band
 * a different card shape would make the page read as two designs; giving it
 * more room makes it read as the top of one.
 *
 * A card links to a profile page only when there is a profile to link to —
 * `hasProfilePage` decides that here and in `generateStaticParams`, so the link
 * and the page it points at cannot disagree. A name and a title is a perfectly
 * good card; it is not a page, and a link to a page containing nothing is a
 * worse outcome than no link.
 */
export default function TeamGrid({
  members,
  prominent = false,
  priority = false,
}: {
  members: TeamMember[];
  prominent?: boolean;
  /** True for the first band on the page, whose portraits should not be lazy. */
  priority?: boolean;
}) {
  if (members.length === 0) return null;

  const columns = prominent
    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid gap-6 sm:gap-7 ${columns}`}>
      {members.map((member, index) => {
        const linked = hasProfilePage(member);

        const inner = (
          <>
            <Portrait
              name={member.name}
              photo={member.photo}
              priority={priority && index < 3}
              sizes={
                prominent
                  ? '(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 360px'
                  : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px'
              }
            />

            <div className="mt-4">
              <h3 className="text-base leading-snug transition-colors group-hover:text-brand sm:text-lg">
                {member.name}
              </h3>
              {member.role && (
                <p className="mt-1 text-sm font-medium text-brand">{member.role}</p>
              )}
              {member.headline && (
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{member.headline}</p>
              )}

              {/*
                The icons are shown on the card but are not links on it — the
                card is already one tap target, and nesting an anchor inside an
                anchor is invalid HTML that browsers resolve by guessing. The
                profile page carries the real links. On a card that is not
                linked there is nowhere to put them, so they are left off
                rather than drawn as decoration.
              */}
              {linked && member.links.length > 0 && (
                <span className="mt-3 flex items-center gap-2 text-ink-subtle" aria-hidden>
                  {member.links.map((link) => (
                    <SocialIcon key={link.kind} kind={link.kind} className="h-4 w-4" />
                  ))}
                </span>
              )}
            </div>
          </>
        );

        const shell = `reveal ${stagger(index)} group`;

        return linked ? (
          <Link key={member.slug} href={`/team/${member.slug}`} className={shell}>
            {inner}
          </Link>
        ) : (
          <article key={member.slug} className={shell}>
            {inner}
          </article>
        );
      })}
    </div>
  );
}

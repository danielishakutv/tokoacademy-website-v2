import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Portrait from '@/components/team/Portrait';
import SocialIcon from '@/components/team/SocialIcon';
import { paragraphs } from '@/components/sections/fields';
import { hasProfilePage, managedTeam, managedTeamMember, type TeamMember } from '@/lib/managed';
import { ORG_ID, SITE_NAME, canonical, jsonLdScript, pageMetadata } from '@/lib/seo';

/**
 * One person's page.
 *
 * Built only for the people who have something on it. `hasProfilePage` is the
 * same test the grid uses to decide whether to link a card, so a card that
 * links always has somewhere to land and a card that does not is not hiding a
 * page somebody could still reach — the two cannot drift, because there is one
 * function and both call it.
 *
 * That matters beyond tidiness. A page carrying a name and a job title and
 * nothing else is a thin page: it tells a visitor nothing they did not see on
 * the grid, and a site full of them is a site a search engine thinks less of.
 * The honest answer to "there is nothing to say yet" is no page, not an empty
 * one.
 */

/**
 * The empty-list trap, which `/p/[slug]` hit first.
 *
 * Next 14 reads a dynamic route's `generateStaticParams` and, under
 * `output: export`, treats an **empty** result as a missing function: it throws
 * "Page /team/[slug] is missing generateStaticParams()" and the whole site stops
 * building. That is exactly the state this repository is in today — nobody has
 * been added to the team page yet — and the state it falls back to whenever
 * ta_admin is unreachable. As written without this, an unrelated admin server
 * restarting would turn into a site that cannot deploy, which is the one thing
 * `lib/managed.ts` exists to prevent.
 *
 * Measured, not reasoned about: with the feed unreachable and the fetch cache
 * cleared, the build failed with that error before this was added.
 *
 * `revalidate = 0` moves the check out of the way and is the wrong cure — it
 * marks the route dynamic, and a dynamic route under `output: export` is listed
 * in the build table and then never written to disk, so the real profiles
 * silently would not ship. So the empty case returns one placeholder slug
 * instead, exactly as the composed-pages route does. It costs a single tiny
 * HTML file that nothing links to, and keeps both promises at once.
 */
const PLACEHOLDER_SLUG = 'index';

/** One safe path segment. Anything else cannot become a directory on disk. */
const SAFE_SLUG = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export async function generateStaticParams() {
  const team = await managedTeam();
  const seen = new Set<string>();

  const params = team
    .filter(hasProfilePage)
    .filter((member) => SAFE_SLUG.test(member.slug))
    .filter((member) => {
      // Two people answering to one slug would write the same `index.html`
      // twice and fail the export. ta_admin keeps the column unique, so this
      // is belt and braces — but the cost of being wrong is the whole site
      // not deploying.
      if (seen.has(member.slug)) return false;
      seen.add(member.slug);
      return true;
    })
    .map((member) => ({ slug: member.slug }));

  return params.length ? params : [{ slug: PLACEHOLDER_SLUG }];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const member = await managedTeamMember(params.slug);

  if (!member) {
    return pageMetadata({
      path: '/team',
      title: 'Our Team',
      description: 'The trainers, staff and board behind Toko Academy.',
    });
  }

  /*
   * The description is what a search result will print, so it is built from
   * what the admin actually holds rather than from a template with the gaps
   * filled by "undefined". The headline is a sentence somebody wrote for this
   * purpose; the opening of the biography is the next best thing; the title
   * alone is the floor.
   */
  const summary =
    member.headline ||
    paragraphs(member.bio)[0]?.slice(0, 180) ||
    [member.role, `at ${SITE_NAME}`].filter(Boolean).join(' ');

  return pageMetadata({
    path: `/team/${member.slug}`,
    title: `${member.name}${member.role ? ` — ${member.role}` : ''}`,
    description: summary,
    socialTitle: `${member.name} | ${SITE_NAME}`,
    socialDescription: summary,
    // Only when there is a photograph. A portrait is the right card image for a
    // person; the site's default card is a better one than a grid of initials.
    ...(member.photo
      ? {
          image: {
            url: member.photo.url,
            alt: `${member.name}, ${SITE_NAME}`,
            ...(member.photo.width ? { width: member.photo.width } : {}),
            ...(member.photo.height ? { height: member.photo.height } : {}),
          },
        }
      : {}),
  });
}

/**
 * The person, for a search engine.
 *
 * `worksFor` points at the one Organization declared in the root layout by id
 * rather than restating it, so a crawler reconciles one entity instead of
 * several. Only fields that are visibly on the page are asserted — an email
 * that is not printed here is not claimed here either.
 */
function personJsonLd(member: TeamMember) {
  const url = canonical(`/team/${member.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${url}#person`,
    name: member.name,
    url,
    ...(member.role ? { jobTitle: member.role } : {}),
    ...(member.headline || member.bio ? { description: member.headline || paragraphs(member.bio)[0] } : {}),
    ...(member.photo ? { image: member.photo.url } : {}),
    ...(member.email ? { email: member.email } : {}),
    ...(member.phone ? { telephone: member.phone } : {}),
    ...(member.links.length > 0 ? { sameAs: member.links.map((link) => link.href) } : {}),
    worksFor: { '@id': ORG_ID },
  };
}

export default async function TeamMemberPage({ params }: { params: { slug: string } }) {
  const member = await managedTeamMember(params.slug);

  // Unpublished, removed, or never existed — all the same answer. A profile
  // taken down should stop resolving, not linger as a page nobody links to.
  if (!member || !hasProfilePage(member)) notFound();

  const bio = paragraphs(member.bio);

  return (
    <>
      <script {...jsonLdScript(personJsonLd(member))} />

      <article className="section-padding bg-surface pt-32 md:pt-44">
        <div className="section-container">
          <Link
            href="/team"
            className="eyebrow inline-flex items-center gap-1.5 text-brand transition-transform duration-200 hover:-translate-x-0.5"
          >
            <span aria-hidden>&larr;</span> Our team
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-16">
            <div className="reveal">
              <Portrait
                name={member.name}
                photo={member.photo}
                priority
                sizes="(max-width: 1024px) 60vw, 352px"
              />

              {(member.email || member.phone || member.links.length > 0) && (
                <div className="mt-6 border-t border-line pt-6">
                  {/*
                    A real heading, not a styled line: this is a section of the
                    page, and somebody moving through it with a screen reader
                    should be able to jump to it.
                  */}
                  <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                    Get in touch
                  </h2>

                  <div className="mt-3 space-y-2 text-sm">
                    {member.email && (
                      <p>
                        <a href={`mailto:${member.email}`} className="link-hover break-all text-ink-muted">
                          {member.email}
                        </a>
                      </p>
                    )}
                    {member.phone && (
                      <p>
                        <a href={`tel:${member.phone.replace(/\s+/g, '')}`} className="link-hover text-ink-muted">
                          {member.phone}
                        </a>
                      </p>
                    )}
                  </div>

                  {member.links.length > 0 && (
                    <ul className="mt-4 flex flex-wrap items-center gap-3">
                      {member.links.map((link) => (
                        <li key={link.kind}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer me"
                            // The label is the accessible name; the glyph is
                            // decorative. An icon row where every item is
                            // announced as "link" helps nobody.
                            aria-label={`${member.name} on ${link.label}`}
                            className="grid size-10 place-items-center rounded-xl border border-line text-ink-muted transition-colors hover:border-brand hover:text-brand"
                          >
                            <SocialIcon kind={link.kind} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="reveal reveal-delay-1">
              <h1>{member.name}</h1>
              {member.role && <p className="mt-3 text-lg font-semibold text-brand">{member.role}</p>}
              {member.headline && (
                <p className="prose-measure mt-4 text-lg text-ink-muted">{member.headline}</p>
              )}

              {bio.length > 0 && (
                <div className="prose-measure mt-8 space-y-4 text-ink-muted">
                  {bio.map((block, index) => (
                    // whitespace-pre-line so a single newline inside a
                    // paragraph stays where it was written.
                    <p key={index} className="whitespace-pre-line">
                      {block}
                    </p>
                  ))}
                </div>
              )}

              <div className="mt-10 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row">
                <Link href="/courses" className="btn-primary">
                  See what we teach
                </Link>
                <Link href="/team" className="btn-secondary">
                  The rest of the team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

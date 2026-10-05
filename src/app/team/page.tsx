import type { Metadata } from 'next';
import Link from 'next/link';
import TeamGrid from '@/components/team/TeamGrid';
import { TEAM_GROUPS, managedTeam, teamIn, type TeamGroup } from '@/lib/managed';
import { SITE_URL, jsonLdScript, pageEntityJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/team',
  title: 'Our Team — The People Who Teach Here',
  description:
    'The trainers, staff and board behind Toko Academy in Jimeta-Yola, Adamawa State — who they are, what they teach, and how to reach them.',
  socialTitle: 'The Toko Academy Team',
  socialDescription:
    'Meet the trainers, staff and board behind Toko Academy — the people who teach, run and govern the academy.',
  image: {
    url: `${SITE_URL}/images/hero/practical-mentorship-approach-classes.jpg`,
    alt: 'A Toko Academy trainer working through a problem with learners at their laptops',
  },
});

const entityJsonLd = pageEntityJsonLd({
  path: '/team',
  name: 'The Toko Academy Team',
  description:
    'The trainers, staff, board and advisors of Toko Academy, a digital skills training academy in Jimeta-Yola, Adamawa State, Nigeria.',
  type: 'CollectionPage',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Our team', path: '/team' },
  ],
});

/**
 * What each band is called on the page.
 *
 * Grouping is the one structural choice the admin makes about this page, so the
 * names are fixed here rather than sent across: a heading typed in an admin
 * screen is a heading nobody is checking the capitalisation of, and these five
 * are the only bands the page knows how to draw.
 */
const GROUP_LABEL: Record<TeamGroup, string> = {
  leadership: 'Leadership',
  team: 'The team',
  trainers: 'Trainers and facilitators',
  board: 'Board',
  advisors: 'Advisors',
};

/** A line under a heading, where the band genuinely needs explaining. */
const GROUP_BLURB: Partial<Record<TeamGroup, string>> = {
  trainers: 'The people in the room with you.',
  board: 'Directors and trustees, who govern the academy without running it day to day.',
  advisors: 'People who advise us without being staff or board.',
};

/**
 * Who works here, from the one place it is maintained.
 *
 * The page is built from the team list in ta_admin, which means adding
 * somebody, replacing a photograph or rewriting a biography is a change made
 * in an admin screen and published — not a commit. That is the whole reason
 * this page exists at all: a team page written into the source code is a team
 * page that goes stale within a term and stays that way, because changing it
 * costs a developer.
 *
 * Everything runs at BUILD time. The site is a static export, so a change in
 * the admin appears here on the next publish.
 */
export default async function TeamPage() {
  const team = await managedTeam();

  // The bands that actually have somebody in them. An empty heading would
  // describe a part of the page that does not exist.
  const bands = TEAM_GROUPS.map((group) => ({ group, members: teamIn(team, group) })).filter(
    (band) => band.members.length > 0,
  );

  /*
   * With one band, its heading is noise: the page is already titled "Our team"
   * and a second heading saying "The team" above the only grid tells a reader
   * nothing. Named rather than inlined because the condition is the reason, and
   * the reason is not obvious from `bands.length > 1`.
   */
  const headingsAreUseful = bands.length > 1;

  return (
    <>
      <script {...jsonLdScript(entityJsonLd)} />

      <section className="relative overflow-hidden bg-surface-sunken pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative z-10">
          <div className="max-w-3xl reveal">
            <p className="eyebrow">Our team</p>
            <h1 className="mt-4">The people who teach here.</h1>
            <p className="prose-measure mt-6 text-lg text-ink-muted">
              Training is done by people, not by a syllabus. These are the ones who run the academy,
              stand at the front of the rooms and govern what we do — and the ones you will actually
              meet if you come and study with us.
            </p>
          </div>
        </div>
      </section>

      {bands.length === 0 ? (
        /*
         * Nobody has been published yet, or ta_admin was unreachable when this
         * built. Either way the honest page says so in a sentence and sends the
         * reader somewhere useful.
         *
         * The alternative — an empty grid under a heading — looks like the site
         * is broken, and a page that apologises at length for having no content
         * is worse than one that does not exist. This is two sentences and two
         * links. `/team` is also left out of the sitemap while it is in this
         * state, so nothing is submitting a thin page to a search engine.
         */
        <section className="section-padding bg-surface">
          <div className="section-container">
            <div className="prose-measure reveal">
              <h2>We are putting this page together.</h2>
              <p className="mt-4 text-ink-muted">
                Profiles for our trainers and staff are being written and photographed. In the
                meantime, the story of how the academy started and what it has done is on the about
                page, and anything you want to ask a person directly can go through the contact page —
                it reaches a real one.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/about" className="btn-primary">
                  About the academy
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Talk to us
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        bands.map((band, index) => (
          <section
            key={band.group}
            className={`section-padding ${index % 2 === 0 ? 'bg-surface' : 'bg-surface-sunken'}`}
          >
            <div className="section-container">
              {headingsAreUseful && (
                <div className="reveal max-w-2xl">
                  <h2>{GROUP_LABEL[band.group]}</h2>
                  {GROUP_BLURB[band.group] && (
                    <p className="mt-3 text-ink-muted">{GROUP_BLURB[band.group]}</p>
                  )}
                </div>
              )}

              <div className={headingsAreUseful ? 'mt-10' : ''}>
                <TeamGrid
                  members={band.members}
                  prominent={band.group === 'leadership'}
                  priority={index === 0}
                />
              </div>
            </div>
          </section>
        ))
      )}

      {bands.length > 0 && (
        <section className="section-padding bg-brand text-brand-ink">
          <div className="section-container">
            <div className="reveal max-w-2xl">
              <h2 className="text-brand-ink">Want to teach with us?</h2>
              <p className="mt-4 text-brand-ink/85">
                We take on trainers and facilitators who can teach what they have actually done. If
                that is you, tell us what you would teach and we will reply.
              </p>
              <div className="mt-8">
                <Link href="/contact" className="btn-secondary">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

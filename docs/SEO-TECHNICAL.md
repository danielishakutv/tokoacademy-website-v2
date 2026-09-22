# Technical SEO and AI discoverability

What was changed, why, and what is left for the owner to do outside this
repository.

Lighthouse already scored SEO 100 before any of this. Lighthouse checks that a
page *has* a title, a description, a valid `robots.txt` and crawlable links — it
does not check whether any of them are any good, whether the site describes a
coherent entity, or whether the sitemap tells the truth. Everything below is in
that gap.

---

## 1. One organisation, declared once

**New: `src/lib/seo.ts`.** Canonical URL construction, a metadata builder, and
the site's structured data, all in one place and all built from
`src/data/config.ts` so the phone numbers, e-mail, address and social profiles in
our markup are the same ones on the contact page.

**Added to `src/app/layout.tsx`:** an `EducationalOrganization` + `WebSite` graph
on every page. `EducationalOrganization` rather than plain `Organization`
because the body's purpose is teaching, which is what the type means. It carries
name, URL, slogan, description, logo, e-mail, the postal address broken into its
schema fields, a `ContactPoint` per published phone number, `areaServed`,
`knowsAbout`, and `sameAs` for the four social profiles in config (all four were
checked and resolve).

Before this change the site had **no organisation-level structured data at all**.
The only `Organization` markup anywhere lived on `/home-v1-original` — an
abandoned, `noindex` homepage draft — and on `/partners`, where it declared the
organisation's `url` to be `https://tokoacademy.org/partners`. That second one
was actively wrong: it told a crawler that Toko Academy, the entity, lives at the
partnerships page, competing with the real thing. It has been replaced with a
`WebPage` node that points back at the canonical organisation by `@id`.

### No `SearchAction`

`WebSite` is declared **without** `potentialAction`. The site has no search page
— confirmed, there is no `/search` route and nothing links to one. Declaring a
search endpoint that does not exist gets tried, fails, and is discounted. If a
search page is ever built, add it in `websiteJsonLd` in `src/lib/seo.ts`.

### What is deliberately *not* in the structured data

The impact figures — 2,000+ learners, 75% career progression, 35+ partners. The
owner stands behind them from offline records and they remain in the page copy,
where they read as the academy's own reporting. Putting them into `aggregateRating`
or `numberOfStudents` restates them to a search engine as audited fact, which
they are not. `/impact` now carries a `WebPage` describing the page; the numbers
stay in the prose.

### A note on what schema is worth

Treat this as entity infrastructure for search — helping a crawler resolve
"Toko Academy" to one body with one address — and as the source of breadcrumb
display in results. It is **not** an AI-citation tactic: the available evidence
(an Ahrefs study of 1,885 pages, May 2026) found no measurable lift in AI
citations from schema markup. It is correct and cheap, so it is worth having.
Do not build a strategy on it.

---

## 2. Canonicals now point at the page, not at a redirect

`next.config.js` sets `trailingSlash: true`, so the served address of every page
ends in a slash and the live site 301s `/about` to `/about/`. Every canonical
tag, every `og:url` and every sitemap entry previously omitted that slash — so
every one of them pointed at a redirect rather than at the page.

All of them now come from `canonical()` in `src/lib/seo.ts` and cannot drift
apart again.

---

## 3. Page metadata

Every owned page now goes through `pageMetadata()`, which guarantees a canonical,
Open Graph and a Twitter card that all agree with each other and reference a real
image. Measured from the built HTML:

| Page | Title (rendered, incl. `| Toko Academy`) | Description |
|---|---|---|
| `/about` | 55 | 147 |
| `/impact` | 60 | 155 |
| `/corporate` | 55 | 150 |
| `/partners` | 55 | 153 |
| `/thematic-areas` | 60 | 155 |
| `/kids` | 58 | 150 |

Specific fixes:

- **`/corporate` and `/kids` had no canonical tag and no Twitter card at all.**
- **`/kids` title** ran to 70 characters *before* the template appended the site
  name, so Google truncated it mid-phrase. Now 58 rendered.
- **`/impact` description** said "from 2023 to 2026". A meta description outlives
  the cohort it was written about; the dates are gone.
- **`/impact` and `/thematic-areas`** had Open Graph blocks with no image, so
  shares fell back to a bare link. Both now use a real photograph from
  `public/images/hero/`.
- No page title repeats "Toko Academy" — the root layout's `template` appends it.
  This was checked in the built HTML, not assumed.
- The root layout's own `default` title was shortened from 76 characters to 52.

---

## 4. Sitemap (`src/app/sitemap.ts`)

Emitted **58 URLs**, up from 45, and every one of them is now the address the
server actually serves.

- **Added:** `/impact`, `/thematic-areas` (both real, linked, and previously
  absent entirely), the 12 course detail pages, and the policy pages
  (`/safeguarding`, `/privacy`, `/terms` — low priority, but a safeguarding
  policy is a genuine trust signal for a body that teaches children).
- **Course pages** come from `getCourses()` in `src/lib/dlc.ts`, the same call the
  catalogue makes. Only canonical slugs: the build also generates 19 legacy and
  misspelt aliases so old links keep working, and listing those would be
  submitting known duplicates.
- **`lastModified`** was `new Date()` on every entry, so every page claimed to
  have changed at the moment of every deploy — which teaches a crawler to ignore
  the field. Static pages now share one build timestamp; news, gallery and event
  entries carry their own published date from WordPress.
- **Confirmed absent:** `/home-v1-original` and `/home-v2-hybrid` (both `noindex`
  — listing a `noindex` page in a sitemap is a direct contradiction that Search
  Console flags), and `/profile`, which no longer exists in the app and returns
  404 in production.

---

## 5. `robots.ts`

It was not blocking any AI crawler, so nothing had to be removed — but it now
allows the major ones **explicitly and by name** (GPTBot, OAI-SearchBot,
ClaudeBot, PerplexityBot, Google-Extended, CCBot, Amazonbot and others), so that
a future "let's block the scrapers" edit has to consciously delete that list
rather than happen by accident through a copied template. This is the lever that
actually governs AI visibility.

Also changed:

- **`public/robots.txt` has been retired.** It was a second, conflicting
  `robots.txt` — a static file in `public/` competing with the generated route.
  Worse, it carried `Disallow: /_next/`, which stops Googlebot fetching the
  site's own JavaScript and CSS and makes it render the page without them. The
  generated route was winning, so the block was not live, but it was one
  build-order change away from being. The old file is preserved at the repo root
  as `robots.txt.superseded-by-app-robots-ts.bak.2026-09-22`.
- **The abandoned drafts are not disallowed**, deliberately. They are `noindex`,
  and a crawler has to be allowed to fetch a page in order to see that it says
  `noindex`. Disallowing them would freeze them in the index instead of removing
  them. Keeping them out of the sitemap is the correct lever, and that is done.

---

## 6. `llms.txt` and `llms-full.txt`

New: `public/llms.txt` (concise) and `public/llms-full.txt` (extended). Both are
factual Markdown summaries — what the academy is, who it serves, where it
operates, how it teaches, and a curated list of URLs with one-line descriptions.
The course list was built from the live catalogue at
`https://learn.tokoacademy.org/api/public/courses`, and the partner list from
`src/data/partners.ts`, so both match what the site actually says.

**Set expectations honestly.** `llms.txt` is an emerging convention, not a
standard. Google has stated that AI Overviews run off the core Search index and
ignore files of this kind, and no major assistant has committed to reading one.
It is cheap to publish, some tools may adopt it, and it is a genuinely useful
canonical summary to hand to anyone — but **crawlability, not this file, is what
decides whether Toko Academy gets cited.** Do not plan around it.

Both files avoid dates and prices, so they cannot go stale. Fees are published
per course page, and the files say so and point at the API.

---

## 7. Fonts — nothing to change

Checked and confirmed: **the site loads no web fonts at all.** There is no
Google Fonts stylesheet link, no `@import` in `globals.css`, and no `next/font`
usage. `tailwind.config.ts` defines both `sans` and `heading` as a system stack
(`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`).

There is therefore no render-blocking third-party font request to remove, and no
reason to introduce `next/font`. Left alone.

---

## 8. FAQ and breadcrumb markup

- **`FAQPage` on `/kids` only** — it is the only owned page with a visible FAQ
  section. The markup is generated from the *same* `faqs` array the page renders,
  so it cannot describe questions a visitor cannot read; remove a question from
  the page and it leaves the markup with it. No other owned page has FAQs, so no
  other page got FAQ markup.
- **`BreadcrumbList`** on `/about`, `/impact`, `/thematic-areas`, `/partners`,
  `/kids` and `/corporate`. Each trail mirrors the real navigation hierarchy in
  `src/data/config.ts`: Impact, Thematic Areas and Partners sit under **About**;
  Kids and Corporate sit under **Programs**, which resolves to `/courses`. These
  are routes a visitor genuinely uses, not a hierarchy invented for the markup.

---

## Owner's to-do list — things that cannot be done in code

1. **Google Search Console.** Verify `https://tokoacademy.org` if it is not
   already, then submit `https://tokoacademy.org/sitemap.xml`. Check the Pages
   report after a week or two for anything reported as "Crawled – currently not
   indexed". Confirm `/home-v1-original` and `/home-v2-hybrid` drop out of the
   index now that they are `noindex` and out of the sitemap; if they linger,
   request removal.
2. **Bing Webmaster Tools.** Verify the site and submit the same sitemap. This
   matters more than it used to — ChatGPT's browsing and search features lean on
   Bing's index, so Bing coverage is a real input to AI visibility in a way that
   `llms.txt` is not.
3. **Google Business Profile.** There is a real street address in Jimeta-Yola. A
   verified Business Profile is what makes the academy appear in map results and
   in "digital skills training near me", and it corroborates the `PostalAddress`
   now in the structured data. This is likely the single highest-value item on
   this list and it cannot be done from the codebase.
4. **Check the social profiles are live and branded.** The four URLs in
   `src/data/config.ts` are asserted as `sameAs` — they are the entity's
   identity. They all resolve, but confirm each is the real, active account with
   a matching name and logo. A `sameAs` pointing at a dormant or mismatched
   profile weakens the entity rather than strengthening it.
5. **Validate the markup once, from the live site**, after deploy — Google's Rich
   Results Test and the Schema.org validator, on the homepage, `/kids` (for the
   FAQ) and `/about`. It parses correctly in the build output, but validating
   against what is actually served is the check that counts.
6. **`public/site.webmanifest` still has `"theme_color": "#7CB342"`**, the old
   brand green. The `<meta name="theme-color">` in the root layout has been
   updated to `#4A7C2A` to match `tailwind.config.ts`; the manifest was outside
   this task's file ownership and has been left for whoever owns branding assets.
   They should now agree.
7. **Decide what to do about `/zero2live` and `/courses/zero-to-live/`.** Both
   are real, linked pages and both describe the same workshop — a landing page
   and a catalogue entry. Both are in the sitemap because both genuinely exist.
   If they start competing with each other in search results, the fix is to
   canonicalise the catalogue entry to the landing page, which is a content
   decision and a change to `src/app/courses/[id]/`.
8. **`/home-v1-original` still carries its own `EducationalOrganization` JSON-LD**,
   which now duplicates the root one on a page that is `noindex`. Harmless, but
   if those drafts are ever deleted or un-noindexed, strip that block first.

---

## Files changed

- `src/lib/seo.ts` — **new.** Canonicals, metadata builder, organisation and page
  structured data.
- `src/app/layout.tsx` — organisation + website JSON-LD, shorter default title,
  `theme-color` realigned to the new brand green.
- `src/app/sitemap.ts` — rewritten.
- `src/app/robots.ts` — rewritten.
- `public/llms.txt`, `public/llms-full.txt` — **new.**
- `src/app/{about,impact,corporate,partners,thematic-areas,kids}/page.tsx` —
  metadata and structured data only; no copy or layout changes.
- `public/robots.txt` — retired to the repo root as
  `robots.txt.superseded-by-app-robots-ts.bak.2026-09-22`.

`npm run build` passes.

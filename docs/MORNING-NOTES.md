# The redesign — 23 September 2026

Everything below is live on tokoacademy.org.

The previous night's work (caching, SEO, security) is in
`NOTES-2026-09-23-speed-seo-security.md`.

---

## Where the site stands

| | Desktop | Mobile |
|---|---|---|
| Performance | **98** | **88** |
| Accessibility | **96** | **96** |
| Best practices | 93 | 93 |
| SEO | **100** | **100** |
| First paint | **0.9 s** | 1.9 s |
| Largest paint | **0.9 s** | 3.6 s |
| Layout shift | **0** | **0** |

Desktop is under a second. Mobile is measured on Lighthouse's simulated slow
4G with the processor deliberately slowed four times over — harsher than most
real phones on most real connections.

---

## The four things you reported

**Apply Now went to the old PHP form.** Fixed. It goes to your course
catalogue now, because "apply" means nothing until somebody has chosen what
they are applying for, and each course page carries the right action. It also
opened in a new tab, which for your own page just breaks the back button.

**The footer repeated the address.** Fixed — the address and both phone
numbers appeared twice, a few centimetres apart. Only the CAC registration
line remains at the bottom.

**The mobile menu did not open.** I drove a real browser at phone size and it
*did* open — your phone was almost certainly holding a cached copy from the
old service worker I replaced the night before. It has been rebuilt properly
anyway: a full-height drawer that slides in, dims the page, locks scrolling
the way iOS actually respects, closes on Escape or a tap outside, returns
focus where it came from, and restores your scroll position exactly. It now
also carries the phone numbers, email and social links — those lived in a bar
hidden on phones, so the one device most likely to want to tap a number
could not reach one.

**Headings dwarfed the body text.** You were right, and it was worse than it
looked: `h2` rendered at 48px against 16px text, and several pages had
invented their own sizes on top. There is now one fluid scale that grows with
the screen rather than jumping between sizes, and every hand-set heading size
has been stripped out. A heading sits about twice its paragraph, not three
times.

---

## The redesign

**Dark and light themes.** A toggle in the header, starting from your system
preference and remembering what you choose. The theme is set before the page
paints, so there is no flash of the wrong one. Twenty-seven files moved onto
colour tokens that flip, so this works on every page rather than on the few I
touched by hand.

**Pictures, everywhere.** This was the biggest complaint and it is the biggest
change. There are now **21 image slots**; 8 already show photographs you
had, and 13 show a labelled placeholder naming exactly what belongs there.

**A hero slider** with four propositions, each with its own photograph. It
pauses when you hover or focus it, has a real pause button, responds to arrow
keys, and stops entirely for anyone who has asked their device for less
motion. All four slides are in the page from the start, so there is no layout
shift and search engines see all of them.

**Movement, kept quiet.** Sections settle into place as you reach them —
fourteen pixels, not eighty. Colour washes behind some sections drift very
slightly with your pointer. There is a custom cursor: a dot that follows
exactly and a ring that lags behind, growing over anything you can click. All
of it disappears on touch screens and for reduced motion.

**One typeface**, self-hosted so there is no request to Google and nothing
that leaks your visitors to a third party.

**The story pages were rewritten**, not restyled. `/impact` was six metric
tiles and an eight-by-seven grid of dots; it now opens with "More than 2,000
people have trained here. This is how we count." and states plainly that the
figures are your own records, honestly kept, and not independently audited.
The old page put a "≥75%" target row directly beside a "75%" headline, which
invited the reader to read a target as a result. `/thematic-areas` became
eight chapters with photographs instead of eight identical cards.
`/about`, `/corporate`, `/kids` and `/partners` the same.

---

## Images: 1.3MB down to 185KB

Your hero photographs were 1,294KB and a phone was downloading all of them at
full size, because a static site does no image work for you. They are now
646KB as originals, and every photograph also has 480, 960 and 1600px WebP
copies generated beside it. A phone takes the 480 — **20KB instead of 228KB**
for the main hero.

Verified in a real browser rather than assumed: WebP is chosen every time, and
the homepage's hero imagery is 185KB against 1,294KB before.

Run **`npm run images`** after adding any photograph and it generates the
copies. Originals are never touched.

---

## Getting photographs in

Run **`npm run shots`**. It prints what is still needed, with the brief:

```
/images/contact/entrance.jpg
   what it shows : The entrance to Toko Academy on Bekaji Road, Jimeta-Yola
   how to shoot  : The front of the building with the signage visible, shot
                   in daylight from across the street. Landscape.
   used on       : src/app/contact/page.tsx
```

Drop a file at that path, run `npm run images`, and it appears on the next
build. No code changes, ever.

`docs/IMAGE-GUIDE.md` has the full brief — what to shoot, how to light it,
file sizes, and **a consent section you should read before photographing
children**. That is a safeguarding matter with legal weight under the Nigeria
Data Protection Act, not a formality.

The ten photographs to take first are listed at the end of that guide. They
cover the home page, About, Impact, Kids and Corporate — every page a
first-time visitor opens.

---

## Your WordPress question

**Don't build a Postgres CMS.** Full reasoning in
`docs/DECISION-wordpress-vs-custom-backend.md`.

A usable CMS is not a database table — it is drafts, media, revisions,
scheduling, roles and previews. Rebuilding that is a quarter of engineering to
arrive where you already are, plus a permanent maintenance bill, and your
people already know WordPress.

WordPress is not the problem. The problem is that a third category of content
— the home page copy, About, Impact — is typed into the code, so changing a
sentence needs a developer. That is the ta_admin editor you asked for a few
days ago: about a week, not a quarter.

---

## Two things still only you can do

Both in Cloudflare, and between them they are worth more than everything in
this repository.

**1. Browser Cache TTL is overriding the headers.** Cloudflare is now caching
your pages — that part started working. But it is rewriting the browser cache
to four hours, which means a visitor will not see a change for four hours
after you publish. Set **Caching → Configuration → Browser Cache TTL** to
**"Respect Existing Headers"**.

**2. Turn off Rocket Loader.** Speed → Optimization → Content Optimization.
It rewrites your scripts in transit and is a known cause of React breaking.
Your site already defers its own JavaScript, so it buys you nothing.

While you are there, confirm **SSL/TLS mode is Full (strict)**.

---

## Smaller things found on the way

- Headings on dark sections were rendering **black on black** — the base
  style beat the section's white. Two measured 1.00:1.
- Primary buttons in dark mode had **white labels on pale green** at 2.07:1.
  Now 8.94:1.
- Muted text was 3.90:1 against a 4.5:1 standard — it carries your dates,
  captions and section labels. Now 4.74:1.
- A photo lightbox **locked page scrolling and never released it**.
- Event cards had links inside links — invalid HTML, and the reason each
  needed a workaround to behave.
- `/schedules` wrote every class out twice, and its filter bar sat permanently
  hidden behind the fixed header.
- Articles with no picture fell back to a real photograph of a real class, so
  that one image appeared three times on the home page.

---

## Tools left behind

| Command | What it does |
|---|---|
| `npm run shots` | What still needs photographing, with briefs |
| `npm run images` | Generates responsive WebP copies |
| `npm run visual` | Screenshots every page in both themes at phone and desktop, and reports anything unreadable or overflowing |

`npm run visual` is the one worth knowing about. A redesign is the one change
a passing build cannot verify — everything can compile while the page is
unreadable. It found both contrast bugs above.

---

## Not done

**The MCP connectors** — letting the Claude app drive the DLC, ta_admin and
the website with your approval. Still mapped and designed, still not built.
Two nights running the website has been the priority you set. It is next.

# Overnight work — 23 September 2026

Everything below is live on tokoacademy.org unless it says otherwise.

---

## The headline

**Lighthouse performance went from 82 to 99 on desktop, 88 on mobile. SEO is
100. First paint dropped from 1.8 seconds to 0.4.**

| | Before | After |
|---|---|---|
| Performance (desktop) | 82 | **99** |
| Performance (mobile) | — | **88** |
| Accessibility | 96 | 96 |
| Best practices | 96 | 93 ¹ |
| SEO | 100 | **100** |
| First Contentful Paint | 1.8 s | **0.4 s** |
| Largest Contentful Paint | 1.8 s | **0.4 s** |
| Speed Index | 2.2 s | **0.9 s** |

¹ Best practices is held down by two errors Cloudflare causes, not us. See
**Two things only you can do** below — fixing the first one should take this to
100 as well.

---

## Two things only you can do (both in Cloudflare, both big)

I have no access to your Cloudflare dashboard. These are the two largest
remaining wins on the site and neither can be done from code.

### 1. Let Cloudflare cache your pages — this is the 1-second target

Your server produces a page in **2 milliseconds**. Through Cloudflare it takes
**560–930 milliseconds**. I measured both.

The reason: `cf-cache-status: DYNAMIC` on every page. Cloudflare's default
cache level does not store HTML, so every single visit — from Yola, from
anywhere — travels to the server in Germany and back. Nothing is served from
the edge.

I have already fixed the origin's side of this. Your pages were being sent
with `Cache-Control: no-store` and an expiry date of **1923**, left behind by a
WordPress caching plugin from before the site was rebuilt. Cloudflare was being
explicitly told never to cache. That is now corrected and Cloudflare is
permitted to cache — it just needs telling to.

**What to do:** Cloudflare dashboard → **Caching → Cache Rules** → Create rule.

- Name: `Cache HTML`
- When incoming requests match: `Hostname equals tokoacademy.org`
- Then: **Eligible for cache**
- Edge TTL: **Use cache-control header if present**, otherwise 1 hour
- Browser TTL: **Respect origin**

Expected effect for someone in the North East: roughly **600ms down to
30–50ms** on every page. This is the single biggest speed change available to
you, and it is bigger than everything I did in code combined.

### 2. Turn off Rocket Loader — it is breaking React on every page

Every page on your site logs two React errors. I traced them: they are not in
your code. Cloudflare is injecting `rocket-loader.min.js` and rewriting your
script tags in transit. I confirmed this by fetching the same page directly
from your own server, which contains none of it.

Rocket Loader is a known cause of React hydration failures, and it buys you
nothing here — the site already defers its own JavaScript. The practical
effect of the failure is that parts of each page are thrown away and rebuilt in
the browser, which wastes time on exactly the slow connections you are trying
to serve.

**What to do:** Cloudflare dashboard → **Speed → Optimization → Content
Optimization** → turn **Rocket Loader** off.

While you are there, confirm **SSL/TLS mode is Full (strict)**. If it is
Flexible, the Cloudflare-to-server leg is unencrypted.

---

## What changed on the website

### Speed

- **The caching disaster described above.** Every page was `no-store` with a
  1923 expiry date. Also: assets that should be cached for a year were being
  re-fetched every four hours, and a malformed `Expires` header was the only
  one having any effect, because `mod_expires` is not even loaded on that
  server. The Apache config now ships from the repository, so it is version
  controlled rather than living only on a server.
- **Icons were being fetched from a third party at runtime.** Every icon on the
  site called `api.iconify.design` from the browser before it could appear, and
  rendered an empty box until it answered. There are eleven icons. They are now
  drawn directly in the HTML — no JavaScript, no network request, no third
  party — and the library is gone from the project.
- **The logo was a 2,991-pixel-wide, 131KB image** displayed at 48 pixels tall,
  loaded from the old WordPress folder. It is now 20KB and lives in the repo.
- **Images now declare their size**, so the page stops jumping as they load.

### Truth

- The endless "flash sale" countdown and struck-through ₦50,000 on the
  zero2live page are gone. The code comment said outright that the price never
  reverts.
- "Only 25 seats" — nothing counted seats. Gone.
- "Spots left" on the schedules page came from `capacity: 25, enrolled: 18`
  typed into a file, identical for every course. Gone, and stripped from the
  page's data rather than merely hidden.
- Four testimonials from named graduates who do not appear to exist no longer
  render anywhere.
- The **"15% OFF TODAY"** badge on course pages, which was calculated in the
  browser and appeared every day of the year, is gone.
- Your impact figures (2,000+, 75%, 35+) are untouched, as you asked.

### Structure

- **Menu: seven top-level items to four** — About, Programs, Newsroom, Contact.
  Impact, Thematic Areas and Partners moved under About. "Press Releases" and
  "Toko in the News" were separate menu items pointing at a page that cannot
  filter, so all three landed in the same place; they are one Newsroom now.
- **The home page shows your work instead of linking to it.** The block that
  said "Follow Our Latest News and Events" contained two buttons and nothing
  else. It now carries your three latest articles and three events, with
  pictures and dates.
- **Course thumbnails.** Six courses had images hotlinked from other people's
  websites — Medium, a UK software firm, a US college. One was already broken.
  Those are cleared (values saved on the server first). Six courses now show
  your own uploads; the rest draw a clean branded tile until you add photos.

### Readability

Your brand green `#7CB342` gives **2.5:1** contrast with white text, against a
standard of 4.5:1. That was every primary button and every green figure on the
site. For people reading on cheap phones outdoors this is not a technicality.
The UI green is now `#4A7C2A` — the same green, deeper — at **4.99:1**. Your
logo is an image and keeps its original colour.

### Security

A full review is in `docs/SECURITY-REVIEW.md`. The serious findings:

- **Anyone who could publish in WordPress could run code on tokoacademy.org.**
  Article HTML went onto the page unfiltered. It is now sanitised when the site
  is built; I tested it against inline scripts, `onerror` handlers,
  `javascript:` links and hostile iframes.
- **A related flaw in text handling** meant an encoded `</script>` in a post
  title survived the safety step and was then turned back into real markup. The
  step meant to make it safe was what armed it.
- **Your GitHub token was printed into the WordPress settings page HTML.**
  `type="password"` hides it on screen, not in view-source. **You need to
  rotate that token** — see below.
- Security headers added, plus a Content Security Policy in report-only mode so
  it can be proved before it starts blocking anything.

### Findability

- Your organisation was **never described to search engines**. It is now, with
  your real contact details, and the entity pages reference it properly.
- Two robots files disagreed; one was blocking Google from your own JavaScript
  and CSS. Fixed.
- Sitemap went from 45 to 58 pages — your Impact and Thematic Areas pages were
  missing entirely, as were all the course pages.
- Canonical links all pointed at redirects. Fixed.
- AI crawlers are now allowed by name, and `llms.txt` is published.

### The DLC

The learning platform's browser tab showed ta_admin's icon. It now carries the
Toko Academy logo, same as the website, including the sizes a phone uses when
someone pins the site to their home screen.

---

## Also for you

1. **Rotate the GitHub token** used by the WordPress deploy plugin — it has
   been readable in that page's source. Create a new fine-grained token with
   **Actions: Read and write** only, save it in the plugin, press "Deploy now
   (test)", then **revoke the old one on GitHub**. Removing it from WordPress
   does not revoke it.
2. **Google Business Profile** for the Jimeta-Yola address. Probably the
   single highest-value marketing action available and it cannot be done from
   code — it drives map results and corroborates the address now in your
   structured data.
3. **Bing Webmaster Tools** — verify and submit the sitemap. This matters more
   than it used to: ChatGPT's search leans on Bing's index.
4. **Google Search Console** — submit the sitemap.
5. **Course photos.** Six courses draw a branded tile because their images were
   other people's property. Your gallery has real photographs of your own
   workshops — those would be better than any stock image. Tell me which photo
   suits which course and I will set them.

---

## Content strategy

`docs/CONTENT-STRATEGY.md` — about 15,000 words, researched rather than
guessed. The short version:

**Three territories to own**

1. **Digital skills in North-East Nigeria.** Nigerian tech content is almost
   entirely Lagos and Abuja. The research found your home market is not
   contested, it is *vacant* — a single Medium post currently ranks for
   "learn coding in Yola". You are physically there and a Code.org Global
   Partner for the region. This is a permanent advantage.
2. **Practical AI for Nigerian workplaces and institutions.** You have already
   trained NSCDC, NPF, FRSC, NMDPRA and NASSCO. Almost nobody in Nigeria can
   write about that first-hand.
3. **How Nigeria's digital-skills system actually works** — 3MTT, SIWES, NDE,
   Adamawa Digital Academy. Serves students and grant officers at the same
   time.

**The first six articles to write**

1. Digital Skills Training in Yola and Adamawa State: The Complete 2026 Guide
2. Every Free Digital Skills Programme in Nigeria in 2026 (And How to Get In)
3. What AI Training for a Nigerian Government Agency Actually Looks Like
4. How Much Does Tech Training Cost in Nigeria in 2026? A Transparent Breakdown
5. SIWES in a Tech Company: What Computer Science Students Actually Do
6. Is a Coding Bootcamp Worth It in Nigeria? An Honest Answer

The document contains 30 briefs in total, a keyword map, and — importantly — a
section listing **statistics not to publish** because they could not be traced
to a primary source, including one widely-circulated figure about computer use
in Adamawa.

One finding worth your attention: the document pushes back on standard "AI
SEO" advice with evidence. Google's own documentation says its AI answers run
off the normal search index and ignore `llms.txt`; a controlled study of 1,885
pages found adding schema produced no measurable lift in AI citations. What
does correlate is being mentioned by other people, publishing original data,
and recency. Your own outcome data is the asset nobody else has.

---

## Not done

**The MCP connectors** — letting the Claude app drive the DLC, ta_admin and the
website with your approval. I mapped exactly how each system can authenticate a
machine client and designed the tool surface, but did not build it; the website
work was what you asked to see this morning and it took the night. It is the
next thing I pick up.

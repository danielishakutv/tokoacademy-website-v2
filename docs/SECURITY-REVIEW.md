# Security review — tokoacademy.org

**Date:** 2026-09-22
**Scope:** the static marketing site (`output: 'export'`), its GitHub Actions deploy
pipeline, the WordPress "Deploy on Publish" plugin, and the third parties the live
site actually talks to.
**Method:** source and build-output inspection, `npm audit`, and read-only probes of
the live origin through Cloudflare.

Counts: **1 critical-adjacent chain, 5 high, 6 medium, 6 low.** Nine are fixed in
this change; the rest need either the site owner or a file outside this review's
scope. Nothing below is speculative padding — where I could not prove something
end to end, I say so.

---

## Summary of what changed in this review

| File | Change |
|---|---|
| `.github/workflows/deploy.yml` | `permissions: contents: read`; actions pinned to commit SHAs; `persist-credentials: false`; optional pinned `SSH_KNOWN_HOSTS`; pre-deploy build sanity check; `rsync --chmod=D755,F644`; `umask 077` around the key write |
| `wordpress-plugin/toko-deploy-on-publish/toko-deploy-on-publish.php` | Token no longer printed into the settings page; blank-save keeps the existing token; nonce-protected "Forget saved token"; `show_in_rest => false`; `workflow_dispatch` preferred over `repository_dispatch` with automatic fallback |
| `wordpress-plugin/README.md` | Token scope guidance corrected to `Actions: Read and write` |
| `package.json` / `package-lock.json` | `sharp` 0.33 → 0.35.4 (real, reachable vulnerability); `npm audit fix` for lockfile-only transitive fixes |
| `next.config.js` | **Unchanged** — see L6 for why |

`npm run build` passes: 84 pages generated, OG post-build step optimized 19/19 images.

The `rsync` still has **no `--delete`**, deliberately, and the warning comment above
it is intact.

---

## HIGH

### H1. The live site sends no security headers at all

**What it is.** `curl -sI https://tokoacademy.org/` returns no
`Content-Security-Policy`, no `Strict-Transport-Security`, no
`X-Content-Type-Options`, no `Referrer-Policy`, no `Permissions-Policy` and no
`X-Frame-Options`. The only headers present are Cloudflare's own and a
cache-control block.

**Why it matters.** These headers are the browser-side controls that limit the blast
radius of every other problem on this page. Without `nosniff`, a file served with the
wrong MIME type can be executed as script. Without `frame-ancestors`/`X-Frame-Options`
the site can be framed and clickjacked. Without HSTS, the first request a visitor
makes on a new network can be intercepted before the redirect to HTTPS happens.
Without a CSP, an injected script (see H2 and H3) can send data anywhere it likes.

**What was done.** Nothing in code — and this is deliberate. `output: 'export'` means
Next's `headers()` config is never applied, because there is no Next server in
production. The headers have to come from Apache or Cloudflare. Ownership of the
`.htaccess` moved to the coordinator mid-review, so this document carries the
**exact header specification** instead: see *Appendix A*.

**What the owner must do.** Deploy the Appendix A block, starting with CSP in
**Report-Only** mode, and walk the site with the browser console open before
switching to enforcing.

---

### H2. WordPress post HTML is injected into the site unsanitised

**What it is.** `src/lib/wordpress.ts` passes post bodies through untouched —
`contentHtml: post.content || ''` (lines 200 and 360) — and two pages write that
string straight into the DOM:

- `src/app/news/[slug]/page.tsx:135` — `dangerouslySetInnerHTML={{ __html: item.contentHtml }}`
- `src/app/events/[slug]/page.tsx:120` — the same, with `contentHtmlWithoutImages`

`stripImagesFromHtml()` removes `<img>` and `<figure>`; it does not remove anything
else, and it is not a sanitiser.

**Why it matters.** Anyone who can publish a post on wp.tokoacademy.org with the
`unfiltered_html` capability — every Administrator and Editor on a single-site
WordPress — can put a `<script>` tag into an article and have it execute on
**tokoacademy.org**, the apex domain. So can anyone who compromises that WordPress
install, which is a much larger attack surface than this static site. Because the
site is a static export, the markup is baked into the shipped HTML at build time, so
it is served by your own origin with your own domain's full trust.

**What was done.** Nothing — these files are outside this review's scope. Flagging
only.

Note carefully: **a CSP does not save you here.** Next.js emits its own inline
hydration script into every exported page, and a static export cannot use nonces
(there is no server to generate one) or hashes (they change every build). So
`script-src` must contain `'unsafe-inline'`, which is exactly what an injected
inline script needs. The CSP in Appendix A limits where a payload could *send*
data, and nothing more.

**What the owner must do.** Sanitise at build time in `src/lib/wordpress.ts`, with an
allow-list of the tags WordPress content genuinely uses (`p`, `h2`–`h4`, `a`, `ul`,
`ol`, `li`, `strong`, `em`, `blockquote`, `figure`, `img`, `br`), stripping everything
else and every `on*` attribute and `javascript:` href. Sanitising once, centrally, in
`wordpress.ts` covers both call sites. As a second layer, remove `unfiltered_html`
from Editor accounts in WordPress.

---

### H3. JSON-LD blocks embed CMS text without escaping `<`

**What it is.** Seven pages build a structured-data object from WordPress-derived
strings and serialise it into a `<script>` block with no escaping:

```
src/app/news/page.tsx:80          src/app/events/page.tsx:73
src/app/news/[slug]/page.tsx:99   src/app/events/[slug]/page.tsx:84
src/app/gallery/page.tsx:61       src/app/gallery/[slug]/page.tsx:83
src/app/home-v1-original/page.tsx:74
```

all of the form `dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}`.

`JSON.stringify` escapes quotes and backslashes. It does **not** escape `<` or `/`.
A `</script>` sequence inside a post title or excerpt therefore closes the block
early and everything after it is parsed as HTML.

There is a second half to this. `stripHtml()` in `src/lib/wordpress.ts:164` looks
like it would prevent that:

```js
function stripHtml(value) {
  const withoutTags = value.replace(/<[^>]*>/g, '');
  return decodeHtmlEntities(withoutTags).replace(/\s+/g, ' ').trim();
}
```

but it strips tags *first* and decodes entities *second*. Entity-encoded markup —
`&lt;/script&gt;`, which is how WordPress stores and returns angle brackets in a
title — passes the strip untouched and is then turned into real markup.

**Why it matters.** Same outcome as H2 (script execution on the apex domain) but at a
**lower privilege bar**: it needs only the ability to set a post title or excerpt, not
the `unfiltered_html` capability.

**What was done.** Nothing — outside scope. But note the fix already exists in this
codebase: `src/app/courses/[id]/page.tsx:376` does

```js
JSON.stringify(data).replace(/</g, '\\u003c')
```

which is correct. The other seven call sites simply lack it.

**Honesty note.** I could not fire this end to end, because I have no publish rights
on wp.tokoacademy.org. I am reporting a code path and a demonstrated ordering bug in
`stripHtml`, not a confirmed exploit. The fix is one `.replace()` per call site and
costs nothing, so it is worth doing regardless of whether WordPress's own filtering
happens to block a particular payload today.

**What the owner must do.** Apply the `courses` page's escape to the other seven, and
swap the order of the two operations in `stripHtml` so entities are decoded before
tags are stripped (or better, decode then strip then decode again).

---

### H4. The WordPress plugin printed the GitHub token into the settings page — **FIXED**

**What it is.** The settings form rendered the saved Personal Access Token back into
the page:

```php
<input type="password" ... value="<?php echo esc_attr( get_option( 'toko_deploy_gh_token', '' ) ); ?>" />
```

**Why it matters.** `type="password"` hides the characters on screen. It does not hide
them from the HTML source. The full token was readable by *every* administrator who
opened Settings → Toko Deploy, by any browser extension with page access, by anything
that captures or serialises the DOM, by a screenshot of "view source", and by any XSS
anywhere in wp-admin. That token can trigger a deploy of the production website — and
with the scope the README used to ask for, much more (see H5).

**What was done — fixed.**
- The field now renders **empty**. The token is never written into the page.
- A saved token is shown only as its last four characters, enough to recognise which
  one is stored.
- Submitting the form with the box blank **keeps** the existing token, so "I edited
  something else on this page" can no longer wipe the credential.
- A separate, nonce- and capability-protected **Forget saved token** button clears it,
  with a notice reminding the admin that removing it here does not revoke it on GitHub.
- `show_in_rest => false` is now stated explicitly rather than relied on as a default.

**What the owner must do.** Because the token has been sitting in page source, treat
it as exposed: **rotate it**. Do that as part of H5 below, which changes its scope
anyway. The `wp-config.php` constant (`TOKO_DEPLOY_GH_TOKEN`) remains the better
storage and the plugin still prefers it.

---

### H5. That token needed `Contents: Read and write` — the right to rewrite the site's source — **FIXED in code, owner action needed**

**What it is.** The plugin triggered deploys with `repository_dispatch`. GitHub
requires the **Contents: Read and write** repository permission for that endpoint,
and the README instructed the owner to grant exactly that, with the reassuring note
"it cannot touch anything else".

**Why it matters.** `Contents: Read and write` is also the permission to **push
commits**. This repository's workflow deploys on `push: [master]`. So a token stored
in a WordPress database was, in practice, a key that lets its holder write arbitrary
code into the website and have this pipeline build and publish it to the live server
within two minutes. The chain is: compromise WordPress → read the token (which H4 made
easy) → push code → the code is deployed. WordPress is the softest part of this
estate, so this was the shortest path to owning the public website.

**What was done — fixed.** The plugin now prefers `workflow_dispatch`
(`POST /repos/{o}/{r}/actions/workflows/deploy.yml/dispatches`), which requires only
**Actions: Read and write** — the right to press the deploy button, and nothing else.
It cannot push code, read secrets or change the workflow.

The change is designed so nothing breaks and nothing has to happen in a particular
order:

- `workflow_dispatch` is tried first; if GitHub refuses it (an old Contents-only token
  gets a 403), the plugin falls back to `repository_dispatch` exactly as before.
- Whichever endpoint succeeded is remembered, so the steady state is one API call.
- If the token's scope is later narrowed to Actions, the remembered method flips back
  by itself on the first failure. It self-heals in both directions.

`wordpress-plugin/README.md` now documents `Actions: Read and write` as the scope to
grant, and explains plainly why the old one was dangerous.

**What the owner must do.**
1. On GitHub, generate a new fine-grained PAT scoped to
   `danielishakutv/tokoacademy-website-v2` only, with **Actions: Read and write** and
   nothing else.
2. Save it in WordPress (or better, as `TOKO_DEPLOY_GH_TOKEN` in `wp-config.php`).
3. Press **Deploy now (test)**. The status line will say
   `Deploy triggered via workflow_dispatch`.
4. **Revoke the old token on GitHub.** Removing it from WordPress does not revoke it.

---

### H6. `sharp` was decoding attacker-influenceable images on the runner that holds the production SSH key — **FIXED**

**What it is.** `scripts/generate-og-images.mjs` runs as a `postbuild` step in CI. It
walks the exported HTML, collects every `og:image`/`twitter:image` URL whose host is
`wp.tokoacademy.org`, downloads the bytes, and pipes them straight into
`sharp(inputBuffer)`.

`sharp@0.33` (the pinned range was `^0.33.0`) shipped with unpatched libvips and
libheif vulnerabilities — GHSA-f88m-g3jw-g9cj (CVE-2026-33327, -33328, -35590,
-35591) and GHSA-rgj7-g3m4-5g8c.

**Why it matters.** This is the one `npm audit` finding that is genuinely reachable.
The bytes fed to the image decoder are *not* trusted repository content — they are
whatever somebody uploaded to the WordPress media library, which is a much wider set
of people. The process doing the decoding runs inside GitHub Actions with the
production SSH private key written to `~/.ssh/deploy_key`. A memory-corruption bug in
libvips there is not a build annoyance; it is a path from "can upload a picture in
WordPress" to "has the deploy key for the web server".

**What was done — fixed.** Upgraded to `sharp@0.35.4`, which clears both advisories.
`npm run build` passes and the OG step still reports `optimized 19/19 image(s)`, so
the upgrade is functionally clean.

**What the owner must do.** Nothing, but keep `sharp` current — it is the only
dependency here that touches untrusted bytes, so it is the only one where a lagging
version is a real problem rather than noise.

---

## MEDIUM

### M1. The deploy workflow had no `permissions:` block — **FIXED**

**What it is.** No `permissions:` key meant `GITHUB_TOKEN` inherited the repository's
default. On repositories created before February 2023 — and on any repo whose org
default was never changed — that default is **read *and write* across every scope**.

**Why it matters.** `npm ci` installs on the order of a thousand packages and runs
their lifecycle scripts. Any one of them could have read `GITHUB_TOKEN` out of the
environment, or out of `.git/config` where `actions/checkout` leaves it by default,
and pushed commits, created releases or edited workflows.

**What was done — fixed.** Top-level `permissions: contents: read`, which is all the
checkout needs; nothing that touches production uses `GITHUB_TOKEN` at all. Plus
`persist-credentials: false` on the checkout so the token is not left sitting in
`.git/config` for the rest of the job.

---

### M2. Actions were pinned to movable tags — **FIXED**

**What it is.** `actions/checkout@v7` and `actions/setup-node@v7`.

**Why it matters.** A tag is a label, not a commitment. If either action's repository
were compromised, `v7` could be repointed at new code that would then execute inside
a job holding the production SSH private key. This is the standard supply-chain
scenario for CI, and it is worth defending against precisely because this workflow is
unusually privileged.

**What was done — fixed.** Both pinned to commit SHAs with the version in a trailing
comment:

- `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1` (v7.0.1)
- `actions/setup-node@820762786026740c76f36085b0efc47a31fe5020` (v7.0.0)

Both SHAs were resolved from the GitHub API at review time.

**What the owner must do.** Update these deliberately when you want a new version —
Dependabot will offer the bumps if you enable it for `github-actions`.

---

### M3. The SSH host key was accepted unverified on every run — **PARTIALLY FIXED**

**What it is.** `ssh-keyscan -p "$SSH_PORT" -H "$SSH_HOST" >> ~/.ssh/known_hosts`
asks the server what its key is and then trusts the answer. There is no comparison
against anything known-good.

**Why it matters.** It means the runner will hand the deploy private key to whatever
answers on that address on the day. That is a narrow window — it requires someone to
be in a position to redirect or answer for the host — but the thing at stake is write
access to the web root, and the defence costs one secret.

**What was done — partially fixed.** The workflow now uses a `SSH_KNOWN_HOSTS` secret
when one is set, and falls back to the old `ssh-keyscan` behaviour when it is not,
emitting a `::warning::` in the run log so the gap is visible rather than silent.
The rsync SSH command also now passes `-o StrictHostKeyChecking=yes` and
`-o IdentitiesOnly=yes`.

Falling back rather than failing is deliberate: making this change hard-fail would
have broken deploys the moment it merged.

**What the owner must do.** On a machine you trust, run
`ssh-keyscan -p <port> -H <host>` and paste the full output into a new repository
secret named `SSH_KNOWN_HOSTS`. The warning in the run log then stops.

---

### M4. Every page calls the public Iconify API at runtime

**What it is.** `@iconify/react` is used through `src/components/IconWrapper.tsx`
without a local icon set, so at runtime it fetches icon data from
`https://api.iconify.design`, with `https://api.simplesvg.com` and
`https://api.unisvg.com` as fallbacks. This is confirmed in the shipped bundle
(`out/_next/static/chunks/720.*.js`).

**Why it matters.** Three separate things:
- **Privacy.** Every visitor's IP address and the set of icons each page uses are sent
  to a third party on every visit. That is a disclosure your privacy policy does not
  mention.
- **Availability.** If the API is slow or down, icons silently disappear from the site.
- **Integrity.** The response is SVG that gets inserted into the page. A compromise of
  that API is a compromise of your pages' visual content, and SVG is a richer format
  than people expect.

**What was done.** Nothing — `IconWrapper.tsx` is outside scope. The CSP in
Appendix A allows these three hosts in `connect-src` because removing them from the
allow-list would break every icon on the site today.

**What the owner must do.** Bundle the icons offline. Install `@iconify/json`, call
`addCollection()` (or `addIcon()` for the handful actually used) at module load, and
the API calls stop entirely. Then remove those three hosts from `connect-src`. This
is a small change with a clean payoff: faster pages, no third party, no dangling
trust.

---

### M5. Cloudflare Rocket Loader is enabled on a React application

**What it is.** The live pages include
`/cdn-cgi/scripts/7d0fa10a/cloudflare-static/rocket-loader.min.js`, which is
Cloudflare's Rocket Loader. It is not in your source; Cloudflare injects it.

**Why it matters.** Rocket Loader works by rewriting `<script>` tags and re-executing
them itself. Two consequences: it permanently forces `'unsafe-inline'` into any CSP
you write (Cloudflare documents this), so you can never tighten `script-src` below
that line; and it reorders script execution, which is a well-known source of subtle
breakage in React hydration.

**What was done.** Nothing — this is a Cloudflare dashboard setting, not a file.
Reported as advisory: the site works today, so this is not a live fault.

**What the owner must do.** Consider turning it off under Cloudflare → Speed →
Optimization → Content Optimization. Next.js already code-splits and defers its own
scripts, so Rocket Loader is doing little here beyond adding a script and constraining
your CSP. Test the site after toggling.

---

### M6. Matomo runs from a third-party origin with no integrity control

**What it is.** `src/components/MatomoAnalytics.tsx` loads
`https://analytics.aictig.org/matomo.js` into every page, as site ID 3.

**Why it matters.** Whoever controls `analytics.aictig.org` can execute arbitrary
JavaScript on tokoacademy.org — read the contact form as it is typed, rewrite links,
anything. That is inherent to any analytics tag, and Subresource Integrity cannot help
because Matomo's tracker updates itself, so its hash changes. This is therefore a
trust decision, not a bug: if aictig.org is a partner's infrastructure rather than
Toko's own, the partner has full script access to your site and full sight of your
visitor data.

**What was done.** Nothing — it is intentional functionality outside scope, and the
CSP allows it.

**What the owner must do.** Confirm who administers that Matomo instance and that you
are content with it. If it is not yours, consider self-hosting Matomo on a
tokoacademy.org subdomain.

---

## LOW

### L1. `npm audit`: 18 findings → 8, and the remaining 8 are not reachable here

**What was done.** `sharp` upgraded (H6, the only genuinely reachable one), then a
plain `npm audit fix` cleared the lockfile-only transitive issues. `package.json`
changed in exactly one line (`sharp`). Result: 18 (1 critical, 14 high, 2 moderate,
1 low) → **8** (1 critical, 7 high).

**Why the remaining 8 were deliberately left.**

- **`next` (critical).** Both critical advisories describe a *running Next server*:
  unauthenticated RCE on Windows-hosted servers, and RCE in the Image Optimization
  API when AVIF files are used. This site is `output: 'export'` with
  `images.unoptimized: true` — there is no Next server and no image optimizer in
  production; Apache serves flat files. Every remaining `next` advisory is likewise a
  runtime one (SSRF in rewrites, Server Actions DoS, middleware bypass, cache
  poisoning, CSP-nonce XSS). None of those code paths exists in a static export.
  Upgrading 14 → 16 is a major version with genuine breakage risk and **no** security
  benefit for this deployment, so it was not done.
- **`postcss`, `glob`, `minimatch`, `@typescript-eslint/*`, `eslint-config-next`,
  `@next/eslint-plugin-next`.** Build- and lint-time only. The input they process is
  this repository's own source, which an attacker does not control. The PostCSS
  `sourceMappingURL` advisories require attacker-controlled CSS; all CSS here is
  ours and Tailwind's.

**What the owner must do.** Plan a Next.js major upgrade on its own merits
(maintenance, not security), not in response to this audit. Re-run `npm audit` after
any dependency change and check whether the new finding touches remote input — that
is the question that separates H6 from the rest of this list.

---

### L2. The deploy never deletes — confirmed, and left that way

`rsync -avz` with no `--delete`, and the warning comment above it, are intact. I also
verified the consequence is not currently biting: the origin was a WordPress site and
nothing of it is left exposed. Probed through Cloudflare, all returning 404:
`/wp-login.php`, `/wp-admin/`, `/xmlrpc.php`, `/wp-content/`, `/wp-includes/`,
`/readme.html`, `/license.txt`, `/index.php`. `/.git/config` and `/.env` are 404.
`/.htaccess` is 403 (Apache's built-in `.ht*` deny).

**Worth knowing:** an additive deploy means a page removed from the site stays live on
the server forever. Retiring a URL is a manual `mv` on the server, not something a
deploy can do. Keep that in mind if a page ever has to come down for legal or
safeguarding reasons.

---

### L3. The pipeline could have published an empty tree — **FIXED**

A build that produced nothing would have rsynced nothing over a live site — which, on
an additive rsync, means the old site survives, but a *partial* export would have
published a half-written site. Added a step before the SSH configuration that fails
the run unless `out/index.html` is non-empty and at least ten pages were exported
(the current build produces 80). Also added `--chmod=D755,F644` to the rsync so file
modes on the server are deterministic rather than inherited from the runner's umask,
and wrapped the private-key write in `umask 077` so it is never briefly world-readable
between creation and `chmod 600`.

---

### L4. `/wp-config.php` returns 403 rather than 404 — worth ten seconds to confirm

Every non-existent path I probed returns 404, with two exceptions: `/wp-config.php`
and `/wp-config.php.bak` return **403**. Control tests (`/zzzzz.bak`,
`/config.php.bak`, `/notarealfile.bak.txt`) all return 404, so the 403 is specific to
that filename.

Almost certainly a Cloudflare managed WAF rule matching the name, which is normal and
fine. But from outside, a 403 is ambiguous — it can also mean "the file is there and
access is denied", and a leftover `wp-config.php` in a docroot contains database
credentials.

**What the owner must do.** You have SSH:
`ls -la /home/tokoacademy/public_html/wp-config.php*`. If anything is there, move it
out of the web root (rename it, do not delete it).

---

### L5. No secrets in the repository or the build output

Searched all tracked files and the entire `out/` directory for PAT/API-key/token
patterns, `BEGIN … PRIVATE KEY`, AWS/Slack/Stripe key formats, and any IPv4 address.
**Nothing found.** Specifically:

- `.env.local` contains one line, the public WordPress GraphQL URL, and is gitignored.
- `.env.local.example` contains no values.
- `personal_private_note.md` contains a root SSH command including the server's IP.
  It is gitignored *and* untracked — correctly handled. It is still plaintext on the
  workstation, so treat that machine as holding production credentials.
- No source maps in `out/` (`productionBrowserSourceMaps` is off by default and
  nothing overrides it) — so the site's JavaScript ships minified without
  reconstructable source.
- No internal hostnames or IPs in the exported HTML.

Values are not reproduced here by design.

---

### L6. `next.config.js` — examined, deliberately unchanged

There is no security-relevant change to make to it for this deployment:

- A `headers()` block would be silently ignored under `output: 'export'`. Adding one
  would be actively harmful — it would look like the headers were handled.
- `poweredByHeader` is moot: no Next server responds in production.
- `productionBrowserSourceMaps` already defaults to off, and `out/` confirms no maps.
- `images.domains` is deprecated *and* currently inert, because `unoptimized: true`
  means no image optimizer runs. Swapping it for `remotePatterns` would be cosmetic.
  Its current value is already correctly narrow, and it only starts to matter if this
  site ever gains a server — at which point it is right as written.

---

## Appendix A — security header specification

For the Apache `.htaccess` at `/home/tokoacademy/public_html/.htaccess`.

`mod_headers` is loaded on this box, so `Header` directives work. The `<IfModule>`
guard is not optional even so: an unguarded `Header` directive on a server without
`mod_headers` returns **500 for the entire directory tree**, which on a shared
`public_html` would take sibling apps down with it.

`Header always set` (not plain `Header set`) so the headers are also present on 403
and 404 responses, which is where a browser is most likely to be handed something
unexpected.

### The block

```apache
<IfModule mod_headers.c>
    # --- Always safe -----------------------------------------------------------
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Permissions-Policy "accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), publickey-credentials-get=(), screen-wake-lock=(), usb=(), xr-spatial-tracking=()"

    # --- Content Security Policy ------------------------------------------------
    # Start here. Report-Only breaks nothing; it only logs to the browser console.
    Header always set Content-Security-Policy-Report-Only "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline' https://analytics.aictig.org https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://admin.tokoacademy.org https://analytics.aictig.org https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com https://challenges.cloudflare.com; frame-src 'self' https://challenges.cloudflare.com; worker-src 'self'; manifest-src 'self'; media-src 'self'; upgrade-insecure-requests"

    # Once the console is clean on every page type, change the header NAME only —
    # the value is identical:
    # Header always set Content-Security-Policy "…same value…"
</IfModule>
```

**HSTS is deliberately not in that block.** See the HSTS section below before adding it.

### Where each directive came from

I built this from what the site genuinely loads, not from a template. The inventory,
taken from `src/`, the exported `out/` tree and the live pages:

| What loads | From | Directive it needs |
|---|---|---|
| Next.js chunks, `sw.js`, CSS, manifest | same origin | `'self'` |
| Next.js hydration script (`self.__next_f.push(…)`) | inline, every page | `script-src 'unsafe-inline'` |
| Cloudflare Rocket Loader, email-decode | `/cdn-cgi/…` = same origin | `script-src 'self'` |
| Matomo loader (injected inline by `next/script`) and `matomo.js` | `analytics.aictig.org` | `script-src` host + `'unsafe-inline'`; `connect-src` host |
| Turnstile `api.js` (contact page, only when a site key is set) | `challenges.cloudflare.com` | `script-src`, `connect-src` |
| Turnstile widget iframe | `challenges.cloudflare.com` | `frame-src` |
| Icon data, fetched at runtime | `api.iconify.design`, `api.simplesvg.com`, `api.unisvg.com` | `connect-src` |
| Contact form POST | `admin.tokoacademy.org/api/v1/public/enquiries` | `connect-src` |
| RSC `.txt` prefetches | same origin | `connect-src 'self'` |
| Service worker | `/sw.js` | `worker-src 'self'` |
| Inline `style={{…}}` attributes, Turnstile's injected styles | inline | `style-src 'unsafe-inline'` |
| Fonts | **none** — no `@font-face`, no Google Fonts | `font-src 'self'` suffices |
| Video / audio / `<object>` | **none found** | `media-src 'self'`, `object-src 'none'` |

**Why `script-src` has `'unsafe-inline'` and cannot lose it.** Next.js writes an
inline bootstrap script into every exported page. A static export has no server, so a
per-request nonce is impossible, and hashing is impractical because the inline content
changes on every build. Cloudflare Rocket Loader (M5) independently requires it too.
This is a real limitation of the architecture and the policy should be honest about it
rather than pretend otherwise.

**Why `img-src` ends in a bare `https:` instead of a host list.** Course thumbnails and
WordPress article images are URLs typed in by content editors. The build output today
contains images from `wp.tokoacademy.org`, `learn.tokoacademy.org`,
`app.tokoacademy.org`, `images.ctfassets.net`, `miro.medium.com`,
`encrypted-tbn0.gstatic.com`, `welovedigitalmarketing.ca`, `www.rhodesstate.edu`,
`trendsresearch.org`, `sdssoftwares.co.uk`, `www.sirstevehq.com` and
`jabbamanews.wordpress.com` — and that list grows every time somebody writes an
article. An allow-list here would break images silently, weeks later, and somebody
would eventually "fix" it by deleting the whole CSP. `https:` still blocks
plaintext-HTTP images, which is the part that actually matters, and an image source is
a weak vector compared to a script source.

**Two directives that do nothing in Report-Only mode.** `frame-ancestors` and
`upgrade-insecure-requests` are ignored by browsers in a `-Report-Only` policy. That is
exactly why `X-Frame-Options: SAMEORIGIN` is in the block separately — it carries the
clickjacking protection during the Report-Only period, and remains useful afterwards
for older browsers.

**`form-action 'self'`.** The contact form submits by `fetch()`, not by a native form
POST, so this does not affect it. I found no native cross-origin form submission
anywhere in the export. If a sibling app under the same docroot posts to another host,
Report-Only will surface it before it breaks.

**If editors ever embed video**, a YouTube iframe will be blocked. Add
`https://www.youtube-nocookie.com https://www.youtube.com` to `frame-src` at that
point. There are no iframes in the export today.

### Rollout

1. Deploy with `Content-Security-Policy-Report-Only` as written.
2. Open DevTools → Console and walk: `/`, `/courses/`, a course detail page, `/contact/`
   (submit the form), a `/news/` article, `/gallery/`, `/events/`, `/zero2live/`.
   Report-Only prints `[Report Only] Refused to …` for anything that *would* have been
   blocked. Nothing actually breaks.
3. Fix or allow each report. Repeat until the console is clean on every page type.
4. Rename the header to `Content-Security-Policy`. The value does not change.

There is no reporting endpoint configured, so reports go to the browser console only.
That is sufficient for a manual pass and avoids standing up a collector you would then
have to maintain.

### Strict-Transport-Security — and how Cloudflare changes the answer

The live site sends **no** HSTS header today, from either the edge or the origin, so
Cloudflare's own HSTS toggle is currently off. `http://tokoacademy.org` already 301s
to HTTPS, and `wp.`, `learn.`, `admin.` and `app.` all answer on HTTPS, so enabling
HSTS is safe — with three conditions.

**Recommendation: set it at Cloudflare, not in `.htaccess`.**
SSL/TLS → Edge Certificates → HTTP Strict Transport Security. The reason is
reversibility. HSTS is the one header a browser *remembers*: if a `max-age` of a year
turns out to be wrong, you cannot unsend it — you have to serve `max-age=0` from the
origin and wait for every browser that saw it to come back. A dashboard toggle can be
turned off in seconds; a header baked into a deployed file cannot. Setting it in both
places also risks a duplicated header.

If you would rather keep everything version-controlled in the `.htaccess`, this is the
value — and ramp the `max-age` rather than starting at a year:

```apache
    # Day 1:  Header always set Strict-Transport-Security "max-age=300"
    # Week 1: Header always set Strict-Transport-Security "max-age=86400"
    # Then:
    Header always set Strict-Transport-Security "max-age=31536000"
```

The three conditions:

1. **No `includeSubDomains`** from this docroot. It would bind *every* `*.tokoacademy.org`
   host, present and future, to HTTPS-only. I verified `wp.`, `learn.`, `admin.` and
   `app.` are fine today, but cPanel/webmail-style hostnames and any subdomain created
   later are the risk, and the failure mode is "that subdomain is unreachable and I
   cannot make it reachable again for a year".
2. **Never `preload`.** Submitting to the preload list is effectively a one-way door
   baked into browser binaries, and removal takes months.
3. **Confirm Cloudflare SSL/TLS mode is Full (strict).** HSTS on a Flexible setup
   protects the browser-to-Cloudflare leg while Cloudflare-to-origin stays plaintext —
   which is precisely the false confidence the header exists to remove.

### Two notes on the cache headers you are writing

Not my lane, but they interact with things in this review:

- **`/sw.js` must not be long-cached.** If the service worker is cached for a long
  time, a broken worker stays in control of the site for that long and a deploy cannot
  displace it. `Cache-Control: no-cache` (revalidate every time) is right for that one
  file.
- **For `index.html`, prefer `no-cache` over `no-store`.** `no-cache` means "revalidate
  before using", which lets Cloudflare hold a copy and serve it on a 304 — `no-store`
  forbids storing at all, which is what is currently costing you the origin round-trip
  on every page load.

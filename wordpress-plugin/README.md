# Toko Academy — Deploy on Publish (WordPress plugin)

Instantly rebuilds and redeploys the static **tokoacademy.org** site whenever you
publish or update a post in WordPress. It does this by triggering a GitHub Actions
`repository_dispatch` event, which the `Build and deploy to server` workflow listens for.

This replaces the old hourly polling — new articles/events/gallery items go live within
a couple of minutes of publishing, and there are no more hourly workflow runs.

## What triggers a deploy

- Publishing a post
- Updating an already-published post
- Unpublishing / trashing a published post

(News, events, and gallery are all the built-in `post` type, so all three are covered.
Bursts of saves within 30s are coalesced into a single deploy.)

## Install

1. **Zip the plugin folder.** Zip the `toko-deploy-on-publish/` directory so you have
   `toko-deploy-on-publish.zip` (the zip must contain the folder with the `.php` inside).
   - *Or* just copy the `toko-deploy-on-publish/` folder straight into
     `wp-content/plugins/` on the server (via your file manager / FTP) and skip the upload.
2. In **wp.tokoacademy.org** admin → **Plugins → Add New → Upload Plugin** → choose the zip → **Install** → **Activate**.

## Create the GitHub token (one time)

The plugin needs a token that's allowed to trigger the deploy.

1. GitHub → your avatar → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Repository access:** *Only select repositories* → `danielishakutv/tokoacademy-website-v2`.
3. **Permissions → Repository permissions → Contents:** **Read and write**.
   *(This is what authorizes the deploy trigger — no other permission is needed.)*
4. Set a long expiry, generate, and **copy the token** (starts with `github_pat_...`).

Then add it to WordPress one of two ways:

- **Recommended (more secure):** in `wp-config.php`, above the "stop editing" line, add:
  ```php
  define( 'TOKO_DEPLOY_GH_TOKEN', 'github_pat_xxxxxxxxxxxxxxxx' );
  ```
- **Or:** WordPress admin → **Settings → Toko Deploy** → paste the token → **Save token**.

## Test it

- **Settings → Toko Deploy → Deploy now (test)** — then open the repo's **Actions** tab; a
  run should start and go green in ~1–2 min. The page also shows the result of the last trigger.
- Or just publish/update any post and watch the Actions tab.

## Notes

- The token only has `Contents: write` on this one repo — it cannot touch anything else.
- If you rotate the token, update it in the same place.
- The workflow still deploys on every code push and once a day as a safety net, so the
  site can never drift more than 24h even if a trigger is ever missed.
- To watch other post types too, a theme/plugin can use the
  `toko_deploy_post_types` filter.

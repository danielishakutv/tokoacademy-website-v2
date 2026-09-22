/**
 * Where a contact form message goes, and whether a captcha guards it.
 *
 * The contact page had no form on it — a dashed box invited people to phone or
 * email instead. Anything typed here now goes to ta_admin, where it lands in
 * one queue that staff work through and reply from, rather than becoming an
 * email in somebody's personal inbox.
 */

/** The admin platform's public API. Unauthenticated, and the only route used is the one POST. */
export const ADMIN_API =
  process.env.NEXT_PUBLIC_ADMIN_API_URL ?? 'https://admin.tokoacademy.org/api/v1';

export const ENQUIRY_ENDPOINT = `${ADMIN_API}/public/enquiries`;

/**
 * The captcha's public key, read from the admin platform at build time.
 *
 * Kept there rather than in this repo's environment for one reason: the person
 * who owns this system can open Settings and paste a key, and cannot edit a
 * GitHub Actions variable. Both halves of the key live in the same screen, the
 * secret one masked — so turning the check on is one action in one place.
 *
 * Returns null when no key is set, and the form then runs on its honeypot and
 * the server's rate limit. A missing captcha must never mean a missing form.
 */
export async function captchaSiteKey(): Promise<string | null> {
  try {
    const response = await fetch(`${ADMIN_API}/settings/public`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { data?: Record<string, unknown> };
    const key = body.data?.['security.turnstile_site_key'];
    return typeof key === 'string' && key.trim() ? key.trim() : null;
  } catch {
    // The admin platform being unreachable at build time must not fail the
    // build or remove the form — it only means no captcha on this release.
    return null;
  }
}

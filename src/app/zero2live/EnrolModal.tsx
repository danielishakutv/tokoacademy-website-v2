'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Sheet from '@/components/ui/Sheet';
import { ENROL_ENDPOINT, APPLY_ENDPOINT, COURSE_SLUG, LOGIN_URL } from './config';
import { leadSource } from '@/lib/leadSource';

type Props = {
  open: boolean;
  onClose: () => void;
  price: string;
  /**
   * Whether the workshop can be bought on the spot.
   *
   * It cannot, as the catalogue currently stands: Zero to Live is `blended`, and
   * /api/public/enrol refuses a scheduled course. So this form was opening a
   * checkout the platform would never open, and showing the refusal to the
   * visitor as an error. A scheduled course takes an application, and admissions
   * confirms the seat and the payment.
   */
  selfPaced?: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'w-full rounded-lg border border-line-strong bg-surface-raised px-3 py-2.5 text-ink outline-none transition placeholder:text-ink-subtle focus:border-brand focus:ring-2 focus:ring-brand/30';

const FORM_ID = 'z2l-enrol-form';

/**
 * Enrolment form → Toko Academy public API. On 201 it redirects the browser to
 * Paystack; Toko creates the account and enrols the buyer after payment. This
 * component owns no backend — it only POSTs and redirects.
 *
 * Deliberately pay-only, unlike the course pages' form. Zero to Live is two
 * days in one physical room with a finite number of chairs, so an unpaid "seat"
 * is a chair nobody can sell and nobody turns up to. Everything about the
 * dialog's layout, scrolling and focus behaviour now comes from Sheet — see the
 * note at the top of components/ui/Sheet.tsx for what it fixes.
 */
export default function EnrolModal({ open, onClose, price, selfPaced = false }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [done, setDone] = useState(false);
  // False when the email already had a working login, so no password was sent.
  const [emailedLogin, setEmailedLogin] = useState(true);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Reset transient state ONLY when the modal opens — not on every submitting
  // change, or an error set right before setSubmitting(false) would be wiped.
  useEffect(() => {
    if (open) {
      setError(null);
      setShowLogin(false);
      setSubmitting(false);
      setDone(false);
    }
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();
    const ph = phone.trim();

    if (!fn || !ln) {
      setError('Please enter your first and last name.');
      return;
    }
    if (!EMAIL_RE.test(em)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Required: a two-day in-person workshop means we have to be able to reach
    // you about the room, the time and what to bring.
    if (ph.length < 7) {
      setError('Please enter a phone number we can reach you on.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setShowLogin(false);
    try {
      const res = await fetch(selfPaced ? ENROL_ENDPOINT : APPLY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: fn,
          lastName: ln,
          email: em,
          phone: ph,
          courseSlug: COURSE_SLUG,
          // Travels through to the leads notification, so the group can see the
          // seat request came from this landing page rather than the catalogue.
          source: leadSource(),
          website: honeypotRef.current?.value ?? '', // honeypot, stays empty
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 201 && data.authorizationUrl) {
        // Success → hand off to Paystack. Stay in the loading state while we navigate.
        window.location.href = data.authorizationUrl;
        return;
      }
      if (!selfPaced && (res.status === 201 || res.status === 200)) {
        // Application lodged. Their login is emailed now; the seat opens once they pay.
        setEmailedLogin(data.credentialsEmailed !== false);
        setDone(true);
        setSubmitting(false);
        return;
      }
      if (res.status === 200 && data.ok) {
        // Honeypot tripped (a bot) — silently ignore.
        setSubmitting(false);
        return;
      }
      if (data.code === 'SCHEDULED_COURSE') {
        /*
         * The catalogue says scheduled even though this page was built thinking
         * otherwise — somebody changed the course between the build and now.
         * Lodge the application rather than losing the person: they filled the
         * form in, and the details are the point.
         */
        const retry = await fetch(APPLY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: fn,
            lastName: ln,
            email: em,
            phone: ph,
            courseSlug: COURSE_SLUG,
            source: leadSource(),
            website: honeypotRef.current?.value ?? '',
          }),
        });
        if (retry.status === 201 || retry.status === 200) {
          const retryData = await retry.json().catch(() => ({}));
          setEmailedLogin(retryData.credentialsEmailed !== false);
          setDone(true);
          setSubmitting(false);
          return;
        }
      }
      if (res.status === 409) {
        setShowLogin(true);
        setError(data.error || "You're already enrolled — just log in to continue.");
      } else if (res.status === 503) {
        setError(data.error || "Online payment isn't available yet. Please try again later.");
      } else if (res.status === 429) {
        // The apply endpoint is throttled because it emails a login on every call.
        setError('That is a few too many attempts. Please wait a few minutes and try again.');
      } else if (res.status === 400) {
        setError(data.error || 'Please check your details and try again.');
      } else if (res.status === 404) {
        setError('This course is unavailable right now. Please try again later.');
      } else {
        setError('Something went wrong, please try again.');
      }
      setSubmitting(false);
    } catch {
      setError('Something went wrong, please try again.');
      setSubmitting(false);
    }
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      busy={submitting}
      labelId="z2l-enrol-title"
      eyebrow="Zero to Live"
      title={done ? 'Seat requested' : 'Hold my seat'}
      description={
        done
          ? undefined
          : selfPaced
            ? `Pay ${price} securely. Your login is emailed to you right after payment.`
            : `${price} for the two days. Request a seat and we will email you a login straight away. Pay from your dashboard to secure it. The room is small, so places go in the order they are paid for.`
      }
      footer={
        done ? (
          <div className="space-y-2">
            <a href={LOGIN_URL} className="btn-primary w-full">
              Log in and pay
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
            >
              I&apos;ll do it later
            </button>
          </div>
        ) : (
        <div className="space-y-2.5">
          <button
            type="submit"
            form={FORM_ID}
            disabled={submitting}
            /* A fixed `bg-toko-green`, not `.btn-primary`: the brand token
               lightens in the dark theme, and this button's label is white. */
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-toko-green px-6 py-3.5 text-lg font-bold text-white shadow-toko transition-all duration-300 hover:bg-toko-green-dark focus:outline-none focus:ring-4 focus:ring-toko-green/50 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {submitting ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                {selfPaced ? 'Taking you to payment…' : 'Sending…'}
              </>
            ) : selfPaced ? (
              <>Enrol &amp; pay {price}</>
            ) : (
              <>Request my seat</>
            )}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-subtle">
            <svg className="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <rect x="4" y="10" width="16" height="11" rx="2" strokeWidth="2" />
              <path d="M8 10V7a4 4 0 118 0v3" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {selfPaced
              ? "Secured by Paystack. You'll be redirected to pay."
              : 'No payment on this form. You pay after you sign in.'}
          </p>
        </div>
        )
      }
    >
      {done ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="m5 13 4 4L19 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm text-ink-muted">
            {emailedLogin ? (
              <>
                Thank you. We have emailed a login to{' '}
                <strong className="font-semibold text-ink">{email.trim()}</strong>.
              </>
            ) : (
              <>Thank you. This email already has an account, so sign in with the password you already use.</>
            )}{' '}
            Sign in and pay {price} from your dashboard to secure your seat.
          </p>
          <p className="text-xs text-ink-subtle">
            Places go in the order they are paid for. If you would rather pay by transfer, reply to the email.
          </p>
        </div>
      ) : (
      <>
      {/* validation is handled in JS (handleSubmit) so we show styled errors */}
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* honeypot — hidden off-screen; real people never fill this */}
        <input
          type="text"
          name="website"
          ref={honeypotRef}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          defaultValue=""
          style={{ position: 'absolute', left: '-9999px' }}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink">First name</span>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink">Last name</span>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required className={inputClass} />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" required className={inputClass} />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            inputMode="tel"
            maxLength={40}
            placeholder="0803 000 0000"
            required
            className={inputClass}
          />
          <span className="mt-1 block text-xs text-ink-subtle">
            So we can send you the venue and timing. WhatsApp is fine.
          </span>
        </label>

        {error && (
          <div className="rounded-lg bg-toko-magenta/10 px-4 py-3 text-sm text-toko-magenta-dark dark:text-toko-magenta-light" role="alert">
            {error}
            {showLogin && (
              <>
                {' '}
                <a href={LOGIN_URL} className="font-bold underline hover:no-underline">Log in to continue →</a>
              </>
            )}
          </div>
        )}
      </form>
      </>
      )}
    </Sheet>
  );
}

'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Sheet from '@/components/ui/Sheet';
import { useLivePrice } from '@/components/ui/Price';
import { leadSource } from '@/lib/leadSource';

/**
 * The one place a course page turns a reader into a student.
 *
 * Four routes in, decided by the course itself rather than by anything typed
 * into this page:
 *
 *   paid + self-paced  → pay now and start today, OR register now and pay later
 *   free + self-paced  → give us your details and the course opens immediately
 *   scheduled          → apply, and somebody approves before the seat is real
 *
 * "Register now, pay later" exists because the old form had exactly one way
 * through it, and anybody not ready to pay in that minute left no trace at all
 * — no name, no email, no phone number, nothing to follow up. Now they get an
 * account and the course sits LOCKED on their dashboard until the money
 * arrives: they can read the syllabus, browse everything else, and pay when
 * they are ready. The lock is enforced by the platform, not by this page.
 *
 * The free route is the same form, because the mistake it replaces was treating
 * free as "no form needed". This button used to be a link to the platform's
 * sign-in screen — which has no self-service sign-up behind it, so a stranger
 * arrived at a password box for an account that did not exist and could not be
 * created. The one journey on this site that collected nothing also could not
 * be completed. Now it collects what the paid routes collect, and the platform
 * grants access on the spot: free means nothing to pay, not nobody to know.
 *
 * All four post to the learning platform's public API. This component owns no
 * backend and holds no key: the payment link comes back from the server and the
 * browser follows it, which is why Paystack's keys never touch this site.
 */

const API = process.env.NEXT_PUBLIC_DLC_API_URL ?? 'https://learn.tokoacademy.org';
const LOGIN_URL = `${API}/login`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * `bg-surface-raised` matters as much as the text colour: a field left on the
 * browser default is white in both themes, so a dark-theme form would be white
 * boxes on a black card — and the typed text, being `text-ink`, would be white
 * on white.
 */
const inputClass =
  'w-full rounded-lg border border-line-strong bg-surface-raised px-3 py-2.5 text-ink outline-none transition placeholder:text-ink-subtle focus:border-brand focus:ring-2 focus:ring-brand/30';

const FORM_ID = 'enrol-form';

/** Which button was pressed. All four submit the same fields to different endpoints. */
type Intent = 'pay' | 'register' | 'apply' | 'free';

/** What this course offers, which decides the whole dialog. */
type Mode = 'pay' | 'apply' | 'free';

/** The endpoint each intent posts to. */
const ENDPOINT: Record<Intent, string> = {
  pay: 'enrol',
  register: 'register',
  apply: 'apply',
  free: 'start-free',
};

type Props = {
  slug: string;
  title: string;
  price: number;
  priceLabel: string;
  /** The undiscounted price, when a promotion is running. */
  originalPrice?: number | null;
  /** When that promotion ends, so the button can stop quoting it. */
  discountEndsAt?: string | null;
  selfPaced: boolean;
};

export default function EnrolPanel({
  slug,
  title,
  price,
  priceLabel,
  originalPrice = null,
  discountEndsAt = null,
  selfPaced,
}: Props) {
  const [open, setOpen] = useState(false);
  /*
   * The amount on these buttons is re-derived in the browser rather than taken
   * from the build.
   *
   * `priceLabel` was correct when the page was exported, and this site is a
   * static export — so after the promotion ends, a page served from the last
   * build would offer "Pay ₦90,000" and the platform would charge ₦180,000.
   * The button has to agree with the checkout, so it asks the clock.
   */
  const live = useLivePrice(price, originalPrice, discountEndsAt);
  const shownPrice = live.label || priceLabel;

  /*
   * Which of the three journeys this course is on.
   *
   * `live.price` rather than the build's `price`, for the same reason the label
   * is re-derived: a course discounted to nothing is free while the promotion
   * runs and priced again the moment it ends, and the platform decides that by
   * its own clock. A page cached from before the end must not offer a free
   * start for something that now costs money — the server would refuse it, and
   * the person would be told their details were wrong when they were not.
   */
  const mode: Mode = !selfPaced ? 'apply' : live.amount > 0 ? 'pay' : 'free';

  const label =
    mode === 'pay' ? `Enrol & pay ${shownPrice}` : mode === 'free' ? 'Start this course free' : 'Apply to join';

  const note =
    mode === 'pay'
      ? 'Pay now and start today, or register and pay later — either way it takes a minute.'
      : mode === 'free'
        ? 'Free, and it opens as soon as you tell us who you are — about a minute.'
        : 'Tell us you are interested and the admissions team will be in touch about dates and payment.';

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-primary w-full">
        {label}
      </button>
      <p className="mt-3 text-center text-xs text-ink-subtle">{note}</p>
      <EnrolDialog
        open={open}
        onClose={() => setOpen(false)}
        slug={slug}
        title={title}
        priceLabel={shownPrice}
        mode={mode}
      />
    </>
  );
}

function EnrolDialog({
  open,
  onClose,
  slug,
  title,
  priceLabel,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  slug: string;
  title: string;
  priceLabel: string;
  mode: Mode;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState<Intent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [done, setDone] = useState<'applied' | 'registered' | 'enrolled' | null>(null);
  /*
   * Whether the platform actually emailed them a password.
   *
   * It does not when the address already had a working login — it will not mail
   * a password for an account somebody else might own, which is right. But the
   * screen used to promise an email in both cases, so the one person who had
   * been here before was told to wait for something that was never coming.
   */
  const [emailedLogin, setEmailedLogin] = useState(true);

  const honeypotRef = useRef<HTMLInputElement>(null);

  /*
   * Which button was pressed, recorded on mousedown/keydown before the submit
   * event runs. Not read from `event.submitter`, because the footer's buttons
   * live OUTSIDE the <form> they submit (they carry `form={FORM_ID}`), and
   * submitter support across that boundary is not something to bet a checkout
   * on.
   */
  const intentRef = useRef<Intent>(mode);

  // Cleared when it opens, not on every render — an error set just before
  // submitting flips back to null would otherwise be wiped before it is read.
  useEffect(() => {
    if (open) {
      setError(null);
      setShowLogin(false);
      setDone(null);
      setEmailedLogin(true);
      setSubmitting(null);
      intentRef.current = mode;
    }
  }, [open, mode]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const intent = intentRef.current;
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
    // Required, not optional as it was. A phone number is how the admissions
    // team reaches somebody who registered and then went quiet, and an email
    // alone has never been enough for that.
    if (ph.length < 7) {
      setError('Please enter a phone number we can reach you on.');
      return;
    }

    setSubmitting(intent);
    setError(null);
    setShowLogin(false);

    try {
      const response = await fetch(`${API}/api/public/${ENDPOINT[intent]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: fn,
          lastName: ln,
          email: em,
          phone: ph,
          courseSlug: slug,
          // Which page they were on, as a whole address. It travels to the leads
          // notification in ta_admin, where a link somebody can tap answers the
          // first question anybody asks about a lead before they ring it.
          source: leadSource(),
          website: honeypotRef.current?.value ?? '', // honeypot; a person leaves it empty
        }),
      });
      const data = await response.json().catch(() => ({}));

      // Paying: the server hands back a payment link and the browser follows it.
      if (intent === 'pay' && response.status === 201 && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return; // stay in the loading state while the browser navigates
      }
      if (response.status === 200 && data.ok) {
        // Honeypot tripped. Say nothing — never tell a bot it was caught.
        setSubmitting(null);
        onClose();
        return;
      }
      // Applying, registering or starting a free course: 201 means it is done.
      // Nothing to pay in any of the three.
      if (intent !== 'pay' && (response.status === 201 || response.status === 200)) {
        // Absent means a brand-new account, which is always emailed its login.
        setEmailedLogin(data.credentialsEmailed !== false);
        setDone(intent === 'apply' ? 'applied' : intent === 'free' ? 'enrolled' : 'registered');
        setSubmitting(null);
        return;
      }
      if (response.status === 409) {
        setShowLogin(true);
        setError(data.error || 'You already have an account for this course — log in to carry on.');
      } else if (response.status === 503) {
        setError(
          intent === 'pay'
            ? 'Online payment is not available at the moment. You can still register now and pay later.'
            : 'Something went wrong. Please try again.',
        );
      } else if (response.status === 429) {
        // The register and free endpoints are throttled per IP and per email, because they send an
        // email on every call. Say what to do rather than "something went wrong" — nothing is
        // broken and trying again immediately will not help.
        setError('That is a few too many attempts. Please wait a few minutes and try again.');
      } else if (response.status === 400) {
        setError(data.error || 'Please check your details and try again.');
      } else if (response.status === 404) {
        setError('This course is unavailable right now. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setSubmitting(null);
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(null);
    }
  }

  const busy = submitting !== null;

  const heading = done
    ? done === 'applied'
      ? 'Application received'
      : done === 'enrolled'
        ? "You're in"
        : "You're registered"
    : mode === 'apply'
      ? 'Apply to join'
      : mode === 'free'
        ? 'Start this course free'
        : 'Enrol on this course';

  const description = done
    ? undefined
    : mode === 'apply'
      ? 'We will contact you about the next cohort, dates and payment.'
      : mode === 'free'
        ? 'It is free. Tell us who you are and we will open it on your dashboard straight away.'
        : `Pay ${priceLabel} now and start today, or register and pay when you are ready.`;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      busy={busy}
      labelId="enrol-title"
      eyebrow={title}
      title={heading}
      description={description}
      footer={
        done ? (
          <DoneFooter
            onClose={onClose}
            signIn={done !== 'applied'}
            label={done === 'registered' ? 'Log in and pay' : 'Log in and start'}
          />
        ) : (
          <Actions
            mode={mode}
            priceLabel={priceLabel}
            submitting={submitting}
            onIntent={(intent) => {
              intentRef.current = intent;
            }}
          />
        )
      }
    >
      {done ? (
        <DoneBody
          done={done}
          email={email.trim()}
          title={title}
          priceLabel={priceLabel}
          emailedLogin={emailedLogin}
        />
      ) : (
        <>
          <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="space-y-4">
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
                <input
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                  required
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-ink">Last name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  autoComplete="family-name"
                  required
                  className={inputClass}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                inputMode="email"
                required
                className={inputClass}
              />
              {mode === 'free' && (
                <span className="mt-1 block text-xs text-ink-subtle">
                  Your login goes here, so do check it is right.
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink">Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                maxLength={40}
                placeholder="0803 000 0000"
                required
                className={inputClass}
              />
              <span className="mt-1 block text-xs text-ink-subtle">
                {mode === 'free'
                  ? 'So we can reach you about this course and the next one. WhatsApp is fine.'
                  : 'So we can reach you about dates and payment. WhatsApp is fine.'}
              </span>
            </label>

            {error && (
              <div
                className="rounded-lg bg-toko-magenta/10 px-4 py-3 text-sm text-toko-magenta-dark dark:text-toko-magenta-light"
                role="alert"
              >
                {error}
                {showLogin && (
                  <>
                    {' '}
                    <a href={LOGIN_URL} className="font-bold underline hover:no-underline">
                      Log in to continue →
                    </a>
                  </>
                )}
              </div>
            )}
          </form>

          {mode === 'pay' && (
            <p className="mt-5 flex items-start gap-2 rounded-lg bg-surface-sunken px-4 py-3 text-xs leading-relaxed text-ink-muted">
              <svg className="mt-0.5 h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <rect x="4" y="10" width="16" height="11" rx="2" strokeWidth="2" />
                <path d="M8 10V7a4 4 0 118 0v3" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>
                Register now and the course waits <strong className="font-semibold text-ink">locked</strong> on your
                dashboard — you can read the syllabus and browse every other course, and unlock it whenever you pay.
              </span>
            </p>
          )}

          {mode === 'free' && (
            <p className="mt-5 flex items-start gap-2 rounded-lg bg-surface-sunken px-4 py-3 text-xs leading-relaxed text-ink-muted">
              <svg className="mt-0.5 h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="m5 13 4 4L19 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                No payment and <strong className="font-semibold text-ink">nothing to approve</strong> — we make your
                account, email you a password, and the course is open the moment you sign in.
              </span>
            </p>
          )}
        </>
      )}
    </Sheet>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The pinned actions.
 *
 * These buttons sit outside the `<form>` they submit — Sheet keeps the footer
 * out of the scrolling region, which is the whole reason the submit button is
 * still on screen when a phone keyboard is up. `form={FORM_ID}` is what lets a
 * button submit a form it is not inside.
 *
 * "Pay now" is the primary and "register, pay later" is quieter but a real
 * button, not a link buried in body text: it is the path for everybody who
 * would otherwise close the dialog and leave no contact details behind.
 */
function Actions({
  mode,
  priceLabel,
  submitting,
  onIntent,
}: {
  mode: Mode;
  priceLabel: string;
  submitting: Intent | null;
  onIntent: (intent: Intent) => void;
}) {
  const busy = submitting !== null;

  if (mode === 'apply') {
    return (
      <button
        type="submit"
        form={FORM_ID}
        disabled={busy}
        onClick={() => onIntent('apply')}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-80"
      >
        {submitting === 'apply' ? (
          <>
            <Spinner />
            Sending…
          </>
        ) : (
          'Send my application'
        )}
      </button>
    );
  }

  if (mode === 'free') {
    return (
      <div className="space-y-2.5">
        <button
          type="submit"
          form={FORM_ID}
          disabled={busy}
          onClick={() => onIntent('free')}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-80"
        >
          {submitting === 'free' ? (
            <>
              <Spinner />
              Setting up your account…
            </>
          ) : (
            'Start the course'
          )}
        </button>
        <p className="pt-0.5 text-center text-xs text-ink-subtle">Free. No card, no payment details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <button
        type="submit"
        form={FORM_ID}
        disabled={busy}
        onClick={() => onIntent('pay')}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-80"
      >
        {submitting === 'pay' ? (
          <>
            <Spinner />
            Taking you to payment…
          </>
        ) : (
          <>Pay {priceLabel} and start now</>
        )}
      </button>
      <button
        type="submit"
        form={FORM_ID}
        disabled={busy}
        onClick={() => onIntent('register')}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting === 'register' ? (
          <>
            <Spinner />
            Saving your place…
          </>
        ) : (
          'Register now, pay later'
        )}
      </button>
      <p className="pt-0.5 text-center text-xs text-ink-subtle">Payments are secured by Paystack.</p>
    </div>
  );
}

/**
 * What happened, and what to do next.
 *
 * Three outcomes, and the difference between them is the whole message: an
 * application waits for a person, a registration waits for money, and a free
 * course waits for nothing at all. Saying "we will be in touch" after the third
 * one would hide the fact that the course is already open.
 */
function DoneBody({
  done,
  email,
  title,
  priceLabel,
  emailedLogin,
}: {
  done: 'applied' | 'registered' | 'enrolled';
  email: string;
  title: string;
  priceLabel: string;
  emailedLogin: boolean;
}) {
  /** How they get in, which depends on whether a password was just emailed. */
  const signInStep = emailedLogin ? (
    <>
      Sign in with the temporary password we emailed to{' '}
      <strong className="font-semibold text-ink">{email}</strong>.
    </>
  ) : (
    <>
      Sign in with the password you already use — this email address has an account, so we have not sent a new
      one.
    </>
  );

  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
          <path d="m5 13 4 4L19 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {done === 'enrolled' && (
        <>
          <p className="text-sm text-ink-muted">
            You are enrolled in <strong className="font-semibold text-ink">{title}</strong>. It is free, so there is
            nothing to pay and nothing to wait for.
          </p>
          <div className="rounded-lg bg-surface-sunken px-4 py-3 text-left text-sm text-ink-muted">
            <p className="font-semibold text-ink">What happens next</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4">
              <li>{signInStep}</li>
              <li>The course is already open on your dashboard — start the first lesson.</li>
              <li>Browse the rest of the catalogue whenever you like.</li>
            </ol>
          </div>
        </>
      )}

      {done === 'registered' && (
        <>
          <p className="text-sm text-ink-muted">
            Your place on <strong className="font-semibold text-ink">{title}</strong> is saved.
          </p>
          <div className="rounded-lg bg-surface-sunken px-4 py-3 text-left text-sm text-ink-muted">
            <p className="font-semibold text-ink">What happens next</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4">
              <li>{signInStep}</li>
              <li>The course sits locked on your dashboard until you pay {priceLabel} — one button unlocks it.</li>
              <li>Browse and pay for anything else in the catalogue meanwhile.</li>
            </ol>
          </div>
        </>
      )}

      {done === 'applied' && (
        <p className="text-sm text-ink-muted">
          Thank you. The admissions team will email <strong className="font-semibold text-ink">{email}</strong> about
          the next cohort, the schedule and how to pay.
        </p>
      )}
    </div>
  );
}

function DoneFooter({ onClose, signIn, label }: { onClose: () => void; signIn: boolean; label: string }) {
  if (!signIn) {
    return (
      <button type="button" onClick={onClose} className="btn-primary w-full">
        Done
      </button>
    );
  }
  return (
    <div className="space-y-2">
      <a href={LOGIN_URL} className="btn-primary w-full">
        {label}
      </a>
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
      >
        I&apos;ll do it later
      </button>
    </div>
  );
}

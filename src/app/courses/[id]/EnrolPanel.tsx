'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

/**
 * The one place a course page turns a reader into a student.
 *
 * Three routes in, decided by the course itself rather than by anything typed
 * into this page:
 *
 *   paid + self-paced  → pay now, account created after payment, start today
 *   free + self-paced  → create an account and begin
 *   scheduled          → apply, and somebody approves before the seat is real
 *
 * Both forms post to the learning platform's public API. This component owns
 * no backend and holds no key: the payment link comes back from the server and
 * the browser follows it, which is why Paystack's keys never touch this site.
 *
 * Replaces a "Register Now" button that sent everybody to the legacy PHP app
 * regardless of what they were buying — and a 15% discount badge that was
 * computed in the browser and never expired.
 */

const API = process.env.NEXT_PUBLIC_DLC_API_URL ?? 'https://learn.tokoacademy.org';
const LOGIN_URL = `${API}/login`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'w-full rounded-lg border border-toko-gray-300 px-3 py-2.5 text-toko-gray-900 outline-none transition focus:border-toko-green focus:ring-2 focus:ring-toko-green/30';

type Props = {
  slug: string;
  title: string;
  price: number;
  priceLabel: string;
  selfPaced: boolean;
};

export default function EnrolPanel({ slug, title, price, priceLabel, selfPaced }: Props) {
  const [open, setOpen] = useState(false);
  const paying = selfPaced && price > 0;
  const applying = !selfPaced;

  // A free self-paced course needs an account, not a form — the platform's own
  // sign-up does that better than a copy of it here would.
  if (selfPaced && price === 0) {
    return (
      <a
        href={LOGIN_URL}
        className="block w-full rounded-lg bg-toko-green px-6 py-3.5 text-center text-lg font-bold text-white shadow-toko transition-colors hover:bg-toko-green-dark"
      >
        Start this course free
      </a>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="w-full btn-primary">
        {paying ? `Enrol & pay ${priceLabel}` : 'Apply to join'}
      </button>
      <p className="mt-3 text-center text-xs text-toko-gray-500">
        {paying
          ? 'Secure payment by Paystack. Your login is emailed straight after.'
          : 'Tell us you are interested and the admissions team will be in touch about dates and payment.'}
      </p>
      <EnrolDialog
        open={open}
        onClose={() => setOpen(false)}
        slug={slug}
        title={title}
        priceLabel={priceLabel}
        applying={applying}
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
  applying,
}: {
  open: boolean;
  onClose: () => void;
  slug: string;
  title: string;
  priceLabel: string;
  applying: boolean;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [done, setDone] = useState(false);

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  submittingRef.current = submitting;

  // Cleared when it opens, not on every render — an error set just before
  // submitting flips back to false would otherwise be wiped before it is read.
  useEffect(() => {
    if (open) {
      setError(null);
      setShowLogin(false);
      setDone(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const focusTimer = setTimeout(() => firstFieldRef.current?.focus(), 50);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submittingRef.current) onClose();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();
    if (!fn || !ln) {
      setError('Please enter your first and last name.');
      return;
    }
    if (!EMAIL_RE.test(em)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setShowLogin(false);

    try {
      const response = await fetch(`${API}/api/public/${applying ? 'apply' : 'enrol'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: fn,
          lastName: ln,
          email: em,
          phone: phone.trim(),
          courseSlug: slug,
          website: honeypotRef.current?.value ?? '', // honeypot; a person leaves it empty
        }),
      });
      const data = await response.json().catch(() => ({}));

      // Paid: the server hands back a payment link and the browser follows it.
      if (!applying && response.status === 201 && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return; // stay in the loading state while the browser navigates
      }
      // Applying: 201 means it is lodged. Nothing to pay yet.
      if (applying && (response.status === 201 || response.status === 200)) {
        setDone(true);
        setSubmitting(false);
        return;
      }
      if (response.status === 200 && data.ok) {
        // Honeypot tripped. Say nothing — never tell a bot it was caught.
        setSubmitting(false);
        onClose();
        return;
      }
      if (response.status === 409) {
        setShowLogin(true);
        setError(data.error || 'You are already enrolled — log in to carry on.');
      } else if (response.status === 503) {
        setError('Online payment is not available at the moment. Please try again shortly.');
      } else if (response.status === 400) {
        setError(data.error || 'Please check your details and try again.');
      } else if (response.status === 404) {
        setError('This course is unavailable right now. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setSubmitting(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enrol-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-toko-lg">
        <div className="relative bg-toko-gray-900 px-6 py-5 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(124,179,66,0.35),transparent_55%)]"
          />
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <p className="relative text-sm font-semibold uppercase tracking-widest text-toko-green-light">
            {title}
          </p>
          <h3 id="enrol-title" className="relative mt-1 text-2xl font-bold">
            {applying ? 'Apply to join' : 'Enrol & start today'}
          </h3>
          <p className="relative mt-1 text-sm text-white/70">
            {applying
              ? 'We will contact you about the next cohort, dates and payment.'
              : `Pay ${priceLabel} securely. Your login is emailed to you right after payment.`}
          </p>
        </div>

        {done ? (
          <div className="space-y-4 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-toko-green/10 text-toko-green">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m5 13 4 4L19 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-toko-gray-900">Application received</h4>
            <p className="text-sm text-toko-gray-600">
              Thank you. The admissions team will email {email.trim()} about the next cohort,
              the schedule and how to pay.
            </p>
            <button type="button" onClick={onClose} className="w-full btn-primary">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6">
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
                <span className="mb-1 block text-sm font-semibold text-toko-gray-700">First name</span>
                <input
                  ref={firstFieldRef}
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                  required
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-toko-gray-700">Last name</span>
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
              <span className="mb-1 block text-sm font-semibold text-toko-gray-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-toko-gray-700">
                Phone <span className="font-normal text-toko-gray-400">(optional)</span>
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                maxLength={40}
                className={inputClass}
              />
            </label>

            {error && (
              <div className="rounded-lg bg-toko-magenta/10 px-4 py-3 text-sm text-toko-magenta-dark" role="alert">
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

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-toko-green px-6 py-3.5 text-lg font-bold text-white shadow-toko transition-all duration-300 hover:bg-toko-green-dark focus:outline-none focus:ring-4 focus:ring-toko-green/50 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {submitting ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  {applying ? 'Sending…' : 'Taking you to payment…'}
                </>
              ) : applying ? (
                <>Send my application</>
              ) : (
                <>Enrol &amp; pay {priceLabel}</>
              )}
            </button>

            {!applying && (
              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-toko-gray-500">
                <svg className="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="4" y="10" width="16" height="11" rx="2" strokeWidth="2" />
                  <path d="M8 10V7a4 4 0 118 0v3" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Secured by Paystack. You&apos;ll be redirected to pay.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

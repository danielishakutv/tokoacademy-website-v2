'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ENROL_ENDPOINT, COURSE_SLUG, LOGIN_URL } from './config';

type Props = {
  open: boolean;
  onClose: () => void;
  price: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'w-full rounded-lg border border-toko-gray-300 px-3 py-2.5 text-toko-gray-900 outline-none transition focus:border-toko-green focus:ring-2 focus:ring-toko-green/30';

/**
 * Enrolment form → Toko Academy public API. On 201 it redirects the browser to
 * Paystack; Toko creates the account and enrols the buyer after payment. This
 * component owns no backend — it only POSTs and redirects.
 */
export default function EnrolModal({ open, onClose, price }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  submittingRef.current = submitting;

  // Reset transient state ONLY when the modal opens — not on every submitting
  // change, or an error set right before setSubmitting(false) would be wiped.
  useEffect(() => {
    if (open) {
      setError(null);
      setShowLogin(false);
    }
  }, [open]);

  // Focus first field, Esc-to-close, and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const focusTimer = setTimeout(() => firstFieldRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submittingRef.current) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
      const res = await fetch(ENROL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: fn,
          lastName: ln,
          email: em,
          phone: phone.trim(),
          courseSlug: COURSE_SLUG,
          website: honeypotRef.current?.value ?? '', // honeypot, stays empty
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 201 && data.authorizationUrl) {
        // Success → hand off to Paystack. Stay in the loading state while we navigate.
        window.location.href = data.authorizationUrl;
        return;
      }
      if (res.status === 200 && data.ok) {
        // Honeypot tripped (a bot) — silently ignore.
        setSubmitting(false);
        return;
      }
      if (res.status === 409) {
        setShowLogin(true);
        setError(data.error || "You're already enrolled — just log in to continue.");
      } else if (res.status === 503) {
        setError(data.error || "Online payment isn't available yet. Please try again later.");
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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enrol-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-toko-lg">
        {/* header */}
        <div className="relative bg-toko-gray-900 px-6 py-5 text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(124,179,66,0.35),transparent_55%)]" />
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <p className="relative text-sm font-semibold uppercase tracking-widest text-toko-green-light">Zero to Live</p>
          <h3 id="enrol-title" className="relative mt-1 text-2xl font-bold">Enrol &amp; start today</h3>
          <p className="relative mt-1 text-sm text-white/70">
            Pay {price} securely. Your login is emailed to you right after payment.
          </p>
        </div>

        {/* form — validation is handled in JS (handleSubmit) so we show styled errors */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6">
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
              <span className="mb-1 block text-sm font-semibold text-toko-gray-700">First name</span>
              <input ref={firstFieldRef} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-toko-gray-700">Last name</span>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required className={inputClass} />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-toko-gray-700">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className={inputClass} />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-toko-gray-700">
              Phone <span className="font-normal text-toko-gray-400">(optional)</span>
            </span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" maxLength={40} className={inputClass} />
          </label>

          {error && (
            <div className="rounded-lg bg-toko-magenta/10 px-4 py-3 text-sm text-toko-magenta-dark" role="alert">
              {error}
              {showLogin && (
                <>
                  {' '}
                  <a href={LOGIN_URL} className="font-bold underline hover:no-underline">Log in to continue →</a>
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
                Taking you to payment…
              </>
            ) : (
              <>Enrol &amp; pay {price}</>
            )}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-toko-gray-500">
            <svg className="h-4 w-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="10" width="16" height="11" rx="2" strokeWidth="2" /><path d="M8 10V7a4 4 0 118 0v3" strokeWidth="2" strokeLinecap="round" /></svg>
            Secured by Paystack. You&apos;ll be redirected to pay.
          </p>
        </form>
      </div>
    </div>
  );
}

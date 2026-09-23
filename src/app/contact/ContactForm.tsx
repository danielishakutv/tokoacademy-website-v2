'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ENQUIRY_ENDPOINT } from '@/lib/enquiries';

/**
 * The contact form.
 *
 * Three things keep it from becoming a spam funnel, and none of them asks a
 * real person to do anything:
 *
 * - A **honeypot** field, off-screen and hidden from screen readers. A person
 *   never sees it; a bot fills every field it finds. The server answers a
 *   tripped honeypot with the same success message a person gets, because
 *   telling a bot it was caught is how it learns to stop.
 * - **Cloudflare Turnstile**, when a key is configured. Unlike a picture
 *   puzzle it usually resolves without the visitor doing anything at all.
 * - The server's **rate limit**, which needs no help from this file.
 *
 * With no Turnstile key set the widget simply is not rendered and the other
 * two still apply — so this page works before anybody has been to Cloudflare.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'w-full rounded-lg border border-line-strong bg-surface-raised px-4 py-3 text-ink outline-none transition placeholder:text-ink-subtle focus:border-brand focus:ring-2 focus:ring-brand/30';

export default function ContactForm({ siteKey }: { siteKey: string | null }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const honeypotRef = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const tokenRef = useRef<string>('');

  // Turnstile's script is only fetched when there is a key to use it with —
  // no key means no third-party script on the page at all.
  useEffect(() => {
    if (!siteKey || !captchaRef.current) return;

    let cancelled = false;

    const render = () => {
      if (cancelled || !captchaRef.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(captchaRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          tokenRef.current = token;
        },
        'expired-callback': () => {
          tokenRef.current = '';
        },
        // Follow the page, not the operating system: the theme here is a
        // class on <html>, and a white captcha box on a dark form is the one
        // piece of this page we do not control the colours of.
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      });
    };

    if (window.turnstile) {
      render();
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = render;
    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      setError('Please tell us your name.');
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError('Please enter an email address we can reply to.');
      return;
    }
    if (trimmedMessage.length < 5) {
      setError('Please tell us a little more.');
      return;
    }
    if (siteKey && !tokenRef.current) {
      setError('Please wait a moment for the verification to finish, then try again.');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await fetch(ENQUIRY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // No cookies, deliberately: this endpoint is open to any origin
        // precisely because it carries no session.
        credentials: 'omit',
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: phone.trim(),
          subject: subject.trim(),
          message: trimmedMessage,
          source: typeof window === 'undefined' ? '' : window.location.pathname,
          captchaToken: tokenRef.current,
          website: honeypotRef.current?.value ?? '',
        }),
      });

      if (response.ok) {
        setSent(true);
        return;
      }

      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? 'Something went wrong. Please try again, or email us directly.');
      // A refused captcha cannot be retried with the same token.
      if (siteKey && window.turnstile && widgetId.current) {
        window.turnstile.reset(widgetId.current);
        tokenRef.current = '';
      }
    } catch {
      setError('We could not send that. Please check your connection, or email us directly.');
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="card p-6 sm:p-8">
        <div className="rounded-lg bg-brand-soft p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m5 13 4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2">Thank you — we have your message</h2>
          <p className="text-ink-muted">
            We reply to {email.trim()} within one working day. If it is urgent, please call us on the
            numbers above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8">
      <h2 className="mb-2">Send Us a Message</h2>
      <p className="mb-6 text-ink-muted">
        We reply within one working day.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Honeypot. Off-screen and hidden from assistive tech, so only a bot finds it. */}
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

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Your name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Email</span>
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
            <span className="mb-1.5 block text-sm font-semibold text-ink">
              Phone <span className="font-normal text-ink-subtle">(optional)</span>
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
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            Subject <span className="font-normal text-ink-subtle">(optional)</span>
          </span>
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={160}
            placeholder="Which course, or what it is about"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            required
            maxLength={5000}
            className={inputClass}
          />
        </label>

        {siteKey && <div ref={captchaRef} className="min-h-[65px]" />}

        {error && (
          <div className="rounded-lg bg-toko-magenta/10 px-4 py-3 text-sm text-toko-magenta-dark dark:text-toko-magenta-light" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="btn-primary inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              Sending…
            </>
          ) : (
            'Send message'
          )}
        </button>

        <p className="text-center text-xs text-ink-subtle">
          We use what you send here only to reply to you.
        </p>
      </form>
    </div>
  );
}

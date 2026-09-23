'use client';

import { useEffect, useState } from 'react';

/**
 * Light and dark, as a choice rather than a guess.
 *
 * The starting position is the visitor's system preference, read by the
 * inline script in <head>. Pressing this overrides it and remembers, because
 * somebody who chose dark on a bright phone meant it.
 *
 * It renders a fixed-size placeholder until mounted. The alternative — reading
 * the theme during render — cannot work: the server has no idea which theme
 * this visitor uses, so whatever it drew would be wrong half the time and
 * React would tear it down. Reserving the space means the header does not
 * shift when the real control appears.
 */

const STORAGE_KEY = 'toko-theme';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Follow the system if the visitor has never chosen for themselves.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        /* private window */
      }
      if (stored) return;
      document.documentElement.classList.toggle('dark', event.matches);
      setDark(event.matches);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.style.colorScheme = next ? 'dark' : 'light';
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      /* the theme still applies for this visit */
    }
  }

  if (!mounted) {
    return <span className={`inline-block size-9 ${className}`} aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className={`group relative inline-flex size-9 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:border-brand hover:text-brand ${className}`}
    >
      {/* Sun and moon cross-fade rather than swapping, so the control does not blink. */}
      <svg
        className={`absolute size-[18px] transition-all duration-300 ${dark ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        className={`absolute size-[18px] transition-all duration-300 ${dark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation, contactInfo, externalLinks } from '@/data/config';
import ThemeToggle from '@/components/ui/ThemeToggle';

/**
 * The site header, and the menu a phone actually opens.
 *
 * Two things were wrong with what stood here.
 *
 * **The mobile menu was a list pushed under the header bar.** It pushed the
 * bar taller, it scrolled with a `max-h-[70vh]` window inside a page that was
 * also scrolling, it had no way out except the same small icon that opened it,
 * and its links were 32 pixels tall on a screen where a fingertip is closer to
 * 44. It is now a drawer: it covers the page, dims what is behind it, locks
 * the page still while it is open, closes on Escape, on a tap outside, and on
 * going anywhere — and keeps the keyboard inside itself while it is up.
 *
 * **The colours were fixed.** `bg-white`, `text-toko-gray-700` and a
 * near-black utility bar are three decisions that only work in one theme. Every
 * surface here is now a token, so the header is correct in both.
 *
 * The utility strip at the top is the one judgement call: it was a black slab
 * with white text, which in a dark theme would have to either stay black
 * against a black page or flip to white and glare. It is now a quiet sunken
 * strip that reads as a utility bar in both themes and carries no fixed colour
 * at all.
 */

const DRAWER_MS = 260;

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  /*
   * The drawer's two pieces of state. `menuOpen` is the intent; `drawerInDom`
   * keeps the panel present for the length of its exit so it can slide out
   * rather than vanish, and `drawerOpen` is the painted position. Splitting
   * them is what makes an entry animation possible at all: an element cannot
   * transition from a position it was never painted in.
   */
  const [drawerInDom, setDrawerInDom] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const normalizeHref = useCallback((href: string) => {
    const [pathOnly] = href.split('?');
    if (!pathOnly) {
      return '/';
    }
    if (pathOnly === '/') {
      return '/';
    }
    return pathOnly.endsWith('/') ? pathOnly.slice(0, -1) : pathOnly;
  }, []);

  const isActiveHref = useCallback((href: string) => {
    const normalizedHref = normalizeHref(href);
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

    if (normalizedHref === '/') {
      return normalizedPath === '/';
    }

    return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
  }, [normalizeHref, pathname]);

  const isDropdownActive = useCallback((item: { dropdown?: Array<{ href: string }> }) => {
    return Boolean(item.dropdown?.some((subItem) => isActiveHref(subItem.href)));
  }, [isActiveHref]);

  const closeMenu = useCallback((returnFocus = false) => {
    setMenuOpen(false);
    setOpenMobileDropdown(null);
    // Only when the visitor dismissed the menu themselves. Following a link
    // should leave focus wherever the new page puts it.
    if (returnFocus) menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Going anywhere closes the menu — including a link that only changes the
  // route, where no click handler of ours runs.
  useEffect(() => {
    setMenuOpen(false);
    setOpenMobileDropdown(null);
    setOpenDropdown(null);
  }, [pathname]);

  // Mount, paint closed, then open on the next frame; on the way out, linger
  // for the length of the slide. Under `prefers-reduced-motion` the transition
  // is already neutered globally, so the panel is gone at once and the wait is
  // invisible.
  useEffect(() => {
    if (menuOpen) {
      setDrawerInDom(true);
      const frame = requestAnimationFrame(() => setDrawerOpen(true));
      return () => cancelAnimationFrame(frame);
    }
    setDrawerOpen(false);
    const timer = setTimeout(() => setDrawerInDom(false), DRAWER_MS);
    return () => clearTimeout(timer);
  }, [menuOpen]);

  // Hold the page still, and hear Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const { body } = document;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
    };

    /*
     * Fixing the body rather than setting `overflow: hidden` on it. iOS Safari
     * ignores the latter for touch scrolling and happily drags the page around
     * behind an overlay — which is precisely the phone this drawer exists for.
     * The negative offset holds the visitor's place, and the scroll position is
     * put back on close.
     */
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu(true);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen, closeMenu]);

  // Keep the keyboard inside the drawer. The list is read fresh on every Tab
  // because opening a sub-menu changes what is in it.
  useEffect(() => {
    if (!menuOpen || !drawerInDom) return;
    const panel = panelRef.current;
    if (!panel) return;

    panel.querySelector<HTMLElement>('[data-drawer-autofocus]')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener('keydown', onKeyDown);
    return () => panel.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, drawerInDom]);

  // Escape also closes an open desktop dropdown.
  useEffect(() => {
    if (!openDropdown) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenDropdown(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openDropdown]);

  const drawerLink =
    'flex min-h-[44px] items-center rounded-lg px-4 text-base font-medium transition-colors';

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility bar. Hidden on phones — the same numbers are in the drawer. */}
      <div className="hidden border-b border-line bg-surface-sunken text-sm text-ink-muted md:block">
        <div className="section-container">
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs lg:text-sm">
              <a href={`tel:${contactInfo.phones[0]}`} className="link-hover flex items-center gap-1.5">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.08 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.12.9.33 1.78.63 2.62a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.46-1.12a2 2 0 012.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0122 16.92z" />
                </svg>
                {contactInfo.phones[0]}
              </a>
              <span className="hidden text-line-strong lg:inline" aria-hidden>|</span>
              <a href={`tel:${contactInfo.phones[1]}`} className="link-hover hidden items-center gap-1.5 lg:flex">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.08 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.12.9.33 1.78.63 2.62a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.46-1.12a2 2 0 012.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0122 16.92z" />
                </svg>
                {contactInfo.phones[1]}
              </a>
              <span className="hidden text-line-strong lg:inline" aria-hidden>|</span>
              <a href={`mailto:${contactInfo.email}`} className="link-hover flex items-center gap-1.5">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
                </svg>
                {contactInfo.email}
              </a>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <SocialLinks className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav
        className={`border-b bg-surface transition-all duration-300 ${
          isScrolled ? 'border-line shadow-lg shadow-ink/5 py-2.5' : 'border-transparent py-3.5'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between gap-3">
            {/* Logo.

                Untouched in both themes on purpose. The mark is a coloured
                pinwheel and the wordmark is the brand green — both read on a
                dark ground, and inverting it to a white silhouette would throw
                away the only colour the brand actually owns. */}
            <Link href="/" className="flex shrink-0 items-center" aria-label="Toko Academy, home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/toko-academy.png"
                alt="Toko Academy"
                width={445}
                height={144}
                className={`w-auto transition-all duration-300 ${isScrolled ? 'h-9 sm:h-10' : 'h-10 sm:h-11 lg:h-12'}`}
                loading="eager"
                // The logo is in the first screenful; it should not queue behind
                // anything else.
                fetchPriority="high"
                decoding="async"
              />
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-7 lg:flex xl:gap-8">
              {navigation.map((item) => {
                if (item.dropdown) {
                  const isActive = isDropdownActive(item);
                  const isOpen = openDropdown === item.name;
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(item.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {/* A button that did nothing when pressed is a button
                          only a mouse could use. */}
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(isOpen ? null : item.name)}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        className={`flex items-center gap-1 font-medium transition-colors duration-300 ${
                          isActive ? 'text-brand' : 'text-ink-muted hover:text-brand'
                        }`}
                      >
                        {item.name}
                        <svg
                          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      {isActive && <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-brand/70" aria-hidden />}

                      {isOpen && (
                        <div className="absolute right-0 top-full z-50 w-64 rounded-xl border border-line bg-surface-raised py-2 shadow-2xl shadow-ink/10">
                          {item.dropdown.map((subItem: any) => {
                            const isSubActive = isActiveHref(subItem.href);
                            return (
                              <div key={subItem.name} className="group/submenu relative">
                                {subItem.megaMenu ? (
                                  <div className="relative">
                                    <Link
                                      href={subItem.href}
                                      className={`flex items-center justify-between px-4 py-2.5 transition-colors ${
                                        isSubActive
                                          ? 'bg-brand/10 font-semibold text-brand'
                                          : 'text-ink-muted hover:bg-brand/10 hover:text-brand'
                                      }`}
                                    >
                                      {subItem.name}
                                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                                      </svg>
                                    </Link>
                                    <div className="absolute right-full top-0 z-50 mr-1 hidden w-80 rounded-xl border border-line bg-surface-raised py-2 shadow-2xl shadow-ink/10 group-hover/submenu:block">
                                      {subItem.megaMenu.map((megaItem: any) => (
                                        <Link
                                          key={megaItem.name}
                                          href={megaItem.href}
                                          className="block px-4 py-3 transition-colors hover:bg-brand/10"
                                        >
                                          <div className="flex items-start gap-3">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
                                              {/* eslint-disable-next-line @next/next/no-img-element */}
                                              <img
                                                src={megaItem.image}
                                                alt={megaItem.name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                  const target = e.target as HTMLImageElement;
                                                  target.style.display = 'none';
                                                }}
                                              />
                                            </div>
                                            <div>
                                              <div className="font-medium text-ink">{megaItem.name}</div>
                                              <div className="text-sm text-ink-muted">{megaItem.description}</div>
                                            </div>
                                          </div>
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <Link
                                    href={subItem.href}
                                    className={`block px-4 py-2.5 transition-colors ${
                                      isSubActive
                                        ? 'bg-brand/10 font-semibold text-brand'
                                        : 'text-ink-muted hover:bg-brand/10 hover:text-brand'
                                    }`}
                                  >
                                    {subItem.name}
                                  </Link>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = isActiveHref(item.href);
                const className = `font-medium transition-colors duration-300 ${
                  isActive ? 'text-brand' : 'text-ink-muted hover:text-brand'
                }`;

                return item.external ? (
                  <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                    {item.name}
                  </a>
                ) : (
                  <Link key={item.name} href={item.href} className={className}>
                    {item.name}
                  </Link>
                );
              })}
              <ThemeToggle />
              {/* An internal page now, so no target="_blank": opening our own
                  catalogue in a new tab strands the visitor's back button. */}
              <Link href={externalLinks.applyNow} className="btn-primary px-6 py-3 text-base">
                Apply Now
              </Link>
            </div>

            {/* Phone controls. Both are 44px, the smallest a fingertip finds
                reliably, and they sit on the same baseline as the logo. */}
            <div className="flex items-center gap-1 lg:hidden">
              {/* `!` because the toggle carries its own `size-9`, which is the
                  right size beside desktop text and too small for a thumb. */}
              <ThemeToggle className="!size-11" />
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => (menuOpen ? closeMenu(true) : setMenuOpen(true))}
                className="inline-flex size-11 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-brand"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ========================= MOBILE DRAWER ========================= */}
      {drawerInDom && (
        <>
          {/* The page behind, dimmed. Tapping it is the gesture most people
              try first, so it must be the one that works. */}
          <div
            // Black, not `bg-ink/50`: ink is near-white in the dark theme, and
            // a scrim that lightens the page is not a scrim.
            className={`fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
              drawerOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => closeMenu(true)}
            aria-hidden
          />

          <div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className={`fixed inset-y-0 right-0 z-50 flex w-[min(20rem,86vw)] flex-col border-l border-line bg-surface shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
              drawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="eyebrow">Menu</span>
              <button
                type="button"
                data-drawer-autofocus
                onClick={() => closeMenu(true)}
                className="inline-flex size-11 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-brand"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
              {navigation.map((item) => {
                if (item.dropdown) {
                  const isActive = isDropdownActive(item);
                  const isOpen = openMobileDropdown === item.name;
                  return (
                    <div key={item.name}>
                      <button
                        type="button"
                        onClick={() => setOpenMobileDropdown(isOpen ? null : item.name)}
                        aria-expanded={isOpen}
                        className={`${drawerLink} w-full justify-between ${
                          isActive ? 'text-brand' : 'text-ink hover:bg-surface-sunken'
                        }`}
                      >
                        {item.name}
                        <svg
                          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="mb-1 ml-4 border-l border-line pl-2">
                          {item.dropdown.map((subItem: any) => {
                            const isSubActive = isActiveHref(subItem.href);
                            return (
                              <div key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  onClick={() => closeMenu()}
                                  className={`${drawerLink} text-[0.95rem] ${
                                    isSubActive ? 'font-semibold text-brand' : 'text-ink-muted hover:bg-surface-sunken'
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                                {subItem.megaMenu && (
                                  <div className="ml-3 border-l border-line pl-2">
                                    {subItem.megaMenu.map((megaItem: any) => (
                                      <Link
                                        key={megaItem.name}
                                        href={megaItem.href}
                                        onClick={() => closeMenu()}
                                        className={`${drawerLink} text-sm text-ink-subtle hover:bg-surface-sunken hover:text-brand`}
                                      >
                                        {megaItem.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = isActiveHref(item.href);
                const className = `${drawerLink} ${
                  isActive ? 'font-semibold text-brand' : 'text-ink hover:bg-surface-sunken'
                }`;

                return item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => closeMenu()}
                    className={className}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link key={item.name} href={item.href} onClick={() => closeMenu()} className={className}>
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* The utility bar is hidden on phones, so its contents live here
                instead — otherwise a phone has no route to a phone number from
                the header at all. */}
            <div className="border-t border-line px-4 py-4">
              <Link
                href={externalLinks.applyNow}
                onClick={() => closeMenu()}
                className="btn-primary w-full"
              >
                Apply Now
              </Link>
              <div className="mt-4 space-y-1 text-sm">
                <a href={`tel:${contactInfo.phones[0]}`} className="link-hover flex min-h-[44px] items-center gap-2 text-ink-muted">
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.08 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.12.9.33 1.78.63 2.62a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.46-1.12a2 2 0 012.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0122 16.92z" />
                  </svg>
                  {contactInfo.phones[0]}
                </a>
                <a href={`mailto:${contactInfo.email}`} className="link-hover flex min-h-[44px] items-center gap-2 break-all text-ink-muted">
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
                  </svg>
                  {contactInfo.email}
                </a>
              </div>
              {/* `-ml-2.5` pulls the row back into line with the text above
                  it, now that each icon sits in a 44px box of its own. */}
              <div className="-ml-2.5 mt-2 flex flex-wrap items-center text-ink-subtle">
                <SocialLinks className="h-5 w-5" linkClassName="inline-flex size-11 items-center justify-center rounded-lg" />
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

/**
 * The same five accounts in the utility bar and in the drawer.
 *
 * `linkClassName` exists because the two places want different targets: on a
 * desktop utility strip a 20px icon is a fine mouse target, and on a phone it
 * is a quarter of a fingertip. The drawer passes a 44px box.
 */
function SocialLinks({ className, linkClassName = '' }: { className: string; linkClassName?: string }) {
  return (
    <>
      <a href={contactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className={`link-hover ${linkClassName}`} aria-label="Facebook">
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      <a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className={`link-hover ${linkClassName}`} aria-label="Instagram">
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      </a>
      <a href={contactInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className={`link-hover ${linkClassName}`} aria-label="X (Twitter)">
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href={contactInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className={`link-hover ${linkClassName}`} aria-label="LinkedIn">
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
      <a href={contactInfo.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className={`link-hover ${linkClassName}`} aria-label="WhatsApp">
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
    </>
  );
}

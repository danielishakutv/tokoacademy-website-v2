'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation, contactInfo } from '@/data/config';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      {/* Top Mini Bar */}
      <div className="hidden md:block bg-toko-gray-900 text-white text-sm">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-center py-2 gap-2">
            {/* Contact Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm">
              <a href={`tel:${contactInfo.phones[0]}`} className="link-hover flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.08 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.12.9.33 1.78.63 2.62a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.46-1.12a2 2 0 012.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0122 16.92z" />
                </svg>
                {contactInfo.phones[0]}
              </a>
              <span className="hidden md:inline">|</span>
              <a href={`tel:${contactInfo.phones[1]}`} className="link-hover flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.08 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.12.9.33 1.78.63 2.62a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.46-1.12a2 2 0 012.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0122 16.92z" />
                </svg>
                {contactInfo.phones[1]}
              </a>
              <span className="hidden md:inline">|</span>
              <a href={`mailto:${contactInfo.email}`} className="link-hover flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
                </svg>
                {contactInfo.email}
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href={contactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="link-hover" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="link-hover" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={contactInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="link-hover" aria-label="X (Twitter)">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={contactInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="link-hover" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href={contactInfo.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="link-hover" aria-label="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`bg-white transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}>
        <div className="section-container">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://tokoacademy.org/logo/ta_logo_png.png" 
                alt="Toko Academy" 
                className={`transition-all duration-300 ${isScrolled ? 'h-10' : 'h-12'}`}
                loading="eager"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                item.dropdown ? (
                  (() => {
                    const isActive = isDropdownActive(item);
                    return (
                  <div
                    key={item.name}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className={`font-medium transition-colors duration-300 flex items-center gap-1 ${isActive ? 'text-toko-green' : 'text-toko-gray-700 hover:text-toko-green'}`}>
                      {item.name}
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {isActive && <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-toko-green/70" aria-hidden />}
                    
                    {openDropdown === item.name && (
                      <div className="absolute top-full right-0 mt-0 w-64 bg-white shadow-2xl rounded-lg py-2 z-50 border border-toko-gray-200">
                        {item.dropdown.map((subItem: any) => (
                          (() => {
                            const isSubActive = isActiveHref(subItem.href);
                            return (
                          <div key={subItem.name} className="relative group/submenu">
                            {subItem.megaMenu ? (
                              <div className="relative">
                                <Link
                                  href={subItem.href}
                                  className={`block px-4 py-2 transition-colors flex items-center justify-between ${isSubActive ? 'bg-toko-green/10 text-toko-green font-semibold' : 'text-toko-gray-700 hover:bg-toko-green/10 hover:text-toko-green'}`}
                                >
                                  {subItem.name}
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                                  </svg>
                                </Link>
                                <div className="hidden group-hover/submenu:block absolute right-full top-0 mr-1 w-80 bg-white shadow-2xl rounded-lg py-2 border border-toko-gray-200 z-50">
                                  {subItem.megaMenu.map((megaItem: any) => (
                                    <Link
                                      key={megaItem.name}
                                      href={megaItem.href}
                                      className="block px-4 py-3 hover:bg-toko-green/10 transition-colors"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="w-16 h-16 bg-toko-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img 
                                            src={megaItem.image} 
                                            alt={megaItem.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              const target = e.target as HTMLImageElement;
                                              target.style.display = 'none';
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <div className="font-medium text-toko-gray-900">{megaItem.name}</div>
                                          <div className="text-sm text-toko-gray-600">{megaItem.description}</div>
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Link
                                href={subItem.href}
                                className={`block px-4 py-2 transition-colors ${isSubActive ? 'bg-toko-green/10 text-toko-green font-semibold' : 'text-toko-gray-700 hover:bg-toko-green/10 hover:text-toko-green'}`}
                              >
                                {subItem.name}
                              </Link>
                            )}
                          </div>
                            );
                          })()
                        ))}
                      </div>
                    )}
                  </div>
                    );
                  })()
                ) : item.external ? (
                  (() => {
                    const isActive = isActiveHref(item.href);
                    return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-medium transition-colors duration-300 ${isActive ? 'text-toko-green' : 'text-toko-gray-700 hover:text-toko-green'}`}
                  >
                    {item.name}
                  </a>
                    );
                  })()
                ) : (
                  (() => {
                    const isActive = isActiveHref(item.href);
                    return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`font-medium transition-colors duration-300 ${isActive ? 'text-toko-green' : 'text-toko-gray-700 hover:text-toko-green'}`}
                  >
                    {item.name}
                  </Link>
                    );
                  })()
                )
              ))}
              <Link
                href="/register/"
                className="btn-primary py-3 px-6 text-base"
              >
                Apply Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-toko-gray-700 hover:text-toko-green transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mounted && isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-toko-gray-200 max-h-[70vh] overflow-y-auto overscroll-contain pr-1">
              <div className="flex flex-col gap-4 mt-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      (() => {
                        const isActive = isDropdownActive(item);
                        return (
                      <div>
                        <button
                          onClick={() => setOpenMobileDropdown(openMobileDropdown === item.name ? null : item.name)}
                          className={`w-full text-left font-medium transition-colors duration-300 py-2 flex items-center justify-between ${isActive ? 'text-toko-green' : 'text-toko-gray-700 hover:text-toko-green'}`}
                        >
                          {item.name}
                          <svg
                            className={`h-5 w-5 transition-transform ${openMobileDropdown === item.name ? 'rotate-180' : ''}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                          </svg>
                        </button>
                        {openMobileDropdown === item.name && (
                          <div className="pl-4 mt-2 space-y-2">
                            {item.dropdown.map((subItem: any) => (
                              (() => {
                                const isSubActive = isActiveHref(subItem.href);
                                return (
                              <div key={subItem.name}>
                                {subItem.megaMenu ? (
                                  <div>
                                    <Link
                                      href={subItem.href}
                                      className={`block py-2 font-medium ${isSubActive ? 'text-toko-green' : 'text-toko-gray-600 hover:text-toko-green'}`}
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      {subItem.name}
                                    </Link>
                                    <div className="pl-4 space-y-1">
                                      {subItem.megaMenu.map((megaItem: any) => (
                                        <Link
                                          key={megaItem.name}
                                          href={megaItem.href}
                                          className="block text-sm text-toko-gray-600 hover:text-toko-green py-1.5"
                                          onClick={() => setIsMenuOpen(false)}
                                        >
                                          → {megaItem.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <Link
                                    href={subItem.href}
                                    className={`block py-2 ${isSubActive ? 'text-toko-green font-semibold' : 'text-toko-gray-600 hover:text-toko-green'}`}
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    {subItem.name}
                                  </Link>
                                )}
                              </div>
                                );
                              })()
                            ))}
                          </div>
                        )}
                      </div>
                        );
                      })()
                    ) : item.external ? (
                      (() => {
                        const isActive = isActiveHref(item.href);
                        return (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-medium transition-colors duration-300 py-2 block ${isActive ? 'text-toko-green' : 'text-toko-gray-700 hover:text-toko-green'}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                        );
                      })()
                    ) : (
                      (() => {
                        const isActive = isActiveHref(item.href);
                        return (
                      <Link
                        href={item.href}
                        className={`font-medium transition-colors duration-300 py-2 block ${isActive ? 'text-toko-green' : 'text-toko-gray-700 hover:text-toko-green'}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                        );
                      })()
                    )}
                  </div>
                ))}
                <Link
                  href="/register/"
                  className="btn-primary text-center mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

import type { Metadata } from 'next'
import { Suspense } from 'react'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import MatomoAnalytics from '@/components/MatomoAnalytics'
import { SITE_URL, siteJsonLd, jsonLdScript } from '@/lib/seo'
import ThemeScript from '@/components/ui/ThemeScript'
import Cursor from '@/components/ui/Cursor'
import Reveal from '@/components/ui/Reveal'
import PointerField from '@/components/ui/PointerField'

/**
 * One typeface, self-hosted from a file in this repository.
 *
 * It is served from our own origin either way — next/font does that for both
 * `google` and `local` — so there is still no request to Google from a
 * visitor's browser, no render-blocking stylesheet and nothing that can leak
 * somebody to a third party. `display: swap` means text is readable in the
 * system font from the first paint rather than invisible while the font
 * arrives, which matters most on exactly the slow connections this audience is
 * on.
 *
 * It used to be `Plus_Jakarta_Sans` from `next/font/google`, which fetches
 * the file from fonts.gstatic.com AT BUILD TIME. That put Google in the path of
 * every build of this site. On 2026-10-07 the nightly build failed inside that
 * loader — `TypeError: Cannot read properties of null (reading '1')` — and
 * because the nightly build is the only thing that picks up a course edited in
 * the admin, the site quietly stopped updating for thirty hours without a line
 * of code having changed.
 *
 * The file below is the same variable font, the same `latin` subset and the
 * same weight range, committed here instead of fetched. One fewer thing that
 * has to be reachable for a deploy to work.
 */
const jakarta = localFont({
  src: '../fonts/PlusJakartaSans-latin-variable.woff2',
  // One variable file covers the whole range the old explicit weight list
  // (400, 500, 600, 700, 800) used to ask Google for.
  weight: '400 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-sans',
  // Exactly the range Google's own `latin` face declares, so which glyphs come
  // from this file and which fall back to a system font is unchanged. Note the
  // naira sign is NOT in it — U+20A6 belongs to latin-ext, which this site has
  // never shipped — so ₦ renders in the fallback font exactly as it did before.
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
    },
  ],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // `default` is only used by a page that sets no title of its own.
    // `template` appends the site name, so page titles must NOT repeat it.
    default: 'Toko Academy — Digital Skills Training in Nigeria',
    template: '%s | Toko Academy'
  },
  description: 'Toko Academy empowers individuals and organizations with industry-relevant digital skills. Learn Web Development, Data Analysis, AI, Digital Marketing, and more. Trusted by 2K+ learners globally.',
  keywords: ['digital skills', 'coding bootcamp', 'web development', 'data analysis', 'AI training', 'digital marketing', 'Nigeria tech training', 'online courses', 'kids coding', 'corporate training'],
  authors: [{ name: 'Toko Academy' }],
  creator: 'Toko Academy',
  publisher: 'Toko Academy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: `${SITE_URL}/`,
    title: 'Toko Academy - Skills for Tomorrow',
    description: 'Empower yourself with industry-relevant digital skills. Learn from expert instructors with hands-on training for real-world success.',
    siteName: 'Toko Academy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Toko Academy - Skills for Tomorrow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toko Academy - Skills for Tomorrow',
    description: 'Empower yourself with industry-relevant digital skills. Learn from expert instructors.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <link rel="preconnect" href="https://tokoacademy.org" />
        <link rel="preconnect" href="https://wp.tokoacademy.org" />
        <link rel="dns-prefetch" href="https://app.tokoacademy.org" />
        {/* Matches `toko-green.DEFAULT` in tailwind.config.ts, which was
            deepened from the logo's #7CB342 to clear WCAG contrast. */}
        <meta name="theme-color" content="#4A7C2A" />
        {/*
          Who we are, once, for the whole site. Every page inherits it, so
          search engines and AI assistants can resolve "Toko Academy" to one
          entity with a verified address, contact points and social profiles
          rather than guessing from page copy.

          The typeface is self-hosted by next/font and preloaded, so there is
          still no third-party font request — see the `jakarta` definition
          above.
        */}
        <script {...jsonLdScript(siteJsonLd)} />
        {/* Sets the theme before the first paint. Must stay blocking and in
            <head>; an effect would run after the page had already been
            painted in the wrong one. */}
        <ThemeScript />
      </head>
      <body>
        <ServiceWorkerRegister />
        {/* Draws over the native pointer on mouse-driven devices, and renders
            nothing at all on touch screens or for anyone who has asked for
            reduced motion. */}
        <Cursor />
        {/* One observer for every `.reveal` on the page, rather than a client
            component wrapped around each section. */}
        <Reveal />
        {/* Publishes the pointer position as CSS variables, which the
            decorative washes drift against. Nothing on touch devices. */}
        <PointerField />
        <Suspense fallback={null}>
          <MatomoAnalytics />
        </Suspense>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main className="min-h-screen">
          {children}
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  )
}

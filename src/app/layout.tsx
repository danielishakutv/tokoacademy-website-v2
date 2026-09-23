import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
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
 * One typeface, self-hosted and preloaded.
 *
 * next/font downloads it at build time and serves it from our own origin, so
 * there is no request to Google, no render-blocking stylesheet and nothing
 * that can leak a visitor to a third party. `display: swap` means text is
 * readable in the system font from the first paint rather than invisible
 * while the font arrives — which matters most on exactly the slow connections
 * this audience is on.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
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

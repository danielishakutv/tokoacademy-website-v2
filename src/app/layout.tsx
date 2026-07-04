import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import MatomoAnalytics from '@/components/MatomoAnalytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://tokoacademy.org'),
  title: {
    default: 'Toko Academy - Skills for Tomorrow | Digital Skills Training in Nigeria',
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
    url: 'https://tokoacademy.org',
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://tokoacademy.org" />
        <link rel="preconnect" href="https://wp.tokoacademy.org" />
        <link rel="dns-prefetch" href="https://app.tokoacademy.org" />
        <meta name="theme-color" content="#7CB342" />
      </head>
      <body>
        <ServiceWorkerRegister />
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

'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    _paq?: unknown[][]
  }
}

const MATOMO_URL = 'https://analytics.aictig.org/'
const MATOMO_SITE_ID = '3'

export default function MatomoAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    // The inline snippet below tracks the first page view; only track
    // subsequent client-side navigations here to avoid double-counting.
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    window._paq = window._paq || []
    window._paq.push(['setCustomUrl', window.location.href])
    window._paq.push(['setDocumentTitle', document.title])
    window._paq.push(['trackPageView'])
  }, [pathname, searchParams])

  return (
    <Script id="matomo-analytics" strategy="afterInteractive">
      {`
        var _paq = window._paq = window._paq || [];
        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u="${MATOMO_URL}";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '${MATOMO_SITE_ID}']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
      `}
    </Script>
  )
}

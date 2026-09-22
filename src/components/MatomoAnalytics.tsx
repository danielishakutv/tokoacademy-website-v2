'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    _paq?: unknown[][]
  }
}

const MATOMO_URL = 'https://analytics.aictig.org/'
const MATOMO_SITE_ID = '3'

/**
 * Deliberately without `useSearchParams`.
 *
 * It used to depend on it, and that was the source of the two React errors
 * logged on every page of the site — #422, "error while hydrating this
 * Suspense boundary, switched to client rendering", and #425, "text content
 * does not match server-rendered HTML".
 *
 * `useSearchParams` cannot be resolved when a page is rendered at build time:
 * this is a static export, and the query string is not known until somebody
 * asks for the URL. React therefore throws away the server-rendered markup for
 * this boundary and re-renders it in the browser. The `<Suspense>` wrapper in
 * the layout stops that being fatal, but it does not stop it happening — the
 * work is still done twice, on every page, and the errors are still logged.
 *
 * Nothing was gained by it. The effect reports `window.location.href`, which
 * already contains the query string; the hook was only a re-render trigger, so
 * that a navigation changing *only* the query string would count as a new page
 * view. No page on this site is driven by a query parameter, so what it bought
 * was nothing and what it cost was a hydration failure site-wide.
 */
export default function MatomoAnalytics() {
  const pathname = usePathname()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    // The inline snippet below tracks the first page view; only track
    // subsequent client-side navigations here to avoid double-counting.
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    window._paq = window._paq || []
    // Read from the browser at the moment of the navigation — this includes
    // any query string, which is why the hook was never needed for accuracy.
    window._paq.push(['setCustomUrl', window.location.href])
    window._paq.push(['setDocumentTitle', document.title])
    window._paq.push(['trackPageView'])
  }, [pathname])

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

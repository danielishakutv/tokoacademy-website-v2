/*
 * Toko Academy service worker.
 *
 * It had two faults that between them produced the complaint "images show as
 * broken until you hard reset".
 *
 * 1. It cached every response it received, whatever the status. A 404 for a
 *    missing image went into the cache exactly like a picture would, and the
 *    asset strategy was cache-first — so once a file had 404'd, this worker
 *    served that 404 back for ever. Uploading the real image changed nothing,
 *    because the request never reached the network again. Only a hard reload,
 *    which bypasses the worker, appeared to fix it. Nothing is cached now
 *    unless the server said it was fine.
 *
 * 2. The cache name was a constant that nobody ever bumped, so a deploy never
 *    invalidated anything. `activate` deletes caches whose key does not start
 *    with CACHE_VERSION, which deleted nothing while the version never moved.
 *    The version is now part of the file, and changing the number below is
 *    what retires every previous cache.
 *
 * The strategies, briefly: pages go to the network first and fall back to the
 * cache when offline; assets are served from cache but refreshed in the
 * background, so a new build is picked up on the next visit rather than never.
 */

const CACHE_VERSION = 'toko-cache-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        cache.addAll(['/', '/site.webmanifest', '/favicon.ico', '/favicon-16x16.png', '/apple-touch-icon.png']),
      )
      // One missing file must not abort the install and leave the site with no
      // worker at all.
      .catch(() => undefined),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

const isAssetRequest = (request) => ['style', 'script', 'image', 'font'].includes(request.destination);
const isHtmlRequest = (request) => request.mode === 'navigate';
const isWordPressGraphQL = (url) =>
  url.origin === 'https://wp.tokoacademy.org' && url.pathname.includes('/graphql');

/**
 * Whether a response is worth keeping.
 *
 * `response.ok` is the whole point — a 404, a 500 or a redirect chain that
 * ended badly must never be stored, because a cache-first strategy would then
 * serve the failure in place of the file for ever.
 *
 * Opaque responses (cross-origin, no CORS) are refused too: their status is
 * always 0, so there is no way to tell a real image from an error page, and
 * caching one risks pinning a failure we cannot even inspect.
 */
const worthCaching = (response) =>
  Boolean(response) && response.ok && response.type !== 'opaque' && response.status !== 206;

/** Store a copy, never letting a cache failure break the response. */
const keep = (request, response) => {
  if (!worthCaching(response)) return response;
  const copy = response.clone();
  caches
    .open(RUNTIME_CACHE)
    .then((cache) => cache.put(request, copy))
    .catch(() => undefined);
  return response;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Pages: always ask the network, fall back to the cache only when offline.
  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => keep(request, response))
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/'))),
    );
    return;
  }

  /*
   * Assets: serve the cached copy at once, and refresh it in the background.
   *
   * This was cache-first with no refresh, which is why a rebuilt stylesheet or
   * a replaced image could stay stale indefinitely. Revalidating means the
   * visitor gets today's copy on their next view instead of never.
   */
  if (isAssetRequest(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => keep(request, response))
          .catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }

  if (isWordPressGraphQL(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => keep(request, response))
          .catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => keep(request, response))
        .catch(() => cached);
      return cached || network;
    }),
  );
});

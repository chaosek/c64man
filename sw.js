const CACHE = 'c64mgr-v6';
// Cache only CDN assets, never the app itself so updates work instantly
self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  // Delete all old caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  // Only cache EmulatorJS CDN files (large WASM cores worth caching)
  if (url.includes('cdn.emulatorjs.org') || url.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          });
        })
      )
    );
  }
  // Everything else (index.html, manifest, icons) — always network first
});

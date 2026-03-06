// SW v8 — minimal, only caches CDN, never app files
const CACHE = 'c64cdn-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(() => clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  // Only cache EmulatorJS WASM/core files — these are huge and don't change
  if (url.includes('cdn.emulatorjs.org')) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(r => r || fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }))
      )
    );
  }
  // index.html, manifest, icons, sw.js — always network, never cached
});

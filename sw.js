const CACHE = 'spz-v7';
const ASSETS = ['/scanSPZ/', '/scanSPZ/manifest.json', '/scanSPZ/icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.anthropic.com')) return; // never cache API
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

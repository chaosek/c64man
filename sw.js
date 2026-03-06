// SW v7 — no HTML caching, only CDN assets
const CACHE = 'c64mgr-v7';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))).then(()=>clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (e.request.method !== 'GET') return;
  if (url.includes('cdn.emulatorjs.org') || url.includes('fonts.gstatic.com')) {
    e.respondWith(caches.open(CACHE).then(cache=>
      cache.match(e.request).then(r=>r||fetch(e.request).then(res=>{
        if(res.ok)cache.put(e.request,res.clone()); return res;
      }))
    ));
  }
  // All other requests (index.html etc) — plain network, no cache
});

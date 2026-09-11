const CACHE_NAME = "altimiras-v3";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e => {
  // No cachear API de GitHub ni mp3s (siempre fresco para detectar nuevos)
  if(e.request.url.includes("api.github.com") || e.request.url.includes("raw.githubusercontent.com") || e.request.url.endsWith(".mp3")){
    return e.respondWith(fetch(e.request));
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(r=>{
      return r;
    }))
  );
});

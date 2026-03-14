const CACHE = "zenon-v1";
const ASSETS = [
  "/zenon/",
  "/zenon/index.html",
  "/zenon/manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  // API isteklerini cache'leme, sadece uygulama kabuğunu cache'le
  if (e.request.url.includes("openai.com") || e.request.url.includes("anthropic.com")) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

const CACHE_NAME = "reaction-game-v1";
const APP_SHELL = [
  "/reaction-game/",
  "/reaction-game/index.html",
  "/reaction-game/manifest.json",
  "/reaction-game/icon-192.png",
  "/reaction-game/icon-512.png"
];

// Install: cache app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", event => {
  const url = event.request.url;

  // Always fetch live temperature data
  if (url.includes("json.htm")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first strategy for app shell
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).catch(() =>
          caches.match("/reaction-game/index.html")
        )
      );
    })
  );
});

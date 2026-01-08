"start_url": "/reaction-game/"

const CACHE_NAME = "reaction-game-v1";
const FILES_TO_CACHE = [
  "index.html",
  "manifest.json"
];
navigator.serviceWorker.register("/reaction-game/sw.js");

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

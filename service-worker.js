const CACHE_NAME = "gzone-cache-v3";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate SW
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy (Network first, fall back to cache)
self.addEventListener("fetch", (event) => {
  // Ignore Firestore/Firebase requests (let them go to network)
  if (event.request.url.includes("firestore") || event.request.url.includes("googleapis")) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Push Notification Handler
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'G-ZONE Update';
  const options = {
    body: data.body || 'New tournament available!',
    icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

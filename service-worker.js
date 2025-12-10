// Service Worker for G-ZONE
const CACHE_NAME = 'g-zone-v3'; // Version bumped
const urlsToCache = ['./', './index.html', './manifest.json'];

// Import Firebase (Required for "Closed App" notifications)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAafXkJwyZ5F7Xuax0VktZ9cpqWD4oCvxU",
  projectId: "tournament-97743",
  messagingSenderId: "584797187828",
  appId: "1:584797187828:web:4c643f83dfd9b700adb8a1"
};

// Initialize Firebase for Background Push
try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    
    messaging.onBackgroundMessage((payload) => {
      console.log('[SW] Background FCM:', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
        vibrate: [200, 100, 200]
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
} catch(e) {
    console.log("Firebase SW Error:", e);
}

// 🟢 REQUIRED: Standard PWA Install Logic
self.addEventListener('install', event => {
  self.skipWaiting(); // Force activate new SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // Take control immediately
});

// 🟢 CRITICAL FIX: The "Fetch" Handler
// Without this specific block, the "Add to Home Screen" banner will NOT appear.
self.addEventListener('fetch', function(event) {
  // We can just return to let the network handle it, but the listener must exist.
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});

// Handle Notification Click (Opens app)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window'}).then( windowClients => {
      // If a window is already open, focus it
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});

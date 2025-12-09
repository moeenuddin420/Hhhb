// Service Worker for G-ZONE
const CACHE_NAME = 'g-zone-v2'; // Bump version to force update
const urlsToCache = ['./', './index.html'];

// Import Firebase (Required for "Closed App" notifications from Console)
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
      return self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
        vibrate: [200, 100, 200]
      });
    });
} catch(e) {
    console.log("Firebase SW Error:", e);
}

// Standard PWA Install
self.addEventListener('install', event => {
  self.skipWaiting(); // Force activate new SW immediately
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // Take control of all pages immediately
});

// Handle Notification Click (Opens app)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window'}).then( windowClients => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});

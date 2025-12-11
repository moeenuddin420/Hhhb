/* COMBINED SERVICE WORKER: Cache + Firebase */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// 1. CONFIG
const CACHE_NAME = 'gzone-v2-cache';
const firebaseConfig = {
    apiKey: "AIzaSyAafXkJwyZ5F7Xuax0VktZ9cpqWD4oCvxU",
    authDomain: "tournament-97743.firebaseapp.com",
    projectId: "tournament-97743",
    messagingSenderId: "584797187828",
    appId: "1:584797187828:web:4c643f83dfd9b700adb8a1"
};

// 2. INIT FIREBASE
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 3. INSTALL (Cache Assets)
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Cache core files for offline use
            return cache.addAll(['index.html', 'app.html', 'manifest.json']);
        })
    );
});

// 4. ACTIVATE
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }));
        })
    );
    self.clients.claim();
});

// 5. FETCH (Network First, Fallback to Cache)
self.addEventListener('fetch', (event) => {
    // Skip Firebase requests (let them go to network)
    if (event.request.url.includes('firebase') || event.request.url.includes('googleapis')) return;

    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

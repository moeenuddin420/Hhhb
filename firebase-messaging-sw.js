importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAafXkJwyZ5F7Xuax0VktZ9cpqWD4oCvxU",
  authDomain: "tournament-97743.firebaseapp.com",
  projectId: "tournament-97743",
  storageBucket: "tournament-97743.appspot.com",
  messagingSenderId: "584797187828",
  appId: "1:584797187828:web:4c643f83dfd9b700adb8a1"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Notification Received', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
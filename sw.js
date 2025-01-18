/**
 * Service Worker para manejar notificaciones
 * @type {ServiceWorkerGlobalScope} self
 */

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (e) => {
    e.notification.close();
});
/* global clients */

const CACHE_NAME = 'gamesalad-v1';

// Actualizar rutas para que sean relativas
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/images/icon.png',
  './assets/images/icon_tr.png'
];

// Agregar función helper para rutas
const getPathname = (requestUrl) => new URL(requestUrl, self.registration.scope).pathname;

self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    event.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Click en notificación');
    event.notification.close();

    const urlToOpen = event.notification.data?.url || './';
    console.log('Abriendo URL:', urlToOpen);

    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then(clientList => {
                const matchingClient = clientList.find(client => 
                    client.url === urlToOpen && 'focus' in client);
                
                if (matchingClient) {
                    return matchingClient.focus();
                }
                return clients.openWindow(urlToOpen);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});

self.addEventListener('push', (event) => {
    console.log('Service Worker: Push recibido');
    
    const iconPath = getPathname('assets/images/icon.png');
    
    const options = {
        body: event.data?.text() || 'Notificación sin contenido',
        icon: iconPath,
        badge: iconPath,
        vibrate: [200, 100, 200],
        requireInteraction: true,
        data: { url: self.registration.scope }
    };

    event.waitUntil(
        self.registration.showNotification('GameSalad', options)
    );
});

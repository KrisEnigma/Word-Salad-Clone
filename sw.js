/* global clients */

const CACHE_NAME = 'gamesalad-v1';

// Usar rutas relativas y dinámicas que coincidan con el build
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/js/main.BZf7lQmB.js',
  './assets/images/icon.png',
  './assets/images/icon_tr.png'
];

// Función para manejar rutas relativas
const getPathname = (requestUrl) => new URL(requestUrl, self.registration.scope).pathname;

self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        // Primero limpiar la caché anterior
        caches.delete(CACHE_NAME).then(() => 
            caches.open(CACHE_NAME)
        ).then(cache => {
            // Intentar cachear cada archivo individualmente
            return Promise.all(
                urlsToCache.map(url => 
                    cache.add(url).catch(err => {
                        console.warn('Error cacheando:', url, err);
                        return Promise.resolve(); // Continuar con el resto
                    })
                )
            );
        })
    );
    // Activar inmediatamente
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

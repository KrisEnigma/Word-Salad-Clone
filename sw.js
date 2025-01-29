/* global clients */

const CACHE_NAME = 'gamesalad-v1';

// Actualizar las rutas para que coincidan con la estructura del build
const urlsToCache = [
    './',
    './index.html',
    './assets/manifest.json',  // Ruta actualizada al manifest
    './assets/images/icon.png',
    './assets/images/icon_tr.png',
    './assets/js/main.BZf7lQmB.js'  // Asegurar que el JS principal también se cachee
];

// Función para manejar rutas de manera más robusta
const getPathname = (requestUrl) => {
    try {
        return new URL(requestUrl, self.registration.scope).pathname;
    } catch (e) {
        return requestUrl;
    }
};

self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(
        caches.delete(CACHE_NAME)
            .then(() => caches.open(CACHE_NAME))
            .then(cache => {
                // Intentar cachear archivos uno por uno
                return Promise.allSettled(
                    urlsToCache.map(url => 
                        cache.add(url)
                            .catch(err => {
                                console.warn('Error cacheando:', url, err);
                                return null;
                            })
                    )
                );
            })
            .then(() => self.skipWaiting())
    );
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

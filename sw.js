/* global clients */

self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activando...');
    event.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Click en notificación');
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';
    console.log('Abriendo URL:', urlToOpen);

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow(urlToOpen);
        })
    );
});

self.addEventListener('push', (event) => {
    console.log('Service Worker: Push recibido');
    const options = {
        body: event.data?.text() || 'Notificación sin contenido',
        icon: '/assets/images/icon.png',
        badge: '/assets/images/icon.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        data: { url: self.registration.scope }
    };

    event.waitUntil(
        self.registration.showNotification('GameSalad', options)
    );
});

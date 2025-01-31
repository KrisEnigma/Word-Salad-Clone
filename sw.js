/* global clients */

self.addEventListener('install', () => {
    self.skipWaiting();
    console.log('📱 Notification SW instalado');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
    console.log('📱 Notification SW activado');
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Usar la URL almacenada en la notificación o construir la URL correcta
    const urlToOpen = event.notification.data?.url || `${self.registration.scope}index.html`;

    // Abrir o enfocar la ventana existente
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
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
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/assets/images/icon.png',
        badge: '/assets/images/icon.png',
        vibrate: [200, 100, 200],
        data: {
            url: self.location.origin
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

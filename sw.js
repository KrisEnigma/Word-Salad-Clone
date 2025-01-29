self.addEventListener('install', (event) => {
    self.skipWaiting();
    console.log('📱 Notification SW instalado');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
    console.log('📱 Notification SW activado');
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Intentar abrir la ventana existente o crear una nueva
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then(clientList => {
                const gameClient = clientList.find(client => 
                    client.url.includes('gamesalad')
                );
                
                if (gameClient) {
                    return gameClient.focus();
                }
                return clients.openWindow('/');
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

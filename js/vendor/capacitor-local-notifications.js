import { registerPlugin } from './capacitor-core.js';
                
                console.log('[LocalNotifications] Inicializando...');
                
                const LocalNotifications = registerPlugin('LocalNotifications');
                
                // Envolver métodos con logs y funcionalidad
                const wrappedMethods = {
                    async checkPermissions() {
                        console.log('[LocalNotifications] Verificando permisos...');
                        if ('Notification' in window) {
                            const permission = Notification.permission;
                            return { display: permission };
                        }
                        return { display: 'granted' };
                    },
                    
                    async requestPermissions() {
                        console.log('[LocalNotifications] Solicitando permisos...');
                        if ('Notification' in window) {
                            const permission = await Notification.requestPermission();
                            return { display: permission };
                        }
                        return { display: 'granted' };
                    },
                    
                    async schedule(options) {
                        console.log('[LocalNotifications] Programando notificación:', options);
                        const notification = options.notifications[0];
                        if ('Notification' in window) {
                            new Notification(notification.title, {
                                body: notification.body,
                                icon: '/assets/images/icon.png'
                            });
                        }
                        return Promise.resolve();
                    },
                    
                    async cancel() {
                        console.log('[LocalNotifications] Cancelando notificaciones');
                        return Promise.resolve();
                    },

                    async getPending() {
                        return { notifications: [] };
                    },

                    async registerActionTypes() {
                        return Promise.resolve();
                    },

                    async createChannel() {
                        return Promise.resolve();
                    }
                };
                
                // Agregar los métodos envueltos al objeto LocalNotifications
                Object.assign(LocalNotifications, wrappedMethods);
                
                export { LocalNotifications };
import { registerPlugin } from './capacitor-core.js';
                
                console.log('[App] Inicializando...');
                
                const App = registerPlugin('App');
                
                // Envolver métodos con funcionalidad web
                const wrappedMethods = {
                    async exitApp() {
                        console.log('[App] Saliendo de la aplicación...');
                        return Promise.resolve();
                    },
                    
                    async getInfo() {
                        return { version: '1.0.0', build: '1', name: 'GameSalad' };
                    },
                    
                    async getLaunchUrl() {
                        return { url: window.location.href };
                    },
                    
                    async getState() {
                        return { isActive: document.visibilityState === 'visible' };
                    },
                    
                    async minimizeApp() {
                        console.log('[App] Minimizando aplicación...');
                        return Promise.resolve();
                    },
                    
                    addListener(eventName, listener) {
                        const validEvents = ['backButton', 'appStateChange', 'pause', 'resume'];
                        if (!validEvents.includes(eventName)) {
                            console.warn('[App] Evento no soportado:', eventName);
                            return { remove: () => {} };
                        }

                        const handler = (e) => listener(e.detail);
                        window.addEventListener(eventName, handler);
                        return {
                            remove: () => {
                                window.removeEventListener(eventName, handler);
                            }
                        };
                    }
                };
                
                Object.assign(App, wrappedMethods);
                
                export { App };
import { registerPlugin } from './capacitor-core.js';
                
                console.log('[Preferences] Inicializando...');
                
                const Preferences = registerPlugin('Preferences');
                
                // Envolver métodos con funcionalidad web
                const wrappedMethods = {
                    async get({ key }) {
                        try {
                            const value = localStorage.getItem(key);
                            return { value };
                        } catch (err) {
                            console.error('[Preferences] Error leyendo:', err);
                            return { value: null };
                        }
                    },
                    
                    async set({ key, value }) {
                        try {
                            localStorage.setItem(key, value);
                            return Promise.resolve();
                        } catch (err) {
                            console.error('[Preferences] Error guardando:', err);
                            return Promise.reject(err);
                        }
                    },
                    
                    async remove({ key }) {
                        try {
                            localStorage.removeItem(key);
                            return Promise.resolve();
                        } catch (err) {
                            console.error('[Preferences] Error eliminando:', err);
                            return Promise.reject(err);
                        }
                    },
                    
                    async clear() {
                        try {
                            localStorage.clear();
                            return Promise.resolve();
                        } catch (err) {
                            console.error('[Preferences] Error limpiando:', err);
                            return Promise.reject(err);
                        }
                    },
                    
                    async keys() {
                        try {
                            return { keys: Object.keys(localStorage) };
                        } catch (err) {
                            console.error('[Preferences] Error listando keys:', err);
                            return { keys: [] };
                        }
                    },
                    
                    async configure() {
                        return Promise.resolve();
                    }
                };
                
                Object.assign(Preferences, wrappedMethods);
                
                export { Preferences };
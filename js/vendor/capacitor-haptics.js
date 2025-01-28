import { registerPlugin } from './capacitor-core.js';
                
                console.log('[Haptics] Inicializando...');

                export const ImpactStyle = {
                    Heavy: 'HEAVY',
                    Medium: 'MEDIUM',
                    Light: 'LIGHT'
                };

                export const NotificationType = {
                    Success: 'SUCCESS',
                    Warning: 'WARNING',
                    Error: 'ERROR'
                };

                const Haptics = registerPlugin('Haptics');
                
                // Envolver métodos con funcionalidad web
                const wrappedMethods = {
                    async impact({ style = ImpactStyle.Medium } = {}) {
                        console.log('[Haptics] Impact:', style);
                        if ('vibrate' in navigator) {
                            switch (style) {
                                case ImpactStyle.Heavy:
                                    navigator.vibrate([100]);
                                    break;
                                case ImpactStyle.Light:
                                    navigator.vibrate([10]);
                                    break;
                                default:
                                    navigator.vibrate([50]);
                            }
                        }
                        return Promise.resolve();
                    },

                    async notification({ type = NotificationType.Success } = {}) {
                        console.log('[Haptics] Notification:', type);
                        if ('vibrate' in navigator) {
                            switch (type) {
                                case NotificationType.Warning:
                                    navigator.vibrate([30, 100, 30]);
                                    break;
                                case NotificationType.Error:
                                    navigator.vibrate([50, 100, 50, 100, 50]);
                                    break;
                                default:
                                    navigator.vibrate([50, 50, 50]);
                            }
                        }
                        return Promise.resolve();
                    },

                    async vibrate(duration = 300) {
                        console.log('[Haptics] Vibrate:', duration);
                        if ('vibrate' in navigator) {
                            navigator.vibrate(duration);
                        }
                        return Promise.resolve();
                    },

                    async selectionStart() {
                        console.log('[Haptics] Selection start');
                        if ('vibrate' in navigator) {
                            navigator.vibrate(10);
                        }
                        return Promise.resolve();
                    },

                    async selectionChanged() {
                        console.log('[Haptics] Selection changed');
                        if ('vibrate' in navigator) {
                            navigator.vibrate(5);
                        }
                        return Promise.resolve();
                    },

                    async selectionEnd() {
                        console.log('[Haptics] Selection end');
                        if ('vibrate' in navigator) {
                            navigator.vibrate(10);
                        }
                        return Promise.resolve();
                    }
                };
                
                Object.assign(Haptics, wrappedMethods);
                
                export { Haptics };
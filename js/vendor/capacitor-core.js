console.log('[Capacitor Core] Inicializando...');
            
            const defaultPlugin = {
                addListener: () => ({ remove: () => {} }),
                removeAllListeners: () => Promise.resolve(),
                checkPermissions: () => Promise.resolve({ display: 'granted' }),
                requestPermissions: () => Promise.resolve({ display: 'granted' }),
                removeListener: () => Promise.resolve(),
                schedule: (options) => {
                    console.log('Mock schedule:', options);
                    return Promise.resolve();
                },
                cancel: () => Promise.resolve(),
                createChannel: () => Promise.resolve(),
                deleteChannel: () => Promise.resolve(),
                listChannels: () => Promise.resolve({ channels: [] }),
                getPending: () => Promise.resolve({ notifications: [] }),
                registerActionTypes: () => Promise.resolve()
            };

            const createCapacitor = () => ({
                platform: 'android',
                isNative: true,
                getPlatform: () => 'android',
                isPluginAvailable: (name) => {
                    console.log('[Capacitor Core] Verificando disponibilidad de:', name);
                    return true;
                },
                registerPlugin: (name) => {
                    console.log('[Capacitor Core] Registrando plugin:', name);
                    const plugins = {
                        'App': {
                            ...defaultPlugin,
                            exitApp: () => Promise.resolve(),
                            getInfo: () => Promise.resolve({ version: '1.0.0' }),
                            addListener: (eventName) => ({
                                remove: () => {}
                            })
                        },
                        'Haptics': {
                            ...defaultPlugin,
                            impact: () => Promise.resolve(),
                            notification: () => Promise.resolve(),
                            vibrate: () => Promise.resolve(),
                            selectionStart: () => Promise.resolve(),
                            selectionChanged: () => Promise.resolve(),
                            selectionEnd: () => Promise.resolve()
                        },
                        'LocalNotifications': {
                            ...defaultPlugin,
                            schedule: () => Promise.resolve(),
                            cancel: () => Promise.resolve(),
                            getPending: () => Promise.resolve({ notifications: [] }),
                            registerActionTypes: () => Promise.resolve(),
                            checkPermissions: () => Promise.resolve({ display: 'granted' }),
                            requestPermissions: () => Promise.resolve({ display: 'granted' })
                        },
                        'Preferences': {
                            ...defaultPlugin,
                            get: () => Promise.resolve({ value: null }),
                            set: () => Promise.resolve(),
                            remove: () => Promise.resolve(),
                            clear: () => Promise.resolve(),
                            keys: () => Promise.resolve({ keys: [] })
                        }
                    };
                    
                    return plugins[name] || defaultPlugin;
                }
            });

            const Capacitor = createCapacitor();
            window.Capacitor = Capacitor;
            console.log('[Capacitor Core] Configuración completada');
            
            export { Capacitor };
            export const registerPlugin = Capacitor.registerPlugin;
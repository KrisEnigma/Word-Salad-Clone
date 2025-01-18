export const Haptics = {
    impact: async (options = {}) => {
        try {
            if ('vibrate' in navigator) {
                navigator.vibrate(options.style === 'heavy' ? 100 : 50);
            }
        } catch (e) {
            console.warn('Haptics no disponible:', e);
        }
    },
    notification: async (options = {}) => {
        try {
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 30, 100]);
            }
        } catch (e) {
            console.warn('Haptics no disponible:', e);
        }
    }
};

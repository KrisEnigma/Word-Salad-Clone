export const Haptics = {
    impact: async ({ style = 'medium' } = {}) => {
        if ('vibrate' in navigator) {
            const duration = style === 'heavy' ? 100 : style === 'medium' ? 50 : 25;
            navigator.vibrate(duration);
        }
    },
    notification: async () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 30, 100]);
        }
    }
};

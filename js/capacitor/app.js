export const App = {
    addListener: (eventName, callback) => {
        if (eventName === 'appStateChange') {
            document.addEventListener('visibilitychange', () => {
                callback({ isActive: !document.hidden });
            });
        }
        return { remove: () => {} };
    }
};

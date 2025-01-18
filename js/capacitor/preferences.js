export const Preferences = {
    get: async ({ key }) => {
        try {
            return { value: localStorage.getItem(key) };
        } catch {
            return { value: null };
        }
    },
    set: async ({ key, value }) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('Error guardando preferencia:', e);
        }
    },
    remove: async ({ key }) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Error eliminando preferencia:', e);
        }
    }
};

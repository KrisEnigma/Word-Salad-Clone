export const Preferences = {
    get: async ({ key }) => {
        return { value: localStorage.getItem(key) };
    },
    set: async ({ key, value }) => {
        localStorage.setItem(key, value);
    },
    remove: async ({ key }) => {
        localStorage.removeItem(key);
    }
};

export const userService = {
    key: 'user',

    setUser(user) {
        localStorage.setItem(this.key, JSON.stringify(user));
    },

    getUser() {
        const currentUser = localStorage.getItem(this.key);
        return JSON.parse(currentUser);
    },

    clearUser() {
        localStorage.removeItem(this.key);
    }
}
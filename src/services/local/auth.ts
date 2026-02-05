import { AuthService, User } from '../types';

const STORAGE_KEY = 'archibuild_user';

export const localAuthService: AuthService = {
    async signIn(email: string) {
        // Mock login: create a fake user based on email
        const user: User = {
            id: 'local-user-' + Math.random().toString(36).substring(7),
            email: email,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return { user, error: null };
    },

    async signOut() {
        localStorage.removeItem(STORAGE_KEY);
        return { error: null };
    },

    async getUser() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return { user: null, error: null };
        try {
            const user = JSON.parse(stored) as User;
            return { user, error: null };
        } catch {
            return { user: null, error: null };
        }
    },
};

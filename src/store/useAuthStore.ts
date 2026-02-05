import { create } from 'zustand';
import { authService } from '@/services';
import { User } from '@/services/types';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    signIn: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    error: null,

    signIn: async (email: string) => {
        set({ isLoading: true, error: null });
        const { user, error } = await authService.signIn(email);
        if (error) {
            set({ error: error.message, isLoading: false });
        } else {
            set({ user, isLoading: false });
        }
    },

    signOut: async () => {
        set({ isLoading: true });
        const { error } = await authService.signOut();
        if (error) {
            set({ error: error.message, isLoading: false });
        } else {
            set({ user: null, isLoading: false });
        }
    },

    checkSession: async () => {
        set({ isLoading: true });
        const { user, error } = await authService.getUser();
        if (error) {
            // Don't set error on checkSession usually, just no user
            set({ user: null, isLoading: false });
        } else {
            set({ user, isLoading: false });
        }
    },
}));

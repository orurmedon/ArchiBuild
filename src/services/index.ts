import { AuthService, StorageService } from './types';
import { localAuthService } from './local/auth';
import { localStorageService } from './local/storage';

// Configuration flag to switch between Local and Supabase
// This could be controlled by an environment variable in the future
const USE_MOCK = true;

export const authService: AuthService = USE_MOCK ? localAuthService : {} as any; // Fallback for now
export const storageService: StorageService = USE_MOCK ? localStorageService : {} as any; // Fallback for now

import { create } from 'zustand';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
};

const storageKey = 'tuitionlms-auth';

const readStoredSession = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  try {
    const rawSession = window.localStorage.getItem(storageKey);
    if (!rawSession) {
      return { token: null, user: null };
    }

    return JSON.parse(rawSession) as { token: string | null; user: AuthUser | null };
  } catch {
    return { token: null, user: null };
  }
};

const storedSession = readStoredSession();

export const useAuthStore = create<AuthState>((set) => ({
  token: storedSession.token,
  user: storedSession.user,
  hydrated: typeof window !== 'undefined',
  setHydrated: (hydrated) => set({ hydrated }),
  setSession: (token, user) => {
    const nextSession = { token, user };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(nextSession));
    }

    set({ token, user, hydrated: true });
  },
  clearSession: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
    }

    set({ token: null, user: null, hydrated: true });
  },
}));

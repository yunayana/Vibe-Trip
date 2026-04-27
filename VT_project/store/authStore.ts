import { create } from 'zustand';

type User = {
  id: string;
  email: string;
} | null;

type AuthState = {
  user: User;
  isLoading: boolean;
  setUser: (user: User) => void;
  setLoading: (value: boolean) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (value) => set({ isLoading: value }),
  reset: () => set({ user: null, isLoading: false }),
}));
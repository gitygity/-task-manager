// Zustand store for auth
import { create } from 'zustand'
import type { AuthState } from './model'

interface AuthStore extends AuthState {
  // Actions will be implemented here
  setUser: (user: AuthState['user']) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})) 
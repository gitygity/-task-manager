// Zustand store for auth
import { create } from 'zustand'
import { authService } from './services/authService'
import type { AuthState } from './types'
import type { User } from './types'


interface AuthStore extends AuthState {
  // Additional state
  error: string | null
  _initialized?: boolean
  _subscription?: { unsubscribe: () => void } | null
  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  // Auth methods
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  _initialized: false,
  _subscription: null,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    error: null 
  }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Initialize auth state and listen to changes
  initialize: async () => {
    const state = get()
    // Prevent multiple initializations
    if (state._initialized) return
    
    set({ loading: true, _initialized: true })
    
    try {
      // Get initial user
      const user = await authService.getCurrentUser()
      set({ 
        user, 
        isAuthenticated: !!user, 
        loading: false,
        error: null 
      })

      // Listen to auth state changes (only once)
      const { data: { subscription } } = authService.onAuthStateChange((user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          loading: false,
          error: null 
        })
      })

      // Store subscription for cleanup if needed
      set({ _subscription: subscription })
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication failed' 
      })
    }
  },

  // Login method
  login: async (email: string, password: string) => {
    set({ loading: true, error: null })
    
    try {
      const result = await authService.login({ email, password })
      
      if (result.error) {
        set({ error: result.error, loading: false })
        return { error: result.error }
      }

      // User state will be updated via onAuthStateChange listener
      set({ loading: false })
      return {}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      set({ error: errorMessage, loading: false })
      return { error: errorMessage }
    }
  },

  // Register method
  register: async (email: string, password: string, fullName?: string) => {
    set({ loading: true, error: null })
    
    try {
      const result = await authService.register({ email, password, fullName })
      
      if (result.error) {
        set({ error: result.error, loading: false })
        return { error: result.error }
      }

      // User state will be updated via onAuthStateChange listener
      set({ loading: false })
      return {}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      set({ error: errorMessage, loading: false })
      return { error: errorMessage }
    }
  },

  // Logout method
  logout: async () => {
    set({ loading: true })
    
    try {
      await authService.logout()
      // User state will be updated via onAuthStateChange listener
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false,
        error: null 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Logout failed',
        loading: false 
      })
    }
  },
})) 
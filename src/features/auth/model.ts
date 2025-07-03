// Types and interfaces for auth data
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role?: 'user' | 'admin' | 'moderator'
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
} 
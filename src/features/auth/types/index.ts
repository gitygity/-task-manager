export interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  created_at: string
  updated_at: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  fullName?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

export interface AuthResponse {
  user: User | null
  error?: string
} 
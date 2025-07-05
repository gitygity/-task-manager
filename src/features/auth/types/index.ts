export interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
    role?: 'user' | 'admin' | 'moderator'
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

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'fa'
  notifications: {
    email: boolean
    push: boolean
    taskReminders: boolean
    projectUpdates: boolean
  }
  dateFormat: 'mm/dd/yyyy' | 'dd/mm/yyyy' | 'yyyy/mm/dd'
  timezone: string
  defaultTaskPriority: 'low' | 'medium' | 'high' | 'urgent'
  kanbanAutoRefresh: boolean
}

export interface PreferencesState {
  preferences: UserPreferences
  loading: boolean
  error: string | null
} 
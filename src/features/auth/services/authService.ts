import { supabase } from '@/lib/supabase'
import type { User, LoginData, RegisterData, AuthResponse } from '../types'

export interface UpdateProfileData {
  full_name?: string
  avatar_url?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export const authService = {
  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        // Only log if it's not a session missing error (which is normal)
        if (error.message !== 'Auth session missing!') {
          console.error('Error getting user:', error)
        }
        return null
      }

      return user ? {
        id: user.id,
        email: user.email!,
        user_metadata: user.user_metadata,
        created_at: user.created_at!,
        updated_at: user.updated_at!
      } : null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  // Login with email and password
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        return { user: null, error: error.message }
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        user_metadata: data.user.user_metadata,
        created_at: data.user.created_at!,
        updated_at: data.user.updated_at!
      }

      return { user }
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }
    }
  },

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName || ''
          }
        }
      })

      if (error) {
        return { user: null, error: error.message }
      }

      // Note: User might need email confirmation depending on Supabase settings

      const user: User | null = data.user ? {
        id: data.user.id,
        email: data.user.email!,
        user_metadata: data.user.user_metadata,
        created_at: data.user.created_at!,
        updated_at: data.user.updated_at!
      } : null

      return { user }
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }
    }
  },

  // Update user profile
  async updateProfile(profileData: UpdateProfileData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: profileData
      })

      if (error) {
        return { user: null, error: error.message }
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        user_metadata: data.user.user_metadata,
        created_at: data.user.created_at!,
        updated_at: data.user.updated_at!
      }

      return { user }
    } catch (error) {
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Profile update failed' 
      }
    }
  },

  // Change password
  async changePassword(passwordData: ChangePasswordData): Promise<{ error?: string }> {
    try {
      // First verify current password by attempting to sign in
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        return { error: 'Not authenticated' }
      }

      // Verify current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: currentUser.email!,
        password: passwordData.currentPassword,
      })

      if (verifyError) {
        return { error: 'Current password is incorrect' }
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Password change failed' 
      }
    }
  },

  // Update email
  async updateEmail(newEmail: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Email update failed' 
      }
    }
  },

  // Logout
  async logout(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Logout failed' 
      }
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        user_metadata: session.user.user_metadata,
        created_at: session.user.created_at!,
        updated_at: session.user.updated_at!
      } : null

      callback(user)
    })
  },

  // Reset password
  async resetPassword(email: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      }
    }
  }
}
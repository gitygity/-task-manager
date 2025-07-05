import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { authService } from './services/authService'
import type { User } from './types'

// Query keys
export const AUTH_KEYS = {
  all: ['auth'] as const,
  user: () => [...AUTH_KEYS.all, 'user'] as const,
} as const

// @deprecated Use useAuthStore instead to avoid duplicate API calls
// Hook for current user state
export function useAuth() {
  console.warn('⚠️  useAuth is deprecated. Use useAuthStore instead to avoid duplicate API calls.')
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
      setError(null)
    })

    // Initial load - only call once
    authService.getCurrentUser()
      .then((user) => {
        setUser(user)
        setLoading(false)
        setError(null)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
        setUser(null)
      })

    return () => {
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array ensures this runs only once

  return {
    user,
    loading,
    isAuthenticated: !!user,
    error,
  }
}

// Hook for login
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      if (response.user) {
        // Clear any existing tasks cache since user changed
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
      }
    },
  })
}

// Hook for registration
export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      if (response.user) {
        // Clear any existing tasks cache since user changed
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
      }
    },
  })
}

// Hook for logout
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all cache
      queryClient.clear()
    },
  })
}

// Hook for password reset
export function useResetPassword() {
  return useMutation({
    mutationFn: authService.resetPassword,
  })
} 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { authService } from './services/authService'
import type { User } from './types'

// Query keys
export const AUTH_KEYS = {
  all: ['auth'] as const,
  user: () => [...AUTH_KEYS.all, 'user'] as const,
} as const

// Hook for current user state
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const userQuery = useQuery({
    queryKey: AUTH_KEYS.user(),
    queryFn: authService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry auth failures
  })

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    // Initial load
    authService.getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user: user || userQuery.data || null,
    loading: loading || userQuery.isLoading,
    isAuthenticated: !!(user || userQuery.data),
    error: userQuery.error,
  }
}

// Hook for login
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      if (response.user) {
        // Update user cache
        queryClient.setQueryData(AUTH_KEYS.user(), response.user)
        
        // Invalidate and refetch user query
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user() })
        
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
        // Update user cache
        queryClient.setQueryData(AUTH_KEYS.user(), response.user)
        
        // Invalidate and refetch user query
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user() })
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
      
      // Set user to null
      queryClient.setQueryData(AUTH_KEYS.user(), null)
    },
  })
}

// Hook for password reset
export function useResetPassword() {
  return useMutation({
    mutationFn: authService.resetPassword,
  })
} 
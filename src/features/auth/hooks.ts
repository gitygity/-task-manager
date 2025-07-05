import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from './services/authService'

// Query keys
export const AUTH_KEYS = {
  all: ['auth'] as const,
  user: () => [...AUTH_KEYS.all, 'user'] as const,
} as const

// useAuth hook removed - use useAuthStore instead to avoid duplicate API calls

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
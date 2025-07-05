import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from './services/authService'
import type { UpdateProfileData, ChangePasswordData } from './services/authService'

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

// Hook for updating profile
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profileData: UpdateProfileData) => authService.updateProfile(profileData),
    onSuccess: (response) => {
      if (response.user) {
        // Invalidate user cache
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user() })
      }
    },
  })
}

// Hook for changing password
export function useChangePassword() {
  return useMutation({
    mutationFn: (passwordData: ChangePasswordData) => authService.changePassword(passwordData),
  })
}

// Hook for updating email
export function useUpdateEmail() {
  return useMutation({
    mutationFn: (newEmail: string) => authService.updateEmail(newEmail),
  })
} 
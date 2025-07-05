import { useEffect, startTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { ROUTE_PATHS } from '@/routes/constants'
import LoadingSpinner from '@/routes/components/LoadingSpinner'

export default function RootRedirect() {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuthStore()

  useEffect(() => {
    if (!loading) {
      startTransition(() => {
        if (isAuthenticated) {
          // Redirect authenticated users to dashboard
          navigate(ROUTE_PATHS.private.dashboard, { replace: true })
        } else {
          // Redirect unauthenticated users to login
          navigate(ROUTE_PATHS.public.login, { replace: true })
        }
      })
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return <LoadingSpinner message="Loading..." />
  }

  return <LoadingSpinner message="Redirecting..." />
} 
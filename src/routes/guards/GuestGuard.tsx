// Guest guard - redirects authenticated users away from auth pages
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../features/auth'
import { ROUTE_PATHS } from '../constants'
import LoadingSpinner from '../components/LoadingSpinner'

interface GuestGuardProps {
  children: React.ReactNode
  fallback?: string
}

export default function GuestGuard({ 
  children, 
  fallback = ROUTE_PATHS.private.dashboard 
}: GuestGuardProps) {
  const { isAuthenticated, loading } = useAuthStore()

  // Still loading authentication status
  if (loading) {
    return <LoadingSpinner message="Loading..." />
  }

  // Already authenticated - redirect to dashboard or stored path
  if (isAuthenticated) {
    const redirectPath = sessionStorage.getItem('redirectPath') || fallback
    sessionStorage.removeItem('redirectPath')
    
    return (
      <Navigate 
        to={redirectPath} 
        replace 
      />
    )
  }

  // Not authenticated - render children (auth pages)
  return <>{children}</>
} 
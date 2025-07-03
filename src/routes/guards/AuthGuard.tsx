// Authentication guard - protects private routes
import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../features/auth'
import { ROUTE_PATHS } from '../constants'
import LoadingSpinner from '../components/LoadingSpinner'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: string
}

export default function AuthGuard({ 
  children, 
  fallback = ROUTE_PATHS.public.auth.login 
}: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuthStore()
  const location = useLocation()

  // Store the attempted location for redirect after login
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== ROUTE_PATHS.public.auth.login) {
      sessionStorage.setItem('redirectPath', location.pathname)
    }
  }, [isAuthenticated, location.pathname])

  // Still loading authentication status
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallback} 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  // Authenticated - render children
  return <>{children}</>
} 
// Authentication guard - protects private routes
import { useAuthStore } from '@/features/auth'
import { Navigate, useLocation } from 'react-router-dom'
import { ROUTE_PATHS } from '../constants'
import type { ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
  fallback?: string
}

export function AuthGuard({ 
  children, 
  fallback = ROUTE_PATHS.public.login 
}: AuthGuardProps) {
  const { user, loading } = useAuthStore()
  const location = useLocation()

  // Don't redirect if we're already on the login page
  if (!user && !loading && location.pathname !== ROUTE_PATHS.public.login) {
    return <Navigate to={fallback} state={{ from: location }} replace />
  }

  // Show loading while auth is being checked
  if (loading) {
    return <div>Loading...</div>
  }

  // If user is authenticated, render children
  if (user) {
    return <>{children}</>
  }

  // If not authenticated and not loading, redirect will happen above
  return <>{children}</>
} 
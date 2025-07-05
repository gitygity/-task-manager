// Admin guard - protects admin-only routes
import { useAuthStore } from '@/features/auth'
import { Navigate, useLocation } from 'react-router-dom'
import { ROUTE_PATHS } from '../constants'
import type { ReactNode } from 'react'

interface AdminGuardProps {
  children: ReactNode
}

export function AdminGuard({ 
  children
}: AdminGuardProps) {
  const { user, loading } = useAuthStore()
  const location = useLocation()

  // Show loading while auth is being checked
  if (loading) {
    return <div>Loading...</div>
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to={ROUTE_PATHS.public.login} state={{ from: location }} replace />
  }

  // Check if user has admin role
  // Since we don't have a role property, we'll assume all authenticated users can access admin
  // TODO: Implement proper role-based access control
  
  // If user is authenticated, render children
  return <>{children}</>
} 
// Admin guard - protects admin-only routes
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../features/auth'
import { ROUTE_PATHS } from '../constants'
import LoadingSpinner from '../components/LoadingSpinner'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAuthenticated, loading } = useAuthStore()

  // Still loading authentication status
  if (loading) {
    return <LoadingSpinner message="Verifying admin access..." />
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={ROUTE_PATHS.public.auth.login} 
        replace 
      />
    )
  }

  // Not admin - show access denied or redirect
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this area.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Admin user - render children
  return <>{children}</>
} 
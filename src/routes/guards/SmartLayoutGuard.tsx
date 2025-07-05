// Smart layout guard - chooses layout based on user role
import { useAuthStore } from '../../features/auth'
import { UserLayout } from '../../layouts/UserLayout'
import { AdminLayout } from '../../layouts/AdminLayout'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'

export function SmartLayoutGuard() {
  const { user, loading } = useAuthStore()

  // Still loading user data
  if (loading) {
    return <LoadingSpinner message="Loading layout..." />
  }

  // Check if user is authenticated
  if (!user) {
    return <LoadingSpinner message="Loading user..." />
  }

  // Choose layout based on user role
  const userRole = user.user_metadata?.role

  if (userRole === 'admin') {
    return <AdminLayout />
  } else if (userRole === 'user') {
    return <UserLayout />
  } else {
    // Default to DashboardLayout for guests or unknown roles
    return <DashboardLayout />
  }
} 
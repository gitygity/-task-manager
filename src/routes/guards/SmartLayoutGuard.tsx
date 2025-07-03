// Smart layout guard - chooses layout based on user role
import { useAuthStore } from '../../features/auth'
import UserLayout from '../../layouts/UserLayout'
import AdminLayout from '../../layouts/AdminLayout'
import DashboardLayout from '../../layouts/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'

export default function SmartLayoutGuard() {
  const { user, loading } = useAuthStore()

  // Still loading user data
  if (loading) {
    return <LoadingSpinner message="Loading layout..." />
  }

  // Choose layout based on user role
  if (user?.role === 'admin') {
    return <AdminLayout />
  }
  
  if (user?.role === 'user') {
    return <UserLayout />
  }

  // Default layout for users without specific role or during role loading
  return <DashboardLayout />
} 
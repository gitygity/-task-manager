import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import LoadingSpinner from '../routes/components/LoadingSpinner'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <Suspense fallback={<LoadingSpinner size="md" message="Loading..." />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
} 
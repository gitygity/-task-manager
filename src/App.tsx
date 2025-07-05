import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, Suspense, startTransition } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAuthStore, usePreferencesStore } from '@/features/auth'
import { router } from '@/routes/routerInstance'
import LoadingSpinner from '@/routes/components/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Create a single query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

function AppContent() {
  const { loading, initialize } = useAuthStore()
  const { initialize: initializePreferences } = usePreferencesStore()

  // Initialize auth store and preferences on mount with startTransition
  useEffect(() => {
    startTransition(() => {
      initialize()
      initializePreferences()
    })
  }, [initialize, initializePreferences])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Loading application..." />
      </div>
    )
  }

  // Show router with all routes wrapped in Suspense
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner message="Loading page..." />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}


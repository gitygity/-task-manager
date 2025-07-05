import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth, AuthContainer } from '@/features/auth'
import { TaskDemo } from '@/features/tasks'
import { Header } from '@/components/layout/Header'
import { LoadingSpinner } from '@/components/LoadingSpinner'

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
  const { isAuthenticated, loading } = useAuth()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show auth forms if not authenticated
  if (!isAuthenticated) {
    return <AuthContainer />
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <Header />
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              مدیریت وظایف
            </h1>
            <p className="text-gray-600">
              وظایف خود را مدیریت کنید و بهره‌وری خود را افزایش دهید
            </p>
          </div>
          
          <TaskDemo />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}


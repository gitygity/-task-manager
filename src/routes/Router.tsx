// Main router setup with error boundaries and route tracking
import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { routes } from './config'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const router = createBrowserRouter(routes)

export function Router() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  )
}

 
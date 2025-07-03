// Main router setup with error boundaries and route tracking
import { useEffect } from 'react'
import { RouterProvider, useLocation } from 'react-router-dom'
import { router } from './routerInstance'
import { ROUTE_META } from './constants'
import ErrorBoundary from '../components/ErrorBoundary'

// Route tracker for analytics and page titles
function RouteTracker() {
  const location = useLocation()

  useEffect(() => {
    // Update page title
    const routeMeta = ROUTE_META[location.pathname as keyof typeof ROUTE_META]
    if (routeMeta) {
      document.title = routeMeta.title
    }

    // Custom analytics tracking
    console.log('Route changed:', location.pathname)
  }, [location])

  return null
}

// Main router component
export default function AppRouter() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <RouteTracker />
    </ErrorBoundary>
  )
}

 
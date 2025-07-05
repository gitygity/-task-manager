// Route system exports
export { ROUTE_PATHS, ROUTE_META, DEFAULT_ROUTES } from './constants'
export { navigate, isPublicRoute, isPrivateRoute, isAdminRoute } from './utils'
export { SmartLayoutGuard } from './guards'
export { Router } from './Router'
export { routes } from './config'

// Type exports
export type { 
  RouteConfig, 
  RoutePaths, 
  RouteParams, 
  RouteGuardConfig,
  RouteKeys, 
  RouteMeta, 
  NavigationItem, 
  NavigationGroup 
} from './types'

// Default export for convenience
export { Router as default } from './Router' 
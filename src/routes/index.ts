// Routes module exports
export { default as AppRouter } from './Router'
export { router } from './routerInstance'
export { routes } from './config'
export { ROUTE_PATHS, ROUTE_META, NAVIGATION_GROUPS } from './constants'
export { AuthGuard, GuestGuard, AdminGuard, SmartLayoutGuard } from './guards'
export { 
  navigate, 
  routeBuilders,
  getBreadcrumbs, 
  isValidRoute, 
  canAccessRoute, 
  queryParams, 
  analyzeCurrentRoute 
} from './utils'
export type { AppRoutes, RouteKeys, RouteMeta, NavigationItem, NavigationGroup } from './types' 
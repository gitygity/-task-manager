// Route utilities and helper functions
import { router } from './routerInstance'
import { ROUTE_PATHS, ROUTE_META } from './constants'

// Dynamic route builders - centralized logic
export const routeBuilders = {
  task: (id: string) => `/tasks/${id}`,
  taskEdit: (id: string) => `/tasks/${id}/edit`,
  project: (id: string) => `/projects/${id}`,
  projectEdit: (id: string) => `/projects/${id}/edit`,
  resetPassword: (token: string) => `/reset-password/${token}`,
} as const

// Navigation utilities
export const navigate = {
  // Public routes
  home: () => router.navigate(ROUTE_PATHS.public.landing),
  login: () => router.navigate(ROUTE_PATHS.public.auth.login),
  register: () => router.navigate(ROUTE_PATHS.public.auth.register),
  
  // Dashboard routes
  dashboard: () => router.navigate(ROUTE_PATHS.private.dashboard),
  
  // Task routes
  tasks: () => router.navigate(ROUTE_PATHS.private.tasks.list),
  createTask: () => router.navigate(ROUTE_PATHS.private.tasks.create),
  taskDetails: (id: string) => router.navigate(routeBuilders.task(id)),
  editTask: (id: string) => router.navigate(routeBuilders.taskEdit(id)),
  
  // Project routes
  projects: () => router.navigate(ROUTE_PATHS.private.projects.list),
  createProject: () => router.navigate(ROUTE_PATHS.private.projects.create),
  projectDetails: (id: string) => router.navigate(routeBuilders.project(id)),
  editProject: (id: string) => router.navigate(routeBuilders.projectEdit(id)),
  
  // Profile routes
  profile: () => router.navigate(ROUTE_PATHS.private.profile.settings),
  preferences: () => router.navigate(ROUTE_PATHS.private.profile.preferences),
  security: () => router.navigate(ROUTE_PATHS.private.profile.security),
  
  // Admin routes
  adminUsers: () => router.navigate(ROUTE_PATHS.private.admin.users),
  adminAnalytics: () => router.navigate(ROUTE_PATHS.private.admin.analytics),
  adminSettings: () => router.navigate(ROUTE_PATHS.private.admin.settings),
  
  // Navigation helpers
  back: () => window.history.back(),
  forward: () => window.history.forward(),
  replace: (path: string) => router.navigate(path, { replace: true }),
}

// Breadcrumb utilities
export const getBreadcrumbs = (pathname: string): Array<{ label: string; path: string }> => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: Array<{ label: string; path: string }> = []
  
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Check if it's a dynamic route (ID)
    if (/^[a-f\d]{24}$|^\d+$/.test(segment)) {
      const prevSegment = segments[index - 1]
      breadcrumbs.push({
        label: `${prevSegment?.charAt(0).toUpperCase()}${prevSegment?.slice(1)} Details`,
        path: currentPath,
      })
    } else {
      const meta = ROUTE_META[currentPath as keyof typeof ROUTE_META]
      breadcrumbs.push({
        label: meta?.breadcrumb || segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath,
      })
    }
  })
  
  return breadcrumbs
}

// Optimized route validation with caching
const validRoutes = new Set<string>()
let routesCached = false

const buildValidRoutes = () => {
  if (routesCached) return
  
  const addRoutes = (obj: Record<string, unknown>) => {
    Object.values(obj).forEach(value => {
      if (typeof value === 'string') {
        validRoutes.add(value)
      } else if (typeof value === 'object' && value !== null) {
        addRoutes(value as Record<string, unknown>)
      }
    })
  }
  
  addRoutes(ROUTE_PATHS as unknown as Record<string, unknown>)
  routesCached = true
}

export const isValidRoute = (path: string): boolean => {
  buildValidRoutes()
  
  // Exact match
  if (validRoutes.has(path)) return true
  
  // Dynamic route match
  for (const route of validRoutes) {
    if (route.includes(':')) {
      const pattern = route.replace(/:[^/]+/g, '[^/]+')
      if (new RegExp(`^${pattern}$`).test(path)) return true
    }
  }
  
  return false
}

// Permission checking
export const canAccessRoute = (path: string, userRole?: string): boolean => {
  if (path.startsWith('/admin')) {
    return userRole === 'admin'
  }
  
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/404']
  if (publicPaths.includes(path) || path.startsWith('/reset-password/')) {
    return true
  }
  
  return !!userRole
}

// Query parameter utilities
export const queryParams = {
  get: (): URLSearchParams => new URLSearchParams(window.location.search),
  
  update: (params: Record<string, string>) => {
    const url = new URL(window.location.href)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    window.history.replaceState({}, '', url.toString())
  },
  
  getParam: (key: string): string | null => {
    return queryParams.get().get(key)
  },
  
  setParam: (key: string, value: string) => {
    queryParams.update({ [key]: value })
  }
}

// Route analysis for debugging
export const analyzeCurrentRoute = () => {
  const pathname = window.location.pathname
  return {
    pathname,
    breadcrumbs: getBreadcrumbs(pathname),
    isValid: isValidRoute(pathname),
    meta: ROUTE_META[pathname as keyof typeof ROUTE_META],
    query: Object.fromEntries(queryParams.get()),
  }
} 
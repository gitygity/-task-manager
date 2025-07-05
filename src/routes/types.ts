// Route types and interfaces

export interface RouteConfig {
  name: string
  path: string
  component: React.ComponentType
  requiresAuth?: boolean
  roles?: string[]
  protected?: boolean
  redirectTo?: string
  exact?: boolean
  metadata?: Record<string, unknown>
}

export interface RoutePaths {
  public: {
    login: string
    register: string
    forgotPassword: string
  }
  private: {
    dashboard: string
    tasks: {
      list: string
      create: string
      edit: string
      details: string
      kanban: string
    }
    projects: {
      list: string
      create: string
      edit: string
      details: string
    }
    profile: {
      settings: string
      preferences: string
      security: string
    }
    admin: {
      dashboard: string
      users: string
      settings: string
      analytics: string
    }
  }
}

export interface RouteParams {
  id?: string
  userId?: string
  projectId?: string
  taskId?: string
}

export interface RouteGuardConfig {
  requiresAuth: boolean
  roles?: string[]
  redirectTo?: string
  middleware?: ((params: RouteParams) => boolean | Promise<boolean>)[]
}

// Route metadata interface
export interface RouteMeta {
  title: string
  breadcrumb: string
  description?: string
}

// Navigation item interface
export interface NavigationItem {
  path: string
  label: string
  icon: string
}

// Navigation group interface
export interface NavigationGroup {
  label: string
  routes: NavigationItem[]
  requiresRole?: string
}

export type RouteKeys = keyof RoutePaths['public'] | keyof RoutePaths['private'] 
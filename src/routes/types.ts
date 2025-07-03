// Route types and interfaces

// Main route structure interface
export interface AppRoutes {
  public: {
    auth: {
      login: string
      register: string
      forgotPassword: string
      resetPassword: string
    }
    landing: string
    notFound: string
  }
  private: {
    dashboard: string
    tasks: {
      list: string
      create: string
      edit: string
      details: string
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
      users: string
      analytics: string
      settings: string
    }
  }
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

export type RouteKeys = keyof AppRoutes['public'] | keyof AppRoutes['private'] 
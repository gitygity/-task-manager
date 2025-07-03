// Route constants - centralized route management
import type { AppRoutes } from './types'

// Base route constants
export const ROUTE_PATHS: AppRoutes = {
  public: {
    auth: {
      login: '/login',
      register: '/register',
      forgotPassword: '/forgot-password',
      resetPassword: '/reset-password/:token',
    },
    landing: '/',
    notFound: '/404',
  },
  private: {
    dashboard: '/dashboard',
    tasks: {
      list: '/tasks',
      create: '/tasks/create',
      edit: '/tasks/:id/edit',
      details: '/tasks/:id',
    },
    projects: {
      list: '/projects',
      create: '/projects/create', 
      edit: '/projects/:id/edit',
      details: '/projects/:id',
    },
    profile: {
      settings: '/profile/settings',
      preferences: '/profile/preferences',
      security: '/profile/security',
    },
    admin: {
      users: '/admin/users',
      analytics: '/admin/analytics',
      settings: '/admin/settings',
    },
  },
} as const

// Enhanced route metadata
export const ROUTE_META = {
  [ROUTE_PATHS.public.landing]: {
    title: 'Welcome to Task Manager',
    breadcrumb: 'Home',
    description: 'Task management application home page',
  },
  [ROUTE_PATHS.public.auth.login]: {
    title: 'Login - Task Manager',
    breadcrumb: 'Login',
    description: 'User login page',
  },
  [ROUTE_PATHS.public.auth.register]: {
    title: 'Register - Task Manager',
    breadcrumb: 'Register',
    description: 'User registration page',
  },
  [ROUTE_PATHS.public.auth.forgotPassword]: {
    title: 'Forgot Password - Task Manager',
    breadcrumb: 'Forgot Password',
    description: 'Password recovery page',
  },
  [ROUTE_PATHS.private.dashboard]: {
    title: 'Dashboard - Task Manager',
    breadcrumb: 'Dashboard',
    description: 'Main dashboard',
  },
  [ROUTE_PATHS.private.tasks.list]: {
    title: 'Tasks - Task Manager',
    breadcrumb: 'Tasks',
    description: 'Task list and management',
  },
  [ROUTE_PATHS.private.tasks.create]: {
    title: 'Create Task - Task Manager',
    breadcrumb: 'Create Task',
    description: 'Create new task',
  },
  [ROUTE_PATHS.private.projects.list]: {
    title: 'Projects - Task Manager',
    breadcrumb: 'Projects',
    description: 'Project list and management',
  },
  [ROUTE_PATHS.private.projects.create]: {
    title: 'Create Project - Task Manager',
    breadcrumb: 'Create Project',
    description: 'Create new project',
  },
  [ROUTE_PATHS.private.profile.settings]: {
    title: 'Profile Settings - Task Manager',
    breadcrumb: 'Profile Settings',
    description: 'User profile configuration',
  },
  [ROUTE_PATHS.private.profile.preferences]: {
    title: 'Preferences - Task Manager',
    breadcrumb: 'Preferences',
    description: 'User preferences and settings',
  },
  [ROUTE_PATHS.private.profile.security]: {
    title: 'Security Settings - Task Manager',
    breadcrumb: 'Security',
    description: 'Security and privacy settings',
  },
  [ROUTE_PATHS.private.admin.users]: {
    title: 'User Management - Task Manager',
    breadcrumb: 'Users',
    description: 'Admin user management',
  },
  [ROUTE_PATHS.private.admin.analytics]: {
    title: 'Analytics - Task Manager',
    breadcrumb: 'Analytics',
    description: 'Admin analytics dashboard',
  },
  [ROUTE_PATHS.private.admin.settings]: {
    title: 'Admin Settings - Task Manager',
    breadcrumb: 'Settings',
    description: 'System administration settings',
  },
} as const

// Navigation groups for sidebar/menu organization
export const NAVIGATION_GROUPS = [
  {
    label: 'Main',
    routes: [
      { path: ROUTE_PATHS.private.dashboard, label: 'Dashboard', icon: 'dashboard' },
      { path: ROUTE_PATHS.private.tasks.list, label: 'Tasks', icon: 'task' },
      { path: ROUTE_PATHS.private.projects.list, label: 'Projects', icon: 'project' },
    ],
  },
  {
    label: 'Personal',
    routes: [
      { path: ROUTE_PATHS.private.profile.settings, label: 'Profile', icon: 'user' },
      { path: ROUTE_PATHS.private.profile.preferences, label: 'Preferences', icon: 'settings' },
    ],
  },
  {
    label: 'Administration',
    routes: [
      { path: ROUTE_PATHS.private.admin.users, label: 'Users', icon: 'users' },
      { path: ROUTE_PATHS.private.admin.analytics, label: 'Analytics', icon: 'chart' },
      { path: ROUTE_PATHS.private.admin.settings, label: 'Settings', icon: 'cog' },
    ],
    requiresRole: 'admin',
  },
] as const 
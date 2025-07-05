// Main route configuration
import type { RouteObject } from 'react-router-dom'
import { Suspense } from 'react'
import { AuthGuard, GuestGuard, AdminGuard, SmartLayoutGuard } from './guards'
import { ROUTE_PATHS } from './constants'
import LoadingSpinner from './components/LoadingSpinner'
import {
  RootRedirect,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  NotFoundPage,
  DashboardPage,
  TasksListPage,
  CreateTaskPage,
  EditTaskPage,
  TaskDetailsPage,
  KanbanPage,
  ProjectsListPage,
  CreateProjectPage,
  EditProjectPage,
  ProjectDetailsPage,
  ProfileSettingsPage,
  ProfilePreferencesPage,
  ProfileSecurityPage,
  AdminUsersPage,
  AdminAnalyticsPage,
  AdminSettingsPage,
} from './lazyRoutes'

// Layouts
import AuthLayout from '../layouts/AuthLayout'

// Utility function to wrap components in Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner message="Loading..." />}>
    <Component />
  </Suspense>
)

// Root route - smart redirect (no suspense needed for this)
const rootRoute: RouteObject = {
  path: '/',
  element: <RootRedirect />,
}

// Public routes configuration
const publicRoutes: RouteObject[] = [
  {
    path: '',
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      {
        path: ROUTE_PATHS.public.login,
        element: withSuspense(LoginPage),
      },
      {
        path: ROUTE_PATHS.public.register,
        element: withSuspense(RegisterPage),
      },
      {
        path: ROUTE_PATHS.public.forgotPassword,
        element: withSuspense(ForgotPasswordPage),
      },
    ],
  },
]

// Private routes configuration
const privateRoutes: RouteObject[] = [
  {
    path: '',
    element: (
      <AuthGuard>
        <SmartLayoutGuard />
      </AuthGuard>
    ),
    children: [
      // Dashboard
      {
        path: ROUTE_PATHS.private.dashboard,
        element: withSuspense(DashboardPage),
      },
      
      // Tasks routes
      {
        path: ROUTE_PATHS.private.tasks.list,
        element: withSuspense(TasksListPage),
      },
      {
        path: ROUTE_PATHS.private.tasks.create,
        element: withSuspense(CreateTaskPage),
      },
      {
        path: ROUTE_PATHS.private.tasks.details,
        element: withSuspense(TaskDetailsPage),
      },
      {
        path: ROUTE_PATHS.private.tasks.edit,
        element: withSuspense(EditTaskPage),
      },
      {
        path: ROUTE_PATHS.private.tasks.kanban,
        element: withSuspense(KanbanPage),
      },
      
      // Projects routes
      {
        path: ROUTE_PATHS.private.projects.list,
        element: withSuspense(ProjectsListPage),
      },
      {
        path: ROUTE_PATHS.private.projects.create,
        element: withSuspense(CreateProjectPage),
      },
      {
        path: ROUTE_PATHS.private.projects.details,
        element: withSuspense(ProjectDetailsPage),
      },
      {
        path: ROUTE_PATHS.private.projects.edit,
        element: withSuspense(EditProjectPage),
      },
      
      // Profile routes
      {
        path: ROUTE_PATHS.private.profile.settings,
        element: withSuspense(ProfileSettingsPage),
      },
      {
        path: ROUTE_PATHS.private.profile.preferences,
        element: withSuspense(ProfilePreferencesPage),
      },
      {
        path: ROUTE_PATHS.private.profile.security,
        element: withSuspense(ProfileSecurityPage),
      },
      
      // Admin routes (protected by AdminGuard)
      {
        path: ROUTE_PATHS.private.admin.users,
        element: (
          <AdminGuard>
            {withSuspense(AdminUsersPage)}
          </AdminGuard>
        ),
      },
      {
        path: ROUTE_PATHS.private.admin.analytics,
        element: (
          <AdminGuard>
            {withSuspense(AdminAnalyticsPage)}
          </AdminGuard>
        ),
      },
      {
        path: ROUTE_PATHS.private.admin.settings,
        element: (
          <AdminGuard>
            {withSuspense(AdminSettingsPage)}
          </AdminGuard>
        ),
      },
    ],
  },
]

// Error routes
const errorRoutes: RouteObject[] = [
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
]

// Main routes configuration
export const routes: RouteObject[] = [
  rootRoute,
  ...publicRoutes,
  ...privateRoutes,
  ...errorRoutes,
] 
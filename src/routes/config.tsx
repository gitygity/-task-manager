// Main route configuration
import type { RouteObject } from 'react-router-dom'
import { AuthGuard, GuestGuard, AdminGuard, SmartLayoutGuard } from './guards'
import { ROUTE_PATHS } from './constants'
import {
  LandingPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  NotFoundPage,
  DashboardPage,
  TasksListPage,
  CreateTaskPage,
  EditTaskPage,
  TaskDetailsPage,
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
import PublicLayout from '../layouts/PublicLayout'

// Public routes configuration
const publicRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.public.landing,
    element: (
      <PublicLayout>
        <LandingPage />
      </PublicLayout>
    ),
  },
  {
    path: '',
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      {
        path: ROUTE_PATHS.public.auth.login,
        element: <LoginPage />,
      },
      {
        path: ROUTE_PATHS.public.auth.register,
        element: <RegisterPage />,
      },
      {
        path: ROUTE_PATHS.public.auth.forgotPassword,
        element: <ForgotPasswordPage />,
      },
      {
        path: ROUTE_PATHS.public.auth.resetPassword,
        element: <ResetPasswordPage />,
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
        element: <DashboardPage />,
      },
      
      // Tasks routes
      {
        path: ROUTE_PATHS.private.tasks.list,
        element: <TasksListPage />,
      },
      {
        path: ROUTE_PATHS.private.tasks.create,
        element: <CreateTaskPage />,
      },
      {
        path: ROUTE_PATHS.private.tasks.details,
        element: <TaskDetailsPage />,
      },
      {
        path: ROUTE_PATHS.private.tasks.edit,
        element: <EditTaskPage />,
      },
      
      // Projects routes
      {
        path: ROUTE_PATHS.private.projects.list,
        element: <ProjectsListPage />,
      },
      {
        path: ROUTE_PATHS.private.projects.create,
        element: <CreateProjectPage />,
      },
      {
        path: ROUTE_PATHS.private.projects.details,
        element: <ProjectDetailsPage />,
      },
      {
        path: ROUTE_PATHS.private.projects.edit,
        element: <EditProjectPage />,
      },
      
      // Profile routes
      {
        path: ROUTE_PATHS.private.profile.settings,
        element: <ProfileSettingsPage />,
      },
      {
        path: ROUTE_PATHS.private.profile.preferences,
        element: <ProfilePreferencesPage />,
      },
      {
        path: ROUTE_PATHS.private.profile.security,
        element: <ProfileSecurityPage />,
      },
      
      // Admin routes (protected by AdminGuard)
      {
        path: ROUTE_PATHS.private.admin.users,
        element: (
          <AdminGuard>
            <AdminUsersPage />
          </AdminGuard>
        ),
      },
      {
        path: ROUTE_PATHS.private.admin.analytics,
        element: (
          <AdminGuard>
            <AdminAnalyticsPage />
          </AdminGuard>
        ),
      },
      {
        path: ROUTE_PATHS.private.admin.settings,
        element: (
          <AdminGuard>
            <AdminSettingsPage />
          </AdminGuard>
        ),
      },
    ],
  },
]

// Error routes
const errorRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.public.notFound,
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

// Main routes configuration
export const routes: RouteObject[] = [
  ...publicRoutes,
  ...privateRoutes,
  ...errorRoutes,
] 
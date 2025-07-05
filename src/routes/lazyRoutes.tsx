// Lazy loaded route components for code splitting
import { lazy } from 'react'

// Public pages
export const LandingPage = lazy(() => import('../pages/LandingPage'))
export const LoginPage = lazy(() => import('../pages/login'))
export const RegisterPage = lazy(() => import('../pages/RegisterPage'))
export const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'))
export const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'))
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

// Private pages - Dashboard
export const DashboardPage = lazy(() => import('../pages/dashboard'))

// Private pages - Tasks
// Task pages removed - using integrated KanbanBoard instead

// Private pages - Projects
export const ProjectsListPage = lazy(() => import('../pages/projects/ProjectsListPage'))
export const CreateProjectPage = lazy(() => import('../pages/projects/CreateProjectPage'))
export const EditProjectPage = lazy(() => import('../pages/projects/EditProjectPage'))
export const ProjectDetailsPage = lazy(() => import('../pages/projects/ProjectDetailsPage'))

// Private pages - Profile
export const ProfileSettingsPage = lazy(() => import('../pages/profile/ProfileSettingsPage'))
export const ProfilePreferencesPage = lazy(() => import('../pages/profile/ProfilePreferencesPage'))
export const ProfileSecurityPage = lazy(() => import('../pages/profile/ProfileSecurityPage'))

// Private pages - Admin
export const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'))
export const AdminAnalyticsPage = lazy(() => import('../pages/admin/AdminAnalyticsPage'))
export const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage')) 
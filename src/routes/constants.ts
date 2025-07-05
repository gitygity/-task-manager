// Route constants and configurations
import type { RoutePaths } from './types'

export const ROUTE_PATHS: RoutePaths = {
  public: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
  },
  private: {
    dashboard: '/dashboard',
    tasks: {
      list: '/tasks',
      create: '/tasks/create',
      edit: '/tasks/:id/edit',
      details: '/tasks/:id',
      kanban: '/tasks/kanban',
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
      dashboard: '/admin/dashboard',
      users: '/admin/users',
      settings: '/admin/settings',
      analytics: '/admin/analytics',
    },
  },
}

// Route metadata for SEO and navigation
export const ROUTE_META = {
  [ROUTE_PATHS.public.login]: {
    title: 'ورود',
    description: 'وارد حساب کاربری خود شوید',
    breadcrumb: 'ورود',
  },
  [ROUTE_PATHS.public.register]: {
    title: 'ثبت نام',
    description: 'حساب کاربری جدید ایجاد کنید',
    breadcrumb: 'ثبت نام',
  },
  [ROUTE_PATHS.public.forgotPassword]: {
    title: 'فراموشی رمز عبور',
    description: 'بازیابی رمز عبور',
    breadcrumb: 'فراموشی رمز عبور',
  },
  [ROUTE_PATHS.private.dashboard]: {
    title: 'داشبورد',
    description: 'نمای کلی پروژه‌ها و وظایف',
    breadcrumb: 'داشبورد',
  },
  [ROUTE_PATHS.private.tasks.list]: {
    title: 'وظایف',
    description: 'مدیریت وظایف',
    breadcrumb: 'وظایف',
  },
  [ROUTE_PATHS.private.tasks.create]: {
    title: 'ایجاد وظیفه',
    description: 'ایجاد وظیفه جدید',
    breadcrumb: 'ایجاد وظیفه',
  },
  [ROUTE_PATHS.private.tasks.edit]: {
    title: 'ویرایش وظیفه',
    description: 'ویرایش وظیفه',
    breadcrumb: 'ویرایش وظیفه',
  },
  [ROUTE_PATHS.private.tasks.details]: {
    title: 'جزئیات وظیفه',
    description: 'مشاهده جزئیات وظیفه',
    breadcrumb: 'جزئیات وظیفه',
  },
  [ROUTE_PATHS.private.tasks.kanban]: {
    title: 'تابلوی کانبان',
    description: 'مدیریت وظایف با تابلوی کانبان',
    breadcrumb: 'تابلوی کانبان',
  },
  [ROUTE_PATHS.private.projects.list]: {
    title: 'پروژه‌ها',
    description: 'مدیریت پروژه‌ها',
    breadcrumb: 'پروژه‌ها',
  },
  [ROUTE_PATHS.private.projects.create]: {
    title: 'ایجاد پروژه',
    description: 'ایجاد پروژه جدید',
    breadcrumb: 'ایجاد پروژه',
  },
  [ROUTE_PATHS.private.projects.edit]: {
    title: 'ویرایش پروژه',
    description: 'ویرایش پروژه',
    breadcrumb: 'ویرایش پروژه',
  },
  [ROUTE_PATHS.private.projects.details]: {
    title: 'جزئیات پروژه',
    description: 'مشاهده جزئیات پروژه',
    breadcrumb: 'جزئیات پروژه',
  },
  [ROUTE_PATHS.private.profile.settings]: {
    title: 'تنظیمات پروفایل',
    description: 'تنظیمات حساب کاربری',
    breadcrumb: 'تنظیمات پروفایل',
  },
  [ROUTE_PATHS.private.profile.preferences]: {
    title: 'تنظیمات کاربری',
    description: 'تنظیمات شخصی‌سازی',
    breadcrumb: 'تنظیمات کاربری',
  },
  [ROUTE_PATHS.private.profile.security]: {
    title: 'امنیت',
    description: 'تنظیمات امنیتی',
    breadcrumb: 'امنیت',
  },
  [ROUTE_PATHS.private.admin.dashboard]: {
    title: 'داشبورد ادمین',
    description: 'پنل مدیریت',
    breadcrumb: 'داشبورد ادمین',
  },
  [ROUTE_PATHS.private.admin.users]: {
    title: 'مدیریت کاربران',
    description: 'مدیریت کاربران سیستم',
    breadcrumb: 'مدیریت کاربران',
  },
  [ROUTE_PATHS.private.admin.settings]: {
    title: 'تنظیمات سیستم',
    description: 'تنظیمات کلی سیستم',
    breadcrumb: 'تنظیمات سیستم',
  },
  [ROUTE_PATHS.private.admin.analytics]: {
    title: 'تحلیلات',
    description: 'گزارشات و تحلیلات',
    breadcrumb: 'تحلیلات',
  },
} as const

// Default route configurations
export const DEFAULT_ROUTES = {
  AUTHENTICATED: ROUTE_PATHS.private.dashboard,
  UNAUTHENTICATED: ROUTE_PATHS.public.login,
  ADMIN: ROUTE_PATHS.private.admin.dashboard,
  AFTER_LOGIN: ROUTE_PATHS.private.dashboard,
  AFTER_LOGOUT: ROUTE_PATHS.public.login,
} as const 
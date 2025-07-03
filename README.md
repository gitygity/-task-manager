# Task Manager 📋

![Repository Size](https://img.shields.io/github/repo-size/gitygity/task-manager)
![Open Issues](https://img.shields.io/github/issues/gitygity/task-manager)
![License](https://img.shields.io/github/license/gitygity/task-manager?style=flat-square&cacheSeconds=60)
![Last Commit](https://img.shields.io/github/last-commit/gitygity/task-manager)
![Build Status](https://img.shields.io/github/actions/workflow/status/gitygity/task-manager/ci.yml?branch=main)
<!-- Coverage badge will be added when testing is implemented -->
<!-- [![Coverage Status](https://coveralls.io/repos/github/gitygity/task-manager/badge.svg?branch=main)](https://coveralls.io/github/gitygity/task-manager?branch=main) -->


A modern, enterprise-grade task management application built with React, TypeScript, and cutting-edge technologies. Features professional routing system, state management, and beautiful UI components with full type safety.

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- ✅ Multi-role authentication (User/Admin)
- ✅ Route guards with smart layout selection
- ✅ Protected routes with redirect handling
- ✅ Login, Register, Password Reset flows

### 📋 **Task Management**
- ✅ Create, edit, delete, and view tasks
- ✅ Task priorities and status tracking
- ✅ Rich task details and descriptions
- ✅ Task filtering and search

### 📁 **Project Organization**
- ✅ Project-based task grouping
- ✅ Project management dashboard
- ✅ Team collaboration features
- ✅ Project analytics and insights

### 👤 **User Experience**
- ✅ Role-based dashboards (User/Admin)
- ✅ Profile management and preferences
- ✅ Security settings and account control
- ✅ Responsive design for all devices

### 🎨 **Modern UI/UX**
- ✅ shadcn/ui component library
- ✅ Dark/Light theme support
- ✅ Smooth animations and transitions
- ✅ Professional design system

---

## 🛠️ Tech Stack

### **Frontend Framework**
- **[React 18](https://reactjs.org/)** - Modern React with hooks
- **[TypeScript](https://www.typescriptlang.org/)** - Full type safety
- **[Vite](https://vitejs.dev/)** - Lightning fast build tool

### **Styling & UI**
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality components
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[CVA](https://cva.style/)** - Class variance authority

### **Routing & State**
- **[React Router v7](https://reactrouter.com/)** - Client-side routing
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **Professional routing system** with guards and utilities

### **Development Tools**
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Commitizen](https://commitizen.github.io/)** - Conventional commits
- **[TypeScript ESLint](https://typescript-eslint.io/)** - TS-specific rules

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/gitygity/task-manager.git

# Navigate to project directory
cd task-manager

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Building
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors

# Git Workflow
npm run commit       # Conventional commits with Commitizen
git cz              # Alternative commit command
```

---

## 📁 Project Architecture

```
src/
├── 📁 components/           # Shared UI components
│   ├── ui/                 # shadcn/ui components
│   └── ErrorBoundary.tsx   # Error handling
│
├── 📁 features/            # Feature-based modules
│   ├── auth/              # Authentication logic
│   ├── tasks/             # Task management
│   └── projects/          # Project features
│
├── 📁 layouts/            # Application layouts
│   ├── AdminLayout.tsx    # Admin dashboard layout
│   ├── UserLayout.tsx     # User dashboard layout
│   ├── AuthLayout.tsx     # Authentication pages
│   └── PublicLayout.tsx   # Public pages
│
├── 📁 lib/               # Utilities and helpers
│   └── utils.ts          # Common utilities
│
├── 📁 pages/             # Page components
│   ├── auth/             # Authentication pages
│   ├── tasks/            # Task pages
│   ├── projects/         # Project pages
│   ├── profile/          # User profile pages
│   └── admin/            # Admin pages
│
└── 📁 routes/            # Professional routing system
    ├── components/       # Route-specific components
    ├── guards/          # Route protection (Auth/Guest/Admin)
    ├── config.tsx       # Route configuration
    ├── constants.ts     # Route constants and metadata
    ├── utils.ts         # Navigation utilities
    └── types.ts         # Route type definitions
```

---

## 🔐 Authentication & Security

### **Route Guards**
- **`AuthGuard`** - Protects private routes
- **`GuestGuard`** - Redirects authenticated users
- **`AdminGuard`** - Admin-only access control
- **`SmartLayoutGuard`** - Role-based layout selection

### **User Roles**
- **Admin** - Full system access with management dashboard
- **User** - Standard user with personal task management
- **Guest** - Public access to landing and auth pages

---

## 🎨 UI Components

### **Component Library**
Built with **shadcn/ui** for consistency and accessibility:

- **Forms** - Input, Button, Label, Alert
- **Layout** - Card, Separator, Badge  
- **Navigation** - Professional routing with breadcrumbs
- **Feedback** - Loading spinners, error boundaries

### **Design Tokens**
- Consistent color palette with CSS variables
- Responsive breakpoints
- Typography scale
- Spacing system

---

## 🔄 State Management

### **Zustand Stores**
- **`useAuthStore`** - Authentication state and user data
- **`useTasksStore`** - Task management and operations
- Feature-specific stores with TypeScript support

### **State Architecture**
```typescript
// Example: Auth Store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: LoginData) => Promise<void>
  logout: () => void
}
```

---

## 🚦 Development Workflow

### **Git Workflow**
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit with conventional commits
npm run commit

# 3. Push changes
git push origin feature/new-feature

# 4. Create Pull Request
```

### **Conventional Commits**
- `feat:` - New features
- `fix:` - Bug fixes  
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 🧪 Testing (Coming Soon)

- **Unit Tests** - Component testing with React Testing Library
- **Integration Tests** - Route and state testing
- **E2E Tests** - End-to-end user workflows

---

## 📈 Performance

### **Optimizations**
- **Code Splitting** - Lazy loading with React.lazy()
- **Route-based Splitting** - Automatic code splitting by routes
- **Component Optimization** - Memoization and efficient re-renders
- **Bundle Analysis** - Optimized bundle size

### **Best Practices**
- TypeScript for type safety
- ESLint and Prettier for code quality
- Professional error handling
- Responsive design patterns

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`npm run commit`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Code Style**
- Follow existing TypeScript and React patterns
- Use conventional commits
- Add proper TypeScript types
- Follow component naming conventions

---

## 📚 Documentation

- [API Documentation](./docs/api.md) *(Coming Soon)*
- [Component Guide](./docs/components.md) *(Coming Soon)*
- [Deployment Guide](./docs/deployment.md) *(Coming Soon)*

---

## 🌐 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deployment Platforms**
- **Vercel** - Recommended for React apps
- **Netlify** - Easy static deployment
- **GitHub Pages** - Free hosting option

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [React](https://reactjs.org/) team for the incredible framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS

---

<div align="center">

**Built with ❤️ using modern web technologies**

⭐ **Star this repository if you find it helpful!** ⭐

</div>

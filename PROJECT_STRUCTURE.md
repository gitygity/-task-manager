# 🏗️ Project Structure

This project follows a **feature-based architecture** to maintain better code organization, scalability, and maintainability.

## 📁 Directory Structure

```
src/
├── features/
│   ├── auth/                    # Authentication feature
│   │   ├── components/          # Auth-specific components
│   │   │   ├── AuthContainer.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── services/            # Auth-specific services
│   │   │   └── authService.ts
│   │   ├── types/               # Auth-specific types
│   │   │   └── index.ts
│   │   ├── hooks.ts             # Auth-specific hooks
│   │   ├── index.ts             # Auth feature exports
│   │   ├── authStore.ts         # Auth state management
│   │   ├── model.ts             # Auth models
│   │   └── utils.ts             # Auth utilities
│   │
│   └── tasks/                   # Task management feature
│       ├── components/          # Task-specific components
│       │   ├── TaskActions.tsx
│       │   ├── TaskDemo.tsx
│       │   └── TaskList.tsx
│       ├── services/            # Task-specific services
│       │   └── taskService.ts
│       ├── types/               # Task-specific types
│       │   └── index.ts
│       ├── hooks.ts             # Task-specific hooks
│       ├── index.ts             # Task feature exports
│       ├── tasksStore.ts        # Task state management
│       ├── model.ts             # Task models
│       └── utils.ts             # Task utilities
│
├── components/                  # Shared/reusable components
│   ├── layout/                  # Layout components
│   │   └── Header.tsx
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── LoadingSpinner.tsx       # Shared loading component
│   └── ErrorBoundary.tsx        # Error handling component
│
├── lib/                         # Third-party configurations
│   ├── supabase.ts             # Supabase client setup
│   └── utils.ts                # Shared utilities
│
├── types/                       # Global type definitions
│   └── env.d.ts                # Environment variables types
│
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── App.css                      # Global styles
```

## 🎯 Feature-Based Architecture Benefits

### ✅ **Advantages**

1. **Better Organization**: Related code is grouped together
2. **Easier Maintenance**: Changes to a feature are contained
3. **Improved Scalability**: New features can be added independently
4. **Clear Dependencies**: Feature boundaries are well-defined
5. **Team Collaboration**: Different teams can work on different features
6. **Easier Testing**: Features can be tested in isolation

### 📦 **Feature Structure**

Each feature follows this structure:

```
feature/
├── components/          # Feature-specific React components
├── services/           # API calls and business logic
├── types/              # TypeScript interfaces and types
├── hooks.ts            # React Query hooks and custom hooks
├── index.ts            # Exports for the feature
├── store.ts            # State management (Zustand)
├── model.ts            # Data models and validation
└── utils.ts            # Feature-specific utilities
```

## 🔄 Import Strategy

### ✅ **Correct Imports**

```typescript
// Import from features
import { useAuth, AuthContainer } from '@/features/auth'
import { TaskDemo, useTasks } from '@/features/tasks'

// Import shared components
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/LoadingSpinner'

// Import shared utilities
import { supabase } from '@/lib/supabase'
```

### ❌ **Avoid Direct Imports**

```typescript
// Don't import from internal feature files
import { LoginForm } from '@/features/auth/components/LoginForm'
import { authService } from '@/features/auth/services/authService'

// Use feature index exports instead
import { LoginForm, authService } from '@/features/auth'
```

## 🔒 Authentication Feature

### **Components**
- `AuthContainer`: Main authentication wrapper
- `LoginForm`: User login form with validation
- `RegisterForm`: User registration form with validation

### **Services**
- `authService`: Handles all Supabase auth operations

### **Hooks**
- `useAuth()`: Current user state and authentication status
- `useLogin()`: Login mutation
- `useRegister()`: Registration mutation
- `useLogout()`: Logout mutation

### **Types**
- `User`: User interface
- `LoginData`: Login form data
- `RegisterData`: Registration form data
- `AuthResponse`: API response types

## 📋 Tasks Feature

### **Components**
- `TaskDemo`: Main task management interface
- `TaskList`: Display list of tasks
- `TaskActions`: Task CRUD operations with optimistic updates

### **Services**
- `taskService`: Handles all task-related API calls

### **Hooks**
- `useTasks()`: Fetch user tasks
- `useCreateTask()`: Create new task with optimistic updates
- `useUpdateTask()`: Update task with optimistic updates
- `useDeleteTask()`: Delete task with optimistic updates

### **Types**
- `Task`: Task interface
- `CreateTaskData`: Task creation data
- `UpdateTaskData`: Task update data

## 🎨 Shared Components

### **Layout Components**
- `Header`: User information and logout functionality

### **UI Components**
- shadcn/ui components: `Button`, `Card`, `Input`, etc.
- `LoadingSpinner`: Consistent loading states
- `ErrorBoundary`: Error handling

## 🔧 Best Practices

### **1. Feature Independence**
- Features should not directly import from other features
- Use shared components for common UI elements
- Communicate between features through props or context

### **2. Export Strategy**
- Each feature has an `index.ts` that exports public APIs
- Internal components/services are not exported
- Use barrel exports for clean imports

### **3. Type Safety**
- Each feature defines its own types
- Use TypeScript interfaces for better IntelliSense
- Export types from feature index files

### **4. State Management**
- Use React Query for server state
- Use Zustand for client state when needed
- Keep state close to where it's used

### **5. Service Layer**
- Abstract API calls in service layers
- Handle errors consistently
- Use proper TypeScript types for API responses

## 🚀 Adding New Features

To add a new feature:

1. **Create feature directory**: `src/features/new-feature/`
2. **Set up structure**: components, services, types, hooks
3. **Create index.ts**: Export public APIs
4. **Add to imports**: Import from `@/features/new-feature`
5. **Update documentation**: Add to this README

## 📱 Development Workflow

1. **Start development**: `npm run dev`
2. **Run tests**: `npm test`
3. **Type checking**: `npm run type-check`
4. **Build**: `npm run build`

## 🔍 Code Organization Rules

### ✅ **Do**
- Group related functionality in features
- Use TypeScript for type safety
- Follow consistent naming conventions
- Export only what's needed
- Keep components focused and small

### ❌ **Don't**
- Create circular dependencies between features
- Import internal feature files directly
- Mix business logic with UI components
- Create monolithic components
- Expose implementation details

This structure ensures maintainable, scalable, and well-organized code that's easy for teams to work with! 🎉 
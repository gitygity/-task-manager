# Component Guide

*Coming Soon*

## shadcn/ui Components

This project uses the **shadcn/ui** component library for consistent, accessible UI components.

### Available Components

#### **Form Components**
- `Button` - Various sizes and variants
- `Input` - Text input with validation states
- `Label` - Accessible form labels
- `Alert` - Success, error, warning alerts

#### **Layout Components**
- `Card` - Content containers with header/footer
- `Separator` - Visual dividers
- `Badge` - Status indicators and tags

#### **Navigation Components**
- Route guards for protected navigation
- Smart layout selection based on user role
- Breadcrumb navigation

#### **Feedback Components**
- `LoadingSpinner` - Loading states
- `ErrorBoundary` - Error handling
- Toast notifications *(Coming Soon)*

---

## Custom Components

### Layouts

#### AdminLayout
```typescript
// Professional admin dashboard with sidebar
- Navigation sidebar
- User profile dropdown
- Stats overview
- Management tools
```

#### UserLayout
```typescript
// Simple user interface
- Top navigation bar
- User menu
- Clean task management
```

#### AuthLayout
```typescript
// Centered authentication forms
- Login/Register forms
- Password reset
- Clean minimal design
```

---

## Component Usage

### Basic Button
```typescript
import { Button } from "@/components/ui/button"

<Button variant="default" size="md">
  Click me
</Button>
```

### Form with Validation
```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<form>
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" />
  <Button type="submit">Submit</Button>
</form>
```

### Loading State
```typescript
import { LoadingSpinner } from "@/components/LoadingSpinner"

<LoadingSpinner />
```

---

*This guide will be expanded as more components are added.* 
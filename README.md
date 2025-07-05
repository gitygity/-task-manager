# راه‌اندازی Supabase برای مدیریت تسک

## 🚀 شروع سریع

### 1. ایجاد جدول در Supabase

در پنل **SQL Editor** سوپابیس، کوئری زیر را اجرا کنید:

```sql
-- ایجاد جدول تسک‌ها
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  description text,
  status text not null default 'todo',
  due_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- فعال‌سازی RLS (Row Level Security)
alter table public.tasks enable row level security;

-- ایجاد policy برای دسترسی کاربران
create policy "Users can access their own tasks"
  on public.tasks for all
  using (auth.uid() = user_id);
```

### 2. تنظیم Environment Variables

فایل `.env` را با مقادیر مربوط به پروژه سوپابیس خود پر کنید:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. اجرای پروژه

```bash
# نصب dependencies
npm install

# اجرای پروژه
npm run dev
```

## 🛠️ فایل‌های ایجاد شده

### Types (`src/types/task.ts`)
```typescript
interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'completed'
  due_date: string | null
  created_at: string
  updated_at: string
}
```

### Service Layer (`src/services/taskService.ts`)
- `getTasks(userId)` - دریافت تسک‌های کاربر
- `createTask(userId, taskData)` - ایجاد تسک جدید
- `updateTask(taskId, updates)` - بروزرسانی تسک
- `deleteTask(taskId)` - حذف تسک

### React Query Hooks (`src/hooks/useTasks.ts`)
**همه با Optimistic Updates! ⚡**

- `useTasks(userId)` - دریافت تسک‌ها با caching
- `useCreateTask()` - ایجاد فوری + real data جایگزینی
- `useUpdateTask()` - بروزرسانی فوری + rollback در صورت خطا
- `useDeleteTask()` - حذف فوری + برگرداندن در صورت خطا

### Components
- `TaskList` - نمایش ساده لیست تسک‌ها
- `TaskActions` - کامپوننت کامل با edit, delete, status change
- `TaskDemo` - کامپوننت کامل با فرم ایجاد + TaskActions

## 📱 استفاده

```tsx
import { TaskDemo } from '@/components/TaskDemo'

function App() {
  const userId = 'user-123' // از authentication store
  
  return <TaskDemo userId={userId} />
}
```

## 🚀 ویژگی‌های جدید

### ⚡ **Optimistic Updates همه جا**
```typescript
// Create Task
onMutate: async ({ userId, taskData }) => {
  // فوری temp task نشون میده
  const tempTask = { id: `temp-${Date.now()}`, ...taskData }
  queryClient.setQueryData(TASK_KEYS.list(userId), 
    (oldTasks) => [tempTask, ...oldTasks]
  )
}

// Update Task  
onMutate: async ({ taskId, updates }) => {
  // فوری تغییرات رو نشون میده
  queryClient.setQueryData(targetQueryKey, (oldTasks) =>
    oldTasks?.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    )
  )
}

// Delete Task
onMutate: async (taskId) => {
  // فوری حذف می‌کنه
  queryClient.setQueryData(targetQueryKey, (oldTasks) =>
    oldTasks?.filter(task => task.id !== taskId)
  )
}
```

### 🔄 **Error Handling & Rollback**
- اگه خطا بده، به حالت قبل برمی‌گرده
- Real data از سرور جایگزین temp data میشه
- UI هیچ وقت در حالت نامعلوم نمی‌مونه

### 🎨 **TaskActions Component**
- **Inline editing** - click to edit
- **Status toggle** - click badges to change status  
- **Delete confirmation** - با confirm dialog
- **Real-time feedback** - loading states + error messages

## 🔧 ویژگی‌ها

- ✅ **Type Safety** - کامل با TypeScript
- ✅ **Optimistic Updates** - فوری برای همه عملیات
- ✅ **Error Rollback** - برگرداندن در صورت خطا
- ✅ **Real-time Ready** - آماده برای Supabase Realtime
- ✅ **Loading States** - مدیریت وضعیت بارگذاری
- ✅ **Persian UI** - رابط کاربری فارسی
- ✅ **Interactive** - edit, delete, status change

## 🎯 UX بهبودها

1. **فوری بودن** - کاربر انتظار نمی‌کشه
2. **قابل اعتماد** - اگه خطا بده rollback میشه
3. **تعاملی** - click to edit, click to change status
4. **بصری** - loading spinners + error messages
5. **بهینه** - کمترین network requests

## 🚀 مرحله بعدی

- اضافه کردن Authentication
- پیاده‌سازی Realtime updates
- اضافه کردن فیلترینگ و جستجو
- بهبود UI/UX with animations

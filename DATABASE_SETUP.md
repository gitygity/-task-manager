# Database Setup Guide

## 📋 Required Database Tables

### 1. Enable Authentication (Already Done)
Supabase Auth is enabled by default. No additional setup needed.

### 2. Create Tasks Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create tasks table
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  due_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Foreign key constraint
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only see their own tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own tasks
CREATE POLICY "Users can insert their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own tasks
CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own tasks
CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. Create Updated At Trigger (Optional)

For automatic `updated_at` timestamps:

```sql
-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER handle_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

## 🔑 Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔐 Authentication Settings

In your Supabase Dashboard:

1. Go to **Authentication** → **Settings**
2. Set **Site URL** to `http://localhost:5173` (for development)
3. Configure **Email Templates** (optional)
4. Enable **Email Confirmation** (recommended for production)

## 📱 Testing the Setup

1. Start the development server: `npm run dev`
2. Open `http://localhost:5173`
3. Try registering a new user
4. Try logging in
5. Create some tasks
6. Test task operations (create, update, delete)

## 🔍 Verifying Database

Check in Supabase SQL Editor:

```sql
-- Check users table (should have registered users)
SELECT * FROM auth.users;

-- Check tasks table (should have user tasks)
SELECT * FROM public.tasks;
```

## 🚨 Common Issues

1. **"Invalid JWT"** - Check your Supabase URL and anon key
2. **"Row Level Security"** - Make sure RLS policies are created
3. **"Permission denied"** - Verify user authentication
4. **"Table doesn't exist"** - Run the CREATE TABLE SQL

## 📊 Database Schema

```
┌─────────────────┐     ┌─────────────────┐
│   auth.users    │     │  public.tasks   │
├─────────────────┤     ├─────────────────┤
│ id (uuid) PK    │────▶│ user_id (uuid)  │
│ email           │     │ id (uuid) PK    │
│ created_at      │     │ title           │
│ updated_at      │     │ description     │
│ user_metadata   │     │ status          │
└─────────────────┘     │ due_date        │
                        │ created_at      │
                        │ updated_at      │
                        └─────────────────┘
``` 
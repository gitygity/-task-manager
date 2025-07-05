-- Complete Database Setup for Task Manager with Projects
-- This file creates both projects and tasks tables from scratch

-- ====================================
-- PROJECTS TABLE
-- ====================================

-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for projects table
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);

-- ====================================
-- TASKS TABLE (WITH PROJECT RELATIONSHIP)
-- ====================================

-- Create the tasks table with project_id from the beginning
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for tasks table
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- ====================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ====================================

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger for projects table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers 
                   WHERE trigger_name = 'update_projects_updated_at' AND event_object_table = 'projects') THEN
        CREATE TRIGGER update_projects_updated_at
            BEFORE UPDATE ON projects
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create trigger for tasks table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers 
                   WHERE trigger_name = 'update_tasks_updated_at' AND event_object_table = 'tasks') THEN
        CREATE TRIGGER update_tasks_updated_at
            BEFORE UPDATE ON tasks
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ====================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================

-- Enable RLS for projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Enable RLS for tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ====================================
-- RLS POLICIES FOR PROJECTS
-- ====================================

-- Drop existing policies for projects (if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own projects' AND tablename = 'projects') THEN
        DROP POLICY "Users can view their own projects" ON projects;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own projects' AND tablename = 'projects') THEN
        DROP POLICY "Users can insert their own projects" ON projects;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own projects' AND tablename = 'projects') THEN
        DROP POLICY "Users can update their own projects" ON projects;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own projects' AND tablename = 'projects') THEN
        DROP POLICY "Users can delete their own projects" ON projects;
    END IF;
END $$;

-- Create RLS policies for projects
CREATE POLICY "Users can view their own projects"
    ON projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- ====================================
-- RLS POLICIES FOR TASKS
-- ====================================

-- Drop existing policies for tasks (if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own tasks' AND tablename = 'tasks') THEN
        DROP POLICY "Users can view their own tasks" ON tasks;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own tasks' AND tablename = 'tasks') THEN
        DROP POLICY "Users can insert their own tasks" ON tasks;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own tasks' AND tablename = 'tasks') THEN
        DROP POLICY "Users can update their own tasks" ON tasks;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own tasks' AND tablename = 'tasks') THEN
        DROP POLICY "Users can delete their own tasks" ON tasks;
    END IF;
END $$;

-- Create RLS policies for tasks
CREATE POLICY "Users can view their own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON tasks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON tasks FOR DELETE
    USING (auth.uid() = user_id);

-- ====================================
-- STATISTICAL VIEWS
-- ====================================

-- Create a view for project statistics
CREATE OR REPLACE VIEW project_stats AS
SELECT 
    user_id,
    COUNT(*) as total_projects,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN status = 'planning' THEN 1 END) as planning_projects,
    COUNT(CASE WHEN status = 'paused' THEN 1 END) as paused_projects,
    COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_projects,
    COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_projects
FROM projects
GROUP BY user_id;

-- Create a view for project tasks statistics
CREATE OR REPLACE VIEW project_tasks_stats AS
SELECT 
    p.id as project_id,
    p.user_id,
    p.title as project_title,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'todo' THEN 1 END) as todo_tasks,
    COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.priority = 'urgent' THEN 1 END) as urgent_tasks,
    COUNT(CASE WHEN t.priority = 'high' THEN 1 END) as high_priority_tasks,
    ROUND(
        CASE 
            WHEN COUNT(t.id) > 0 THEN 
                COUNT(CASE WHEN t.status = 'completed' THEN 1 END) * 100.0 / COUNT(t.id)
            ELSE 0 
        END, 2
    ) as completion_percentage
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, p.user_id, p.title;

-- ====================================
-- PERMISSIONS
-- ====================================

-- Grant necessary permissions for projects
GRANT ALL ON projects TO authenticated;
GRANT SELECT ON project_stats TO authenticated;

-- Grant necessary permissions for tasks
GRANT ALL ON tasks TO authenticated;
GRANT SELECT ON project_tasks_stats TO authenticated;

-- ====================================
-- EXAMPLE DATA (OPTIONAL - REMOVE IF NOT NEEDED)
-- ====================================

-- Uncomment the following lines if you want some sample data
-- Note: Replace 'your-user-id-here' with an actual user ID from auth.users

/*
-- Sample Project
INSERT INTO projects (user_id, title, description, status, priority, start_date, end_date) VALUES
('your-user-id-here', 'نمونه پروژه', 'این یک پروژه نمونه است', 'active', 'high', '2024-01-01', '2024-12-31');

-- Sample Tasks
INSERT INTO tasks (user_id, title, description, status, priority, project_id) VALUES
('your-user-id-here', 'تسک نمونه ۱', 'توضیحات تسک نمونه', 'todo', 'high', (SELECT id FROM projects WHERE title = 'نمونه پروژه' LIMIT 1)),
('your-user-id-here', 'تسک نمونه ۲', 'توضیحات تسک نمونه', 'in_progress', 'medium', (SELECT id FROM projects WHERE title = 'نمونه پروژه' LIMIT 1)),
('your-user-id-here', 'تسک بدون پروژه', 'این تسک به هیچ پروژه‌ای متصل نیست', 'todo', 'low', NULL);
*/ 
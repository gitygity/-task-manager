-- Projects Table Schema for Task Manager
-- This file contains all the SQL commands needed to set up the projects functionality

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to automatically update updated_at (only if it doesn't exist)
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

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if they exist) to recreate them
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

-- Create RLS policies
-- Users can only see their own projects
CREATE POLICY "Users can view their own projects"
    ON projects FOR SELECT
    USING (auth.uid() = user_id);

-- Users can only insert their own projects
CREATE POLICY "Users can insert their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own projects
CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own projects
CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- Optional: Create a view for project statistics
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

-- Grant necessary permissions
GRANT ALL ON projects TO authenticated;
GRANT SELECT ON project_stats TO authenticated;

-- ====================================
-- TASKS TABLE UPDATES FOR PROJECT RELATIONSHIP
-- ====================================

-- Add project_id column to tasks table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tasks' AND column_name = 'project_id') THEN
        ALTER TABLE tasks ADD COLUMN project_id UUID;
    END IF;
END $$;

-- Add foreign key constraint to link tasks with projects
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_tasks_project_id') THEN
        ALTER TABLE tasks 
        ADD CONSTRAINT fk_tasks_project_id 
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);

-- Update RLS policies for tasks to include project-based access
-- Note: This assumes you want users to access tasks through their projects
-- If you want different behavior, modify these policies accordingly

-- Drop existing policies (if they exist) to recreate them
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

-- Create updated RLS policies for tasks
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

-- Grant permissions for the new view
GRANT SELECT ON project_tasks_stats TO authenticated; 
// Types and interfaces for tasks data
export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  parent_task_id?: string
  project_id?: string
  due_date?: string
  created_at: Date
  updated_at: Date
  // Computed field for subtasks
  subtasks?: Task[]
}

export interface TasksState {
  tasks: Task[]
  loading: boolean
  error: string | null
} 
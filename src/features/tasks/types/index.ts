export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'completed'
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface CreateTaskData {
  title: string
  description?: string
  status?: Task['status']
  due_date?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: Task['status']
  due_date?: string
} 
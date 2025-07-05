export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  parent_task_id: string | null
  project_id: string | null
  due_date: string | null
  created_at: string
  updated_at: string
  // Computed field for subtasks (populated by service)
  subtasks?: Task[]
}

export interface CreateTaskData {
  title: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  parent_task_id?: string
  project_id?: string
  due_date?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  parent_task_id?: string
  project_id?: string
  due_date?: string
}

// Helper types for priority handling
export type TaskPriority = Task['priority']
export type TaskStatus = Task['status']

export const TASK_STATUSES: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: 'انتظار', color: 'bg-gray-100 text-gray-800' },
  in_progress: { label: 'در حال انجام', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'تکمیل شده', color: 'bg-green-100 text-green-800' }
}

export const TASK_PRIORITIES: Record<TaskPriority, { label: string; color: string; order: number }> = {
  low: { label: 'کم', color: 'bg-green-100 text-green-800', order: 1 },
  medium: { label: 'متوسط', color: 'bg-yellow-100 text-yellow-800', order: 2 },
  high: { label: 'بالا', color: 'bg-orange-100 text-orange-800', order: 3 },
  urgent: { label: 'فوری', color: 'bg-red-100 text-red-800', order: 4 }
}

// Helper types for subtask handling
export interface TaskWithSubtasks extends Task {
  subtasks: Task[]
  subtasksCount: number
  completedSubtasksCount: number
}

export interface CreateSubtaskData extends Omit<CreateTaskData, 'parent_task_id'> {
  parent_task_id: string
} 
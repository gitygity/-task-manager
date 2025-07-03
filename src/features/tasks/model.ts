// Types and interfaces for tasks data
export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TasksState {
  tasks: Task[]
  loading: boolean
  error: string | null
} 
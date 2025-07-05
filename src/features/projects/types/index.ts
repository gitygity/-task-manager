export interface Project {
  id: string
  user_id: string
  title: string
  description: string | null
  status: 'planning' | 'active' | 'completed' | 'paused'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  // Computed field for project tasks (populated by service)
  tasks?: Array<{
    id: string
    title: string
    status: 'todo' | 'in_progress' | 'completed'
    priority: 'low' | 'medium' | 'high' | 'urgent'
  }>
}

export interface CreateProjectData {
  title: string
  description?: string
  status?: Project['status']
  priority?: Project['priority']
  start_date?: string
  end_date?: string
}

export interface UpdateProjectData {
  title?: string
  description?: string
  status?: Project['status']
  priority?: Project['priority']
  start_date?: string
  end_date?: string
}

// Helper types for priority handling
export type ProjectPriority = Project['priority']
export type ProjectStatus = Project['status']

// Helper types for project statistics
export interface ProjectStats {
  total: number
  completed: number
  active: number
  planning: number
  paused: number
  byPriority: Record<Project['priority'], number>
  tasksCount: number
  completedTasksCount: number
} 
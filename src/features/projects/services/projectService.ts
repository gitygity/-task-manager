import { supabase } from '@/lib/supabase'
import type { Project, CreateProjectData, UpdateProjectData } from '../types'

export const projectService = {
  // Get all projects for a user
  async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`)
    }

    const projects = data || []
    return this.sortProjects(projects)
  },

  // Get a single project by ID
  async getProject(projectId: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch project: ${error.message}`)
    }

    return data
  },

  // Create a new project
  async createProject(userId: string, projectData: CreateProjectData): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...projectData,
        user_id: userId,
        priority: projectData.priority || 'medium',
        status: projectData.status || 'planning'
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`)
    }

    return data
  },

  // Update an existing project
  async updateProject(projectId: string, updates: UpdateProjectData): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`)
    }

    return data
  },

  // Delete a project
  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`)
    }
  },

  // Get project statistics
  async getProjectStats(userId: string): Promise<{
    total: number
    completed: number
    active: number
    planning: number
    paused: number
    byPriority: Record<Project['priority'], number>
  }> {
    const { data, error } = await supabase
      .from('projects')
      .select('status, priority')
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to fetch project stats: ${error.message}`)
    }

    const projects = data || []
    
    const stats = {
      total: projects.length,
      completed: projects.filter(p => p.status === 'completed').length,
      active: projects.filter(p => p.status === 'active').length,
      planning: projects.filter(p => p.status === 'planning').length,
      paused: projects.filter(p => p.status === 'paused').length,
      byPriority: {
        low: projects.filter(p => p.priority === 'low').length,
        medium: projects.filter(p => p.priority === 'medium').length,
        high: projects.filter(p => p.priority === 'high').length,
        urgent: projects.filter(p => p.priority === 'urgent').length,
      },
    }

    return stats
  },

  // Sort projects by priority and date
  sortProjects(projects: Project[]): Project[] {
    return projects.sort((a, b) => {
      // Priority order (urgent = 4, high = 3, medium = 2, low = 1)
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      
      if (priorityDiff !== 0) return priorityDiff
      
      // If same priority, sort by creation date
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }
} 
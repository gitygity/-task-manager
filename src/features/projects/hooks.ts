import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectService } from './services/projectService'
import type { Project, CreateProjectData, UpdateProjectData } from './types'

// Query keys
export const PROJECT_KEYS = {
  all: ['projects'] as const,
  lists: () => [...PROJECT_KEYS.all, 'list'] as const,
  list: (userId: string) => [...PROJECT_KEYS.lists(), userId] as const,
  details: () => [...PROJECT_KEYS.all, 'detail'] as const,
  detail: (projectId: string) => [...PROJECT_KEYS.details(), projectId] as const,
  stats: (userId: string) => [...PROJECT_KEYS.all, 'stats', userId] as const,
} as const

// Hook to fetch projects for a user
export function useProjects(userId: string) {
  return useQuery({
    queryKey: PROJECT_KEYS.list(userId),
    queryFn: () => projectService.getProjects(userId),
    enabled: !!userId, // Only fetch if userId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch a single project
export function useProject(projectId: string) {
  return useQuery({
    queryKey: PROJECT_KEYS.detail(projectId),
    queryFn: () => projectService.getProject(projectId),
    enabled: !!projectId, // Only fetch if projectId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch project statistics
export function useProjectStats(userId: string) {
  return useQuery({
    queryKey: PROJECT_KEYS.stats(userId),
    queryFn: () => projectService.getProjectStats(userId),
    enabled: !!userId, // Only fetch if userId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to create a new project
export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, projectData }: { userId: string; projectData: CreateProjectData }) =>
      projectService.createProject(userId, projectData),
    onMutate: async ({ userId, projectData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: PROJECT_KEYS.list(userId) })

      // Snapshot the previous values
      const previousProjects = queryClient.getQueryData<Project[]>(PROJECT_KEYS.list(userId))

      // Optimistically update to the new value
      if (previousProjects) {
        const tempProject: Project = {
          id: `temp-${Date.now()}`,
          user_id: userId,
          title: projectData.title,
          description: projectData.description || null,
          status: projectData.status || 'planning',
          priority: projectData.priority || 'medium',
          start_date: projectData.start_date || null,
          end_date: projectData.end_date || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        queryClient.setQueryData<Project[]>(PROJECT_KEYS.list(userId), [tempProject, ...previousProjects])
      }

      return { previousProjects }
    },
    onError: (_error, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousProjects) {
        queryClient.setQueryData(PROJECT_KEYS.list(variables.userId), context.previousProjects)
      }
    },
    onSuccess: (_newProject, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.list(variables.userId) })
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.stats(variables.userId) })
    },
  })
}

// Hook to update a project
export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, updates }: { projectId: string; updates: UpdateProjectData }) =>
      projectService.updateProject(projectId, updates),
    onMutate: async ({ projectId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: PROJECT_KEYS.detail(projectId) })

      // Find the project in cache to get the user_id
      const queryCache = queryClient.getQueryCache()
      let userId = ''
      let previousProjects: Project[] | undefined

      // Find the query that contains this project
      queryCache.findAll({ queryKey: PROJECT_KEYS.lists() }).forEach(query => {
        const projects = query.state.data as Project[]
        if (projects) {
          const project = projects.find(p => p.id === projectId)
          if (project) {
            userId = project.user_id
            previousProjects = projects
          }
        }
      })

      // Get the single project data
      const previousProject = queryClient.getQueryData<Project>(PROJECT_KEYS.detail(projectId))

      if (userId && previousProjects) {
        await queryClient.cancelQueries({ queryKey: PROJECT_KEYS.list(userId) })

        // Optimistically update the project list
        const updatedProjects = previousProjects.map(project =>
          project.id === projectId
            ? { ...project, ...updates, updated_at: new Date().toISOString() }
            : project
        )
        queryClient.setQueryData<Project[]>(PROJECT_KEYS.list(userId), updatedProjects)
      }

      // Optimistically update the single project
      if (previousProject) {
        const updatedProject = { ...previousProject, ...updates, updated_at: new Date().toISOString() }
        queryClient.setQueryData<Project>(PROJECT_KEYS.detail(projectId), updatedProject)
      }

      return { previousProjects, previousProject, userId }
    },
    onError: (_error, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousProjects && context.userId) {
        queryClient.setQueryData(PROJECT_KEYS.list(context.userId), context.previousProjects)
      }
      if (context?.previousProject) {
        queryClient.setQueryData(PROJECT_KEYS.detail(variables.projectId), context.previousProject)
      }
    },
    onSuccess: (_updatedProject, variables, context) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.detail(variables.projectId) })
      if (context?.userId) {
        queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.list(context.userId) })
        queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.stats(context.userId) })
      }
    },
  })
}

// Hook to delete a project
export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onMutate: async (projectId) => {
      // Find the project in cache to get the user_id
      const queryCache = queryClient.getQueryCache()
      let userId = ''
      let previousProjects: Project[] | undefined
      let deletedProject: Project | undefined

      // Find the query that contains this project
      queryCache.findAll({ queryKey: PROJECT_KEYS.lists() }).forEach(query => {
        const projects = query.state.data as Project[]
        if (projects) {
          const project = projects.find(p => p.id === projectId)
          if (project) {
            userId = project.user_id
            previousProjects = projects
            deletedProject = project
          }
        }
      })

      if (userId && previousProjects) {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: PROJECT_KEYS.list(userId) })

        // Optimistically update
        const updatedProjects = previousProjects.filter(project => project.id !== projectId)
        queryClient.setQueryData<Project[]>(PROJECT_KEYS.list(userId), updatedProjects)
      }

      return { previousProjects, userId, deletedProject }
    },
    onError: (_error, _variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousProjects && context.userId) {
        queryClient.setQueryData(PROJECT_KEYS.list(context.userId), context.previousProjects)
      }
    },
    onSuccess: (_data, _variables, context) => {
      // Invalidate and refetch relevant queries
      if (context?.userId) {
        queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.list(context.userId) })
        queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.stats(context.userId) })
      }
    },
  })
} 
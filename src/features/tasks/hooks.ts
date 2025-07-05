import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from './services/taskService'
import type { Task, CreateTaskData, UpdateTaskData, CreateSubtaskData } from './types'

// Query keys for task-related queries
export const TASK_KEYS = {
  all: ['tasks'] as const,
  lists: () => [...TASK_KEYS.all, 'list'] as const,
  list: (userId: string, projectId?: string) => [...TASK_KEYS.lists(), userId, projectId] as const,
  byProject: (userId: string, projectId: string) => [...TASK_KEYS.all, 'project', userId, projectId] as const,
  withoutProject: (userId: string) => [...TASK_KEYS.all, 'without-project', userId] as const,
  mainTasks: (userId: string, projectId?: string) => [...TASK_KEYS.all, 'main', userId, projectId] as const,
  subtasks: (parentTaskId: string) => [...TASK_KEYS.all, 'subtasks', parentTaskId] as const,
  stats: (userId: string, projectId?: string) => [...TASK_KEYS.all, 'stats', userId, projectId] as const,
  byPriority: (userId: string, priority: Task['priority']) => [...TASK_KEYS.all, 'priority', userId, priority] as const,
  projectStats: (userId: string) => [...TASK_KEYS.all, 'project-stats', userId] as const,
  counts: (userId: string) => [...TASK_KEYS.all, 'counts', userId] as const,
} as const

// Hook to fetch all tasks for a user with optional project filter
export function useTasks(userId: string, projectId?: string) {
  return useQuery({
    queryKey: TASK_KEYS.list(userId, projectId),
    queryFn: () => taskService.getTasks(userId, projectId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch tasks for a specific project
export function useTasksByProject(userId: string, projectId: string) {
  return useQuery({
    queryKey: TASK_KEYS.byProject(userId, projectId),
    queryFn: () => taskService.getTasksByProject(userId, projectId),
    enabled: !!userId && !!projectId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook to fetch tasks without a project
export function useTasksWithoutProject(userId: string) {
  return useQuery({
    queryKey: TASK_KEYS.withoutProject(userId),
    queryFn: () => taskService.getTasksWithoutProject(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook to fetch main tasks (without parent) with optional project filter
export function useMainTasks(userId: string, projectId?: string) {
  return useQuery({
    queryKey: TASK_KEYS.mainTasks(userId, projectId),
    queryFn: () => taskService.getMainTasks(userId, projectId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook to fetch subtasks for a parent task
export function useSubtasks(parentTaskId: string) {
  return useQuery({
    queryKey: TASK_KEYS.subtasks(parentTaskId),
    queryFn: () => taskService.getSubtasks(parentTaskId),
    enabled: !!parentTaskId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook to fetch task statistics with optional project filter
export function useTaskStats(userId: string, projectId?: string) {
  return useQuery({
    queryKey: TASK_KEYS.stats(userId, projectId),
    queryFn: () => taskService.getTaskStats(userId, projectId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook to fetch tasks by priority
export function useTasksByPriority(userId: string, priority: Task['priority']) {
  return useQuery({
    queryKey: TASK_KEYS.byPriority(userId, priority),
    queryFn: () => taskService.getTasksByPriority(userId, priority),
    enabled: !!userId && !!priority,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook to fetch project-based task statistics
export function useTasksByProjectStats(userId: string) {
  return useQuery({
    queryKey: TASK_KEYS.projectStats(userId),
    queryFn: () => taskService.getTasksByProjectStats(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook to create a new task
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, taskData }: { userId: string; taskData: CreateTaskData }) =>
      taskService.createTask(userId, taskData),
    onSuccess: (newTask) => {
      // Invalidate and refetch multiple queries
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
      
      // Optimistically update the cache
      queryClient.setQueryData(
        TASK_KEYS.list(newTask.user_id, newTask.project_id || undefined),
        (oldTasks: Task[] | undefined) => {
          if (!oldTasks) return [newTask]
          return [newTask, ...oldTasks]
        }
      )
    },
  })
}

// Hook to update an existing task
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, taskData }: { taskId: string; taskData: UpdateTaskData }) =>
      taskService.updateTask(taskId, taskData),
    onSuccess: (updatedTask) => {
      // Invalidate and refetch all task-related queries
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
      
      // Update specific cache entries
      queryClient.setQueryData(
        TASK_KEYS.list(updatedTask.user_id, updatedTask.project_id || undefined),
        (oldTasks: Task[] | undefined) => {
          if (!oldTasks) return [updatedTask]
          return oldTasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        }
      )
    },
  })
}

// Hook to delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: (_, taskId) => {
      // Invalidate all task-related queries
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
      
      // Optimistically remove from cache
      queryClient.setQueriesData(
        { queryKey: TASK_KEYS.lists() },
        (oldTasks: Task[] | undefined) => {
          if (!oldTasks) return []
          return oldTasks.filter(task => task.id !== taskId)
        }
      )
    },
  })
}

// Hook to create a subtask
export function useCreateSubtask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, subtaskData }: { userId: string; subtaskData: CreateSubtaskData }) =>
      taskService.createSubtask(userId, subtaskData),
    onSuccess: (newSubtask) => {
      // Invalidate all task-related queries
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
      
      // Update subtasks cache
      queryClient.setQueryData(
        TASK_KEYS.subtasks(newSubtask.parent_task_id!),
        (oldSubtasks: Task[] | undefined) => {
          if (!oldSubtasks) return [newSubtask]
          return [newSubtask, ...oldSubtasks]
        }
      )
    },
  })
} 

// Get task counts for each project
export const useTaskCounts = (userId: string) => {
  return useQuery({
    queryKey: TASK_KEYS.counts(userId),
    queryFn: async () => {
      const tasks = await taskService.getTasks(userId)
      
      // Count tasks by project
      const counts: Record<string, number> = {}
      
      tasks.forEach(task => {
        if (task.project_id) {
          counts[task.project_id] = (counts[task.project_id] || 0) + 1
        } else {
          counts['none'] = (counts['none'] || 0) + 1
        }
      })
      
      return counts
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
} 
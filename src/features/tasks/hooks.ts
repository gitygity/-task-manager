import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from './services/taskService'
import type { Task, CreateTaskData, UpdateTaskData, TaskWithSubtasks, CreateSubtaskData } from './types'

// Query keys for task-related queries
export const TASK_KEYS = {
  all: ['tasks'] as const,
  lists: () => [...TASK_KEYS.all, 'list'] as const,
  list: (userId: string) => [...TASK_KEYS.lists(), userId] as const,
  mainTasks: (userId: string) => [...TASK_KEYS.all, 'main', userId] as const,
  subtasks: (parentTaskId: string) => [...TASK_KEYS.all, 'subtasks', parentTaskId] as const,
  stats: (userId: string) => [...TASK_KEYS.all, 'stats', userId] as const,
  byPriority: (userId: string, priority: Task['priority']) => [...TASK_KEYS.all, 'priority', userId, priority] as const,
} as const

// Hook to fetch tasks for a specific user (hierarchical)
export function useTasks(userId: string) {
  return useQuery({
    queryKey: TASK_KEYS.list(userId),
    queryFn: () => taskService.getTasks(userId),
    enabled: !!userId, // Only fetch if userId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch main tasks with subtasks count
export function useMainTasks(userId: string) {
  return useQuery({
    queryKey: TASK_KEYS.mainTasks(userId),
    queryFn: () => taskService.getMainTasks(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook to fetch subtasks for a specific parent task
export function useSubtasks(parentTaskId: string) {
  return useQuery({
    queryKey: TASK_KEYS.subtasks(parentTaskId),
    queryFn: () => taskService.getSubtasks(parentTaskId),
    enabled: !!parentTaskId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook to fetch task statistics
export function useTaskStats(userId: string) {
  return useQuery({
    queryKey: TASK_KEYS.stats(userId),
    queryFn: () => taskService.getTaskStats(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
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

// Hook to create a new task
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, taskData }: { userId: string; taskData: CreateTaskData }) =>
      taskService.createTask(userId, taskData),
    onMutate: async ({ userId, taskData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: TASK_KEYS.list(userId) })
      await queryClient.cancelQueries({ queryKey: TASK_KEYS.mainTasks(userId) })

      // Snapshot the previous values
      const previousTasks = queryClient.getQueryData<Task[]>(TASK_KEYS.list(userId))
      const previousMainTasks = queryClient.getQueryData<TaskWithSubtasks[]>(TASK_KEYS.mainTasks(userId))

      // Optimistically update to the new value
      if (previousTasks) {
        const tempTask: Task = {
          id: `temp-${Date.now()}`,
          user_id: userId,
          title: taskData.title,
          description: taskData.description || null,
          status: taskData.status || 'todo',
          priority: taskData.priority || 'medium',
          parent_task_id: taskData.parent_task_id || null,
          due_date: taskData.due_date || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        queryClient.setQueryData<Task[]>(TASK_KEYS.list(userId), [tempTask, ...previousTasks])
      }

      return { previousTasks, previousMainTasks }
    },
    onError: (_error, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(TASK_KEYS.list(variables.userId), context.previousTasks)
      }
      if (context?.previousMainTasks) {
        queryClient.setQueryData(TASK_KEYS.mainTasks(variables.userId), context.previousMainTasks)
      }
    },
    onSuccess: (_newTask, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(variables.userId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.mainTasks(variables.userId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.stats(variables.userId) })
    },
  })
}

// Hook to create a new subtask
export function useCreateSubtask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, subtaskData }: { userId: string; subtaskData: CreateSubtaskData }) =>
      taskService.createSubtask(userId, subtaskData),
    onMutate: async ({ userId, subtaskData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: TASK_KEYS.subtasks(subtaskData.parent_task_id) })
      await queryClient.cancelQueries({ queryKey: TASK_KEYS.list(userId) })

      // Snapshot the previous values
      const previousSubtasks = queryClient.getQueryData<Task[]>(TASK_KEYS.subtasks(subtaskData.parent_task_id))
      const previousTasks = queryClient.getQueryData<Task[]>(TASK_KEYS.list(userId))

      // Optimistically update subtasks query
      if (previousSubtasks) {
        const tempSubtask: Task = {
          id: `temp-${Date.now()}`,
          user_id: userId,
          title: subtaskData.title,
          description: subtaskData.description || null,
          status: subtaskData.status || 'todo',
          priority: subtaskData.priority || 'medium',
          parent_task_id: subtaskData.parent_task_id,
          due_date: subtaskData.due_date || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        queryClient.setQueryData<Task[]>(TASK_KEYS.subtasks(subtaskData.parent_task_id), [tempSubtask, ...previousSubtasks])
      }

      // Optimistically update hierarchical tasks structure
      if (previousTasks) {
        const tempSubtask: Task = {
          id: `temp-${Date.now()}`,
          user_id: userId,
          title: subtaskData.title,
          description: subtaskData.description || null,
          status: subtaskData.status || 'todo',
          priority: subtaskData.priority || 'medium',
          parent_task_id: subtaskData.parent_task_id,
          due_date: subtaskData.due_date || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const updatedTasks = previousTasks.map(task => {
          if (task.id === subtaskData.parent_task_id) {
            return {
              ...task,
              subtasks: task.subtasks ? [tempSubtask, ...task.subtasks] : [tempSubtask]
            }
          }
          return task
        })

        queryClient.setQueryData<Task[]>(TASK_KEYS.list(userId), updatedTasks)
      }

      return { previousSubtasks, previousTasks }
    },
    onError: (_error, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousSubtasks) {
        queryClient.setQueryData(TASK_KEYS.subtasks(variables.subtaskData.parent_task_id), context.previousSubtasks)
      }
      if (context?.previousTasks) {
        queryClient.setQueryData(TASK_KEYS.list(variables.userId), context.previousTasks)
      }
    },
    onSuccess: (_newSubtask, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.subtasks(variables.subtaskData.parent_task_id) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(variables.userId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.mainTasks(variables.userId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.stats(variables.userId) })
      
      // Force a refetch to ensure UI consistency
      queryClient.refetchQueries({ queryKey: TASK_KEYS.list(variables.userId) })
    },
  })
}

// Hook to update a task
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: UpdateTaskData }) =>
      taskService.updateTask(taskId, updates),
    onMutate: async ({ taskId, updates }) => {
      // Find the task in cache to get the user_id
      const queryCache = queryClient.getQueryCache()
      let userId = ''
      let previousTasks: Task[] | undefined
      let parentTaskId: string | null = null

      // Find the query that contains this task
      queryCache.findAll({ queryKey: TASK_KEYS.lists() }).forEach(query => {
        const tasks = query.state.data as Task[]
        if (tasks) {
          // Search in main tasks
          const mainTask = tasks.find(t => t.id === taskId)
          if (mainTask) {
            userId = mainTask.user_id
            previousTasks = tasks
            parentTaskId = mainTask.parent_task_id
          } else {
            // Search in subtasks
            for (const task of tasks) {
              if (task.subtasks) {
                const subtask = task.subtasks.find(st => st.id === taskId)
                if (subtask) {
                  userId = subtask.user_id
                  previousTasks = tasks
                  parentTaskId = subtask.parent_task_id
                  break
                }
              }
            }
          }
        }
      })

      if (userId && previousTasks) {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: TASK_KEYS.list(userId) })
        if (parentTaskId) {
          await queryClient.cancelQueries({ queryKey: TASK_KEYS.subtasks(parentTaskId) })
        }

        // Optimistically update - handle both main tasks and subtasks
        const updateTaskInHierarchy = (tasks: Task[]): Task[] => {
          return tasks.map(task => {
            if (task.id === taskId) {
              // Update the target task (main task)
              return { ...task, ...updates, updated_at: new Date().toISOString() }
            } else if (task.subtasks && task.subtasks.length > 0) {
              // Check if the task to update is in the subtasks
              const hasSubtaskToUpdate = task.subtasks.some(st => st.id === taskId)
              if (hasSubtaskToUpdate) {
                return {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.id === taskId
                      ? { ...subtask, ...updates, updated_at: new Date().toISOString() }
                      : subtask
                  )
                }
              }
            }
            return task
          })
        }

        const updatedTasks = updateTaskInHierarchy(previousTasks)
        queryClient.setQueryData<Task[]>(TASK_KEYS.list(userId), updatedTasks)
      }

      return { previousTasks, userId, parentTaskId }
    },
    onError: (_error, _variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousTasks && context.userId) {
        queryClient.setQueryData(TASK_KEYS.list(context.userId), context.previousTasks)
      }
    },
    onSuccess: (_updatedTask, _variables, context) => {
      // Invalidate and refetch relevant queries
      if (context?.userId) {
        queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(context.userId) })
        queryClient.invalidateQueries({ queryKey: TASK_KEYS.mainTasks(context.userId) })
        queryClient.invalidateQueries({ queryKey: TASK_KEYS.stats(context.userId) })
        
        if (context.parentTaskId) {
          queryClient.invalidateQueries({ queryKey: TASK_KEYS.subtasks(context.parentTaskId) })
        }
        
        // Force a refetch to ensure UI consistency
        queryClient.refetchQueries({ queryKey: TASK_KEYS.list(context.userId) })
      }
    },
  })
}

// Hook to delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onMutate: async (taskId) => {
      // Find the task in cache to get the user_id
      const queryCache = queryClient.getQueryCache()
      let userId = ''
      let previousTasks: Task[] | undefined
      let deletedTask: Task | undefined
      let parentTaskId: string | null = null

      // Find the query that contains this task
      queryCache.findAll({ queryKey: TASK_KEYS.lists() }).forEach(query => {
        const tasks = query.state.data as Task[]
        if (tasks) {
          // Search in main tasks
          const mainTask = tasks.find(t => t.id === taskId)
          if (mainTask) {
            userId = mainTask.user_id
            previousTasks = tasks
            deletedTask = mainTask
            parentTaskId = mainTask.parent_task_id
          } else {
            // Search in subtasks
            for (const task of tasks) {
              if (task.subtasks) {
                const subtask = task.subtasks.find(st => st.id === taskId)
                if (subtask) {
                  userId = subtask.user_id
                  previousTasks = tasks
                  deletedTask = subtask
                  parentTaskId = subtask.parent_task_id
                  break
                }
              }
            }
          }
        }
      })

      if (userId && previousTasks) {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: TASK_KEYS.list(userId) })
        if (parentTaskId) {
          await queryClient.cancelQueries({ queryKey: TASK_KEYS.subtasks(parentTaskId) })
        }

        // Optimistically update - handle both main tasks and subtasks
        const deleteTaskFromHierarchy = (tasks: Task[]): Task[] => {
          return tasks.filter(task => {
            if (task.id === taskId) {
              // Delete main task
              return false
            }
            // For other tasks, check if we need to remove a subtask
            if (task.subtasks && task.subtasks.length > 0) {
              const hasSubtaskToDelete = task.subtasks.some(st => st.id === taskId)
              if (hasSubtaskToDelete) {
                task.subtasks = task.subtasks.filter(subtask => subtask.id !== taskId)
              }
            }
            return true
          })
        }

        const updatedTasks = deleteTaskFromHierarchy(previousTasks)
        queryClient.setQueryData<Task[]>(TASK_KEYS.list(userId), updatedTasks)
      }

      return { previousTasks, userId, deletedTask, parentTaskId }
    },
    onError: (_error, _variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousTasks && context.userId) {
        queryClient.setQueryData(TASK_KEYS.list(context.userId), context.previousTasks)
      }
    },
    onSuccess: (_data, _variables, context) => {
      // Invalidate and refetch relevant queries
      if (context?.userId) {
        queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(context.userId) })
        queryClient.invalidateQueries({ queryKey: TASK_KEYS.mainTasks(context.userId) })
        queryClient.invalidateQueries({ queryKey: TASK_KEYS.stats(context.userId) })
        
        if (context.parentTaskId) {
          queryClient.invalidateQueries({ queryKey: TASK_KEYS.subtasks(context.parentTaskId) })
        }
      }
    },
  })
} 
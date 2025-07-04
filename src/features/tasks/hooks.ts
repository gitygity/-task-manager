import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from './services/taskService'
import type { Task, CreateTaskData, UpdateTaskData } from './types'

// Query keys for task-related queries
export const TASK_KEYS = {
  all: ['tasks'] as const,
  lists: () => [...TASK_KEYS.all, 'list'] as const,
  list: (userId: string) => [...TASK_KEYS.lists(), userId] as const,
} as const

// Hook to fetch tasks for a specific user
export function useTasks(userId: string) {
  return useQuery({
    queryKey: TASK_KEYS.list(userId),
    queryFn: () => taskService.getTasks(userId),
    enabled: !!userId, // Only fetch if userId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
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

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(TASK_KEYS.list(userId))

      // Optimistically update to the new value
      if (previousTasks) {
        const tempTask: Task = {
          id: `temp-${Date.now()}`,
          user_id: userId,
          title: taskData.title,
          description: taskData.description || null,
          status: taskData.status || 'todo',
          due_date: taskData.due_date || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        queryClient.setQueryData<Task[]>(TASK_KEYS.list(userId), [tempTask, ...previousTasks])
      }

      return { previousTasks }
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(TASK_KEYS.list(variables.userId), context.previousTasks)
      }
    },
    onSuccess: (newTask, variables) => {
      // Replace the temporary task with the real one
      const tasks = queryClient.getQueryData<Task[]>(TASK_KEYS.list(variables.userId))
      if (tasks) {
        const filteredTasks = tasks.filter(task => !task.id.startsWith('temp-'))
        queryClient.setQueryData<Task[]>(TASK_KEYS.list(variables.userId), [newTask, ...filteredTasks])
      }
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

      // Find the query that contains this task
      queryCache.findAll({ queryKey: TASK_KEYS.lists() }).forEach(query => {
        const tasks = query.state.data as Task[]
        if (tasks) {
          const task = tasks.find(t => t.id === taskId)
          if (task) {
            userId = task.user_id
            previousTasks = tasks
          }
        }
      })

      if (userId && previousTasks) {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: TASK_KEYS.list(userId) })

        // Optimistically update
        const updatedTasks = previousTasks.map(task =>
          task.id === taskId ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
        )
        queryClient.setQueryData<Task[]>(TASK_KEYS.list(userId), updatedTasks)
      }

      return { previousTasks, userId }
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousTasks && context.userId) {
        queryClient.setQueryData(TASK_KEYS.list(context.userId), context.previousTasks)
      }
    },
    onSuccess: (updatedTask, variables, context) => {
      // Replace with the real updated task
      if (context?.userId) {
        const tasks = queryClient.getQueryData<Task[]>(TASK_KEYS.list(context.userId))
        if (tasks) {
          const updatedTasks = tasks.map(task =>
            task.id === variables.taskId ? updatedTask : task
          )
          queryClient.setQueryData<Task[]>(TASK_KEYS.list(context.userId), updatedTasks)
        }
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

      // Find the query that contains this task
      queryCache.findAll({ queryKey: TASK_KEYS.lists() }).forEach(query => {
        const tasks = query.state.data as Task[]
        if (tasks) {
          const task = tasks.find(t => t.id === taskId)
          if (task) {
            userId = task.user_id
            previousTasks = tasks
            deletedTask = task
          }
        }
      })

      if (userId && previousTasks) {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: TASK_KEYS.list(userId) })

        // Optimistically update
        const updatedTasks = previousTasks.filter(task => task.id !== taskId)
        queryClient.setQueryData<Task[]>(TASK_KEYS.list(userId), updatedTasks)
      }

      return { previousTasks, userId, deletedTask }
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousTasks && context.userId) {
        queryClient.setQueryData(TASK_KEYS.list(context.userId), context.previousTasks)
      }
    },
    onSuccess: (data, variables, context) => {
      // Task successfully deleted, no need to update cache (already removed optimistically)
    },
  })
} 
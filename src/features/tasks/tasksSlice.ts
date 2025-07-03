// Zustand store for tasks
import { create } from 'zustand'
import type { TasksState } from './model'

interface TasksStore extends TasksState {
  // Actions will be implemented here
  setTasks: (tasks: TasksState['tasks']) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  loading: false,
  error: null,
  setTasks: (tasks) => set({ tasks }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})) 
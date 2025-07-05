import { supabase } from '@/lib/supabase'
import type { Task, CreateTaskData, UpdateTaskData, TaskWithSubtasks, CreateSubtaskData } from '../types'

export const taskService = {
  // دریافت تمام تسکهای کاربر با ساختار سلسله مراتبی
  async getTasks(userId: string, projectId?: string): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`)
    }

    // سازماندهی تسکها به صورت سلسله مراتبی
    const tasks = data || []
    return this.organizeTasksHierarchically(tasks)
  },

  // دریافت تسکهای مربوط به یک پروژه خاص
  async getTasksByProject(userId: string, projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tasks for project: ${error.message}`)
    }

    return data || []
  },

  // دریافت تسکهای بدون پروژه
  async getTasksWithoutProject(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .is('project_id', null)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tasks without project: ${error.message}`)
    }

    return data || []
  },

  // دریافت تسکهای اصلی (بدون parent)
  async getMainTasks(userId: string, projectId?: string): Promise<TaskWithSubtasks[]> {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .is('parent_task_id', null)

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch main tasks: ${error.message}`)
    }

    const mainTasks = data || []
    
    // دریافت سابتسکها برای هر تسک اصلی
    const tasksWithSubtasks = await Promise.all(
      mainTasks.map(async (task) => {
        const subtasks = await this.getSubtasks(task.id)
        return {
          ...task,
          subtasks,
          subtasksCount: subtasks.length,
          completedSubtasksCount: subtasks.filter(st => st.status === 'completed').length
        }
      })
    )

    return tasksWithSubtasks
  },

  // دریافت سابتسکهای یک تسک
  async getSubtasks(parentTaskId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('parent_task_id', parentTaskId)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch subtasks: ${error.message}`)
    }

    return data || []
  },

  // ساخت تسک جدید
  async createTask(userId: string, taskData: CreateTaskData): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...taskData,
        user_id: userId,
        priority: taskData.priority || 'medium'
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`)
    }

    return data
  },

  // ساخت سابتسک
  async createSubtask(userId: string, subtaskData: CreateSubtaskData): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...subtaskData,
        user_id: userId,
        priority: subtaskData.priority || 'medium'
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create subtask: ${error.message}`)
    }

    return data
  },

  // بروزرسانی تسک
  async updateTask(taskId: string, updates: UpdateTaskData): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`)
    }

    return data
  },

  // حذف تسک (و تمام سابتسکهایش)
  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`)
    }
  },

  // دریافت تسکها بر اساس اولویت
  async getTasksByPriority(userId: string, priority: Task['priority']): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('priority', priority)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tasks by priority: ${error.message}`)
    }

    return data || []
  },

  // سازماندهی تسکها به صورت سلسله مراتبی
  organizeTasksHierarchically(tasks: Task[]): Task[] {
    const taskMap = new Map<string, Task>()
    const mainTasks: Task[] = []

    // ایجاد نقشه از تسکها
    tasks.forEach(task => {
      taskMap.set(task.id, { ...task, subtasks: [] })
    })

    // سازماندهی سلسله مراتبی
    tasks.forEach(task => {
      const taskWithSubtasks = taskMap.get(task.id)!
      
      if (task.parent_task_id) {
        // این یک سابتسک است
        const parentTask = taskMap.get(task.parent_task_id)
        if (parentTask) {
          parentTask.subtasks!.push(taskWithSubtasks)
        }
      } else {
        // این یک تسک اصلی است
        mainTasks.push(taskWithSubtasks)
      }
    })

    // مرتب‌سازی بر اساس اولویت و تاریخ ایجاد
    const sortTasks = (tasks: Task[]): Task[] => {
      return tasks.sort((a, b) => {
        // اولویت (urgent = 4, high = 3, medium = 2, low = 1)
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        
        if (priorityDiff !== 0) return priorityDiff
        
        // در صورت یکسان بودن اولویت، بر اساس تاریخ ایجاد
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    }

    // مرتب‌سازی تسکهای اصلی
    const sortedMainTasks = sortTasks(mainTasks)
    
    // مرتب‌سازی سابتسکها
    sortedMainTasks.forEach(task => {
      if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks = sortTasks(task.subtasks)
      }
    })

    return sortedMainTasks
  },

  // آمار تسکها
  async getTaskStats(userId: string, projectId?: string): Promise<{
    total: number
    completed: number
    inProgress: number
    todo: number
    byPriority: Record<Task['priority'], number>
    mainTasks: number
    subtasks: number
  }> {
    let query = supabase
      .from('tasks')
      .select('status, priority, parent_task_id')
      .eq('user_id', userId)

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch task stats: ${error.message}`)
    }

    const tasks = data || []
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      byPriority: {
        low: tasks.filter(t => t.priority === 'low').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        high: tasks.filter(t => t.priority === 'high').length,
        urgent: tasks.filter(t => t.priority === 'urgent').length,
      },
      mainTasks: tasks.filter(t => !t.parent_task_id).length,
      subtasks: tasks.filter(t => t.parent_task_id).length,
    }

    return stats
  },

  // آمار تسکهای گروه‌بندی شده بر اساس پروژه
  async getTasksByProjectStats(userId: string): Promise<{
    projectId: string | null
    projectTitle: string | null
    totalTasks: number
    completedTasks: number
    inProgressTasks: number
    todoTasks: number
    completionPercentage: number
  }[]> {
    const { data, error } = await supabase
      .from('project_tasks_stats')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to fetch project tasks stats: ${error.message}`)
    }

    const stats = data || []
    
    // شامل تسکهای بدون پروژه
    const { data: tasksWithoutProject, error: tasksError } = await supabase
      .from('tasks')
      .select('status')
      .eq('user_id', userId)
      .is('project_id', null)

    if (tasksError) {
      throw new Error(`Failed to fetch tasks without project: ${tasksError.message}`)
    }

    const withoutProjectTasks = tasksWithoutProject || []
    
    if (withoutProjectTasks.length > 0) {
      const completedCount = withoutProjectTasks.filter(t => t.status === 'completed').length
      const inProgressCount = withoutProjectTasks.filter(t => t.status === 'in_progress').length
      const todoCount = withoutProjectTasks.filter(t => t.status === 'todo').length
      
      stats.push({
        project_id: null,
        project_title: 'بدون پروژه',
        total_tasks: withoutProjectTasks.length,
        completed_tasks: completedCount,
        in_progress_tasks: inProgressCount,
        todo_tasks: todoCount,
        completion_percentage: withoutProjectTasks.length > 0 ? 
          Math.round((completedCount / withoutProjectTasks.length) * 100) : 0
      })
    }

    return stats.map(stat => ({
      projectId: stat.project_id,
      projectTitle: stat.project_title,
      totalTasks: stat.total_tasks,
      completedTasks: stat.completed_tasks,
      inProgressTasks: stat.in_progress_tasks,
      todoTasks: stat.todo_tasks,
      completionPercentage: stat.completion_percentage
    }))
  }
} 
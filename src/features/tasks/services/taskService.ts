import { supabase } from '@/lib/supabase'
import type { Task, CreateTaskData, UpdateTaskData } from '../types'

export const taskService = {
  // دریافت تمام تسکهای کاربر
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`)
    }

    return data || []
  },

  // ساخت تسک جدید
  async createTask(userId: string, taskData: CreateTaskData): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...taskData,
        user_id: userId
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`)
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

  // حذف تسک
  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`)
    }
  }
} 
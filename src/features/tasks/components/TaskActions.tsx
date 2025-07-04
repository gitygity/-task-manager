import { useState } from 'react'
import { useUpdateTask, useDeleteTask } from '../hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

import { 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  LoaderCircle,
  Check,
  Clock,
  Play
} from 'lucide-react'
import type { Task, UpdateTaskData } from '../types'

interface TaskActionsProps {
  task: Task
}

export function TaskActions({ task }: TaskActionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || '')
  
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  // Handle task update
  const handleUpdate = async (updates: UpdateTaskData) => {
    try {
      await updateTask.mutateAsync({ taskId: task.id, updates })
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  // Handle task deletion
  const handleDelete = async () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این تسک را حذف کنید؟')) {
      try {
        await deleteTask.mutateAsync(task.id)
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  // Handle edit save
  const handleEditSave = () => {
    const updates: UpdateTaskData = {}
    
    if (editTitle.trim() !== task.title) {
      updates.title = editTitle.trim()
    }
    
    if (editDescription.trim() !== (task.description || '')) {
      updates.description = editDescription.trim() || undefined
    }
    
    if (Object.keys(updates).length > 0) {
      handleUpdate(updates)
    }
    
    setIsEditing(false)
  }

  // Cancel edit
  const handleEditCancel = () => {
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setIsEditing(false)
  }

  // Status change handlers
  const handleStatusChange = (newStatus: Task['status']) => {
    handleUpdate({ status: newStatus })
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
    }
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return <Clock className="h-3 w-3" />
      case 'in_progress':
        return <Play className="h-3 w-3" />
      case 'completed':
        return <Check className="h-3 w-3" />
    }
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {isEditing ? (
          // Edit Mode
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">عنوان</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="عنوان تسک..."
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">توضیحات</Label>
              <Input
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="توضیحات..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleEditSave} 
                size="sm"
                disabled={updateTask.isPending || !editTitle.trim()}
              >
                {updateTask.isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                ذخیره
              </Button>
              
              <Button 
                onClick={handleEditCancel} 
                variant="outline" 
                size="sm"
                disabled={updateTask.isPending}
              >
                <X className="h-4 w-4" />
                لغو
              </Button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{task.title}</h3>
              
              <div className="flex items-center gap-2">
                {/* Status Badge با click برای تغییر */}
                <div className="flex gap-1">
                  {(['todo', 'in_progress', 'completed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={updateTask.isPending}
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer
                        ${task.status === status 
                          ? getStatusColor(status) 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }
                        ${updateTask.isPending ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(status)}
                        {status === 'todo' && 'در انتظار'}
                        {status === 'in_progress' && 'در حال انجام'}
                        {status === 'completed' && 'تکمیل شده'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {task.description && (
              <p className="text-gray-600">{task.description}</p>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-gray-500">
                ایجاد: {new Date(task.created_at).toLocaleDateString('fa-IR')}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline" 
                  size="sm"
                  disabled={updateTask.isPending || deleteTask.isPending}
                >
                  <Edit3 className="h-4 w-4" />
                  ویرایش
                </Button>
                
                <Button 
                  onClick={handleDelete} 
                  variant="destructive" 
                  size="sm"
                  disabled={updateTask.isPending || deleteTask.isPending}
                >
                  {deleteTask.isPending ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  حذف
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* نمایش خطاها */}
        {updateTask.error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            خطا در بروزرسانی: {updateTask.error.message}
          </div>
        )}
        
        {deleteTask.error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            خطا در حذف: {deleteTask.error.message}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
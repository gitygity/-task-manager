import { useState, useEffect } from 'react'
import { useUpdateTask } from '../hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoaderCircle, Flag, Save, X } from 'lucide-react'
import { TASK_PRIORITIES } from '../types'
import { ProjectSelector } from './ProjectSelector'
import type { Task, UpdateTaskData } from '../types'

interface TaskEditModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export function TaskEditModal({ task, isOpen, onClose }: TaskEditModalProps) {
  const [editTitle, setEditTitle] = useState(task?.title || '')
  const [editDescription, setEditDescription] = useState(task?.description || '')
  const [editPriority, setEditPriority] = useState<Task['priority']>(task?.priority || 'medium')
  const [editStatus, setEditStatus] = useState<Task['status']>(task?.status || 'todo')
  const [editProjectId, setEditProjectId] = useState<string>(task?.project_id || '')
  
  const updateTask = useUpdateTask()

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setEditTitle(task.title)
      setEditDescription(task.description || '')
      setEditPriority(task.priority)
      setEditStatus(task.status)
      setEditProjectId(task.project_id || '')
    }
  }, [task])

  const handleSave = async () => {
    if (!task || !editTitle.trim()) return

    const updates: UpdateTaskData = {}
    
    if (editTitle.trim() !== task.title) {
      updates.title = editTitle.trim()
    }
    
    if (editDescription.trim() !== (task.description || '')) {
      updates.description = editDescription.trim() || undefined
    }

    if (editPriority !== task.priority) {
      updates.priority = editPriority
    }

    if (editStatus !== task.status) {
      updates.status = editStatus
    }

    if (editProjectId !== (task.project_id || '')) {
      updates.project_id = editProjectId || undefined
    }
    
    if (Object.keys(updates).length > 0) {
      try {
        await updateTask.mutateAsync({
          taskId: task.id,
          taskData: updates
        })
        onClose()
      } catch (error) {
        console.error('Error updating task:', error)
      }
    } else {
      onClose()
    }
  }

  const handleCancel = () => {
    if (task) {
      setEditTitle(task.title)
      setEditDescription(task.description || '')
      setEditPriority(task.priority)
      setEditStatus(task.status)
      setEditProjectId(task.project_id || '')
    }
    onClose()
  }

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ویرایش تسک</DialogTitle>
        </DialogHeader>
        
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

          <div>
            <Label htmlFor="edit-project">پروژه</Label>
            <ProjectSelector
              value={editProjectId}
              onValueChange={setEditProjectId}
              placeholder="انتخاب پروژه..."
            />
          </div>

          <div>
            <Label htmlFor="edit-priority">اولویت</Label>
            <Select value={editPriority} onValueChange={(value: Task['priority']) => setEditPriority(value)}>
              <SelectTrigger id="edit-priority">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    <span className={`px-2 py-1 rounded-full text-xs ${TASK_PRIORITIES[editPriority].color}`}>
                      {TASK_PRIORITIES[editPriority].label}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TASK_PRIORITIES).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-status">وضعیت</Label>
            <Select value={editStatus} onValueChange={(value: Task['status']) => setEditStatus(value)}>
              <SelectTrigger id="edit-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">در انتظار</SelectItem>
                <SelectItem value="in_progress">در حال انجام</SelectItem>
                <SelectItem value="completed">تکمیل شده</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateTask.isPending}
          >
            <X className="h-4 w-4 mr-2" />
            لغو
          </Button>
          <Button
            onClick={handleSave}
            disabled={!editTitle.trim() || updateTask.isPending}
          >
            {updateTask.isPending ? (
              <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            ذخیره
          </Button>
        </DialogFooter>

        {updateTask.error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            خطا در بروزرسانی: {updateTask.error.message}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 
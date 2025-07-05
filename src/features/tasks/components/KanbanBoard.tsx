import { useState, useMemo, useCallback } from 'react'
import { useTasks, useUpdateTask, useCreateTask } from '../hooks'
import { useAuthStore } from '@/features/auth'
import { useSimpleDragDrop } from '../hooks/useDragAndDrop'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { DragPreview } from '@/components/DragPreview'
import { Plus, LoaderCircle, Flag } from 'lucide-react'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { TaskEditModal } from './TaskEditModal'
import { TASK_PRIORITIES } from '../types'
import type { Task } from '../types'

export function KanbanBoard() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium')

  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { user } = useAuthStore()
  const { data: tasks, isLoading, error } = useTasks(user?.id || '')
  const updateTask = useUpdateTask()
  const createTask = useCreateTask()

  // Handle drag and drop
  const handleTaskMove = useCallback(async (taskId: string, targetStatus: string, _sourceStatus: string) => {
    if (!tasks) return
    
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    
    // Don't call API if status hasn't changed
    if (task.status === targetStatus) return

    try {
      await updateTask.mutateAsync({
        taskId,
        updates: { status: targetStatus as Task['status'] }
      })
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }, [tasks, updateTask])

  // Initialize drag and drop
  const {
    isDragging,
    draggedItem,
    activeDropZone,
    makeDraggable,
    makeDropZone,
  } = useSimpleDragDrop<Task>(handleTaskMove)

  // Group tasks by status (only main tasks, not subtasks)
  const tasksByStatus = useMemo(() => {
    if (!tasks) return { todo: [], in_progress: [], completed: [] }
    
    const mainTasks = tasks.filter(task => !task.parent_task_id)
    
    return {
      todo: mainTasks.filter(task => task.status === 'todo'),
      in_progress: mainTasks.filter(task => task.status === 'in_progress'),
      completed: mainTasks.filter(task => task.status === 'completed'),
    }
  }, [tasks])

  // Get dragged task for preview
  const draggedTask = useMemo(() => {
    if (!draggedItem || !tasks) return null
    return tasks.find(t => t.id === draggedItem.id) || null
  }, [draggedItem, tasks])

  // Handle create new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !user) return

    try {
      await createTask.mutateAsync({
        userId: user.id,
        taskData: {
          title: newTaskTitle.trim(),
          description: newTaskDescription.trim() || undefined,
          priority: newTaskPriority,
          status: 'todo'
        }
      })
      
      // Reset form
      setNewTaskTitle('')
      setNewTaskDescription('')
      setNewTaskPriority('medium')
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  // Handle task edit
  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsEditModalOpen(true)
  }

  // Handle edit modal close
  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    setEditingTask(null)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">لطفاً وارد سیستم شوید</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">خطا در بارگیری تسک‌ها</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${isDragging ? 'dnd-context' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">تسک‌های من</h2>
        </div>

        <Button
          onClick={() => setShowCreateForm(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          تسک جدید
        </Button>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>ایجاد تسک جدید</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask} className="space-y-4 allow-select">
              <div>
                <Label htmlFor="title">عنوان تسک</Label>
                <Input
                  id="title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="عنوان تسک را وارد کنید..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">توضیحات (اختیاری)</Label>
                <Input
                  id="description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="توضیحات تسک..."
                />
              </div>

              <div>
                <Label htmlFor="priority">اولویت</Label>
                <Select value={newTaskPriority} onValueChange={(value: Task['priority']) => setNewTaskPriority(value)}>
                  <SelectTrigger id="priority">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        <span className={`px-2 py-1 rounded-full text-xs ${TASK_PRIORITIES[newTaskPriority].color}`}>
                          {TASK_PRIORITIES[newTaskPriority].label}
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
              
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={!newTaskTitle.trim() || createTask.isPending}
                >
                  {createTask.isPending ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    'ایجاد تسک'
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewTaskTitle('')
                    setNewTaskDescription('')
                    setNewTaskPriority('medium')
                  }}
                  disabled={createTask.isPending}
                >
                  انصراف
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {createTask.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded allow-select">
          خطا در ایجاد تسک: {createTask.error.message}
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
        {/* Mobile: Stacked layout, Desktop: Side by side */}
        <div className="lg:hidden space-y-4">
          {/* Mobile View - Stacked Columns */}
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <KanbanColumn
              key={status}
              status={status as Task['status']}
              tasks={statusTasks}
              onAddTask={() => setShowCreateForm(true)}
              onEditTask={handleEditTask}
              dropZoneProps={makeDropZone(status)}
              isDropTarget={activeDropZone === status}
              createDraggable={makeDraggable}
            />
          ))}
        </div>

        {/* Desktop View - Side by side */}
        <div className="hidden lg:flex gap-6 flex-1">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <KanbanColumn
              key={status}
              status={status as Task['status']}
              tasks={statusTasks}
              onAddTask={() => setShowCreateForm(true)}
              onEditTask={handleEditTask}
              dropZoneProps={makeDropZone(status)}
              isDropTarget={activeDropZone === status}
              createDraggable={makeDraggable}
            />
          ))}
        </div>
      </div>

      {/* Drag Preview */}
      <DragPreview isVisible={isDragging && !!draggedTask}>
        {draggedTask && (
          <KanbanCard task={draggedTask} />
        )}
      </DragPreview>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t allow-select">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{tasksByStatus.todo.length}</div>
          <div className="text-sm text-gray-500">در انتظار</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{tasksByStatus.in_progress.length}</div>
          <div className="text-sm text-gray-500">در حال انجام</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{tasksByStatus.completed.length}</div>
          <div className="text-sm text-gray-500">تکمیل شده</div>
        </div>
      </div>

      {/* Task Edit Modal */}
      <TaskEditModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
      />
    </div>
  )
} 
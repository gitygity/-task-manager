import { useState, useMemo } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X } from 'lucide-react'
import { KanbanColumn } from './KanbanColumn'
import { TaskEditModal } from './TaskEditModal'
import { useTasks, useTasksByProject, useTasksWithoutProject, useCreateTask } from '../hooks'
import { useAuthStore } from '@/features/auth'
import { ProjectSelector } from './ProjectSelector'
import type { Task } from '../types'

interface KanbanBoardProps {
  projectFilter?: string
}

export function KanbanBoard({ projectFilter }: KanbanBoardProps = {}) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium')
  const [newTaskProjectId, setNewTaskProjectId] = useState<string>('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const { user } = useAuthStore()
  
  // Fetch different data based on project filter
  const allTasks = useTasks(user?.id || '')
  const tasksWithoutProject = useTasksWithoutProject(user?.id || '')
  const tasksByProject = useTasksByProject(
    user?.id || '', 
    projectFilter && projectFilter !== 'all' && projectFilter !== 'none' ? projectFilter : ''
  )
  
  // Select the appropriate query result based on filter
  const selectedQuery = !projectFilter || projectFilter === 'all' 
    ? allTasks 
    : projectFilter === 'none' 
      ? tasksWithoutProject 
      : tasksByProject
  
  const { data: tasks, isLoading, error } = selectedQuery
  const createTask = useCreateTask()

  // Group tasks by status
  const groupedTasks = useMemo(() => {
    if (!tasks) return { todo: [], in_progress: [], completed: [] }
    
    const mainTasks = tasks.filter((task: Task) => !task.parent_task_id)
    
    return {
      todo: mainTasks.filter((task: Task) => task.status === 'todo'),
      in_progress: mainTasks.filter((task: Task) => task.status === 'in_progress'),
      completed: mainTasks.filter((task: Task) => task.status === 'completed'),
    }
  }, [tasks])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !user) return

    try {
      await createTask.mutateAsync({
        userId: user.id,
        taskData: {
          title: newTaskTitle.trim(),
          description: newTaskDescription.trim(),
          priority: newTaskPriority,
          status: 'todo',
          project_id: newTaskProjectId || undefined
        }
      })

      // Reset form
      setNewTaskTitle('')
      setNewTaskDescription('')
      setNewTaskPriority('medium')
      setNewTaskProjectId('')
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task)
  }



  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">خطا در بارگذاری تسک‌ها</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="kanban-board">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn 
          status="todo"
          tasks={groupedTasks.todo}
          onEditTask={handleTaskEdit}
        />

        <KanbanColumn 
          status="in_progress"
          tasks={groupedTasks.in_progress}
          onEditTask={handleTaskEdit}
        />

        <KanbanColumn 
          status="completed"
          tasks={groupedTasks.completed}
          onEditTask={handleTaskEdit}
        />
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>تسک جدید</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <Label htmlFor="task-title">عنوان *</Label>
                  <Input
                    id="task-title"
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="عنوان تسک را وارد کنید"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="task-description">توضیحات</Label>
                  <Input
                    id="task-description"
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="توضیحات تسک (اختیاری)"
                  />
                </div>

                <div>
                  <Label htmlFor="task-priority">اولویت</Label>
                  <Select value={newTaskPriority} onValueChange={(value) => setNewTaskPriority(value as Task['priority'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="اولویت را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">کم</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="high">زیاد</SelectItem>
                      <SelectItem value="urgent">فوری</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="task-project">پروژه</Label>
                  <ProjectSelector
                    value={newTaskProjectId}
                    onValueChange={setNewTaskProjectId}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    انصراف
                  </Button>
                  <Button type="submit">ایجاد تسک</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Add Button */}
      <Button
        onClick={() => setShowCreateForm(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
        size="lg"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Edit Task Modal */}
      <TaskEditModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />
    </div>
  )
} 
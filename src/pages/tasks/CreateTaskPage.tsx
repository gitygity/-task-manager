import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { ArrowLeft, Save, LoaderCircle, Flag } from 'lucide-react'
import { navigate } from '@/routes/utils'
import { useAuthStore } from '@/features/auth'
import { useCreateTask } from '@/features/tasks/hooks'
import { ProjectSelector } from '@/features/tasks/components/ProjectSelector'
import { TASK_PRIORITIES } from '@/features/tasks/types'
import type { Task } from '@/features/tasks/types'

export default function CreateTaskPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [status, setStatus] = useState<Task['status']>('todo')
  const [projectId, setProjectId] = useState<string>('')
  const [dueDate, setDueDate] = useState('')

  const { user } = useAuthStore()
  const createTask = useCreateTask()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !user) return

    try {
      await createTask.mutateAsync({
        userId: user.id,
        taskData: {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          status,
          project_id: projectId || undefined,
          due_date: dueDate || undefined
        }
      })
      
      // Navigate back to tasks page
      navigate.tasks()
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleCancel = () => {
    navigate.tasks()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          بازگشت به تسک‌ها
        </Button>
        <div>
          <h1 className="text-3xl font-bold">ایجاد تسک جدید</h1>
          <p className="text-muted-foreground mt-2">
            تسک جدید به فهرست کارهای خود اضافه کنید
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>جزئیات تسک</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">عنوان تسک</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان تسک را وارد کنید..."
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">توضیحات (اختیاری)</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات تسک..."
                rows={4}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <Label htmlFor="project">پروژه</Label>
              <ProjectSelector
                value={projectId}
                onValueChange={setProjectId}
                placeholder="انتخاب پروژه..."
              />
            </div>

            <div>
              <Label htmlFor="due-date">تاریخ مقرر (اختیاری)</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">اولویت</Label>
                <Select value={priority} onValueChange={(value: Task['priority']) => setPriority(value)}>
                  <SelectTrigger id="priority">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        <span className={`px-2 py-1 rounded-full text-xs ${TASK_PRIORITIES[priority].color}`}>
                          {TASK_PRIORITIES[priority].label}
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
                <Label htmlFor="status">وضعیت</Label>
                <Select value={status} onValueChange={(value: Task['status']) => setStatus(value)}>
                  <SelectTrigger id="status">
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
            
            <div className="flex items-center gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={!title.trim() || createTask.isPending}
              >
                {createTask.isPending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                    در حال ایجاد...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    ایجاد تسک
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={createTask.isPending}
              >
                انصراف
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {createTask.error && (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              خطا در ایجاد تسک: {createTask.error.message}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
import { useState } from 'react'
import { useTasks, useCreateTask } from '../hooks'
import { useAuth } from '@/features/auth/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, LoaderCircle } from 'lucide-react'
import { TaskList } from './TaskList'

export function TaskDemo() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showForm, setShowForm] = useState(false)
  
  const { user } = useAuth()
  const { data: tasks } = useTasks(user?.id || '')
  const createTask = useCreateTask()
  
  // If no user, don't render anything
  if (!user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      await createTask.mutateAsync({
        userId: user.id,
        taskData: {
          title: title.trim(),
          description: description.trim() || undefined,
          status: 'todo'
        }
      })
      
      // پاک کردن فرم
      setTitle('')
      setDescription('')
      setShowForm(false)
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* فرم ایجاد تسک */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>ایجاد تسک جدید</span>
            {!showForm && (
              <Button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                تسک جدید
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        
        {showForm && (
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
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="توضیحات تسک..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={!title.trim() || createTask.isPending}
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
                    setShowForm(false)
                    setTitle('')
                    setDescription('')
                  }}
                >
                  انصراف
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* نمایش خطا */}
      {createTask.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          خطا در ایجاد تسک: {createTask.error.message}
        </div>
      )}

      {/* لیست تسکها */}
      <TaskList />
      
      {/* نمایش تعداد تسکها */}
      <div className="text-sm text-gray-500 text-center">
        تعداد کل تسکها: {tasks?.length || 0}
      </div>
    </div>
  )
} 
import { useTasks } from '../hooks'
import { useAuth } from '@/features/auth/hooks'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { TaskActions } from './TaskActions'
import { AlertCircle } from 'lucide-react'

export function TaskList() {
  const { user } = useAuth()
  const { data: tasks, isLoading, error } = useTasks(user?.id || '')

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-700">خطا در بارگذاری تسکها</p>
          <p className="text-sm text-red-600 mt-2">
            {error instanceof Error ? error.message : 'خطای نامشخص'}
          </p>
        </div>
      </div>
    )
  }

  if (!tasks?.length) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-500">هیچ تسکی پیدا نشد</p>
        <p className="text-sm text-gray-400 mt-2">اولین تسک خود را ایجاد کنید</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">تسکهای من ({tasks.length})</h2>
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskActions key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
} 
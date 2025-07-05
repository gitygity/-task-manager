import { useTaskStats } from '../hooks'
import { useAuthStore } from '@/features/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { 
  BarChart3, 
  CheckCircle, 
  Clock, 
  PlayCircle, 
  Flag,
  ListTodo,
  TreePine,
} from 'lucide-react'
import { TASK_PRIORITIES } from '../types'

interface TaskStatsProps {
  projectId?: string
}

export function TaskStats({ projectId }: TaskStatsProps) {
  const { user } = useAuthStore()
  const { data: stats, isLoading, error } = useTaskStats(
    user?.id || '', 
    projectId === 'none' ? '' : projectId
  )

  if (!user) return null

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            خطا در بارگیری آمار
          </div>
        </CardContent>
      </Card>
    )
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  // Determine title based on filter
  const getTitle = () => {
    if (!projectId || projectId === 'all') return 'آمار کلی تسک‌ها'
    if (projectId === 'none') return 'آمار تسک‌های بدون پروژه'
    return 'آمار تسک‌های پروژه'
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="text-lg font-semibold text-gray-800">
        {getTitle()}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* کل تسک‌ها */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل تسک‌ها</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.mainTasks} تسک اصلی، {stats.subtasks} سابتسک
            </p>
          </CardContent>
        </Card>

        {/* نرخ تکمیل */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نرخ تکمیل</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} از {stats.total} تسک
            </p>
          </CardContent>
        </Card>

        {/* تسک‌های در حال انجام */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">در حال انجام</CardTitle>
            <PlayCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              تسک‌های فعال
            </p>
          </CardContent>
        </Card>

        {/* تسک‌های در انتظار */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">در انتظار</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todo}</div>
            <p className="text-xs text-muted-foreground">
              تسک‌های جدید
            </p>
          </CardContent>
        </Card>

        {/* آمار اولویت */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flag className="h-4 w-4" />
              توزیع اولویت
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(TASK_PRIORITIES).map(([priority, config]) => {
                const count = stats.byPriority[priority as keyof typeof stats.byPriority]
                const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${config.color.split(' ')[0]}`} />
                      <span className="text-sm font-medium">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{percentage}%</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ساختار سلسله مراتبی */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TreePine className="h-4 w-4" />
              ساختار تسک‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">تسک‌های اصلی</span>
                </div>
                <span className="text-sm font-medium">{stats.mainTasks}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                  <span className="text-sm font-medium">سابتسک‌ها</span>
                </div>
                <span className="text-sm font-medium">{stats.subtasks}</span>
              </div>
              
              {stats.mainTasks > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>میانگین سابتسک در هر تسک</span>
                    <span>{(stats.subtasks / stats.mainTasks).toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
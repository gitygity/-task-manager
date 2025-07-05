import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KanbanBoard } from '@/features/tasks'
import { ProjectFilter } from '@/features/tasks/components/ProjectFilter'
import { useTaskCounts } from '@/features/tasks/hooks'
import { useAuthStore } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import { navigate } from '@/routes/utils'

export default function KanbanPage() {
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all')
  const navigateTo = useNavigate()
  const { user } = useAuthStore()
  
  // Get task counts for each project
  const { data: taskCounts } = useTaskCounts(user?.id || '')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigateTo(navigate.tasks())}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            بازگشت به تسک‌ها
          </Button>
          <div>
            <h1 className="text-3xl font-bold">تابلوی کانبان</h1>
            <p className="text-muted-foreground mt-2">
              مدیریت کارهای خود با قابلیت کشیدن و رها کردن
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ProjectFilter
            value={selectedProjectFilter}
            onValueChange={setSelectedProjectFilter}
            showTaskCount={true}
            taskCounts={taskCounts}
          />
          <Button onClick={() => navigateTo(navigate.createTask())}>
            <Plus className="h-4 w-4 mr-2" />
            تسک جدید
          </Button>
        </div>
      </div>

      {/* Full Kanban Board */}
      <div className="w-full">
        <KanbanBoard projectFilter={selectedProjectFilter !== 'all' ? selectedProjectFilter : undefined} />
      </div>
    </div>
  )
} 
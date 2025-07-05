import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, BarChart3, Calendar } from 'lucide-react'
import { navigate } from '@/routes/utils'
import { TaskStats, KanbanBoard } from '@/features/tasks'
import { useTaskCounts } from '@/features/tasks/hooks'
import { useAuthStore } from '@/features/auth'
import { ProjectFilter } from '@/features/tasks/components/ProjectFilter'

export default function TasksListPage() {
  const [activeTab, setActiveTab] = useState('kanban')
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all')
  const navigateTo = useNavigate()
  const { user } = useAuthStore()
  
  // Get task counts for each project
  const { data: taskCounts } = useTaskCounts(user?.id || '')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">تسک‌ها</h1>
          <p className="text-muted-foreground mt-2">
            مدیریت و پیگیری تمام کارهای خود با تابلوی کانبان
          </p>
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

      {/* Task Statistics */}
      <TaskStats projectId={selectedProjectFilter !== 'all' ? selectedProjectFilter : undefined} />

      {/* Task Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            تابلوی کانبان
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            نمای لیست
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            تقویم
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="kanban" className="mt-6">
          {/* Kanban Board Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                نمایش کوچک تابلوی کانبان شما. برای تجربه کامل، روی "باز کردن کانبان کامل" کلیک کنید.
              </p>
              <Button onClick={() => navigateTo(navigate.kanban())}>
                <Calendar className="h-4 w-4 mr-2" />
                باز کردن کانبان کامل
              </Button>
            </div>
            <div className="border rounded-lg p-4 bg-muted/20">
              <KanbanBoard 
                projectFilter={selectedProjectFilter !== 'all' ? selectedProjectFilter : undefined}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>نمای لیست</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                نمای لیست به زودی... فعلاً از تابلوی کانبان بالا استفاده کنید.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>نمای تقویم</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                نمای تقویم به زودی... فعلاً از تابلوی کانبان بالا استفاده کنید.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
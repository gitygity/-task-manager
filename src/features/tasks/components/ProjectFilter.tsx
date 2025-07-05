import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useProjects } from '@/features/projects/hooks'
import { useAuthStore } from '@/features/auth'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { FolderOpen, Folder, Filter } from 'lucide-react'

interface ProjectFilterProps {
  value?: string
  onValueChange: (value: string) => void
  showTaskCount?: boolean
  taskCounts?: Record<string, number>
}

export function ProjectFilter({ 
  value, 
  onValueChange, 
  showTaskCount = false,
  taskCounts = {}
}: ProjectFilterProps) {
  const { user } = useAuthStore()
  const { data: projects, isLoading, error } = useProjects(user?.id || '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2 min-w-48">
        <LoadingSpinner size="sm" />
        <span className="mr-2 text-sm text-gray-500">بارگذاری...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 text-sm text-red-500 min-w-48">
        خطا در بارگذاری پروژه‌ها
      </div>
    )
  }

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue)
  }

  const getDisplayValue = () => {
    if (!value || value === 'all') return 'همه پروژه‌ها'
    if (value === 'none') return 'بدون پروژه'
    
    const project = projects?.find(p => p.id === value)
    return project?.title || 'پروژه ناشناخته'
  }

  const getTotalTaskCount = () => {
    return Object.values(taskCounts).reduce((sum, count) => sum + count, 0)
  }

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-gray-500" />
      <Select value={value || 'all'} onValueChange={handleValueChange}>
        <SelectTrigger className="min-w-48">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{getDisplayValue()}</span>
              {showTaskCount && (
                <Badge variant="secondary" className="text-xs">
                  {value === 'all' ? getTotalTaskCount() : 
                   value === 'none' ? (taskCounts['none'] || 0) :
                   (taskCounts[value || ''] || 0)}
                </Badge>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {/* گزینه همه پروژه‌ها */}
          <SelectItem value="all">
            <div className="flex items-center gap-2 w-full">
              <FolderOpen className="h-4 w-4 text-blue-500" />
              <span>همه پروژه‌ها</span>
              {showTaskCount && (
                <Badge variant="secondary" className="text-xs mr-auto">
                  {getTotalTaskCount()}
                </Badge>
              )}
            </div>
          </SelectItem>

          {/* گزینه بدون پروژه */}
          <SelectItem value="none">
            <div className="flex items-center gap-2 w-full">
              <div className="w-4 h-4 rounded border-2 border-dashed border-gray-400" />
              <span className="text-gray-600">بدون پروژه</span>
              {showTaskCount && (
                <Badge variant="secondary" className="text-xs mr-auto">
                  {taskCounts['none'] || 0}
                </Badge>
              )}
            </div>
          </SelectItem>

          {/* خط جداکننده */}
          {projects && projects.length > 0 && (
            <div className="border-t border-gray-200 my-1" />
          )}

          {/* لیست پروژه‌ها */}
          {projects?.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  <div className={`w-2 h-2 rounded-full ${
                    project.status === 'active' ? 'bg-green-500' :
                    project.status === 'completed' ? 'bg-blue-500' :
                    project.status === 'planning' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <span>{project.title}</span>
                </div>
                {showTaskCount && (
                  <Badge variant="secondary" className="text-xs mr-auto">
                    {taskCounts[project.id] || 0}
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}

          {/* پیام خالی بودن */}
          {(!projects || projects.length === 0) && (
            <div className="p-2 text-center text-gray-500 text-sm">
              هیچ پروژه‌ای موجود نیست
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  )
} 
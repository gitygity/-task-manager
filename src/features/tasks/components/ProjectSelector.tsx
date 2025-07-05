import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProjects } from '@/features/projects/hooks'
import { useAuthStore } from '@/features/auth'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface ProjectSelectorProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ProjectSelector({ value, onValueChange, placeholder = "انتخاب پروژه", disabled = false }: ProjectSelectorProps) {
  const { user } = useAuthStore()
  const { data: projects, isLoading, error } = useProjects(user?.id || '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2">
        <LoadingSpinner size="sm" />
        <span className="mr-2 text-sm text-gray-500">بارگذاری پروژه‌ها...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 text-sm text-red-500">
        خطا در بارگذاری پروژه‌ها
      </div>
    )
  }

  const handleValueChange = (newValue: string) => {
    if (newValue === 'none') {
      onValueChange('')
    } else {
      onValueChange(newValue)
    }
  }

  return (
    <Select value={value || 'none'} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <span className="text-gray-500">بدون پروژه</span>
        </SelectItem>
        {projects?.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                project.status === 'active' ? 'bg-green-500' :
                project.status === 'completed' ? 'bg-blue-500' :
                project.status === 'planning' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`} />
              <span>{project.title}</span>
              <span className="text-xs text-gray-500">
                ({project.status === 'active' ? 'فعال' :
                  project.status === 'completed' ? 'تکمیل شده' :
                  project.status === 'planning' ? 'برنامه‌ریزی' :
                  'متوقف شده'})
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 
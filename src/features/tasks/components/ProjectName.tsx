import { useProjects } from '@/features/projects/hooks'
import { useAuthStore } from '@/features/auth'
import { Folder } from 'lucide-react'

interface ProjectNameProps {
  projectId?: string | null
  showIcon?: boolean
  className?: string
}

export function ProjectName({ projectId, showIcon = true, className = "" }: ProjectNameProps) {
  const { user } = useAuthStore()
  const { data: projects } = useProjects(user?.id || '')

  if (!projectId) {
    return (
      <div className={`flex items-center gap-1 text-xs text-gray-500 ${className}`}>
        {showIcon && <div className="w-3 h-3 rounded border border-dashed border-gray-400" />}
        <span>بدون پروژه</span>
      </div>
    )
  }

  const project = projects?.find(p => p.id === projectId)

  if (!project) {
    return (
      <div className={`flex items-center gap-1 text-xs text-gray-500 ${className}`}>
        {showIcon && <Folder className="h-3 w-3" />}
        <span>پروژه ناشناخته</span>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'planning': return 'bg-yellow-500'
      case 'paused': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className={`flex items-center gap-1 text-xs text-gray-600 ${className}`}>
      {showIcon && (
        <div className="flex items-center gap-1">
          <Folder className="h-3 w-3" />
          <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
        </div>
      )}
      <span className="truncate max-w-24" title={project.title}>
        {project.title}
      </span>
    </div>
  )
} 
import { useState } from 'react'
import { Calendar, Clock, MoreHorizontal, Edit, Trash2, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { navigate } from '@/routes/utils'
import { useDeleteProject } from '../hooks'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteProject = useDeleteProject()

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setIsDeleting(true)
      try {
        await deleteProject.mutateAsync(project.id)
      } catch (error) {
        console.error('Failed to delete project:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(project)
    } else {
      navigate.editProject(project.id)
    }
  }

  const handleViewDetails = () => {
    navigate.projectDetails(project.id)
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle 
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
            onClick={handleViewDetails}
          >
            {project.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge className={getStatusColor(project.status)} variant="secondary">
            {project.status}
          </Badge>
          <Badge className={getPriorityColor(project.priority)} variant="secondary">
            {project.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {project.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {project.description}
          </p>
        )}
        
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          {project.start_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Start: {formatDate(project.start_date)}</span>
            </div>
          )}
          {project.end_date && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>End: {formatDate(project.end_date)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Created: {formatDate(project.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
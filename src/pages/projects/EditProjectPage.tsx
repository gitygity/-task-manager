import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuthStore } from '@/features/auth'
import { useProject, ProjectForm } from '@/features/projects'
import { navigate } from '@/routes/utils'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const { data: project, isLoading, error } = useProject(id || '')

  const handleSuccess = () => {
    // Navigate back to project details after successful update
    navigate.projectDetails(id || '')
  }

  const handleCancel = () => {
    // Navigate back to project details
    navigate.projectDetails(id || '')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate.projects()}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load project. The project may not exist or you may not have access to it.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Project
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-gray-600 mt-1">
            Update project details and settings
          </p>
        </div>

        <ProjectForm
          project={project}
          userId={user?.id || ''}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
} 
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth'
import { ProjectForm } from '@/features/projects'
import { navigate } from '@/routes/utils'

export default function CreateProjectPage() {
  const { user } = useAuthStore()

  const handleSuccess = () => {
    // Navigate back to projects list after successful creation
    navigate.projects()
  }

  const handleCancel = () => {
    // Navigate back to projects list
    navigate.projects()
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
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-1">
            Add a new project to organize your work and track progress
          </p>
        </div>

        <ProjectForm
          userId={user?.id || ''}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
} 
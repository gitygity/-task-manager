import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { navigate } from '@/routes/utils'

export default function TaskDetailsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate.tasks()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Task Details</h1>
            <p className="text-muted-foreground mt-2">
              View and manage task information
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Task Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Design homepage mockup</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-blue-100 text-blue-800">In Progress</Badge>
              <Badge variant="destructive">High</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm">Description</h3>
              <p className="text-muted-foreground mt-1">
                Create a modern and responsive homepage mockup for the new company website. 
                Include sections for hero, features, testimonials, and footer.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm">Assigned to</h3>
                <p className="text-muted-foreground mt-1">John Doe</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Created</h3>
                <p className="text-muted-foreground mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
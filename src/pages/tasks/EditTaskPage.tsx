import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import { navigate } from '@/routes/utils'

export default function EditTaskPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate.tasks()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Task</h1>
          <p className="text-muted-foreground mt-2">
            Update task information
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Task Title</label>
              <input 
                type="text" 
                className="w-full mt-1 px-3 py-2 border rounded-md"
                defaultValue="Design homepage mockup"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea 
                className="w-full mt-1 px-3 py-2 border rounded-md h-32"
                defaultValue="Create a modern and responsive homepage mockup for the new company website."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue="High">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue="In Progress">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => navigate.tasks()}>
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
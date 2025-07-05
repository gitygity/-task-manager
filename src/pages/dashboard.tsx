import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { navigate } from '@/routes/utils'
import { TaskStats } from '@/features/tasks'

const stats = [
  {
    title: "Total Tasks",
    value: "12",
    description: "4 completed this week",
    color: "text-blue-600"
  },
  {
    title: "Active Projects", 
    value: "3",
    description: "2 due this month",
    color: "text-green-600"
  },
  {
    title: "Pending Reviews",
    value: "5",
    description: "Awaiting approval",
    color: "text-orange-600"
  },
  {
    title: "Team Members",
    value: "8",
    description: "Active collaborators",
    color: "text-purple-600"
  }
]

const recentTasks = [
  { id: 1, title: "Design homepage mockup", status: "in-progress", priority: "high" },
  { id: 2, title: "Review API documentation", status: "completed", priority: "medium" },
  { id: 3, title: "Update user authentication", status: "pending", priority: "high" },
  { id: 4, title: "Write unit tests", status: "in-progress", priority: "low" },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
    case 'in-progress':
      return <Badge variant="default" className="bg-blue-100 text-blue-800">In Progress</Badge>
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive">High</Badge>
    case 'medium':
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium</Badge>
    case 'low':
      return <Badge variant="outline">Low</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your current work.
        </p>
      </div>

      {/* Task Statistics */}
      <TaskStats />

      {/* Overview Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Tasks */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Your most recent task activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <div key={task.id}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  {index < recentTasks.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common actions you might want to take
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              variant="default"
              onClick={() => navigate.createTask()}
            >
              Create New Task
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate.kanban()}
            >
              Open Kanban Board
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate.createProject()}
            >
              Start New Project
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate.projects()}
            >
              View All Projects
            </Button>
            <Button 
              className="w-full" 
              variant="ghost"
              onClick={() => navigate.profile()}
            >
              Profile Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
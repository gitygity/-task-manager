import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Circle, Play, CheckCircle } from 'lucide-react'
import { KanbanCard } from './KanbanCard'
import type { Task } from '../types'

interface KanbanColumnProps {
  status: Task['status']
  tasks: Task[]
  onAddTask?: () => void
  onEditTask?: (task: Task) => void
  dropZoneProps?: Record<string, unknown>
  isDropTarget?: boolean
  createDraggable?: (task: Task, sourceZoneId?: string) => Record<string, unknown>
}

const statusConfig = {
  todo: {
    title: 'در انتظار',
    color: 'bg-gray-100 text-gray-800',
    icon: Circle,
    headerColor: 'bg-gray-50 border-gray-200'
  },
  in_progress: {
    title: 'در حال انجام',
    color: 'bg-blue-100 text-blue-800',
    icon: Play,
    headerColor: 'bg-blue-50 border-blue-200'
  },
  completed: {
    title: 'تکمیل شده',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    headerColor: 'bg-green-50 border-green-200'
  }
}

export function KanbanColumn({ 
  status, 
  tasks, 
  onAddTask, 
  onEditTask, 
  dropZoneProps = {},
  isDropTarget = false,
  createDraggable
}: KanbanColumnProps) {
  const config = statusConfig[status]
  const IconComponent = config.icon

  return (
    <div className="flex-1 min-w-0">
      <Card className={`h-full transition-colors duration-200 ${
        isDropTarget ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50' : ''
      }`}>
        {/* Column Header */}
        <CardHeader className={`pb-3 ${config.headerColor} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 allow-select">
              <IconComponent className="h-4 w-4 text-gray-600" />
              <h3 className="font-medium text-sm text-gray-900">{config.title}</h3>
              <Badge variant="secondary" className="text-xs pointer-events-none">
                {tasks.length}
              </Badge>
            </div>
            
            {onAddTask && status === 'todo' && (
              <Button
                onClick={onAddTask}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Column Content */}
        <CardContent className="p-3">
          <div
            className={`min-h-[200px] rounded-lg transition-colors duration-200 ${
              isDropTarget ? 'bg-blue-100 border-2 border-dashed border-blue-300' : ''
            }`}
            {...dropZoneProps}
          >
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 pointer-events-none">
                <IconComponent className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">هیچ تسکی در این بخش نیست</p>
                {status === 'todo' && (
                  <p className="text-xs mt-1">تسک جدید اضافه کنید</p>
                )}
              </div>
            ) : (
              tasks.map((task) => {
                const dragProps = createDraggable ? createDraggable(task, status) : {}
                
                return (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    dragProps={dragProps}
                  />
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
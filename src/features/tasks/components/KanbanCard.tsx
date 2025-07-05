import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  Flag, 
  MoreHorizontal, 
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Calendar,
  GripVertical,
  ChevronDown,
  ChevronRight,
  ListTodo
} from 'lucide-react'
import { TASK_PRIORITIES } from '../types'
import type { Task } from '../types'
import { useState, memo } from 'react'
import { useCreateSubtask } from '../hooks'
import { useAuthStore } from '@/features/auth'
import { Input } from '@/components/ui/input'

interface KanbanCardProps {
  task: Task
  onEdit?: (task: Task) => void
  dragProps?: Record<string, unknown>
  isDragging?: boolean
}

function KanbanCardComponent({ 
  task, 
  onEdit, 
  dragProps = {},
  isDragging = false
}: KanbanCardProps) {
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [showAddSubtask, setShowAddSubtask] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  
  const { user } = useAuthStore()
  const createSubtask = useCreateSubtask()
  
  const priorityConfig = TASK_PRIORITIES[task.priority]
  const hasSubtasks = task.subtasks && task.subtasks.length > 0
  const completedSubtasks = task.subtasks ? task.subtasks.filter(st => st.status === 'completed').length : 0

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'urgent':
        return <AlertCircle className="h-3 w-3" />
      case 'high':
        return <Flag className="h-3 w-3" />
      case 'medium':
        return <Clock className="h-3 w-3" />
      case 'low':
        return <CheckCircle2 className="h-3 w-3" />
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    console.log('Three dots clicked for task:', task.title)
    if (onEdit) {
      onEdit(task)
    } else {
      console.log('onEdit handler not provided')
    }
  }

  const handleCreateSubtask = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!newSubtaskTitle.trim() || !user) return

    try {
      await createSubtask.mutateAsync({
        userId: user.id,
        subtaskData: {
          title: newSubtaskTitle.trim(),
          priority: 'medium',
          parent_task_id: task.id,
          status: 'todo'
        }
      })
      
      setNewSubtaskTitle('')
      setShowAddSubtask(false)
      setShowSubtasks(true) // Show subtasks after creating one
    } catch (error) {
      console.error('Error creating subtask:', error)
    }
  }

  return (
    <div className={`${isDragging ? 'opacity-50' : ''}`}>
      <Card className="mb-3 kanban-card group bg-white border border-gray-200 hover:border-gray-300 relative pointer-events-none">
        <CardContent className="p-3 pointer-events-auto">
          {/* Header with drag handle */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-2 flex-1">
              {/* Drag Handle */}
              <div
                className="drag-handle p-1 cursor-grab active:cursor-grabbing rounded hover:bg-gray-100 pointer-events-auto"
                {...dragProps}
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              
              {/* Task Title */}
              <h4 className="text-sm font-medium line-clamp-2 text-gray-900 flex-1 allow-select">
                {task.title}
              </h4>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 ml-2 opacity-60 hover:opacity-100 hover:bg-gray-100 transition-all rounded-full z-10 pointer-events-auto"
              onClick={handleEdit}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              title="ویرایش تسک"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2 allow-select">
              {task.description}
            </p>
          )}

          {/* Priority Badge */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className={`text-xs ${priorityConfig.color} border-0 pointer-events-none`}>
              <div className="flex items-center gap-1">
                {getPriorityIcon()}
                {priorityConfig.label}
              </div>
            </Badge>

            {/* Subtasks indicator */}
            {hasSubtasks && (
              <div className="flex items-center gap-1 text-xs text-gray-500 pointer-events-none">
                <CheckCircle2 className="h-3 w-3" />
                <span>{completedSubtasks}/{task.subtasks!.length}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pointer-events-none">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.created_at).toLocaleDateString('fa-IR')}</span>
            </div>
            
            {task.user_id && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
              </div>
            )}
          </div>

          {/* Progress bar for subtasks */}
          {hasSubtasks && (
            <div className="mt-2 pointer-events-none">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-green-500 h-1 rounded-full"
                  style={{ 
                    width: `${(completedSubtasks / task.subtasks!.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}

                    {/* Subtasks collapsible section */}
          <Collapsible open={showSubtasks} onOpenChange={setShowSubtasks}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 h-6 px-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 pointer-events-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1">
                    <ListTodo className="h-3 w-3" />
                    <span>
                      {hasSubtasks 
                        ? `سابتسک‌ها (${completedSubtasks}/${task.subtasks!.length})`
                        : "افزودن سابتسک"
                      }
                    </span>
                  </div>
                  {showSubtasks ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="mt-2 space-y-1 pointer-events-auto">
                {hasSubtasks && task.subtasks!.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs border"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          subtask.status === 'completed'
                            ? 'bg-green-500 border-green-500'
                            : subtask.status === 'in_progress'
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {subtask.status === 'completed' && (
                          <CheckCircle2 className="h-2 w-2 text-white" />
                        )}
                      </div>
                      <span className={`flex-1 ${subtask.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {subtask.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs px-1 py-0 ${TASK_PRIORITIES[subtask.priority].color} border-0`}
                      >
                        {TASK_PRIORITIES[subtask.priority].label}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 opacity-60 hover:opacity-100 pointer-events-auto"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          onEdit?.(subtask)
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        title="ویرایش سابتسک"
                      >
                        <MoreHorizontal className="h-2 w-2" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Add subtask section */}
                {showAddSubtask ? (
                  <form onSubmit={handleCreateSubtask} className="mt-2 p-2 bg-blue-50 rounded border pointer-events-auto">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="نام سابتسک جدید..."
                        className="flex-1 text-xs h-7 pointer-events-auto"
                        autoFocus
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="h-7 px-2 text-xs pointer-events-auto"
                        disabled={!newSubtaskTitle.trim() || createSubtask.isPending}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      >
                        افزودن
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs pointer-events-auto"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setShowAddSubtask(false)
                          setNewSubtaskTitle('')
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      >
                        لغو
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 h-6 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-dashed border-blue-300 hover:border-blue-400 pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setShowAddSubtask(true)
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    + افزودن سابتسک
                  </Button>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}

// Memoize component to only re-render when task prop changes
export const KanbanCard = memo(KanbanCardComponent, (prevProps, nextProps) => {
  // Custom comparison function to ensure re-render when task data changes
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.updated_at === nextProps.task.updated_at &&
    JSON.stringify(prevProps.task.subtasks) === JSON.stringify(nextProps.task.subtasks) &&
    prevProps.isDragging === nextProps.isDragging
  )
}) 
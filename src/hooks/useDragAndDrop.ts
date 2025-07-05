import { useState, useCallback, useRef } from 'react'

// Types for drag and drop functionality
export interface DragItem {
  id: string
  data?: unknown
  sourceZone?: string // Track source zone
}

export interface DropZone {
  id: string
  accepts?: string[]
}

export interface DragDropEvents {
  onDragStart?: (item: DragItem) => void
  onDragEnd?: (item: DragItem, dropZone?: DropZone) => void
  onDrop?: (item: DragItem, dropZone: DropZone) => void
}

export interface DragDropState {
  isDragging: boolean
  draggedItem: DragItem | null
  activeDropZone: string | null
  sourceZone: string | null | undefined // Track source zone
}

// Main hook for drag and drop functionality
export function useDragAndDrop(events: DragDropEvents = {}) {
  const [state, setState] = useState<DragDropState>({
    isDragging: false,
    draggedItem: null,
    activeDropZone: null,
    sourceZone: null,
  })

  const touchStartPos = useRef<{ x: number; y: number } | null>(null)
  const isDraggedRef = useRef(false)

  // Create draggable item props
  const createDraggable = useCallback((item: DragItem) => {
    return {
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        // Use provided sourceZone or find it from DOM
        let sourceZoneId = item.sourceZone
        if (!sourceZoneId) {
          const sourceElement = e.currentTarget.closest('[data-drop-zone]')
          sourceZoneId = sourceElement?.getAttribute('data-drop-zone') || undefined
        }
        
        const itemWithSource = { ...item, sourceZone: sourceZoneId }
        
        e.dataTransfer.setData('text/plain', JSON.stringify(itemWithSource))
        e.dataTransfer.effectAllowed = 'move'
        
        // Hide default drag image
        const dragImage = document.createElement('div')
        dragImage.style.opacity = '0'
        document.body.appendChild(dragImage)
        e.dataTransfer.setDragImage(dragImage, 0, 0)
        setTimeout(() => document.body.removeChild(dragImage), 0)

        setState(prev => ({
          ...prev,
          isDragging: true,
          draggedItem: itemWithSource,
          sourceZone: sourceZoneId,
        }))

        events.onDragStart?.(itemWithSource)
      },
      onDragEnd: (e: React.DragEvent) => {
        e.preventDefault()
        
        const dropZone = state.activeDropZone ? { id: state.activeDropZone } : undefined
        
        setState(prev => ({
          ...prev,
          isDragging: false,
          draggedItem: null,
          activeDropZone: null,
          sourceZone: null,
        }))

        events.onDragEnd?.(item, dropZone)
      },
      // Touch events for mobile support
      onTouchStart: (e: React.TouchEvent) => {
        const touch = e.touches[0]
        touchStartPos.current = { x: touch.clientX, y: touch.clientY }
        isDraggedRef.current = false
      },
      onTouchMove: (e: React.TouchEvent) => {
        if (!touchStartPos.current) return
        
        const touch = e.touches[0]
        const deltaX = Math.abs(touch.clientX - touchStartPos.current.x)
        const deltaY = Math.abs(touch.clientY - touchStartPos.current.y)
        
        // Start drag if moved enough
        if ((deltaX > 10 || deltaY > 10) && !isDraggedRef.current) {
          e.preventDefault()
          isDraggedRef.current = true
          
          // Use provided sourceZone or find it from DOM for touch events
          let sourceZoneId = item.sourceZone
          if (!sourceZoneId) {
            const sourceElement = e.currentTarget.closest('[data-drop-zone]')
            sourceZoneId = sourceElement?.getAttribute('data-drop-zone') || undefined
          }
          
          const itemWithSource = { ...item, sourceZone: sourceZoneId }
          
          setState(prev => ({
            ...prev,
            isDragging: true,
            draggedItem: itemWithSource,
            sourceZone: sourceZoneId,
          }))

          events.onDragStart?.(itemWithSource)
        }
      },
      onTouchEnd: (e: React.TouchEvent) => {
        if (isDraggedRef.current) {
          e.preventDefault()
          
          // Find drop zone under touch point
          const touch = e.changedTouches[0]
          const element = document.elementFromPoint(touch.clientX, touch.clientY)
          const dropZoneElement = element?.closest('[data-drop-zone]')
          const dropZoneId = dropZoneElement?.getAttribute('data-drop-zone')
          
          const dropZone = dropZoneId ? { id: dropZoneId } : undefined
          
          setState(prev => ({
            ...prev,
            isDragging: false,
            draggedItem: null,
            activeDropZone: null,
            sourceZone: null,
          }))

          // Only trigger onDrop if dropped on a different zone
          if (dropZone && state.sourceZone !== dropZone.id) {
            events.onDrop?.(item, dropZone)
          }
          
          events.onDragEnd?.(item, dropZone)
        }
        
        touchStartPos.current = null
        isDraggedRef.current = false
      },
    }
  }, [events, state.activeDropZone, state.sourceZone])

  // Create drop zone props
  const createDropZone = useCallback((dropZone: DropZone) => {
    return {
      'data-drop-zone': dropZone.id,
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        
        setState(prev => ({
          ...prev,
          activeDropZone: dropZone.id,
        }))
      },
      onDragEnter: (e: React.DragEvent) => {
        e.preventDefault()
      },
      onDragLeave: (e: React.DragEvent) => {
        e.preventDefault()
        
        // Only clear if leaving the drop zone, not entering a child
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX
        const y = e.clientY
        
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
          setState(prev => ({
            ...prev,
            activeDropZone: null,
          }))
        }
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        
        try {
          const itemData = e.dataTransfer.getData('text/plain')
          const item: DragItem = JSON.parse(itemData)
          
          setState(prev => ({
            ...prev,
            isDragging: false,
            draggedItem: null,
            activeDropZone: null,
            sourceZone: null,
          }))

          // Only trigger onDrop if dropped on a different zone
          if (item.sourceZone !== dropZone.id) {
            events.onDrop?.(item, dropZone)
          }
        } catch (error) {
          console.error('Failed to parse drop data:', error)
        }
      },
    }
  }, [events])

  // Create drag preview (overlay)
  const createDragPreview = useCallback(() => {
    if (!state.isDragging || !state.draggedItem) return null

    return {
      item: state.draggedItem,
      style: {
        position: 'fixed' as const,
        pointerEvents: 'none' as const,
        zIndex: 1000,
        top: 0,
        left: 0,
        opacity: 0.8,
      },
    }
  }, [state.isDragging, state.draggedItem])

  return {
    state,
    createDraggable,
    createDropZone,
    createDragPreview,
  }
}

// Utility hook for simple drag and drop without complex state management
export function useSimpleDragDrop<T extends { id: string }>(
  onItemMove: (itemId: string, targetZoneId: string, sourceZoneId: string) => void
) {
  const { state, createDraggable, createDropZone, createDragPreview } = useDragAndDrop({
    onDrop: (item, dropZone) => {
      console.log('onDrop called:', { 
        itemId: item.id, 
        sourceZone: item.sourceZone, 
        dropZoneId: dropZone.id,
        shouldMove: item.sourceZone && item.sourceZone !== dropZone.id
      })
      
      // Only call onItemMove if source and target zones are different
      if (item.sourceZone && item.sourceZone !== dropZone.id) {
        console.log('Calling onItemMove - zones are different')
        onItemMove(item.id, dropZone.id, item.sourceZone)
      } else {
        console.log('Skipping onItemMove - same zone or missing sourceZone')
      }
    },
  })

  const makeDraggable = useCallback((item: T, sourceZoneId?: string) => {
    return createDraggable({ id: item.id, data: item, sourceZone: sourceZoneId })
  }, [createDraggable])

  const makeDropZone = useCallback((zoneId: string) => {
    return createDropZone({ id: zoneId })
  }, [createDropZone])

  return {
    isDragging: state.isDragging,
    draggedItem: state.draggedItem,
    activeDropZone: state.activeDropZone,
    sourceZone: state.sourceZone,
    makeDraggable,
    makeDropZone,
    createDragPreview,
  }
} 
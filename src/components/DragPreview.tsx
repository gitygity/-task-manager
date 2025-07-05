import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface DragPreviewProps {
  children: React.ReactNode
  isVisible: boolean
}

export function DragPreview({ children, isVisible }: DragPreviewProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!isVisible) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        setPosition({ x: touch.clientX, y: touch.clientY })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchmove', handleTouchMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isVisible])

  if (!isVisible) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: position.x + 10,
        top: position.y + 10,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0.8,
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3)',
      }}
    >
      {children}
    </div>,
    document.body
  )
} 
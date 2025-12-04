import { useState, useCallback, useEffect } from 'react'

interface DragState {
  isDragging: boolean
  dragStart: { x: number; y: number }
  currentPosition: { x: number; y: number }
}

export function useDragAndDrop() {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 }
  })

  const handleMouseDown = useCallback((e: React.MouseEvent, initialX: number, initialY: number) => {
    e.stopPropagation()
    setState({
      isDragging: true,
      dragStart: { x: e.clientX - initialX, y: e.clientY - initialY },
      currentPosition: { x: initialX, y: initialY }
    })
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setState(prev => {
      if (!prev.isDragging) return prev

      const newX = e.clientX - prev.dragStart.x
      const newY = e.clientY - prev.dragStart.y

      return {
        ...prev,
        currentPosition: { x: newX, y: newY }
      }
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDragging: false
    }))
  }, [])

  useEffect(() => {
    if (state.isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp])

  return {
    isDragging: state.isDragging,
    currentPosition: state.currentPosition,
    handleMouseDown
  }
}

import React, { useEffect, useState, useRef } from 'react'
import type { DraggableElement } from '../types/template'

interface TextElementProps {
  element: DraggableElement
  isSelected: boolean
  pdfHeight: number
  canvasScale: number
  onMove: (x: number, y: number) => void
  onSelect: () => void
  onResize?: (width: number) => void
}

export const TextElement: React.FC<TextElementProps> = ({
  element,
  isSelected,
  pdfHeight,
  canvasScale,
  onMove,
  onSelect,
  onResize
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, width: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  // Convert PDF coordinates to HTML coordinates for display
  const htmlY = pdfHeight - element.y

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - element.x * canvasScale,
      y: e.clientY - htmlY * canvasScale
    })
    onSelect()
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      width: element.maxWidth || 100
    })
    onSelect()
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newX = (e.clientX - dragStart.x) / canvasScale
      const newHtmlY = (e.clientY - dragStart.y) / canvasScale
      const newPdfY = pdfHeight - newHtmlY

      onMove(Math.round(newX), Math.round(newPdfY))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, canvasScale, pdfHeight, onMove])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x
      const newWidth = Math.max(50, resizeStart.width + deltaX / canvasScale)

      if (onResize) {
        onResize(Math.round(newWidth))
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeStart, canvasScale, onResize])

  const borderClass = isSelected
    ? 'border-blue-500 bg-blue-50/90 shadow-lg shadow-blue-500/30 ring-1 ring-blue-400'
    : 'border-rose-400 bg-rose-50/70 hover:bg-rose-50/90 hover:border-rose-500 hover:shadow-md'

  const leftPx = element.x * canvasScale
  const topPx = htmlY * canvasScale
  const roundedX = Math.round(element.x)
  const roundedY = Math.round(element.y)

  // Calculate width - use maxWidth if set, otherwise auto
  const elementWidth = element.maxWidth ? element.maxWidth * canvasScale : 'auto'

  return (
    <div
      ref={elementRef}
      className={'absolute cursor-move border border-dashed px-2 py-1 text-xs font-mono select-none transition-all rounded ' + borderClass}
      style={{
        left: leftPx + 'px',
        top: topPx + 'px',
        width: elementWidth !== 'auto' ? elementWidth + 'px' : 'auto',
        minWidth: '60px',
        pointerEvents: 'auto'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-1 text-[10px]">
        <div className="text-slate-700 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          {element.path || <span className="text-slate-400 italic">No path</span>}
        </div>
      </div>

      {isSelected && (
        <>
          <div className="absolute -top-6 left-0 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded shadow-lg font-semibold flex items-center gap-1">
            <span>({roundedX}, {roundedY})</span>
            {element.maxWidth && <span>• {Math.round(element.maxWidth)}w</span>}
          </div>

          {/* Resize handle */}
          <div
            className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-blue-500 rounded-r cursor-ew-resize hover:bg-blue-600 transition-colors"
            onMouseDown={handleResizeMouseDown}
            title="Drag to resize width"
          />
        </>
      )}
    </div>
  )
}

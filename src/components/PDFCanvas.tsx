import React, { useEffect, useRef, useState } from 'react'
import type { DraggableElement } from '../types/template'
import { renderPDFToCanvas, renderPDFWithText } from '../utils/pdfUtils'

interface PDFCanvasProps {
  pdfBytes: Uint8Array | null
  elements: DraggableElement[]
  pdfPageDimensions: { width: number; height: number } | null
  canvasScale: number
  onPreviewPdfUpdate?: (bytes: Uint8Array | null) => void
  onPDFUpload?: (file: File) => void
}

export const PDFCanvas: React.FC<PDFCanvasProps> = ({
  pdfBytes,
  elements,
  pdfPageDimensions,
  canvasScale,
  onPreviewPdfUpdate,
  onPDFUpload
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [previewPdfBytes, setPreviewPdfBytes] = useState<Uint8Array | null>(null)

  // Regenerate PDF with text overlays whenever elements change (with debounce)
  useEffect(() => {
    if (!pdfBytes) return

    // Debounce PDF regeneration to avoid excessive re-renders
    const timeoutId = setTimeout(async () => {
      try {
        const modifiedBytes = await renderPDFWithText(pdfBytes, elements)
        setPreviewPdfBytes(modifiedBytes)
        onPreviewPdfUpdate?.(modifiedBytes)
      } catch (err) {
        console.error('Failed to regenerate PDF:', err)
        setPreviewPdfBytes(pdfBytes)
        onPreviewPdfUpdate?.(pdfBytes)
      }
    }, 300) // 300ms debounce delay

    return () => clearTimeout(timeoutId)
  }, [pdfBytes, elements, onPreviewPdfUpdate])

  // Render the preview PDF to canvas
  useEffect(() => {
    if (previewPdfBytes && canvasRef.current) {
      console.log('Rendering PDF to canvas...', { pdfBytes: previewPdfBytes.length })
      renderPDFToCanvas(previewPdfBytes, canvasRef.current, 1)
        .then(() => {
          console.log('PDF rendered successfully!')
        })
        .catch(err => {
          console.error('Failed to render PDF:', err)
          alert('Failed to render PDF. Check console for details.')
        })
    }
  }, [previewPdfBytes])

  if (!pdfBytes || !pdfPageDimensions) {
    return (
      <div className="flex-1 flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-12">
        <label className="w-full max-w-2xl border-4 border-dashed border-slate-300 rounded-2xl p-16 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file && file.type === 'application/pdf' && onPDFUpload) {
                onPDFUpload(file)
              }
            }}
            className="hidden"
          />
          <div className="text-center">
            <div className="text-8xl mb-6">📄</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Drop PDF Here</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Drag and drop a PDF file or click to browse
            </p>
            <div className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all">
              <span>📁</span>
              <span>Choose PDF File</span>
            </div>
          </div>
        </label>
      </div>
    )
  }

  const canvasWidth = pdfPageDimensions.width * canvasScale
  const canvasHeight = pdfPageDimensions.height * canvasScale

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-linear-to-br from-slate-100 via-slate-50 to-blue-50 p-12"
    >
      <div className="mb-4 flex items-center justify-center gap-4">
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">PDF Size:</span> {Math.round(pdfPageDimensions.width)} × {Math.round(pdfPageDimensions.height)}
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Elements:</span> {elements.length}
        </div>
      </div>

      <div
        className="relative mx-auto shadow-2xl bg-white rounded-lg overflow-hidden border-4 border-slate-200"
        style={{
          width: canvasWidth + 'px',
          height: canvasHeight + 'px'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            pointerEvents: 'auto',
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg text-sm text-blue-700 border border-blue-200">
          <span>💡</span>
          <span>Use the sidebar to add elements and enter sample text to preview how they'll appear</span>
        </div>
      </div>
    </div>
  )
}

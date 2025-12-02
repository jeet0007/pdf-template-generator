import { PDFDocument } from 'pdf-lib'

/**
 * Load PDF from file and return bytes
 */
export async function loadPDFFromFile(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

/**
 * Get PDF page dimensions
 */
export async function getPDFPageDimensions(
  pdfBytes: Uint8Array, 
  pageIndex: number = 0
): Promise<{ width: number; height: number }> {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const pages = pdfDoc.getPages()
  
  if (pageIndex >= pages.length) {
    throw new Error(`Page ${pageIndex} does not exist. PDF has ${pages.length} pages.`)
  }
  
  const page = pages[pageIndex]
  const { width, height } = page.getSize()
  
  return { width, height }
}

/**
 * Render PDF page to canvas
 */
export async function renderPDFToCanvas(
  pdfBytes: Uint8Array,
  canvas: HTMLCanvasElement,
  pageIndex: number = 0,
  scale: number = 1
): Promise<void> {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const pages = pdfDoc.getPages()
  
  if (pageIndex >= pages.length) {
    throw new Error(`Page ${pageIndex} does not exist. PDF has ${pages.length} pages.`)
  }
  
  const page = pages[pageIndex]
  const { width, height } = page.getSize()
  
  // Set canvas dimensions
  canvas.width = width * scale
  canvas.height = height * scale
  
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not get canvas context')
  }
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // For now, we'll create a simple placeholder
  // In a real implementation, you'd use a PDF rendering library like PDF.js
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Draw border
  ctx.strokeStyle = '#dee2e6'
  ctx.lineWidth = 1
  ctx.strokeRect(0, 0, canvas.width, canvas.height)
  
  // Add text to indicate this is a PDF preview
  ctx.fillStyle = '#6c757d'
  ctx.font = '16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(
    `PDF Page ${pageIndex + 1}`,
    canvas.width / 2,
    canvas.height / 2
  )
  ctx.fillText(
    `${Math.round(width)} x ${Math.round(height)}`,
    canvas.width / 2,
    canvas.height / 2 + 20
  )
}

/**
 * Convert PDF bytes to data URL for simple display
 * Note: This is a simplified approach. For production, consider using PDF.js
 */
export function createPDFDataURL(pdfBytes: Uint8Array): string {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  return URL.createObjectURL(blob)
}
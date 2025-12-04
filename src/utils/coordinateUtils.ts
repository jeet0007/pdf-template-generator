// Convert HTML Y coordinate (top-left origin) to PDF Y coordinate (bottom-left origin)
export function htmlToPdfY(htmlY: number, pdfHeight: number): number {
  return pdfHeight - htmlY
}

// Convert PDF Y coordinate (bottom-left origin) to HTML Y coordinate (top-left origin)
export function pdfToHtmlY(pdfY: number, pdfHeight: number): number {
  return pdfHeight - pdfY
}

// Snap a value to a grid
export function snapToGrid(value: number, gridSize: number = 5): number {
  return Math.round(value / gridSize) * gridSize
}

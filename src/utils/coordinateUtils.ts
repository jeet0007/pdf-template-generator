/**
 * Convert HTML canvas coordinates to PDF coordinates
 * HTML uses top-left origin, PDF uses bottom-left origin
 */
export function htmlToPDFCoordinates(
  htmlX: number,
  htmlY: number,
  canvasScale: number,
  pdfHeight: number
): { x: number; y: number } {
  // Convert from scaled HTML coordinates to PDF coordinates
  const pdfX = htmlX / canvasScale
  const pdfY = pdfHeight - (htmlY / canvasScale)
  
  return { x: pdfX, y: pdfY }
}

/**
 * Convert PDF coordinates to HTML canvas coordinates
 * PDF uses bottom-left origin, HTML uses top-left origin
 */
export function pdfToHTMLCoordinates(
  pdfX: number,
  pdfY: number,
  canvasScale: number,
  pdfHeight: number
): { x: number; y: number } {
  // Convert from PDF coordinates to scaled HTML coordinates
  const htmlX = pdfX * canvasScale
  const htmlY = (pdfHeight - pdfY) * canvasScale
  
  return { x: htmlX, y: htmlY }
}

/**
 * Snap coordinates to grid (optional helper)
 */
export function snapToGrid(value: number, gridSize: number = 5): number {
  return Math.round(value / gridSize) * gridSize
}

/**
 * Calculate bounding box for text element
 */
export function calculateTextBounds(
  x: number,
  y: number,
  maxWidth: number = 100,
  fontSize: number = 10,
  lineHeight: number = 1.2
): { x: number; y: number; width: number; height: number } {
  const height = fontSize * lineHeight
  
  return {
    x,
    y: y - height, // Adjust for text baseline
    width: maxWidth,
    height
  }
}

/**
 * Check if a point is within a bounding box
 */
export function isPointInBounds(
  pointX: number,
  pointY: number,
  bounds: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    pointX >= bounds.x &&
    pointX <= bounds.x + bounds.width &&
    pointY >= bounds.y &&
    pointY <= bounds.y + bounds.height
  )
}
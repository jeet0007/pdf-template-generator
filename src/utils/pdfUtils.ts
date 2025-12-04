import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import type { DraggableElement } from '../types/template'

// Set worker source for PDF.js - using local worker from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export interface PDFLoadResult {
  bytes: Uint8Array
  doc: PDFDocument
  firstPageDimensions: { width: number; height: number }
}

export async function loadPDF(file: File): Promise<PDFLoadResult> {
  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  const doc = await PDFDocument.load(bytes)

  const pages = doc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()

  return {
    bytes,
    doc,
    firstPageDimensions: { width, height }
  }
}

export async function renderPDFToCanvas(
  bytes: Uint8Array,
  canvas: HTMLCanvasElement,
  pageNumber: number = 1
): Promise<void> {
  // Load PDF document with PDF.js
  const loadingTask = pdfjsLib.getDocument({ data: bytes })
  const pdf = await loadingTask.promise

  // Get the first page
  const page = await pdf.getPage(pageNumber)

  // Get viewport at scale 1
  const viewport = page.getViewport({ scale: 1 })

  // Set canvas dimensions to match PDF page
  canvas.width = viewport.width
  canvas.height = viewport.height

  // Render PDF page into canvas context
  const context = canvas.getContext('2d')!
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    canvas: canvas
  }

  await page.render(renderContext).promise
}

export async function renderPDFWithText(
  originalBytes: Uint8Array,
  elements: DraggableElement[]
): Promise<Uint8Array> {
  // Load the PDF
  const pdfDoc = await PDFDocument.load(originalBytes)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]

  // Embed a standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Draw each text element
  for (const element of elements) {
    if (element.sampleText && element.sampleText.trim()) {
      const fontSize = element.size || 10
      const text = element.sampleText

      // Handle text wrapping if maxWidth is set
      if (element.maxWidth && element.handleMaxWidth) {
        const words = element.wordBreak ? text.split('') : text.split(' ')
        let currentLine = ''
        let yOffset = 0
        const lineHeight = element.lineHeight || fontSize * 1.2

        for (const word of words) {
          const testLine = currentLine + (currentLine ? (element.wordBreak ? '' : ' ') : '') + word
          const textWidth = font.widthOfTextAtSize(testLine, fontSize)

          if (textWidth > element.maxWidth && currentLine) {
            // Draw current line
            drawText(firstPage, font, currentLine, element, fontSize, yOffset)
            currentLine = word
            yOffset += lineHeight
          } else {
            currentLine = testLine
          }
        }

        // Draw remaining text
        if (currentLine) {
          drawText(firstPage, font, currentLine, element, fontSize, yOffset)
        }
      } else {
        // Draw single line
        drawText(firstPage, font, text, element, fontSize, 0)
      }
    }
  }

  // Save the PDF
  const modifiedBytes = await pdfDoc.save()
  return modifiedBytes
}

function drawText(
  page: any,
  font: any,
  text: string,
  element: DraggableElement,
  fontSize: number,
  yOffset: number
) {
  let x = element.x
  const y = element.y - yOffset

  // Handle alignment
  if (element.align === 'center' && element.maxWidth) {
    const textWidth = font.widthOfTextAtSize(text, fontSize)
    x = element.x + (element.maxWidth - textWidth) / 2
  } else if (element.align === 'right' && element.maxWidth) {
    const textWidth = font.widthOfTextAtSize(text, fontSize)
    x = element.x + element.maxWidth - textWidth
  }

  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0)
  })
}

import { useState } from 'react'
import './App.css'
import { Toolbar } from './components/Toolbar'
import { PDFCanvas } from './components/PDFCanvas'
import { ElementList } from './components/ElementList'
import type { DraggableElement, PDFTemplateConfig, PageItem, TextItemConfig } from './types/template'
import { loadPDF } from './utils/pdfUtils'

function App() {
  // PDF data
  const [, setPdfFile] = useState<File | null>(null)
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null)
  const [pdfPageDimensions, setPdfPageDimensions] = useState<{ width: number; height: number } | null>(null)
  const [previewPdfBytes, setPreviewPdfBytes] = useState<Uint8Array | null>(null)

  // Template configuration
  const [font, setFont] = useState('Sarabun-Regular.ttf')
  const [defaultSize] = useState(10)
  const [defaultLineHeight] = useState(12)

  // UI state
  const [elements, setElements] = useState<DraggableElement[]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  // Canvas state
  const [canvasScale] = useState(1)

  const handlePDFUpload = async (file: File) => {
    try {
      const result = await loadPDF(file)
      setPdfFile(file)
      setPdfBytes(result.bytes)
      setPdfPageDimensions(result.firstPageDimensions)
      setElements([])
      setSelectedElementId(null)
    } catch (error) {
      console.error('Failed to load PDF:', error)
      alert('Failed to load PDF. Please try another file.')
    }
  }

  const handleAddTextElement = () => {
    if (!pdfPageDimensions) return

    const newElement: DraggableElement = {
      id: crypto.randomUUID(),
      type: 'text',
      path: '',
      x: 50,
      y: pdfPageDimensions.height - 50,
      size: defaultSize,
      lineHeight: defaultLineHeight,
      align: 'left',
      maxWidth: 150  // Default width for new elements
    }

    setElements(prev => [...prev, newElement])
    setSelectedElementId(newElement.id)
  }

  const handleElementUpdate = (id: string, updates: Partial<TextItemConfig>) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...updates } : el))
    )
  }

  const handleElementDelete = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id))
    if (selectedElementId === id) {
      setSelectedElementId(null)
    }
  }

  const handleImportJSON = async (file: File) => {
    try {
      const text = await file.text()
      const config: PDFTemplateConfig = JSON.parse(text)

      // Validate the JSON structure
      if (!config.pages || !Array.isArray(config.pages) || config.pages.length === 0) {
        throw new Error('Invalid JSON: Missing or empty pages array')
      }

      // Update font if present
      if (config.font) {
        setFont(config.font)
      }

      // Convert first page items to DraggableElements
      const firstPageItems = config.pages[0]
      const newElements: DraggableElement[] = firstPageItems
        .filter(item => item.type === 'text')
        .map((item) => {
          const textItem = item as TextItemConfig
          return {
            id: crypto.randomUUID(),
            type: 'text' as const,
            path: textItem.path,
            x: textItem.x,
            y: textItem.y,
            maxWidth: textItem.maxWidth,
            handleMaxWidth: textItem.handleMaxWidth,
            align: textItem.align,
            wordBreak: textItem.wordBreak,
            size: textItem.size,
            lineHeight: textItem.lineHeight,
            sampleText: config.defaultValues?.[textItem.path] || ''
          }
        })

      setElements(newElements)
      setSelectedElementId(null)

      alert(`Successfully imported ${newElements.length} elements from template`)
    } catch (error) {
      console.error('Failed to import JSON:', error)
      alert('Failed to import JSON. Please check that the file is a valid template configuration.')
    }
  }

  const handleExportPDF = () => {
    if (!previewPdfBytes) {
      alert('No PDF preview available. Please add some sample text to elements first.')
      return
    }

    const blob = new Blob([previewPdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    a.download = 'preview-' + timestamp + '.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const pageItems: PageItem[] = elements.map(el => {
      const item: TextItemConfig = {
        type: 'text',
        path: el.path,
        x: el.x,
        y: el.y
      }

      if (el.maxWidth !== undefined) item.maxWidth = el.maxWidth
      if (el.handleMaxWidth !== undefined) item.handleMaxWidth = el.handleMaxWidth
      if (el.align) item.align = el.align
      if (el.wordBreak !== undefined) item.wordBreak = el.wordBreak
      if (el.size !== undefined) item.size = el.size
      if (el.lineHeight !== undefined) item.lineHeight = el.lineHeight

      return item
    })

    const config: PDFTemplateConfig = {
      font,
      drawTextOptions: {
        size: defaultSize,
        lineHeight: defaultLineHeight
      },
      defaultValues: {},
      pages: [pageItems]
    }

    const jsonString = JSON.stringify(config, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    a.download = 'template-' + timestamp + '.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-screen flex flex-col">
      <Toolbar
        font={font}
        onFontChange={setFont}
        onExportJSON={handleExportJSON}
        onExportPDF={handleExportPDF}
        onImportJSON={handleImportJSON}
        hasElements={elements.length > 0}
      />

      <div className="flex flex-1 overflow-hidden">
        <ElementList
          elements={elements}
          selectedElementId={selectedElementId}
          onElementUpdate={handleElementUpdate}
          onElementDelete={handleElementDelete}
          onElementSelect={setSelectedElementId}
          onAddElement={handleAddTextElement}
          hasPdf={pdfBytes !== null}
        />

        <PDFCanvas
          pdfBytes={pdfBytes}
          elements={elements}
          pdfPageDimensions={pdfPageDimensions}
          canvasScale={canvasScale}
          onPreviewPdfUpdate={setPreviewPdfBytes}
          onPDFUpload={handlePDFUpload}
        />
      </div>
    </div>
  )
}

export default App

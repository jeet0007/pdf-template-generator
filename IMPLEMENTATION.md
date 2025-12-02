# PDF Template Editor - Implementation Guide

## Project Overview

A standalone visual editor for creating PDF templates with drag-and-drop positioning. This tool allows users to load a PDF, add text elements, position them visually, and export a JSON configuration file that can be used with the mac-document-generator PDF service.

## Goals

- **Visual positioning**: Click and drag text elements directly on PDF preview
- **Real-time feedback**: See changes immediately as you adjust properties
- **Simple export**: Generate JSON in exact format expected by PDF service
- **Standalone**: Completely separate from main application, no backend needed
- **Type-safe**: Full TypeScript support for better developer experience

## Technology Stack

- **React 18** - Component-based UI framework
- **TypeScript** - Type safety and better IDE support
- **Vite** - Fast dev server and build tool
- **pdf-lib** - PDF manipulation and rendering
- **TailwindCSS** - Utility-first CSS framework

## Project Structure

```
pdf-template-generator/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Main application component
│   ├── App.css                     # TailwindCSS imports
│   ├── components/
│   │   ├── Toolbar.tsx             # Upload, add, export buttons
│   │   ├── PDFCanvas.tsx           # PDF viewer with overlay
│   │   ├── TextElement.tsx         # Draggable text box component
│   │   └── ElementList.tsx         # Left sidebar with form fields
│   ├── types/
│   │   └── template.ts             # TypeScript types matching PDF service
│   ├── utils/
│   │   ├── pdfUtils.ts             # PDF loading and rendering
│   │   └── coordinateUtils.ts     # HTML ↔ PDF coordinate conversion
│   └── hooks/
│       └── useDragAndDrop.ts       # Reusable drag-and-drop logic
└── IMPLEMENTATION.md               # This file
```

## Core Types (src/types/template.ts)

```typescript
export interface TextItemConfig {
  type: 'text'
  path: string
  x: number
  y: number
  maxWidth?: number
  handleMaxWidth?: boolean
  align?: 'left' | 'center' | 'right'
  wordBreak?: boolean
  size?: number
  lineHeight?: number
}

export interface ImageItemConfig {
  type: 'image'
  path: string
  x: number
  y: number
  width?: number
  height?: number
}

export type PageItem = TextItemConfig | ImageItemConfig

export interface PDFTemplateConfig {
  font?: string
  drawTextOptions?: {
    size: number
    lineHeight: number
  }
  defaultValues?: Record<string, string>
  pages: PageItem[][]
}

export interface DraggableElement extends TextItemConfig {
  id: string
}
```

## App State Structure (App.tsx)

```typescript
interface AppState {
  // PDF data
  pdfFile: File | null
  pdfBytes: Uint8Array | null
  pdfPageDimensions: { width: number; height: number } | null

  // Template configuration
  templateConfig: PDFTemplateConfig

  // UI state
  elements: DraggableElement[]
  selectedElementId: string | null

  // Canvas state
  canvasScale: number
}
```

## Component Specifications

### 1. Toolbar Component

**Purpose**: Top bar with main actions

**Props**: None (uses context or props from App)

**Features**:
- PDF file upload button
- Font selector dropdown (Sarabun/Helvetica)
- "Add Text Element" button
- "Export JSON" button
- Optional: "Import JSON" button (load existing templates)

**Implementation**:
```tsx
<div className="toolbar">
  <input
    type="file"
    accept=".pdf"
    onChange={handlePDFUpload}
  />
  <select value={font} onChange={handleFontChange}>
    <option value="Sarabun-Regular.ttf">Sarabun</option>
    <option value="Helvetica-Regular.ttf">Helvetica</option>
  </select>
  <button onClick={addTextElement}>+ Add Text Element</button>
  <button onClick={exportJSON}>Export JSON</button>
</div>
```

### 2. PDFCanvas Component

**Purpose**: Display PDF with draggable text element overlays

**Props**:
```typescript
interface PDFCanvasProps {
  pdfBytes: Uint8Array | null
  elements: DraggableElement[]
  selectedElementId: string | null
  onElementMove: (id: string, x: number, y: number) => void
  onElementSelect: (id: string) => void
  canvasScale: number
}
```

**Features**:
- Render PDF to canvas using pdf-lib
- Display draggable overlays for each text element
- Handle click-to-position for new elements
- Convert coordinates (HTML canvas uses top-left origin, PDF uses bottom-left)
- Show bounding boxes and selection highlights

**Coordinate Conversion**:
```typescript
// HTML Y (top-left origin) → PDF Y (bottom-left origin)
const pdfY = pdfHeight - htmlY

// PDF Y → HTML Y
const htmlY = pdfHeight - pdfY
```

**Key Implementation Details**:
- Use `<canvas>` for PDF rendering
- Overlay `<div>` elements with `position: absolute` for text boxes
- Scale coordinates based on canvas zoom level
- Snap to grid (optional): `Math.round(value / 5) * 5`

### 3. TextElement Component

**Purpose**: Individual draggable text box overlay

**Props**:
```typescript
interface TextElementProps {
  element: DraggableElement
  isSelected: boolean
  pdfHeight: number
  canvasScale: number
  onMove: (x: number, y: number) => void
  onSelect: () => void
}
```

**Features**:
- Draggable using mouse events
- Shows placeholder text or field path
- Visual feedback when selected (blue border)
- Bounding box shows dimensions

**Implementation**:
```tsx
<div
  className={`text-element ${isSelected ? 'selected' : ''}`}
  style={{
    position: 'absolute',
    left: element.x * canvasScale,
    top: (pdfHeight - element.y) * canvasScale,
    border: '1px dashed red',
    padding: '4px',
    cursor: 'move'
  }}
  onMouseDown={handleMouseDown}
>
  {element.path || 'Text'}
</div>
```

### 4. ElementList Component

**Purpose**: Left sidebar with form for editing selected element properties

**Props**:
```typescript
interface ElementListProps {
  elements: DraggableElement[]
  selectedElementId: string | null
  onElementUpdate: (id: string, updates: Partial<TextItemConfig>) => void
  onElementDelete: (id: string) => void
  onElementSelect: (id: string) => void
}
```

**Features**:
- List of all text elements
- Form fields for editing properties:
  - `path` (text input)
  - `x`, `y` (number inputs, read-only or editable)
  - `maxWidth` (number input)
  - `size` (number input)
  - `align` (dropdown: left/center/right)
  - `wordBreak` (checkbox)
  - `handleMaxWidth` (checkbox)
- Delete button for selected element
- Click to select element

**Form Layout**:
```tsx
<div className="element-list">
  <h3>Text Elements</h3>
  {elements.map(element => (
    <div
      key={element.id}
      className={selectedElementId === element.id ? 'selected' : ''}
      onClick={() => onElementSelect(element.id)}
    >
      <label>Path</label>
      <input
        value={element.path}
        onChange={e => onElementUpdate(element.id, { path: e.target.value })}
      />

      <label>X Position</label>
      <input
        type="number"
        value={element.x}
        onChange={e => onElementUpdate(element.id, { x: +e.target.value })}
      />

      <label>Y Position</label>
      <input
        type="number"
        value={element.y}
        onChange={e => onElementUpdate(element.id, { y: +e.target.value })}
      />

      <label>Max Width</label>
      <input
        type="number"
        value={element.maxWidth || ''}
        onChange={e => onElementUpdate(element.id, { maxWidth: +e.target.value })}
      />

      <label>Font Size</label>
      <input
        type="number"
        value={element.size || 10}
        onChange={e => onElementUpdate(element.id, { size: +e.target.value })}
      />

      <label>Alignment</label>
      <select
        value={element.align || 'left'}
        onChange={e => onElementUpdate(element.id, { align: e.target.value as any })}
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={element.wordBreak || false}
          onChange={e => onElementUpdate(element.id, { wordBreak: e.target.checked })}
        />
        Word Break
      </label>

      <button onClick={() => onElementDelete(element.id)}>Delete</button>
    </div>
  ))}
</div>
```

## Utility Functions

### pdfUtils.ts

```typescript
import { PDFDocument } from 'pdf-lib'

export async function loadPDF(file: File): Promise<{
  bytes: Uint8Array
  doc: PDFDocument
  firstPageDimensions: { width: number; height: number }
}> {
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
  pageNumber: number = 0
): Promise<void> {
  const pdfDoc = await PDFDocument.load(bytes)
  const pages = pdfDoc.getPages()
  const page = pages[pageNumber]

  const { width, height } = page.getSize()

  // Set canvas dimensions
  canvas.width = width
  canvas.height = height

  // Use pdf-lib to render (or integrate with PDF.js for better rendering)
  // Note: pdf-lib doesn't have built-in canvas rendering
  // You'll need to use PDF.js or convert to image

  // Alternative: Save as PNG and load as image
  const pngBytes = await page.getImage()
  const blob = new Blob([pngBytes], { type: 'image/png' })
  const url = URL.createObjectURL(blob)

  const img = new Image()
  img.onload = () => {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(img, 0, 0)
    }
    URL.revokeObjectURL(url)
  }
  img.src = url
}
```

### coordinateUtils.ts

```typescript
export function htmlToPdfY(htmlY: number, pdfHeight: number): number {
  return pdfHeight - htmlY
}

export function pdfToHtmlY(pdfY: number, pdfHeight: number): number {
  return pdfHeight - pdfY
}

export function snapToGrid(value: number, gridSize: number = 5): number {
  return Math.round(value / gridSize) * gridSize
}
```

### useDragAndDrop.ts

```typescript
import { useState, useCallback } from 'react'

export function useDragAndDrop() {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent, initialX: number, initialY: number) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - initialX, y: e.clientY - initialY })
    setCurrentPosition({ x: initialX, y: initialY })
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    setCurrentPosition({ x: newX, y: newY })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  return {
    isDragging,
    currentPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  }
}
```

## JSON Export Logic

```typescript
function exportJSON(elements: DraggableElement[], templateConfig: PDFTemplateConfig): void {
  // Build pages array (currently only supports single page)
  const pageItems: PageItem[] = elements.map(el => ({
    type: 'text',
    path: el.path,
    x: el.x,
    y: el.y,
    maxWidth: el.maxWidth,
    handleMaxWidth: el.handleMaxWidth,
    align: el.align,
    wordBreak: el.wordBreak,
    size: el.size,
    lineHeight: el.lineHeight
  }))

  const output: PDFTemplateConfig = {
    font: templateConfig.font || 'Sarabun-Regular.ttf',
    drawTextOptions: templateConfig.drawTextOptions || {
      size: 10,
      lineHeight: 12
    },
    defaultValues: templateConfig.defaultValues || {},
    pages: [pageItems]
  }

  // Create blob and download
  const jsonString = JSON.stringify(output, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `template-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

## Implementation Steps

### Phase 1: Project Setup
1. ✅ Initialize Vite + React + TypeScript project
2. ✅ Install dependencies (pdf-lib, tailwindcss)
3. Configure TailwindCSS
   - Update `tailwind.config.js` with content paths
   - Import TailwindCSS directives in `src/App.css`
4. Create basic project structure (components/, types/, utils/)

### Phase 2: Type Definitions
1. Create `src/types/template.ts` with all interfaces
2. Match types exactly to PDF service expectations
3. Add utility types for UI state (DraggableElement with id)

### Phase 3: PDF Loading & Rendering
1. Implement `pdfUtils.ts` functions
2. Create basic PDFCanvas component
3. Test PDF upload and canvas rendering
4. Handle errors (invalid PDF, loading failures)

### Phase 4: Drag and Drop
1. Create TextElement component with drag handlers
2. Implement useDragAndDrop hook
3. Add coordinate conversion logic
4. Test dragging on canvas
5. Add visual feedback (selection, bounding boxes)

### Phase 5: Form Controls
1. Create ElementList component
2. Add form inputs for all properties
3. Connect form updates to state
4. Add validation (required fields, number ranges)

### Phase 6: Export Functionality
1. Implement JSON export logic
2. Add download trigger
3. Test with PDF service (manual verification)
4. Add import functionality (optional)

### Phase 7: Polish
1. Add TailwindCSS styling
2. Improve layout and responsiveness
3. Add keyboard shortcuts (Delete, Esc, Arrow keys)
4. Add undo/redo (optional)
5. Add zoom controls for canvas

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing Checklist

- [ ] Upload various PDF files (single page, multi-page)
- [ ] Add multiple text elements
- [ ] Drag elements to different positions
- [ ] Edit all form fields (path, x, y, maxWidth, etc.)
- [ ] Delete elements
- [ ] Export JSON and verify format
- [ ] Import JSON and verify elements load correctly
- [ ] Test coordinate conversion accuracy
- [ ] Test with different PDF sizes
- [ ] Verify exported JSON works with PDF service

## Known Limitations & Future Enhancements

**Current Limitations**:
- Single page support only (first page of PDF)
- Text elements only (no image support yet)
- No preview of actual rendered text (just bounding boxes)
- No font preview (requires embedding fonts in browser)

**Future Enhancements**:
- Multi-page support
- Image element support
- Real-time PDF generation with actual text rendering
- Grid/snap-to-guides
- Keyboard shortcuts
- Undo/redo
- Template library/presets
- Zoom and pan controls
- Ruler and measurement tools

## Troubleshooting

**PDF doesn't render**:
- Check browser console for errors
- Verify PDF file is valid
- pdf-lib may not support all PDF features

**Coordinates are off**:
- Ensure coordinate conversion is correct (HTML top-left vs PDF bottom-left)
- Check canvas scaling factor
- Verify PDF dimensions match canvas dimensions

**Drag and drop doesn't work**:
- Check mouse event handlers are attached
- Verify event propagation isn't blocked
- Test on different browsers

**Exported JSON doesn't work with PDF service**:
- Compare exported JSON structure with working examples
- Check for missing required fields
- Verify coordinate values are reasonable

## Contact & Support

For questions or issues with implementation, refer to the brainstorming conversation that created this document or consult the mac-document-generator PDF service documentation for JSON format requirements.

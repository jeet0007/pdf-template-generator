// Types matching the PDF service expectations
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

// UI-specific types
export interface DraggableElement extends TextItemConfig {
  id: string
  sampleText?: string  // Sample text for preview
}

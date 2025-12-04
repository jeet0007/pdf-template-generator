# PDF Template Generator

A visual editor for creating PDF templates with drag-and-drop positioning. Design your PDF templates visually and export them as JSON configurations for use with PDF generation services.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

### PDF Management
- 📄 **Drag-and-Drop PDF Upload** - Large, intuitive drop area for uploading PDF files
- 👁️ **Live PDF Preview** - Real-time canvas rendering with pdfjs-dist
- 📏 **Automatic Dimension Detection** - Automatically detects PDF page dimensions
- ⚡ **Optimized Rendering** - 300ms debounce for smooth performance

### Text Element Editor
- ➕ **Add Text Elements** - Quick-add button in sidebar to create new text fields
- 🎯 **Visual Positioning** - Set precise X/Y coordinates with number inputs
- 📝 **Sample Text Preview** - Enter sample text to see how it renders on the PDF
- 🗑️ **Element Management** - Select, edit, and delete text elements with ease

### Advanced Text Properties
- 📏 **Max Width Control** - Set maximum width for text wrapping
- ↔️ **Text Alignment** - Left, center, or right alignment
- 🔤 **Word Breaking** - Character-level or word-level text breaking
- 📐 **Line Height** - Customize line spacing for multi-line text
- 🎨 **Font Size** - Adjust font size per element
- 🔧 **Handle Max Width** - Toggle automatic text wrapping behavior

### Font Support
- 🔤 **Multiple Fonts** - Choose between Sarabun and Helvetica
- 🎯 **Accurate Rendering** - Uses pdf-lib for exact coordinate placement

### Import/Export
- 📥 **Import JSON Configuration** - Load existing template configurations
- 💾 **Export JSON Template** - Download template configuration with timestamped filenames
- 📄 **Export Preview PDF** - Download PDF preview with rendered sample text
- 🎯 **Dropdown Export Menu** - Clean UI combining all export options

### User Interface
- 🎨 **Modern Design** - Beautiful gradient UI with TailwindCSS v4
- 📱 **Responsive Layout** - Three-column layout (sidebar, canvas, properties)
- ⚙️ **Properties Panel** - Comprehensive element configuration panel
- 🏷️ **Element Labels** - Easy-to-identify element numbering and path display
- ✨ **Smooth Transitions** - Polished hover effects and animations

## How It Works

1. **Upload a PDF** - Drag and drop a PDF file onto the canvas area
2. **Add Text Elements** - Click the "+" button in the sidebar to create text elements
3. **Position Elements** - Use the properties panel to set X/Y coordinates
4. **Configure Properties** - Set path, alignment, max width, font size, and more
5. **Preview with Sample Text** - Enter sample text to see real-time preview on the PDF
6. **Export Configuration** - Download JSON template or preview PDF

## Tech Stack

- **React 19** - UI framework with latest hooks
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool and dev server
- **TailwindCSS v4** - Utility-first CSS framework (@tailwindcss/postcss)
- **pdf-lib** - PDF manipulation and text rendering
- **pdfjs-dist** - PDF preview rendering to canvas

## JSON Template Format

The exported JSON follows this structure:

```json
{
  "font": "Sarabun-Regular.ttf",
  "drawTextOptions": {
    "size": 10,
    "lineHeight": 12
  },
  "defaultValues": {},
  "pages": [
    [
      {
        "type": "text",
        "path": "data.fieldName",
        "x": 50,
        "y": 750,
        "maxWidth": 200,
        "handleMaxWidth": true,
        "align": "left",
        "wordBreak": false,
        "size": 12,
        "lineHeight": 14
      }
    ]
  ]
}
```

### Template Properties

- `font` - Font file name (e.g., "Sarabun-Regular.ttf", "Helvetica-Regular.ttf")
- `drawTextOptions` - Default text rendering options
- `defaultValues` - Optional default values for paths
- `pages` - Array of pages, each containing an array of text items

### Text Item Properties

- `type` - Always "text" for text elements
- `path` - JSON path to data field (e.g., "data.customerName")
- `x` - X coordinate (bottom-left origin)
- `y` - Y coordinate (bottom-left origin)
- `maxWidth` - Maximum width in points (optional)
- `handleMaxWidth` - Enable automatic text wrapping (optional)
- `align` - Text alignment: "left", "center", or "right" (optional)
- `wordBreak` - Character-level breaking instead of word-level (optional)
- `size` - Font size in points (optional)
- `lineHeight` - Line height in points (optional)

## Development

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── Toolbar.tsx          # Top toolbar with font selector and export menu
│   ├── ElementList.tsx      # Sidebar with element list and properties panel
│   └── PDFCanvas.tsx        # Main canvas with PDF preview
├── types/
│   └── template.ts          # TypeScript type definitions
├── utils/
│   └── pdfUtils.ts          # PDF loading and rendering utilities
├── App.tsx                  # Main application component
└── main.tsx                 # Application entry point
```

## Related Projects

This tool generates JSON templates for use with PDF generation services that support the template format described above.

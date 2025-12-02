# PDF Template Generator

Visual editor for creating PDF templates with drag-and-drop positioning.

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Initialize TailwindCSS config
npx tailwindcss init -p

# Start development server
npm run dev
```

## What This Does

1. **Upload a PDF file** - Load any PDF as your template base
2. **Add text elements** - Create draggable text boxes on the PDF
3. **Position visually** - Click and drag to place elements precisely
4. **Configure properties** - Set path, x/y position, maxWidth, alignment, word breaking, etc.
5. **Export JSON** - Download template configuration for mac-document-generator

## Project Status

- ✅ Vite + React + TypeScript initialized
- ✅ Dependencies installed (pdf-lib, tailwindcss)
- ✅ Detailed implementation guide created
- ⏳ Ready for implementation

## Documentation

See **IMPLEMENTATION.md** for comprehensive guide including:
- Complete architecture overview
- Detailed component specifications with code examples
- TypeScript type definitions
- Utility functions and hooks
- Step-by-step implementation plan
- Testing checklist
- Troubleshooting guide

## Features

- 📄 Visual PDF template editing
- 🎯 Drag-and-drop positioning
- 📝 Full property configuration (maxWidth, alignment, word breaking)
- 💾 JSON export in mac-document-generator format
- 🎨 TailwindCSS styling
- 🔒 Full TypeScript support
- 🚀 Fast development with Vite HMR

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **pdf-lib** - PDF manipulation
- **TailwindCSS** - Utility-first CSS

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

## Next Steps

1. Configure TailwindCSS (see IMPLEMENTATION.md Phase 1)
2. Create type definitions (Phase 2)
3. Implement PDF loading and rendering (Phase 3)
4. Build drag-and-drop functionality (Phase 4)
5. Create form controls (Phase 5)
6. Add JSON export (Phase 6)
7. Polish and style (Phase 7)

## Related Projects

This tool generates JSON templates for use with:
- [mac-document-generator](../mac-document-generator) - PDF generation service

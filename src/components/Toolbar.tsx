import React from 'react'

interface ToolbarProps {
  onPDFUpload: (file: File) => void
  font: string
  onFontChange: (font: string) => void
  onAddTextElement: () => void
  onExportJSON: () => void
  hasElements: boolean
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onPDFUpload,
  font,
  onFontChange,
  onAddTextElement,
  onExportJSON,
  hasElements
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      onPDFUpload(file)
    }
  }

  return (
    <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white px-6 py-4 shadow-xl border-b border-slate-700">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
            📄
          </div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            PDF Template Editor
          </h1>
        </div>

        <div className="h-8 w-px bg-slate-600" />

        <label className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:scale-105 font-medium">
          <span className="text-lg">📁</span>
          <span>Upload PDF</span>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-300 font-medium">Font:</label>
          <select
            value={font}
            onChange={(e) => onFontChange(e.target.value)}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option value="Sarabun-Regular.ttf">Sarabun</option>
            <option value="Helvetica-Regular.ttf">Helvetica</option>
          </select>
        </div>

        <button
          onClick={onAddTextElement}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all hover:shadow-lg hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={!hasElements && hasElements !== false}
        >
          <span className="text-lg mr-1">+</span> Add Text Element
        </button>

        <div className="flex-1" />

        <button
          onClick={onExportJSON}
          className="px-6 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={!hasElements}
        >
          <span className="text-lg mr-1">💾</span> Export JSON
        </button>
      </div>
    </div>
  )
}

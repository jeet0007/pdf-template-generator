import React, { useState } from 'react'

interface ToolbarProps {
  font: string
  onFontChange: (font: string) => void
  onExportJSON: () => void
  onExportPDF: () => void
  onImportJSON: (file: File) => void
  hasElements: boolean
}

export const Toolbar: React.FC<ToolbarProps> = ({
  font,
  onFontChange,
  onExportJSON,
  onExportPDF,
  onImportJSON,
  hasElements
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false)

  const handleJSONImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/json') {
      onImportJSON(file)
    }
  }

  const handleExportClick = (type: 'json' | 'pdf') => {
    setShowExportMenu(false)
    if (type === 'json') {
      onExportJSON()
    } else {
      onExportPDF()
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

        <div className="flex-1" />

        <label className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:scale-105 font-medium">
          <span className="text-lg">📥</span>
          <span>Import JSON</span>
          <input
            type="file"
            accept=".json"
            onChange={handleJSONImport}
            className="hidden"
          />
        </label>

        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={!hasElements}
          >
            <span className="text-lg">💾</span>
            <span>Export</span>
            <span className="text-lg">▼</span>
          </button>

          {showExportMenu && hasElements && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-20">
                <button
                  onClick={() => handleExportClick('json')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors text-left text-slate-700 hover:text-purple-700"
                >
                  <span className="text-lg">📋</span>
                  <div>
                    <div className="font-semibold">Export JSON</div>
                    <div className="text-xs text-slate-500">Template configuration</div>
                  </div>
                </button>
                <div className="h-px bg-slate-200" />
                <button
                  onClick={() => handleExportClick('pdf')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-left text-slate-700 hover:text-green-700"
                >
                  <span className="text-lg">📄</span>
                  <div>
                    <div className="font-semibold">Export PDF</div>
                    <div className="text-xs text-slate-500">Preview with sample text</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import type { DraggableElement, TextItemConfig } from '../types/template'

interface ElementListProps {
  elements: DraggableElement[]
  selectedElementId: string | null
  onElementUpdate: (id: string, updates: Partial<TextItemConfig>) => void
  onElementDelete: (id: string) => void
  onElementSelect: (id: string) => void
}

export const ElementList: React.FC<ElementListProps> = ({
  elements,
  selectedElementId,
  onElementUpdate,
  onElementDelete,
  onElementSelect
}) => {
  if (elements.length === 0) {
    return (
      <div className="w-96 bg-slate-50 border-r border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📝</span>
          <h2 className="text-xl font-bold text-slate-800">Text Elements</h2>
        </div>
        <div className="bg-white rounded-lg p-6 border-2 border-dashed border-slate-300 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-600 font-medium mb-1">No elements yet</p>
          <p className="text-slate-400 text-sm">Add a text element to get started</p>
        </div>
      </div>
    )
  }

  const selectedElement = elements.find(el => el.id === selectedElementId)

  return (
    <div className="w-96 bg-slate-50 border-r border-slate-200 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">📝</span>
          <h2 className="text-xl font-bold text-slate-800">Elements</h2>
          <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {elements.length}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          {elements.map((element, index) => {
            const isSelected = selectedElementId === element.id
            return (
              <div
                key={element.id}
                className={'p-4 rounded-xl cursor-pointer border-2 transition-all ' +
                  (isSelected
                    ? 'bg-blue-50 border-blue-500 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-sm')}
                onClick={() => onElementSelect(element.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏷️</span>
                    <div className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      #{index + 1}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full">
                      Selected
                    </div>
                  )}
                </div>
                <div className="font-semibold text-slate-800 truncate mb-1">
                  {element.path || <span className="text-slate-400 italic">No path set</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    <span className="font-mono">({Math.round(element.x)}, {Math.round(element.y)})</span>
                  </span>
                  {element.size && (
                    <span className="flex items-center gap-1">
                      <span>🔤</span>
                      <span className="font-mono">{element.size}pt</span>
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {selectedElement && (
          <div className="border-t-2 border-slate-300 pt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                <h3 className="font-bold text-slate-800 text-lg">Properties</h3>
              </div>
              <button
                onClick={() => onElementDelete(selectedElement.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all hover:shadow-lg font-medium"
              >
                🗑️ Delete
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">🏷️ Path</label>
                <input
                  type="text"
                  value={selectedElement.path}
                  onChange={e => onElementUpdate(selectedElement.id, { path: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="data.fieldName"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">📝 Sample Text (Preview)</label>
                <input
                  type="text"
                  value={selectedElement.sampleText || ''}
                  onChange={e => onElementUpdate(selectedElement.id, { sampleText: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter sample text to preview"
                />
                <p className="text-xs text-slate-500 mt-1">This text will be rendered on the PDF preview</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">📍 X Position</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={e => onElementUpdate(selectedElement.id, { x: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">📍 Y Position</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={e => onElementUpdate(selectedElement.id, { y: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">📏 Max Width</label>
                <input
                  type="number"
                  value={selectedElement.maxWidth || ''}
                  onChange={e => onElementUpdate(selectedElement.id, { maxWidth: parseFloat(e.target.value) || undefined })}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                  placeholder="Optional"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">🔤 Font Size</label>
                  <input
                    type="number"
                    value={selectedElement.size || 10}
                    onChange={e => onElementUpdate(selectedElement.id, { size: parseFloat(e.target.value) || 10 })}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">📐 Line Height</label>
                  <input
                    type="number"
                    value={selectedElement.lineHeight || 12}
                    onChange={e => onElementUpdate(selectedElement.id, { lineHeight: parseFloat(e.target.value) || 12 })}
                    className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">↔️ Alignment</label>
                <select
                  value={selectedElement.align || 'left'}
                  onChange={e => onElementUpdate(selectedElement.id, { align: e.target.value as 'left' | 'center' | 'right' })}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer bg-white"
                >
                  <option value="left">⬅️ Left</option>
                  <option value="center">↔️ Center</option>
                  <option value="right">➡️ Right</option>
                </select>
              </div>

              <div className="bg-slate-100 rounded-lg p-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedElement.wordBreak || false}
                    onChange={e => onElementUpdate(selectedElement.id, { wordBreak: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-700">🔤 Word Break</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedElement.handleMaxWidth || false}
                    onChange={e => onElementUpdate(selectedElement.id, { handleMaxWidth: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-700">📏 Handle Max Width</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

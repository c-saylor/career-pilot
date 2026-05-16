import { useState, useEffect } from 'react'
import type { Resume } from '../../types'

interface Props {
  resume?: Resume | null
  onSave: (data: Partial<Resume>) => void
  onDelete?: (id: string) => void
  onClose: () => void
}

export default function ResumeModal({ resume, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    if (resume) {
      setTitle(resume.title ?? '')
      setContent(resume.content ?? '')
      setTags(resume.tags ?? '')
    }
  }, [resume])

  function handleSave() {
    if (!title) return
    onSave({ title, content, tags })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-white font-bold text-lg">
            {resume ? 'Edit Resume' : 'Add Resume'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-slate-400 text-xs block mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Engineer v2"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-400 text-xs block mb-1">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Frontend, React, TypeScript"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <p className="text-slate-500 text-xs mt-1">Separate tags with commas</p>
          </div>

          <div>
            <label className="text-slate-400 text-xs block mb-1">Resume Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your resume content here..."
              rows={10}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none font-mono"
            />
            <p className="text-slate-500 text-xs mt-1">
              Paste your resume as plain text — this is what the AI will use for tailoring suggestions
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-700">
          <div>
            {resume && onDelete && (
              <button
                onClick={() => {
                  onDelete(resume.id)
                  onClose()
                }}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {resume ? 'Save changes' : 'Add resume'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
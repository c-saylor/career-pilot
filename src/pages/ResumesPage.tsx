import { useState } from 'react'
import { useResumes } from '../hooks/useResumes'
import ResumeCard from '../components/resumes/ResumeCard'
import ResumeModal from '../components/resumes/ResumeModal'
import type { Resume } from '../types'
import { supabase } from '../lib/supabase'

export default function ResumesPage() {
  const { resumes, isLoading, createResume, updateResume, deleteResume } = useResumes()
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNewResume, setIsNewResume] = useState(false)

  function handleResumeClick(resume: Resume) {
    setSelectedResume(resume)
    setIsNewResume(false)
    setIsModalOpen(true)
  }

  function handleAddResume() {
    setSelectedResume(null)
    setIsNewResume(true)
    setIsModalOpen(true)
  }

  async function handleSave(data: Partial<Resume>) {
    if (isNewResume) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      createResume({
        ...data,
        user_id: user.id,
        title: data.title ?? '',
        content: data.content ?? '',
        tags: data.tags ?? '',
      })
    } else if (selectedResume) {
      updateResume({ id: selectedResume.id, ...data })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400 text-sm">Loading resumes...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-bold">Resumes</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {resumes.length} version{resumes.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <button
          onClick={handleAddResume}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Resume
        </button>
      </div>

      {/* Resume grid */}
      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-700 rounded-xl">
          <p className="text-slate-400 text-sm mb-2">No resumes yet</p>
          <p className="text-slate-500 text-xs mb-4">
            Add a resume version to get started with AI tailoring
          </p>
          <button
            onClick={handleAddResume}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            + Add your first resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onClick={handleResumeClick}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ResumeModal
          resume={isNewResume ? null : selectedResume}
          onSave={handleSave}
          onDelete={(id) => deleteResume(id)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
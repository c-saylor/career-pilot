import { useState } from 'react'
import { useResumes } from '../../hooks/useResumes'
import { useJobs } from '../../hooks/useJobs'
import { tailorResume } from '../../lib/groq'

interface TailorResult {
  improvedBullets: { original: string; improved: string }[]
  missingKeywords: string[]
  recommendations: string[]
}

export default function ResumeTailor() {
  const { resumes } = useResumes()
  const { jobs } = useJobs()
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [selectedJobId, setSelectedJobId] = useState('')
  const [result, setResult] = useState<TailorResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedResume = resumes.find((r) => r.id === selectedResumeId)
  const selectedJob = jobs.find((j) => j.id === selectedJobId)

  async function handleTailor() {
    if (!selectedResume || !selectedJob?.job_description) return
    setLoading(true)
    setError(null)
    try {
      const tailored = await tailorResume(
        selectedResume.content,
        selectedJob.job_description
      )
      setResult(tailored)
    } catch (err: any) {
      setError('Failed to tailor resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canTailor =
    selectedResume &&
    selectedJob?.job_description &&
    !loading

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Input panel */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-white font-medium text-sm mb-1">Resume Tailor</h3>
          <p className="text-slate-400 text-xs mb-4">
            Select a resume and a job to get AI-powered optimization suggestions
          </p>

          {/* Resume select */}
          <div className="mb-4">
            <label className="text-slate-400 text-xs block mb-1">Select Resume</label>
            {resumes.length === 0 ? (
              <p className="text-slate-500 text-xs">
                No resumes saved yet — add one in the Resumes section
              </p>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose a resume...</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Job select */}
          <div className="mb-4">
            <label className="text-slate-400 text-xs block mb-1">Select Job</label>
            {jobs.length === 0 ? (
              <p className="text-slate-500 text-xs">
                No jobs saved yet — add one in the Board section
              </p>
            ) : (
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose a job...</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.company} — {j.role}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected info */}
          {selectedResume && (
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 mb-4">
              <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">
                Resume preview
              </p>
              <p className="text-slate-300 text-xs line-clamp-4 leading-relaxed">
                {selectedResume.content || 'No content added to this resume yet.'}
              </p>
            </div>
          )}

          {selectedJob && !selectedJob.job_description && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-lg p-3 mb-4">
              This job has no description saved. Edit the job card on the board to add one.
            </div>
          )}

          <button
            onClick={handleTailor}
            disabled={!canTailor}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Tailoring...' : 'Tailor Resume'}
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results panel */}
      <div className="flex flex-col gap-4">
        {!result && !loading && (
          <div className="flex items-center justify-center h-full border border-dashed border-slate-700 rounded-xl">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-1">No suggestions yet</p>
              <p className="text-slate-500 text-xs">
                Select a resume and job then click tailor
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-sm">Tailoring with Groq...</p>
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-4 overflow-y-auto">
            {/* Improved bullets */}
            {result.improvedBullets.length > 0 && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h4 className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">
                  Improved Bullet Points
                </h4>
                <div className="flex flex-col gap-4">
                  {result.improvedBullets.map((bullet, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="bg-slate-800 rounded p-2">
                        <p className="text-xs text-red-400 font-mono mb-1">before</p>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {bullet.original}
                        </p>
                      </div>
                      <div className="bg-green-500/5 border border-green-500/20 rounded p-2">
                        <p className="text-xs text-green-400 font-mono mb-1">improved</p>
                        <p className="text-slate-200 text-xs leading-relaxed">
                          {bullet.improved}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing keywords */}
            {result.missingKeywords.length > 0 && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h4 className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full font-mono"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h4 className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec) => (
                    <li key={rec} className="text-slate-300 text-xs flex gap-2">
                      <span className="text-blue-400 mt-0.5">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
import { useState } from 'react'
import { analyzeJobDescription } from '../../lib/groq'

interface AnalysisResult {
  requiredSkills: string[]
  responsibilities: string[]
  atsKeywords: string[]
  gaps: string[]
  summary: string
}

export default function AIAnalyzer() {
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze() {
    if (!jobDescription.trim()) return
    setLoading(true)
    setError(null)
    try {
      const analysis = await analyzeJobDescription(jobDescription)
      setResult(analysis)
    } catch (err: any) {
      setError('Failed to analyze job description. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Input panel */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-white font-medium text-sm mb-1">Job Description</h3>
          <p className="text-slate-400 text-xs mb-3">
            Paste a job description to extract skills, keywords, and insights
          </p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={16}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none font-mono"
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !jobDescription.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Analyzing...' : 'Analyze Job Description'}
        </button>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3">
            {error}
          </div>
        )}
      </div>

      {/* Results panel */}
      <div className="flex flex-col gap-4">
        {!result && !loading && (
          <div className="flex items-center justify-center h-full border border-dashed border-slate-700 rounded-xl">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-1">No analysis yet</p>
              <p className="text-slate-500 text-xs">
                Paste a job description and click analyze
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 text-sm">Analyzing with Groq...</p>
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-4 overflow-y-auto">
            {/* Summary */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
              <h4 className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                Summary
              </h4>
              <p className="text-white text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Required skills */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
              <h4 className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* ATS Keywords */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
              <h4 className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">
                ATS Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.atsKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full font-mono"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
              <h4 className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">
                Key Responsibilities
              </h4>
              <ul className="space-y-2">
                {result.responsibilities.map((r) => (
                  <li key={r} className="text-slate-300 text-xs flex gap-2">
                    <span className="text-blue-400 mt-0.5">→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            {result.gaps.length > 0 && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h4 className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">
                  Potential Gaps
                </h4>
                <ul className="space-y-2">
                  {result.gaps.map((gap) => (
                    <li key={gap} className="text-slate-300 text-xs flex gap-2">
                      <span className="text-amber-400 mt-0.5">⚠</span>
                      {gap}
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
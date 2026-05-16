import { useState } from 'react'
import AIAnalyzer from '../components/ai/AIAnalyzer'
import ResumeTailor from '../components/ai/ResumeTailor'

type AITool = 'analyzer' | 'tailor'

export default function AIPage() {
  const [activeTool, setActiveTool] = useState<AITool>('analyzer')

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-white text-xl font-bold">AI Tools</h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Powered by Google Groq
        </p>
      </div>

      {/* Tool tabs */}
      <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1 w-fit mb-6">
        <button
          onClick={() => setActiveTool('analyzer')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTool === 'analyzer'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Job Analyzer
        </button>
        <button
          onClick={() => setActiveTool('tailor')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTool === 'tailor'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Resume Tailor
        </button>
      </div>

      {/* Active tool */}
      {activeTool === 'analyzer' && <AIAnalyzer />}
      {activeTool === 'tailor' && <ResumeTailor />}
    </div>
  )
}
import type { Resume } from '../../types'

interface Props {
  resume: Resume
  onClick: (resume: Resume) => void
}

export default function ResumeCard({ resume, onClick }: Props) {
  const tags = resume.tags ? resume.tags.split(',').map((t) => t.trim()) : []

  return (
    <div
      onClick={() => onClick(resume)}
      className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-slate-500 transition-colors"
    >
      {/* Title */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-medium text-sm">{resume.title}</h3>
        <span className="text-slate-500 text-xs font-mono">
          {new Date(resume.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Content preview */}
      {resume.content && (
        <p className="text-slate-400 text-xs line-clamp-3 mb-3 leading-relaxed">
          {resume.content}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
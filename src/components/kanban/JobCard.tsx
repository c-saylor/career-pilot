import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { JobApplication } from '../../types'

interface Props {
  job: JobApplication
  onClick: (job: JobApplication) => void
}

export default function JobCard({ job, onClick }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(job)}
      className="bg-slate-900 border border-slate-700 rounded-lg p-3 cursor-pointer hover:border-slate-500 transition-colors"
    >
      <p className="text-slate-400 text-xs font-mono mb-1">{job.company}</p>
      <p className="text-white text-sm font-medium leading-snug">{job.role}</p>
      {job.date_applied && (
        <p className="text-slate-500 text-xs font-mono mt-2">{job.date_applied}</p>
      )}
      {job.notes && (
        <p className="text-slate-400 text-xs mt-2 line-clamp-2">{job.notes}</p>
      )}
    </div>
  )
}
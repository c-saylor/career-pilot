import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { JobApplication, ApplicationStatus } from '../../types'
import JobCard from './JobCard'

interface Props {
  status: ApplicationStatus
  jobs: JobApplication[]
  onJobClick: (job: JobApplication) => void
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
  saved: { label: 'Saved', color: 'bg-slate-500' },
  applied: { label: 'Applied', color: 'bg-blue-500' },
  interviewing: { label: 'Interviewing', color: 'bg-purple-500' },
  offer: { label: 'Offer', color: 'bg-green-500' },
  rejected: { label: 'Rejected', color: 'bg-red-500' },
}

export default function KanbanColumn({ status, jobs, onJobClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const config = statusConfig[status]

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-slate-800 rounded-xl border transition-colors ${
        isOver ? 'border-blue-500' : 'border-slate-700'
      }`}
      style={{ minHeight: '500px' }}
    >
      {/* Column header */}
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.color}`} />
          <span className="text-slate-300 text-xs font-medium uppercase tracking-wider font-mono">
            {config.label}
          </span>
        </div>
        <span className="text-slate-500 text-xs font-mono bg-slate-900 px-2 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>

      {/* Cards */}
      <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 p-2 flex-1">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onClick={onJobClick} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
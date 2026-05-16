import { useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { JobApplication, ApplicationStatus } from '../../types'
import { useJobs } from '../../hooks/useJobs'
import KanbanColumn from './KanbanColumn'
import JobCard from './JobCard'
import JobModal from './JobModal'
import { supabase } from '../../lib/supabase'

const STATUSES: ApplicationStatus[] = [
  'saved',
  'applied',
  'interviewing',
  'offer',
  'rejected',
]

export default function KanbanBoard() {
  const { jobs, isLoading, createJob, updateJob, deleteJob } = useJobs()
  const [activeJob, setActiveJob] = useState<JobApplication | null>(null)
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNewJob, setIsNewJob] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const job = jobs.find((j) => j.id === event.active.id)
    if (job) setActiveJob(job)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveJob(null)
    if (!over) return

    const job = jobs.find((j) => j.id === active.id)
    if (!job) return

    const newStatus = over.id as ApplicationStatus
    if (STATUSES.includes(newStatus) && job.status !== newStatus) {
      updateJob({ id: job.id, status: newStatus })
    }
  }

  function handleJobClick(job: JobApplication) {
    setSelectedJob(job)
    setIsNewJob(false)
    setIsModalOpen(true)
  }

  function handleAddJob() {
    setSelectedJob(null)
    setIsNewJob(true)
    setIsModalOpen(true)
  }

  async function handleSave(data: Partial<JobApplication>) {
    if (isNewJob) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      createJob({
        ...data,
        user_id: user.id,
        status: data.status ?? 'saved',
        company: data.company ?? '',
        role: data.role ?? '',
        url: data.url ?? '',
        notes: data.notes ?? '',
        date_applied: data.date_applied || null,
        job_description: data.job_description ?? '',
        resume_id: null,
      })
    } else if (selectedJob) {
      updateJob({ id: selectedJob.id, ...data })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400 text-sm">Loading jobs...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-bold">Application Board</h2>
          <p className="text-slate-400 text-sm mt-0.5">{jobs.length} applications tracked</p>
        </div>
        <button
          onClick={handleAddJob}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Application
        </button>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-5 gap-3">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              jobs={jobs.filter((j) => j.status === status)}
              onJobClick={handleJobClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeJob && (
            <JobCard job={activeJob} onClick={() => {}} />
          )}
        </DragOverlay>
      </DndContext>

      {/* Modal */}
      {isModalOpen && (
        <JobModal
          job={isNewJob ? null : selectedJob}
          onSave={handleSave}
          onDelete={(id) => deleteJob(id)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
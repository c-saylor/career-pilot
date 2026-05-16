import { create } from 'zustand'
import type { JobApplication, Resume } from '../types'

interface AppState {
  // Data
  jobs: JobApplication[]
  resumes: Resume[]

  // UI state
  selectedJobId: string | null
  isJobModalOpen: boolean

  // Actions
  setJobs: (jobs: JobApplication[]) => void
  setResumes: (resumes: Resume[]) => void
  addJob: (job: JobApplication) => void
  updateJob: (id: string, updates: Partial<JobApplication>) => void
  deleteJob: (id: string) => void
  addResume: (resume: Resume) => void
  deleteResume: (id: string) => void
  setSelectedJobId: (id: string | null) => void
  setIsJobModalOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  jobs: [],
  resumes: [],
  selectedJobId: null,
  isJobModalOpen: false,

  // Actions
  setJobs: (jobs) => set({ jobs }),
  setResumes: (resumes) => set({ resumes }),
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    })),
  deleteJob: (id) =>
    set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) })),
  addResume: (resume) =>
    set((state) => ({ resumes: [...state.resumes, resume] })),
  deleteResume: (id) =>
    set((state) => ({ resumes: state.resumes.filter((r) => r.id !== id) })),
  setSelectedJobId: (id) => set({ selectedJobId: id }),
  setIsJobModalOpen: (open) => set({ isJobModalOpen: open }),
}))
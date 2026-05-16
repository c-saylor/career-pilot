export type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected'

export interface Resume {
  id: string
  created_at: string
  title: string
  content: string
  tags: string
  user_id: string
}

export interface JobApplication {
  id: string
  created_at: string
  user_id: string
  company: string
  role: string
  url: string
  status: ApplicationStatus
  notes: string
  date_applied: string
  job_description: string
  resume_id: string | null
}
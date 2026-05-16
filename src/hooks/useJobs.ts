import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { JobApplication } from '../types'

async function fetchJobs() {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as JobApplication[]
}

async function createJob(job: Omit<JobApplication, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('job_applications')
    .insert(job)
    .select()
    .single()
  if (error) throw error
  return data as JobApplication
}

async function updateJob({ id, ...updates }: Partial<JobApplication> & { id: string }) {
  const { data, error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as JobApplication
}

async function deleteJob(id: string) {
  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export function useJobs() {
  const queryClient = useQueryClient()

  const jobsQuery = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  })

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const updateMutation = useMutation({
    mutationFn: updateJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  return {
    jobs: jobsQuery.data ?? [],
    isLoading: jobsQuery.isLoading,
    isError: jobsQuery.isError,
    createJob: createMutation.mutate,
    updateJob: updateMutation.mutate,
    deleteJob: deleteMutation.mutate,
  }
}
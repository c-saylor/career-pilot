import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Resume } from '../types'

async function fetchResumes() {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Resume[]
}

async function createResume(resume: Omit<Resume, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('resumes')
    .insert(resume)
    .select()
    .single()
  if (error) throw error
  return data as Resume
}

async function updateResume({ id, ...updates }: Partial<Resume> & { id: string }) {
  const { data, error } = await supabase
    .from('resumes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Resume
}

async function deleteResume(id: string) {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export function useResumes() {
  const queryClient = useQueryClient()

  const resumesQuery = useQuery({
    queryKey: ['resumes'],
    queryFn: fetchResumes,
  })

  const createMutation = useMutation({
    mutationFn: createResume,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  })

  const updateMutation = useMutation({
    mutationFn: updateResume,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  })

  return {
    resumes: resumesQuery.data ?? [],
    isLoading: resumesQuery.isLoading,
    isError: resumesQuery.isError,
    createResume: createMutation.mutate,
    updateResume: updateMutation.mutate,
    deleteResume: deleteMutation.mutate,
  }
}
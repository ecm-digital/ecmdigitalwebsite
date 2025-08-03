import { supabase } from './client'

// Helper functions for database operations

export async function createProfile(userId: string, profileData: {
  company_name?: string
  contact_person?: string
  phone?: string
  address?: Record<string, any>
}) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      id: userId,
      ...profileData
    }])
    .select()
    .single()

  return { data, error }
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function updateProfile(userId: string, updates: Partial<{
  company_name: string
  contact_person: string
  phone: string
  address: Record<string, any>
  preferences: Record<string, any>
}>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:profiles(*)
    `)
    .eq('client_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function createProject(projectData: {
  name: string
  description?: string
  type: string
  client_id: string
  budget_total?: number
  start_date?: string
  end_date?: string
  metadata?: Record<string, any>
}) {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single()

  return { data, error }
}

export async function updateProject(projectId: string, updates: Partial<{
  name: string
  description: string
  status: string
  budget_total: number
  budget_used: number
  start_date: string
  end_date: string
  metadata: Record<string, any>
}>) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single()

  return { data, error }
}

export async function getProjectMessages(projectId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles(*)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  return { data, error }
}

export async function sendMessage(messageData: {
  project_id: string
  sender_id: string
  content: string
  attachments?: Record<string, any>[]
  thread_id?: string
}) {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select(`
      *,
      sender:profiles(*)
    `)
    .single()

  return { data, error }
}

export async function getProjectDocuments(projectId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      uploader:profiles(*)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getProjectInvoices(projectId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      project:projects(*)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getUserInvoices(userId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      project:projects!inner(*)
    `)
    .eq('project.client_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Real-time subscriptions
export function subscribeToProjectMessages(projectId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`messages:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `project_id=eq.${projectId}`
      },
      callback
    )
    .subscribe()
}

export function subscribeToUserProjects(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`projects:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `client_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase credentials not configured. Some features may not work.')
}

// Server-side client with service role key (full access)
export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseServiceKey || 'demo-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseServiceKey && supabaseUrl !== 'https://demo.supabase.co')
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Get user by ID
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Get all projects
  async getProjects(filters?: { status?: string; userId?: string }) {
    let query = supabase.from('projects').select('*')
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.userId) {
      query = query.eq('user_id', filters.userId)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Create project
  async createProject(projectData: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update project
  async updateProject(projectId: string, updates: any) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete project
  async deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
    
    if (error) throw error
  },

  // Get messages for project
  async getMessages(projectId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Send message
  async sendMessage(messageData: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Upload file to storage
  async uploadFile(bucket: string, path: string, file: Buffer, contentType: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: false
      })
    
    if (error) throw error
    return data
  },

  // Get file URL
  getFileUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  // Delete file
  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
  }
}

export default supabase

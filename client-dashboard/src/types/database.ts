export type ProjectType = 'website' | 'shopify' | 'mvp' | 'ux-audit' | 'automation' | 'social-media'
export type ProjectStatus = 'discovery' | 'design' | 'development' | 'testing' | 'completed' | 'on-hold'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface Profile {
  id: string
  company_name?: string
  contact_person?: string
  phone?: string
  address?: Record<string, any>
  preferences?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  type: ProjectType
  status: ProjectStatus
  client_id: string
  budget_total?: number
  budget_used?: number
  start_date?: string
  end_date?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  client?: Profile
}

export interface Message {
  id: string
  project_id: string
  sender_id: string
  content: string
  attachments?: Record<string, any>[]
  thread_id?: string
  created_at: string
  read_at?: string
  sender?: Profile
}

export interface Document {
  id: string
  project_id: string
  name: string
  file_path: string
  file_size?: number
  mime_type?: string
  version: number
  uploaded_by: string
  tags?: string[]
  created_at: string
  uploader?: Profile
}

export interface Invoice {
  id: string
  project_id: string
  invoice_number: string
  amount: number
  currency: string
  status: InvoiceStatus
  due_date?: string
  line_items: Record<string, any>
  payment_data?: Record<string, any>
  created_at: string
  paid_at?: string
  project?: Project
}
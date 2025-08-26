import { useEffect, useState } from 'react'
import { useAWSAuth } from '@/hooks/use-aws-auth'
import { Project } from '@/types/database'

export function useProjects() {
  const { user } = useAWSAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Force dev data in development mode
    if (process.env.NODE_ENV === 'development') {
      const defaultProjects: Project[] = [
        {
          id: 'dev-project-1',
          name: 'Strona WWW ECM Digital',
          description: 'Nowoczesna strona internetowa z AI chatbotem',
          type: 'website' as const,
          status: 'development' as const,
          priority: 'high' as const,
          client_id: 'dev-user-1',
          budget_total: 15000,
          budget_used: 8500,
          deadline: '2025-02-15',
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-26T15:30:00Z'
        },
        {
          id: 'dev-project-2',
          name: 'Sklep Shopify',
          description: 'E-commerce platform dla firmy technologicznej',
          type: 'shopify' as const,
          status: 'design' as const,
          priority: 'medium' as const,
          client_id: 'dev-user-1',
          budget_total: 25000,
          budget_used: 5000,
          deadline: '2025-03-20',
          created_at: '2025-01-20T14:00:00Z',
          updated_at: '2025-01-25T11:15:00Z'
        },
        {
          id: 'dev-project-3',
          name: 'AI Chatbot',
          description: 'Inteligentny asystent dla klientów',
          type: 'automation' as const,
          status: 'testing' as const,
          priority: 'high' as const,
          client_id: 'dev-user-1',
          budget_total: 8000,
          budget_used: 7200,
          deadline: '2025-01-30',
          created_at: '2025-01-10T09:00:00Z',
          updated_at: '2025-01-26T16:45:00Z'
        }
      ]
      
      // Save to localStorage
      localStorage.setItem('dev_projects', JSON.stringify(defaultProjects))
      localStorage.setItem('dev_user', JSON.stringify({
        id: 'dev-user-1',
        email: 'dev@ecm-digital.com',
        name: 'Tomasz Gnat',
        company: 'ECM Digital',
        role: 'client' as const,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }))
      
      setProjects(defaultProjects)
      setLoading(false)
      return
    }

    if (user) {
      fetchProjects()
    }
  }, [user])

  const fetchProjects = async () => {
    if (!user) return

    setLoading(true)
    try {
      const resp = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.email }),
      })
      if (!resp.ok) throw new Error('Failed to load projects')
      const data = await resp.json()
      setProjects((data.projects || []) as Project[])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { data: null, error: new Error('User not authenticated') }

    try {
      const resp = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.email,
          name: projectData.name,
          description: (projectData as any).description,
          type: (projectData as any).type,
          status: projectData.status,
          budget_total: (projectData as any).budget_total,
          budget_used: (projectData as any).budget_used,
          deadline: (projectData as any).deadline,
        }),
      })
      if (!resp.ok) throw new Error('Failed to create project')
      const data = await resp.json()
      await fetchProjects()
      return { data: data.project as Project, error: null }
    } catch (error) {
      console.error('Error creating project:', error)
      return { data: null, error }
    }
  }

  const updateProjectData = async (id: string, updates: Partial<Project>) => {
    try {
      const resp = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!resp.ok) throw new Error('Failed to update project')
      const data = await resp.json()
      await fetchProjects()
      return { data: data.project as Project, error: null }
    } catch (error) {
      console.error('Error updating project:', error)
      return { data: null, error }
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const resp = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (!resp.ok) throw new Error('Failed to delete project')
      await fetchProjects()
      return { error: null }
    } catch (error) {
      console.error('Error deleting project:', error)
      return { error }
    }
  }

  const getProjectById = (id: string) => {
    return projects.find(p => p.id === id) || null
  }

  const getProjectsByStatus = (status: Project['status']) => {
    return projects.filter(p => p.status === status)
  }

  const getProjectsByPriority = (priority: Project['priority']) => {
    return projects.filter(p => p.priority === priority)
  }

  return {
    projects,
    selectedProject,
    loading,
    setSelectedProject,
    fetchProjects,
    createProject,
    updateProjectData,
    deleteProject,
    getProjectById,
    getProjectsByStatus,
    getProjectsByPriority,
  }
}
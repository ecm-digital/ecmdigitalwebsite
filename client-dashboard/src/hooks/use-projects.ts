import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useProjectsStore } from '@/lib/stores/projects-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Project } from '@/types/database'

export function useProjects() {
  const { projects, selectedProject, loading, setProjects, setSelectedProject, setLoading, addProject, updateProject, removeProject } = useProjectsStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user])

  const fetchProjects = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles(*)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { data: null, error: new Error('User not authenticated') }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, client_id: user.id }])
        .select()
        .single()

      if (error) throw error
      
      addProject(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error creating project:', error)
      return { data: null, error }
    }
  }

  const updateProjectData = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      updateProject(id, data)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating project:', error)
      return { data: null, error }
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      removeProject(id)
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

  const getProjectsByType = (type: Project['type']) => {
    return projects.filter(p => p.type === type)
  }

  return {
    projects,
    selectedProject,
    loading,
    setSelectedProject,
    fetchProjects,
    createProject,
    updateProject: updateProjectData,
    deleteProject,
    getProjectById,
    getProjectsByStatus,
    getProjectsByType,
  }
}
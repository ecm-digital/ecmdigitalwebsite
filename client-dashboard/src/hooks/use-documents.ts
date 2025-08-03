import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Document } from '@/types/database'
import { uploadFile, deleteFile, STORAGE_BUCKETS } from '@/lib/supabase/storage'

export function useDocuments(projectId?: string) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { user } = useAuthStore()

  // Fetch documents for a project
  const fetchDocuments = useCallback(async (pId: string) => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          uploader:profiles(*)
        `)
        .eq('project_id', pId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Upload a new document
  const uploadDocument = async (
    file: File,
    projectId: string,
    tags: string[] = []
  ) => {
    if (!user) return { success: false, error: 'User not authenticated' }

    setUploading(true)
    try {
      // Upload file to storage
      const uploadResult = await uploadFile(file, STORAGE_BUCKETS.DOCUMENTS)
      
      if (uploadResult.error) {
        throw uploadResult.error
      }

      // Save document metadata to database
      const { data, error } = await supabase
        .from('documents')
        .insert([{
          project_id: projectId,
          name: file.name,
          file_path: uploadResult.data.path,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
          tags: tags
        }])
        .select(`
          *,
          uploader:profiles(*)
        `)
        .single()

      if (error) throw error

      // Add to local state
      setDocuments(prev => [data, ...prev])
      
      return { success: true, data }
    } catch (error) {
      console.error('Error uploading document:', error)
      return { success: false, error: error.message }
    } finally {
      setUploading(false)
    }
  }

  // Delete a document
  const deleteDocument = async (documentId: string, filePath: string) => {
    if (!user) return { success: false, error: 'User not authenticated' }

    try {
      // Delete from storage
      const { error: storageError } = await deleteFile(STORAGE_BUCKETS.DOCUMENTS, filePath)
      if (storageError) {
        console.warn('Error deleting file from storage:', storageError)
        // Continue with database deletion even if storage deletion fails
      }

      // Delete from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error

      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      
      return { success: true }
    } catch (error) {
      console.error('Error deleting document:', error)
      return { success: false, error: error.message }
    }
  }

  // Update document metadata
  const updateDocument = async (
    documentId: string,
    updates: Partial<Pick<Document, 'name' | 'tags'>>
  ) => {
    if (!user) return { success: false, error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', documentId)
        .select(`
          *,
          uploader:profiles(*)
        `)
        .single()

      if (error) throw error

      // Update local state
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? data : doc)
      )
      
      return { success: true, data }
    } catch (error) {
      console.error('Error updating document:', error)
      return { success: false, error: error.message }
    }
  }

  // Get document by ID
  const getDocumentById = (id: string) => {
    return documents.find(doc => doc.id === id)
  }

  // Filter documents by tags
  const getDocumentsByTags = (tags: string[]) => {
    return documents.filter(doc => 
      doc.tags && doc.tags.some(tag => tags.includes(tag))
    )
  }

  // Filter documents by type
  const getDocumentsByType = (mimeType: string) => {
    return documents.filter(doc => doc.mime_type?.includes(mimeType))
  }

  // Get documents statistics
  const getDocumentsStats = () => {
    const totalSize = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0)
    const typeStats = documents.reduce((stats, doc) => {
      const type = doc.mime_type || 'unknown'
      stats[type] = (stats[type] || 0) + 1
      return stats
    }, {} as Record<string, number>)

    return {
      totalCount: documents.length,
      totalSize,
      typeStats
    }
  }

  // Set up real-time subscription
  useEffect(() => {
    if (!projectId || !user) return

    fetchDocuments(projectId)

    // Subscribe to document changes
    const channel = supabase
      .channel(`documents:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'documents',
          filter: `project_id=eq.${projectId}`
        },
        async (payload) => {
          // Fetch the complete document with uploader info
          const { data } = await supabase
            .from('documents')
            .select(`
              *,
              uploader:profiles(*)
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setDocuments(prev => {
              // Avoid duplicates
              const exists = prev.some(doc => doc.id === data.id)
              return exists ? prev : [data, ...prev]
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          setDocuments(prev =>
            prev.map(doc =>
              doc.id === payload.new.id
                ? { ...doc, ...payload.new }
                : doc
            )
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'documents',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          setDocuments(prev =>
            prev.filter(doc => doc.id !== payload.old.id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, user, fetchDocuments])

  return {
    documents,
    loading,
    uploading,
    uploadDocument,
    deleteDocument,
    updateDocument,
    getDocumentById,
    getDocumentsByTags,
    getDocumentsByType,
    getDocumentsStats,
    refetch: () => projectId && fetchDocuments(projectId)
  }
}
import { supabase } from './client'

// Storage bucket names
export const STORAGE_BUCKETS = {
  ATTACHMENTS: 'message-attachments',
  DOCUMENTS: 'project-documents',
  AVATARS: 'user-avatars'
} as const

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_FILES: 10,
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    TEXT: ['text/plain', 'text/csv'],
    ARCHIVES: ['application/zip', 'application/x-rar-compressed']
  }
} as const

// Get all allowed file types
export const getAllowedFileTypes = () => {
  return Object.values(FILE_LIMITS.ALLOWED_TYPES).flat()
}

// Validate file
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > FILE_LIMITS.MAX_SIZE) {
    return {
      valid: false,
      error: `Plik jest za duży. Maksymalny rozmiar to ${FILE_LIMITS.MAX_SIZE / (1024 * 1024)}MB`
    }
  }

  // Check file type
  const allowedTypes = getAllowedFileTypes()
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Nieobsługiwany typ pliku'
    }
  }

  return { valid: true }
}

// Generate unique file name
export const generateFileName = (originalName: string, userId: string): string => {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${userId}/${timestamp}_${randomString}.${extension}`
}

// Upload file to Supabase Storage
export const uploadFile = async (
  file: File,
  bucket: string,
  path?: string
): Promise<{ data: any; error: any; url?: string }> => {
  try {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return { data: null, error: new Error(validation.error) }
    }

    // Generate file path
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { data: null, error: new Error('User not authenticated') }
    }

    const fileName = path || generateFileName(file.name, user.id)

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return { data: null, error }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return {
      data,
      error: null,
      url: urlData.publicUrl
    }
  } catch (error) {
    return { data: null, error }
  }
}

// Upload multiple files
export const uploadMultipleFiles = async (
  files: File[],
  bucket: string,
  onProgress?: (progress: number, fileName: string) => void
): Promise<{
  successful: Array<{ file: File; data: any; url: string }>
  failed: Array<{ file: File; error: any }>
}> => {
  const successful: Array<{ file: File; data: any; url: string }> = []
  const failed: Array<{ file: File; error: any }> = []

  // Validate file count
  if (files.length > FILE_LIMITS.MAX_FILES) {
    files.forEach(file => {
      failed.push({
        file,
        error: new Error(`Można przesłać maksymalnie ${FILE_LIMITS.MAX_FILES} plików jednocześnie`)
      })
    })
    return { successful, failed }
  }

  // Upload files sequentially to avoid overwhelming the server
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    try {
      onProgress?.(((i + 1) / files.length) * 100, file.name)
      
      const result = await uploadFile(file, bucket)
      
      if (result.error) {
        failed.push({ file, error: result.error })
      } else {
        successful.push({ 
          file, 
          data: result.data, 
          url: result.url! 
        })
      }
    } catch (error) {
      failed.push({ file, error })
    }
  }

  return { successful, failed }
}

// Delete file from storage
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ error: any }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    return { error }
  } catch (error) {
    return { error }
  }
}

// Get file info
export const getFileInfo = async (
  bucket: string,
  path: string
): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path)

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Download file
export const downloadFile = async (
  bucket: string,
  path: string
): Promise<{ data: Blob | null; error: any }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

// Get file URL
export const getFileUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get file icon based on type
export const getFileIcon = (mimeType: string): string => {
  if (FILE_LIMITS.ALLOWED_TYPES.IMAGES.includes(mimeType)) {
    return '🖼️'
  } else if (FILE_LIMITS.ALLOWED_TYPES.DOCUMENTS.includes(mimeType)) {
    return '📄'
  } else if (FILE_LIMITS.ALLOWED_TYPES.SPREADSHEETS.includes(mimeType)) {
    return '📊'
  } else if (FILE_LIMITS.ALLOWED_TYPES.TEXT.includes(mimeType)) {
    return '📝'
  } else if (FILE_LIMITS.ALLOWED_TYPES.ARCHIVES.includes(mimeType)) {
    return '🗜️'
  } else {
    return '📎'
  }
}
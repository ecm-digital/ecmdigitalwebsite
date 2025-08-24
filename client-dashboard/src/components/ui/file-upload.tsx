'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from './button'
import { Progress } from './progress'
import { Badge } from './badge'
import { 
  Upload, 
  X, 
  File, 
  Image, 
  FileText, 
  Archive,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

// TODO: Implement AWS S3 file validation and limits
const FILE_LIMITS = {
  MAX_FILES: 10,
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: [
    'image/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed'
  ]
}

const validateFile = (file: File) => {
  if (file.size > FILE_LIMITS.MAX_SIZE) {
    return {
      valid: false,
      error: `Plik jest za duży. Maksymalny rozmiar: ${(FILE_LIMITS.MAX_SIZE / (1024 * 1024)).toFixed(1)} MB`
    }
  }

  const isAcceptedType = FILE_LIMITS.ACCEPTED_TYPES.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1))
    }
    return file.type === type
  })

  if (!isAcceptedType) {
    return {
      valid: false,
      error: 'Nieobsługiwany typ pliku'
    }
  }

  return { valid: true, error: null }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  onUpload?: (files: File[]) => Promise<void>
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  disabled?: boolean
  className?: string
}

interface FileWithStatus extends File {
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
  url?: string
}

export function FileUpload({
  onFilesSelected,
  onUpload,
  maxFiles = FILE_LIMITS.MAX_FILES,
  maxSize = FILE_LIMITS.MAX_SIZE,
  acceptedTypes,
  disabled = false,
  className = ''
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    } else if (file.type.includes('pdf') || file.type.includes('document')) {
      return <FileText className="h-4 w-4" />
    } else if (file.type.includes('zip') || file.type.includes('rar')) {
      return <Archive className="h-4 w-4" />
    } else {
      return <File className="h-4 w-4" />
    }
  }

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles: FileWithStatus[] = []
    const errors: string[] = []

    newFiles.forEach(file => {
      // Check if file already exists
      if (files.some(f => f.name === file.name && f.size === file.size)) {
        errors.push(`Plik "${file.name}" już został dodany`)
        return
      }

      // Validate file
      const validation = validateFile(file)
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`)
        return
      }

      // Check max files limit
      if (files.length + validFiles.length >= maxFiles) {
        errors.push(`Można dodać maksymalnie ${maxFiles} plików`)
        return
      }

      validFiles.push({
        ...file,
        id: Math.random().toString(36).substring(2, 15),
        status: 'pending'
      } as FileWithStatus)
    })

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
      onFilesSelected(validFiles)
    }

    if (errors.length > 0) {
      // TODO: Show error messages to user
      console.error('File validation errors:', errors)
    }
  }, [files, maxFiles, onFilesSelected])

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }, [])

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length > 0) {
      addFiles(selectedFiles)
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [addFiles])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(event.dataTransfer.files)
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles)
    }
  }, [addFiles])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleUpload = useCallback(async () => {
    if (!onUpload || files.length === 0) return

    setIsUploading(true)
    
    try {
      // Update all files to uploading status
      setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const })))
      
      // TODO: Implement AWS S3 upload
      // For now, simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update all files to success status
      setFiles(prev => prev.map(f => ({ ...f, status: 'success' as const })))
      
      await onUpload(files)
    } catch (error) {
      console.error('Upload failed:', error)
      // Update all files to error status
      setFiles(prev => prev.map(f => ({ 
        ...f, 
        status: 'error' as const, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      })))
    } finally {
      setIsUploading(false)
    }
  }, [onUpload, files])

  const clearAll = useCallback(() => {
    setFiles([])
  }, [])

  return (
    <div className={`w-full ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInput}
        accept={acceptedTypes?.join(',')}
        className="hidden"
        disabled={disabled}
      />

      {/* Drop Zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Przeciągnij pliki tutaj lub kliknij, aby wybrać
        </p>
        <p className="text-sm text-gray-500">
          Maksymalnie {maxFiles} plików, każdy do {formatFileSize(maxSize)}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Obsługiwane formaty: PDF, DOC, XLS, obrazy, archiwa
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              Wybrane pliki ({files.length})
            </h3>
            <div className="flex items-center space-x-2">
              {onUpload && (
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || disabled}
                  size="sm"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Wysyłanie...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Wyślij
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={clearAll}
                disabled={isUploading || disabled}
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Wyczyść
              </Button>
            </div>
          </div>

          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {file.status === 'uploading' && (
                  <Progress value={file.progress || 0} className="w-20" />
                )}
                
                {file.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                
                {file.status === 'error' && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-600">{file.error}</span>
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  disabled={isUploading || disabled}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
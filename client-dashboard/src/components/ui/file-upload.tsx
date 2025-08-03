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
import { validateFile, formatFileSize, FILE_LIMITS } from '@/lib/supabase/storage'

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
      // TODO: Show toast notifications for errors
      console.error('File validation errors:', errors)
    }
  }, [files, maxFiles, onFilesSelected])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [disabled, addFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    addFiles(selectedFiles)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [addFiles])

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleUpload = async () => {
    if (!onUpload || files.length === 0) return

    setIsUploading(true)
    
    try {
      // Update all files to uploading status
      setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const, progress: 0 })))
      
      await onUpload(files)
      
      // Update all files to success status
      setFiles(prev => prev.map(f => ({ ...f, status: 'success' as const, progress: 100 })))
    } catch (error) {
      // Update all files to error status
      setFiles(prev => prev.map(f => ({ 
        ...f, 
        status: 'error' as const, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      })))
    } finally {
      setIsUploading(false)
    }
  }

  const clearFiles = () => {
    setFiles([])
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          accept={acceptedTypes?.join(',') || undefined}
          className="hidden"
          disabled={disabled}
        />

        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {isDragOver ? 'Upuść pliki tutaj' : 'Przeciągnij i upuść pliki'}
          </p>
          <p className="text-sm text-gray-500">
            lub <span className="text-blue-600 font-medium">kliknij aby wybrać</span>
          </p>
          <p className="text-xs text-gray-400">
            Maksymalnie {maxFiles} plików, {formatFileSize(maxSize)} każdy
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Wybrane pliki ({files.length})
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFiles}
              disabled={disabled || isUploading}
            >
              Wyczyść wszystkie
            </Button>
          </div>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50"
              >
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(file)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <Progress value={file.progress || 0} className="mt-2 h-1" />
                  )}
                  
                  {/* Error Message */}
                  {file.status === 'error' && file.error && (
                    <p className="text-xs text-red-600 mt-1">{file.error}</p>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {file.status === 'pending' && (
                    <Badge variant="secondary">Oczekuje</Badge>
                  )}
                  {file.status === 'uploading' && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                  {file.status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>

                {/* Remove Button */}
                {file.status !== 'uploading' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={disabled}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Upload Button */}
          {onUpload && files.some(f => f.status === 'pending') && (
            <Button
              onClick={handleUpload}
              disabled={disabled || isUploading || files.length === 0}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Przesyłanie...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Prześlij pliki ({files.filter(f => f.status === 'pending').length})
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Document } from '@/types/database'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MoreVertical, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  Image as ImageIcon,
  File,
  Archive,
  X,
  Check,
  ExternalLink
} from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { formatFileSize, getFileUrl, STORAGE_BUCKETS } from '@/lib/supabase/storage'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DocumentCardProps {
  document: Document
  onDelete?: (document: Document) => void
  onUpdate?: (document: Document, updates: { name?: string; tags?: string[] }) => void
  onView?: (document: Document) => void
}

export function DocumentCard({ 
  document, 
  onDelete, 
  onUpdate, 
  onView 
}: DocumentCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(document.name)
  const [editTags, setEditTags] = useState(document.tags?.join(', ') || '')

  const getFileIcon = () => {
    if (!document.mime_type) return <File className="h-8 w-8 text-gray-400" />
    
    if (document.mime_type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    } else if (document.mime_type.includes('pdf') || document.mime_type.includes('document')) {
      return <FileText className="h-8 w-8 text-red-500" />
    } else if (document.mime_type.includes('zip') || document.mime_type.includes('rar')) {
      return <Archive className="h-8 w-8 text-yellow-500" />
    } else {
      return <File className="h-8 w-8 text-gray-400" />
    }
  }

  const handleDownload = () => {
    const url = getFileUrl(STORAGE_BUCKETS.DOCUMENTS, document.file_path)
    window.open(url, '_blank')
  }

  const handleView = () => {
    if (onView) {
      onView(document)
    } else {
      handleDownload()
    }
  }

  const handleSaveEdit = () => {
    if (onUpdate) {
      const tags = editTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      
      onUpdate(document, {
        name: editName.trim(),
        tags: tags.length > 0 ? tags : []
      })
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(document.name)
    setEditTags(document.tags?.join(', ') || '')
    setIsEditing(false)
  }

  const isImage = document.mime_type?.startsWith('image/')

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* File Icon/Preview */}
          <div className="flex-shrink-0">
            {isImage ? (
              <div className="relative">
                <img
                  src={getFileUrl(STORAGE_BUCKETS.DOCUMENTS, document.file_path)}
                  alt={document.name}
                  className="h-12 w-12 object-cover rounded-lg cursor-pointer"
                  onClick={handleView}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-12 w-12 bg-gray-100 rounded-lg">
                {getFileIcon()}
              </div>
            )}
          </div>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-sm"
                  placeholder="Nazwa dokumentu"
                />
                <Input
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="text-sm"
                  placeholder="Tagi (oddzielone przecinkami)"
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h4 
                  className="font-medium text-sm text-gray-900 truncate cursor-pointer hover:text-blue-600"
                  onClick={handleView}
                  title={document.name}
                >
                  {document.name}
                </h4>
                
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {document.file_size && formatFileSize(document.file_size)}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(document.created_at), 'dd MMM yyyy', { locale: pl })}
                  </span>
                </div>

                {/* Tags */}
                {document.tags && document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {document.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{document.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Uploader Info */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {document.uploader?.contact_person || 'Nieznany użytkownik'}
                  </span>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleView}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDownload}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleView}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Otwórz
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Pobierz
                        </DropdownMenuItem>
                        {onUpdate && (
                          <DropdownMenuItem onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edytuj
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(document)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Usuń
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
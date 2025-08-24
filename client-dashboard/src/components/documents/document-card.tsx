'use client'

import { useState } from 'react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Document {
  id: string
  name: string
  mime_type: string
  size: number
  tags: string[]
  created_at: string
  updated_at: string
  project_id: string
  url?: string
}

interface DocumentCardProps {
  document: Document
  onDelete?: (id: string) => void
  onUpdate?: (id: string, updates: Partial<Document>) => void
}

export function DocumentCard({ 
  document, 
  onDelete, 
  onUpdate
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = () => {
    // TODO: Implement AWS S3 download
    console.log('Download document:', document.name)
  }

  const handleView = () => {
    // TODO: Implement document viewer
    console.log('View document:', document.name)
  }

  const handleSaveEdit = () => {
    if (onUpdate) {
      const tags = editTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      
      onUpdate(document.id, {
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
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 hover:from-white hover:to-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-slate-200/50">
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <CardContent className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-sm font-semibold text-slate-900 mb-2"
                placeholder="Nazwa dokumentu"
              />
            ) : (
              <h3 className="text-sm font-semibold text-slate-900 mb-2 truncate group-hover:text-blue-700 transition-colors">
                {document.name}
              </h3>
            )}
            
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span>{formatFileSize(document.size)}</span>
              <span>•</span>
              <span>{format(new Date(document.created_at), 'dd MMM yyyy', { locale: pl })}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="h-4 w-4 mr-2" />
                Podgląd
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Pobierz
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edytuj
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(document.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* File Icon and Preview */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
            {getFileIcon()}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          {isEditing ? (
            <Input
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="text-xs"
              placeholder="Tagi (oddzielone przecinkami)"
            />
          ) : (
            <div className="flex flex-wrap gap-1">
              {document.tags && document.tags.length > 0 ? (
                document.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-slate-100 text-slate-700 border-slate-200"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-slate-400">Brak tagów</span>
              )}
            </div>
          )}
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleSaveEdit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-1" />
              Zapisz
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1" />
              Anuluj
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        {!isEditing && (
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              onClick={handleView}
              className="flex-1 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Podgląd
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="flex-1 border-slate-200 hover:border-green-300 hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-1" />
              Pobierz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
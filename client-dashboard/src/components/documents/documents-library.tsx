'use client'

import { useState, useMemo } from 'react'
import { useDocuments } from '@/hooks/use-documents'
import { DocumentCard } from './document-card'
import { FileUpload } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Upload,
  FileText,
  BarChart3,
  Plus,
  X,
  Loader2
} from 'lucide-react'
import { Document } from '@/types/database'
import { formatFileSize } from '@/lib/supabase/storage'

interface DocumentsLibraryProps {
  projectId: string
  projectName: string
}

const FILE_TYPE_FILTERS = [
  { value: 'all', label: 'Wszystkie typy' },
  { value: 'image/', label: 'Obrazy' },
  { value: 'pdf', label: 'PDF' },
  { value: 'document', label: 'Dokumenty' },
  { value: 'spreadsheet', label: 'Arkusze' },
  { value: 'text', label: 'Tekstowe' },
  { value: 'zip', label: 'Archiwa' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Najnowsze' },
  { value: 'oldest', label: 'Najstarsze' },
  { value: 'name', label: 'Nazwa A-Z' },
  { value: 'size', label: 'Rozmiar' },
]

export function DocumentsLibrary({ projectId, projectName }: DocumentsLibraryProps) {
  const {
    documents,
    loading,
    uploading,
    uploadDocument,
    deleteDocument,
    updateDocument,
    getDocumentsStats
  } = useDocuments(projectId)

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showUpload, setShowUpload] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    documents.forEach(doc => {
      doc.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [documents])

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      // Search filter
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Type filter
      const matchesType = typeFilter === 'all' || 
        (doc.mime_type && doc.mime_type.includes(typeFilter))
      
      // Tag filter
      const matchesTag = !tagFilter || 
        (doc.tags && doc.tags.includes(tagFilter))

      return matchesSearch && matchesType && matchesTag
    })

    // Sort documents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          return (b.file_size || 0) - (a.file_size || 0)
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [documents, searchQuery, typeFilter, tagFilter, sortBy])

  const stats = getDocumentsStats()

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files)
  }

  const handleUpload = async (files: File[]) => {
    const results = await Promise.all(
      files.map(file => uploadDocument(file, projectId, []))
    )

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    // TODO: Show toast notifications
    console.log(`Upload completed: ${successful} successful, ${failed} failed`)
    
    setSelectedFiles([])
    setShowUpload(false)
  }

  const handleDeleteDocument = async (document: Document) => {
    if (confirm(`Czy na pewno chcesz usunąć dokument "${document.name}"?`)) {
      const result = await deleteDocument(document.id, document.file_path)
      if (!result.success) {
        // TODO: Show error toast
        console.error('Failed to delete document:', result.error)
      }
    }
  }

  const handleUpdateDocument = async (
    document: Document, 
    updates: { name?: string; tags?: string[] }
  ) => {
    const result = await updateDocument(document.id, updates)
    if (!result.success) {
      // TODO: Show error toast
      console.error('Failed to update document:', result.error)
    }
  }

  const handleViewDocument = (document: Document) => {
    // TODO: Implement document viewer modal
    console.log('View document:', document)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Ładowanie dokumentów...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dokumenty</h1>
          <p className="text-gray-600 mt-2">
            Zarządzaj dokumentami projektu {projectName}
          </p>
        </div>
        <Button 
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Dodaj dokumenty</span>
        </Button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Prześlij dokumenty</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpload(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              onUpload={handleUpload}
              maxFiles={10}
              maxSize={100 * 1024 * 1024} // 100MB
              disabled={uploading}
            />
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCount}</p>
                <p className="text-sm text-gray-600">Dokumentów</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</p>
                <p className="text-sm text-gray-600">Całkowity rozmiar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Filter className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{allTags.length}</p>
                <p className="text-sm text-gray-600">Tagów</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Szukaj dokumentów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Typ pliku" />
          </SelectTrigger>
          <SelectContent>
            {FILE_TYPE_FILTERS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Wszystkie tagi</SelectItem>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sortuj" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {(searchQuery || typeFilter !== 'all' || tagFilter) && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Szukaj: {searchQuery}</span>
              <button onClick={() => setSearchQuery('')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {typeFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Typ: {FILE_TYPE_FILTERS.find(f => f.value === typeFilter)?.label}</span>
              <button onClick={() => setTypeFilter('all')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {tagFilter && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Tag: {tagFilter}</span>
              <button onClick={() => setTagFilter('')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={handleDeleteDocument}
              onUpdate={handleUpdateDocument}
              onView={handleViewDocument}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {documents.length === 0 
              ? 'Brak dokumentów'
              : 'Brak dokumentów spełniających kryteria'
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {documents.length === 0
              ? 'Prześlij pierwszy dokument do tego projektu'
              : 'Spróbuj zmienić filtry wyszukiwania'
            }
          </p>
          {documents.length === 0 && (
            <Button onClick={() => setShowUpload(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Dodaj dokumenty
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
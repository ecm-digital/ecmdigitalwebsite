'use client'

import { useState, useMemo } from 'react'
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
  Loader2,
  FolderOpen,
  HardDrive,
  Tag,
  Calendar,
  Download
} from 'lucide-react'

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

interface DocumentsLibraryProps {
  projectId?: string
  projectName?: string
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Projekt_UX_Research.pdf',
    mime_type: 'application/pdf',
    size: 2048576,
    tags: ['UX', 'Research', 'Projekt'],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    project_id: 'demo'
  },
  {
    id: '2',
    name: 'Wireframes_Figma.fig',
    mime_type: 'application/figma',
    size: 1048576,
    tags: ['Design', 'Wireframes', 'Figma'],
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z',
    project_id: 'demo'
  },
  {
    id: '3',
    name: 'User_Stories.docx',
    mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 512000,
    tags: ['Requirements', 'User Stories', 'Documentation'],
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    project_id: 'demo'
  },
  {
    id: '4',
    name: 'Budget_Spreadsheet.xlsx',
    mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 256000,
    tags: ['Budget', 'Finance', 'Planning'],
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    project_id: 'demo'
  },
  {
    id: '5',
    name: 'Team_Photo.jpg',
    mime_type: 'image/jpeg',
    size: 1536000,
    tags: ['Team', 'Photo', 'Marketing'],
    created_at: '2024-01-11T11:30:00Z',
    updated_at: '2024-01-11T11:30:00Z',
    project_id: 'demo'
  }
]

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
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showUpload, setShowUpload] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Mock functions
  const uploadDocument = async (files: File[]) => {
    setUploading(true)
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newDocs: Document[] = files.map((file, index) => ({
      id: Date.now().toString() + index,
      name: file.name,
      mime_type: file.type || 'application/octet-stream',
      size: file.size,
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project_id: projectId || 'demo'
    }))
    
    setDocuments(prev => [...newDocs, ...prev])
    setUploading(false)
    setShowUpload(false)
    setSelectedFiles([])
  }

  const deleteDocument = async (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates, updated_at: new Date().toISOString() } : doc
    ))
  }

  const getDocumentsStats = () => {
    const totalCount = documents.length
    const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0)
    const typeCounts = documents.reduce((acc, doc) => {
      const type = doc.mime_type.split('/')[0]
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalCount,
      totalSize,
      typeCounts
    }
  }

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
    const filtered = documents.filter(doc => {
      // Search filter
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Type filter
      const matchesType = typeFilter === 'all' || 
        (doc.mime_type && doc.mime_type.includes(typeFilter))
      
      // Tag filter
      const matchesTag = tagFilter === 'all' || 
        (doc.tags && doc.tags.includes(tagFilter))

      return matchesSearch && matchesType && matchesTag
    })

    // Sort documents
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          return b.size - a.size
        default:
          return 0
      }
    })
  }, [documents, searchQuery, typeFilter, tagFilter, sortBy])

  const stats = getDocumentsStats()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = async (files: File[]) => {
    await uploadDocument(files)
  }

  const handleDeleteDocument = async (id: string) => {
    await deleteDocument(id)
  }

  const handleUpdateDocument = async (id: string, updates: Partial<Document>) => {
    await updateDocument(id, updates)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setTypeFilter('all')
    setTagFilter('all')
    setSortBy('newest')
  }

  const hasActiveFilters = searchQuery || typeFilter !== 'all' || tagFilter || sortBy !== 'newest'

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl p-8 lg:p-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                <FileText className="h-4 w-4 mr-2" />
                Biblioteka Dokumentów
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Dokumenty
              </h1>
              <p className="text-xl text-purple-100 mb-6 max-w-2xl">
                {projectName ? `Zarządzaj dokumentami projektu ${projectName}` : 'Zarządzaj wszystkimi dokumentami'}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-white/80 text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Wszystkich: {stats.totalCount}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Rozmiar: {stats.totalSize > 0 ? formatFileSize(stats.totalSize) : '0 Bytes'}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Tag className="h-4 w-4 mr-2" />
                  Tagów: {allTags.length}
                </div>
              </div>
            </div>
            <div className="hidden lg:block mt-8 lg:mt-0">
              <Button 
                onClick={() => setShowUpload(!showUpload)}
                className="btn-primary-modern text-lg px-8 py-4 bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Dodaj Dokumenty
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-200 rounded-xl">
                <FileText className="h-8 w-8 text-blue-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">{stats.totalCount}</div>
                <div className="text-sm text-blue-600 font-medium">Wszystkich dokumentów</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-green-50 to-green-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-200 rounded-xl">
                <HardDrive className="h-8 w-8 text-green-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">{formatFileSize(stats.totalSize)}</div>
                <div className="text-sm text-green-600 font-medium">Całkowity rozmiar</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-200 rounded-xl">
                <Tag className="h-8 w-8 text-purple-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">{allTags.length}</div>
                <div className="text-sm text-purple-600 font-medium">Unikalnych tagów</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-blue-600" />
              Dodaj Nowe Dokumenty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFilesSelected={handleFileUpload}
              onUpload={handleFileUpload}
              maxFiles={10}
              maxSize={100 * 1024 * 1024} // 100MB
              disabled={uploading}
              className="w-full"
            />
            {uploading && (
              <div className="flex items-center justify-center mt-4 p-4 bg-blue-50 rounded-xl">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                <span className="text-blue-600 font-medium">Przesyłanie dokumentów...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters Section */}
      <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-slate-600" />
            Filtry i Wyszukiwanie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Wyszukaj</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Nazwa dokumentu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-slate-200/50 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Typ pliku</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-11 border-slate-200/50 rounded-xl">
                  <SelectValue placeholder="Wszystkie typy" />
                </SelectTrigger>
                <SelectContent>
                  {FILE_TYPE_FILTERS.map(filter => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tag</label>
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="h-11 border-slate-200/50 rounded-xl">
                  <SelectValue placeholder="Wszystkie tagi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie tagi</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Sortuj</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 border-slate-200/50 rounded-xl">
                  <SelectValue placeholder="Sortuj według" />
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
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-700">Aktywne filtry:</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Wyczyść wszystkie
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                    Wyszukiwanie: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {typeFilter !== 'all' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    Typ: {FILE_TYPE_FILTERS.find(f => f.value === typeFilter)?.label}
                    <button
                      onClick={() => setTypeFilter('all')}
                      className="ml-2 hover:text-green-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {tagFilter && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                    Tag: {tagFilter}
                    <button
                      onClick={() => setTagFilter('')}
                      className="ml-2 hover:text-purple-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {sortBy !== 'newest' && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                    Sortowanie: {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                    <button
                      onClick={() => setSortBy('newest')}
                      className="ml-2 hover:text-orange-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-slate-600 text-lg">Ładowanie dokumentów...</span>
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={handleDeleteDocument}
              onUpdate={handleUpdateDocument}
            />
          ))}
        </div>
      ) : (
        <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Brak dokumentów
            </h3>
            <p className="text-slate-500 mb-6">
              {hasActiveFilters 
                ? 'Spróbuj zmienić filtry lub wyszukiwanie'
                : 'Dodaj swój pierwszy dokument, aby rozpocząć'
              }
            </p>
            {!hasActiveFilters && (
              <Button 
                onClick={() => setShowUpload(true)}
                className="btn-primary-modern"
              >
                <Plus className="h-4 w-4 mr-2" />
                Dodaj Dokument
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mobile Upload Button */}
      <div className="lg:hidden">
        <Button 
          onClick={() => setShowUpload(!showUpload)}
          className="btn-primary-modern w-full text-lg py-4 bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Dodaj Dokumenty
        </Button>
      </div>
    </div>
  )
}
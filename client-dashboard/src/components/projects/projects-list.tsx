'use client'

import { useState, useMemo } from 'react'
import { useProjects } from '@/hooks/use-projects'
import { ProjectCard } from './project-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Plus,
  FolderOpen
} from 'lucide-react'
import { Project, ProjectStatus, ProjectType } from '@/types/database'

const statusOptions = [
  { value: 'all', label: 'Wszystkie statusy' },
  { value: 'discovery', label: 'Analiza' },
  { value: 'design', label: 'Projektowanie' },
  { value: 'development', label: 'Rozwój' },
  { value: 'testing', label: 'Testowanie' },
  { value: 'completed', label: 'Ukończone' },
  { value: 'on-hold', label: 'Wstrzymane' },
]

const typeOptions = [
  { value: 'all', label: 'Wszystkie typy' },
  { value: 'website', label: 'Strona WWW' },
  { value: 'shopify', label: 'Sklep Shopify' },
  { value: 'mvp', label: 'Prototyp MVP' },
  { value: 'ux-audit', label: 'Audyt UX' },
  { value: 'automation', label: 'Automatyzacja' },
  { value: 'social-media', label: 'Social Media' },
]

export function ProjectsList() {
  const { projects, loading } = useProjects()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter
      const matchesType = typeFilter === 'all' || project.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [projects, searchQuery, statusFilter, typeFilter])

  const handleViewDetails = (project: Project) => {
    // TODO: Navigate to project details page
    console.log('View project details:', project.id)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projekty</h1>
          <p className="text-gray-600 mt-2">
            Zarządzaj swoimi projektami i śledź postępy
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nowy projekt</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Szukaj projektów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Typ" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">
          Wszystkich: {projects.length}
        </Badge>
        <Badge variant="outline">
          Aktywnych: {projects.filter(p => p.status !== 'completed').length}
        </Badge>
        <Badge variant="outline">
          Ukończonych: {projects.filter(p => p.status === 'completed').length}
        </Badge>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'Brak projektów spełniających kryteria'
              : 'Brak projektów'
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Spróbuj zmienić filtry wyszukiwania'
              : 'Rozpocznij współpracę z ECM Digital, aby zobaczyć swoje projekty tutaj'
            }
          </p>
          {(!searchQuery && statusFilter === 'all' && typeFilter === 'all') && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Rozpocznij nowy projekt
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
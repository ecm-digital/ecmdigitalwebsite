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
  FolderOpen,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
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

  const activeProjects = projects.filter(p => p.status !== 'completed')
  const completedProjects = projects.filter(p => p.status === 'completed')
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget_total || 0), 0)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-xl w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 lg:p-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                <FolderOpen className="h-4 w-4 mr-2" />
                Zarządzanie Projektami
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Twoje Projekty
              </h1>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                Zarządzaj swoimi projektami i śledź postępy w czasie rzeczywistym
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-white/80 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Aktywnych: {activeProjects.length}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ukończonych: {completedProjects.length}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Budżet: ${totalBudget.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="hidden lg:block mt-8 lg:mt-0">
              <Button className="btn-primary-modern text-lg px-8 py-4">
                <Plus className="h-5 w-5 mr-2" />
                Nowy Projekt
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
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium text-sm">Aktywne Projekty</p>
              <p className="text-3xl font-bold text-blue-900">{activeProjects.length}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-xl">
              <FolderOpen className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium text-sm">Ukończone</p>
              <p className="text-3xl font-bold text-green-900">{completedProjects.length}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-medium text-sm">Całkowity Budżet</p>
              <p className="text-3xl font-bold text-purple-900">${totalBudget.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-xl">
              <BarChart3 className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Szukaj projektów, opisów, nazw..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-modern pl-12 text-lg"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48 h-12 text-lg border-slate-200/50 rounded-xl">
              <SelectValue placeholder="Status projektu" />
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
            <SelectTrigger className="w-full lg:w-48 h-12 text-lg border-slate-200/50 rounded-xl">
              <SelectValue placeholder="Typ projektu" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            className="h-12 px-6 border-slate-200/50 rounded-xl hover:bg-slate-50"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filtry
          </Button>
        </div>
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
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'Brak projektów spełniających kryteria'
              : 'Brak projektów'
            }
          </h3>
          <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Spróbuj zmienić filtry wyszukiwania lub rozszerzyć kryteria'
              : 'Rozpocznij współpracę z ECM Digital, aby zobaczyć swoje projekty tutaj'
            }
          </p>
          {(!searchQuery && statusFilter === 'all' && typeFilter === 'all') && (
            <Button className="btn-primary-modern text-lg px-8 py-4">
              <Plus className="h-5 w-5 mr-2" />
              Rozpocznij nowy projekt
            </Button>
          )}
        </div>
      )}

      {/* Mobile New Project Button */}
      <div className="lg:hidden">
        <Button className="btn-primary-modern w-full text-lg py-4">
          <Plus className="h-5 w-5 mr-2" />
          Nowy Projekt
        </Button>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Eye, Globe, Calendar, User } from 'lucide-react'
import Link from 'next/link'

interface CaseStudy {
  id: string
  title: string
  client: string
  industry: string
  projectType: 'www' | 'shopify' | 'mvp' | 'ux'
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  author: string
  slug: string
  featured: boolean
}

// Mock data - w rzeczywistej aplikacji będzie z API
const mockCaseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'TechFlow Solutions - Startup Website',
    client: 'TechFlow Solutions',
    industry: 'Technology & SaaS',
    projectType: 'www',
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    author: 'Jan Kowalski',
    slug: 'techflow-solutions',
    featured: true
  },
  {
    id: '2',
    title: 'Premium Estates - Luxury Real Estate',
    client: 'Premium Estates',
    industry: 'Real Estate',
    projectType: 'www',
    status: 'published',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    author: 'Anna Nowak',
    slug: 'premium-estates',
    featured: false
  },
  {
    id: '3',
    title: 'HealthTech Telemedicine Platform',
    client: 'MedConnect',
    industry: 'Healthcare',
    projectType: 'mvp',
    status: 'draft',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
    author: 'Piotr Wiśniewski',
    slug: 'healthtech-telemedicine',
    featured: false
  }
]

const projectTypeLabels = {
  www: 'Strona WWW',
  shopify: 'Sklep Shopify',
  mvp: 'Prototyp MVP',
  ux: 'Audyt UX'
}

const statusLabels = {
  draft: 'Szkic',
  published: 'Opublikowany',
  archived: 'Zarchiwizowany'
}

const statusColors = {
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800'
}

export default function CaseStudiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const filteredCaseStudies = mockCaseStudies.filter(caseStudy => {
    const matchesSearch = caseStudy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseStudy.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || caseStudy.projectType === selectedType
    const matchesStatus = selectedStatus === 'all' || caseStudy.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Studies</h1>
          <p className="text-muted-foreground">
            Zarządzaj portfolio projektów i publikuj case studies na stronie
          </p>
        </div>
        <Link href="/dashboard/case-studies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nowy Case Study
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Szukaj case studies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="all">Wszystkie typy</option>
              <option value="www">Strony WWW</option>
              <option value="shopify">Sklepy Shopify</option>
              <option value="mvp">Prototypy MVP</option>
              <option value="ux">Audyty UX</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="draft">Szkice</option>
              <option value="published">Opublikowane</option>
              <option value="archived">Zarchiwizowane</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Case Studies Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCaseStudies.map((caseStudy) => (
          <Card key={caseStudy.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg leading-tight">
                    {caseStudy.title}
                  </CardTitle>
                  <CardDescription>
                    {caseStudy.client} • {caseStudy.industry}
                  </CardDescription>
                </div>
                {caseStudy.featured && (
                  <Badge variant="secondary">Wyróżniony</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {projectTypeLabels[caseStudy.projectType]}
                  </Badge>
                  <Badge className={statusColors[caseStudy.status]}>
                    {statusLabels[caseStudy.status]}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {caseStudy.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Zaktualizowano: {new Date(caseStudy.updatedAt).toLocaleDateString('pl-PL')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/case-studies/${caseStudy.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edytuj
                    </Button>
                  </Link>
                  <Link href={`/dashboard/case-studies/${caseStudy.id}/preview`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  {caseStudy.status === 'published' && (
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCaseStudies.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Brak case studies</h3>
              <p className="text-muted-foreground">
                Nie znaleziono case studies spełniających kryteria wyszukiwania.
              </p>
              <Link href="/dashboard/case-studies/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Stwórz pierwszy case study
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
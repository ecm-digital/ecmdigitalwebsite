'use client'

import { Project } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  ExternalLink,
  MessageSquare,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface ProjectCardProps {
  project: Project
  onViewDetails?: (project: Project) => void
}

const statusColors = {
  'discovery': 'bg-blue-100 text-blue-800 border-blue-200',
  'design': 'bg-purple-100 text-purple-800 border-purple-200',
  'development': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'testing': 'bg-orange-100 text-orange-800 border-orange-200',
  'completed': 'bg-green-100 text-green-800 border-green-200',
  'on-hold': 'bg-gray-100 text-gray-800 border-gray-200',
}

const statusLabels = {
  'discovery': 'Analiza',
  'design': 'Projektowanie',
  'development': 'Rozwój',
  'testing': 'Testowanie',
  'completed': 'Ukończone',
  'on-hold': 'Wstrzymane',
}

const typeLabels = {
  'website': 'Strona WWW',
  'shopify': 'Sklep Shopify',
  'mvp': 'Prototyp MVP',
  'ux-audit': 'Audyt UX',
  'automation': 'Automatyzacja',
  'social-media': 'Social Media',
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const budgetProgress = project.budget_total && project.budget_used 
    ? (project.budget_used / project.budget_total) * 100 
    : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: pl })
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {project.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {typeLabels[project.type]} • {project.description}
            </CardDescription>
          </div>
          <Badge 
            variant="secondary" 
            className={statusColors[project.status]}
          >
            {statusLabels[project.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Budget Progress */}
        {project.budget_total && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Budżet</span>
              <span className="font-medium">
                {formatCurrency(project.budget_used || 0)} / {formatCurrency(project.budget_total)}
              </span>
            </div>
            <Progress value={budgetProgress} className="h-2" />
          </div>
        )}

        {/* Timeline */}
        {(project.start_date || project.end_date) && (
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {project.start_date && formatDate(project.start_date)}
                {project.start_date && project.end_date && ' - '}
                {project.end_date && formatDate(project.end_date)}
              </span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
              <MessageSquare className="h-4 w-4" />
              <span>Wiadomości</span>
            </button>
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
              <FileText className="h-4 w-4" />
              <span>Dokumenty</span>
            </button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(project)}
            className="flex items-center space-x-1"
          >
            <span>Szczegóły</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
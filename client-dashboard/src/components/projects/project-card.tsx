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
  FileText,
  FolderOpen,
  TrendingUp,
  Users,
  ArrowRight
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

const typeIcons = {
  'website': '🌐',
  'shopify': '🛍️',
  'mvp': '🚀',
  'ux-audit': '🔍',
  'automation': '⚡',
  'social-media': '📱',
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
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 hover:from-white hover:to-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-slate-200/50">
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
              <span className="text-2xl">{typeIcons[project.type]}</span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                {project.name}
              </CardTitle>
              <CardDescription className="mt-1 text-slate-600 font-medium">
                {typeLabels[project.type]}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className={`${statusColors[project.status]} border font-semibold px-3 py-1`}
          >
            {statusLabels[project.status]}
          </Badge>
        </div>
        
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-5 relative z-10">
        {/* Budget Progress */}
        {project.budget_total && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                Budżet projektu
              </span>
              <span className="font-bold text-slate-900">
                {formatCurrency(project.budget_used || 0)} / {formatCurrency(project.budget_total)}
              </span>
            </div>
            <div className="relative">
              <Progress value={budgetProgress} className="h-3 bg-slate-200" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-green-600 opacity-20"></div>
            </div>
            <div className="text-right text-sm font-medium text-slate-700">
              {budgetProgress.toFixed(1)}% wykorzystane
            </div>
          </div>
        )}

        {/* Timeline */}
        {(project.start_date || project.end_date) && (
          <div className="flex items-center space-x-3 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="font-medium">
              {project.start_date && formatDate(project.start_date)}
              {project.start_date && project.end_date && ' - '}
              {project.end_date && formatDate(project.end_date)}
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-sm text-slate-600 hover:text-blue-600 transition-colors group">
              <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                <MessageSquare className="h-4 w-4" />
              </div>
              <span className="font-medium">Wiadomości</span>
            </button>
            <button className="flex items-center space-x-2 text-sm text-slate-600 hover:text-green-600 transition-colors group">
              <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-green-100 transition-colors">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-medium">Dokumenty</span>
            </button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(project)}
            className="flex items-center space-x-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl px-4 py-2"
          >
            <span className="font-medium">Szczegóły</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
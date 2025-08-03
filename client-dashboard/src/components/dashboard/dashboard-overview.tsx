'use client'

import { useProjects } from '@/hooks/use-projects'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DemoDataBanner } from './demo-data-banner'
import { 
  FolderOpen, 
  Clock, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Calendar,
  MessageSquare,
  FileText
} from 'lucide-react'

const statusColors = {
  'discovery': 'bg-blue-100 text-blue-800',
  'design': 'bg-purple-100 text-purple-800',
  'development': 'bg-yellow-100 text-yellow-800',
  'testing': 'bg-orange-100 text-orange-800',
  'completed': 'bg-green-100 text-green-800',
  'on-hold': 'bg-gray-100 text-gray-800',
}

const statusLabels = {
  'discovery': 'Analiza',
  'design': 'Projektowanie',
  'development': 'Rozwój',
  'testing': 'Testowanie',
  'completed': 'Ukończone',
  'on-hold': 'Wstrzymane',
}

export function DashboardOverview() {
  const { projects, loading } = useProjects()
  const { profile } = useAuth()

  const activeProjects = projects.filter(p => p.status !== 'completed')
  const completedProjects = projects.filter(p => p.status === 'completed')
  
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget_total || 0), 0)
  const usedBudget = projects.reduce((sum, p) => sum + (p.budget_used || 0), 0)
  const budgetProgress = totalBudget > 0 ? (usedBudget / totalBudget) * 100 : 0

  const recentProjects = projects.slice(0, 5)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Data Banner */}
      <DemoDataBanner />

      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Witaj, {profile?.contact_person || 'Użytkowniku'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Oto przegląd Twoich projektów i aktywności
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktywne Projekty</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              z {projects.length} wszystkich
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukończone</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              projektów zakończonych
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budżet</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN'
              }).format(totalBudget)}
            </div>
            <Progress value={budgetProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {budgetProgress.toFixed(1)}% wykorzystane
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Średni Postęp</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeProjects.length > 0 ? '67%' : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              wszystkich projektów
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie Projekty</CardTitle>
            <CardDescription>
              Twoje najnowsze projekty i ich status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{project.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{project.type}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={statusColors[project.status]}
                    >
                      {statusLabels[project.status]}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Brak projektów do wyświetlenia</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Szybkie Akcje</CardTitle>
            <CardDescription>
              Najczęściej używane funkcje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="/dashboard/messages"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors relative"
              >
                <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Wiadomości</span>
                {/* TODO: Add unread count badge */}
              </a>
              
              <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">Dokumenty</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Kalendarz</span>
              </button>
              
              <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <DollarSign className="h-8 w-8 text-orange-600 mb-2" />
                <span className="text-sm font-medium">Faktury</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
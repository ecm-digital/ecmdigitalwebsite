'use client'

import { useProjects } from '@/hooks/use-projects'
import { useAuth } from '@/hooks/use-auth'
import { useUnreadMessages } from '@/hooks/use-unread-messages'
import { useLanguage } from '@/hooks/use-language'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DemoDataBanner } from './demo-data-banner'
import { 
  FolderOpen, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Calendar,
  MessageSquare,
  FileText,
  Zap,
  LayoutDashboard
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
  const unreadCount = useUnreadMessages()
  const { t } = useLanguage()

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
    <div className="space-y-8">
      {/* Demo Data Banner */}
      <DemoDataBanner />

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('dashboard.welcome')}, {profile?.contact_person || 'User'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {t('dashboard.overview')}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <LayoutDashboard className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{t('dashboard.stats.activeProjects')}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{activeProjects.length}</div>
            <p className="text-xs text-slate-500 mt-1">
              {t('dashboard.stats.allProjects')} {projects.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{t('dashboard.stats.completed')}</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{completedProjects.length}</div>
            <p className="text-xs text-slate-500 mt-1">
              {t('dashboard.stats.completedProjects')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{t('dashboard.stats.budget')}</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN'
              }).format(totalBudget)}
            </div>
            <Progress value={budgetProgress} className="mt-2 h-2" />
            <p className="text-xs text-slate-500 mt-1">
              {budgetProgress.toFixed(1)}% {t('dashboard.stats.utilized')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{t('dashboard.stats.averageProgress')}</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {activeProjects.length > 0 ? '67%' : '0%'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t('dashboard.stats.allProjectsProgress')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-blue-600" />
              <span>{t('dashboard.sections.recentProjects')}</span>
            </CardTitle>
            <CardDescription>
              {t('dashboard.sections.recentProjectsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{project.name}</h4>
                      <p className="text-sm text-slate-500 capitalize">{project.type}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${statusColors[project.status]} border-0 font-medium`}
                    >
                      {statusLabels[project.status]}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <FolderOpen className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium">Brak projektów</p>
                  <p className="text-sm">Twoje projekty pojawią się tutaj</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span>{t('dashboard.sections.quickActions')}</span>
            </CardTitle>
            <CardDescription>
              {t('dashboard.sections.quickActionsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="/dashboard/messages"
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 relative"
              >
                <MessageSquare className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-slate-900">{t('dashboard.actions.messages')}</span>
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </a>
              
              <a 
                href="/dashboard/documents"
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105"
              >
                <FileText className="h-8 w-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-slate-900">{t('dashboard.actions.documents')}</span>
              </a>
              
              <button className="group flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105">
                <Calendar className="h-8 w-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-slate-900">{t('dashboard.actions.calendar')}</span>
              </button>
              
              <button className="group flex flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:scale-105">
                <DollarSign className="h-8 w-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-slate-900">{t('dashboard.actions.invoices')}</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
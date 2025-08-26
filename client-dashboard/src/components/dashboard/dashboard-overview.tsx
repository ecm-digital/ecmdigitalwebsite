'use client'

import { useProjects } from '@/hooks/use-projects'
import { useAWSAuth } from '@/hooks/use-aws-auth'
import { useUnreadMessages } from '@/hooks/use-unread-messages'
import { useLanguage } from '@/hooks/use-language'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FolderOpen, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Calendar,
  MessageSquare,
  FileText,
  Zap,
  LayoutDashboard,
  Plus,
  ArrowRight,
  Users,
  Clock
} from 'lucide-react'

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

export function DashboardOverview() {
  const { projects, loading } = useProjects()
  const { user } = useAWSAuth()
  const unreadCount = useUnreadMessages()
  const { t } = useLanguage()

  // Fallback data if user or projects are not available
  const safeUser = user || { name: 'Użytkownik', email: 'user@example.com', role: 'client' }
  const safeProjects = projects || []
  const safeUnreadCount = unreadCount || 0

  const activeProjects = safeProjects.filter(p => p.status !== 'completed')
  const completedProjects = safeProjects.filter(p => p.status === 'completed')
  
  const totalBudget = safeProjects.reduce((sum, p) => sum + (p.budget_total || 0), 0)
  const usedBudget = safeProjects.reduce((sum, p) => sum + (p.budget_used || 0), 0)
  const budgetProgress = totalBudget > 0 ? (usedBudget / totalBudget) * 100 : 0

  const recentProjects = safeProjects.slice(0, 5)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-xl w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 lg:p-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                <Users className="h-4 w-4 mr-2" />
                Panel Klienta
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {t('dashboard.welcome')}, {safeUser?.name || safeUser?.email || 'User'}! 👋
              </h1>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                {t('dashboard.overview')}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center text-white/80 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
                </div>
              </div>
            </div>
            <div className="hidden lg:block mt-8 lg:mt-0">
              <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <LayoutDashboard className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-blue-900">Aktywne Projekty</CardTitle>
            <div className="p-2.5 bg-blue-200 rounded-xl group-hover:bg-blue-300 transition-colors">
              <FolderOpen className="h-5 w-5 text-blue-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-1">{activeProjects.length}</div>
            <p className="text-sm text-blue-700 font-medium">
              {t('dashboard.stats.activeProjectsDesc')}
            </p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-green-900">Ukończone Projekty</CardTitle>
            <div className="p-2.5 bg-green-200 rounded-xl group-hover:bg-green-300 transition-colors">
              <CheckCircle className="h-5 w-5 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-1">{completedProjects.length}</div>
            <p className="text-sm text-green-700 font-medium">
              {t('dashboard.stats.completedProjectsDesc')}
            </p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-purple-900">Całkowity Budżet</CardTitle>
            <div className="p-2.5 bg-purple-200 rounded-xl group-hover:bg-purple-300 transition-colors">
              <DollarSign className="h-5 w-5 text-purple-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-1">${totalBudget.toLocaleString()}</div>
            <p className="text-sm text-purple-700 font-medium">
              {t('dashboard.stats.totalBudgetDesc')}
            </p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-orange-900">Nieprzeczytane Wiadomości</CardTitle>
            <div className="p-2.5 bg-orange-200 rounded-xl group-hover:bg-orange-300 transition-colors">
              <MessageSquare className="h-5 w-5 text-orange-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-1">{safeUnreadCount}</div>
            <p className="text-sm text-orange-700 font-medium">
              {t('dashboard.stats.unreadMessagesDesc')}
            </p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Card>
      </div>

      {/* Budget Progress */}
      {totalBudget > 0 && (
        <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Postęp Budżetu
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Śledź wykorzystanie budżetu w projektach
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between text-sm font-medium text-slate-700">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Wykorzystane: ${usedBudget.toLocaleString()}
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-slate-300 rounded-full mr-2"></div>
                Całkowity: ${totalBudget.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <Progress value={budgetProgress} className="h-4 bg-slate-200" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-20"></div>
            </div>
            <div className="text-right text-lg font-bold text-slate-800">
              {budgetProgress.toFixed(1)}% wykorzystane
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
                Ostatnie Projekty
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Twoje najnowsze projekty i ich status
              </CardDescription>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Wszystkie projekty
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                        <FolderOpen className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{project.name}</h4>
                        <p className="text-slate-600 text-sm">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={`${statusColors[project.status as keyof typeof statusColors]} border font-medium`}>
                        {statusLabels[project.status as keyof typeof statusLabels]}
                      </Badge>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">${project.budget_total?.toLocaleString() || '0'}</div>
                        <div className="text-xs text-slate-500">budżet</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-600" />
            Szybkie Akcje
          </CardTitle>
          <CardDescription className="text-slate-600 text-base">
            Najczęściej używane funkcje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-200 hover:border-blue-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-200 rounded-xl group-hover:bg-blue-300 transition-colors">
                  <Plus className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 text-lg group-hover:text-blue-800 transition-colors">
                    {t('dashboard.quickActions.newProject')}
                  </h4>
                  <p className="text-blue-700 text-sm font-medium">
                    {t('dashboard.quickActions.newProjectDesc')}
                  </p>
                </div>
              </div>
            </button>

            <button className="group p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-lg border border-green-200 hover:border-green-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-200 rounded-xl group-hover:bg-green-300 transition-colors">
                  <MessageSquare className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 text-lg group-hover:text-green-800 transition-colors">
                    {t('dashboard.quickActions.sendMessage')}
                  </h4>
                  <p className="text-green-700 text-sm font-medium">
                    {t('dashboard.quickActions.sendMessageDesc')}
                  </p>
                </div>
              </div>
            </button>

            <button className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-lg border border-purple-200 hover:border-purple-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-200 rounded-xl group-hover:bg-purple-300 transition-colors">
                  <FileText className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900 text-lg group-hover:text-purple-800 transition-colors">
                    {t('dashboard.quickActions.uploadDocument')}
                  </h4>
                  <p className="text-purple-700 text-sm font-medium">
                    {t('dashboard.quickActions.uploadDocumentDesc')}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
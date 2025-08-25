'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Clock,
  DollarSign,
  Calendar,
  Target,
  Award,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Download,
  RefreshCw,
  Eye,
  Filter
} from 'lucide-react'

interface AnalyticsData {
  period: string
  projects: {
    total: number
    active: number
    completed: number
    onHold: number
  }
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  performance: {
    onTime: number
    delayed: number
    quality: number
    satisfaction: number
  }
  team: {
    totalMembers: number
    activeMembers: number
    productivity: number
    utilization: number
  }
}

// Mock data
const mockAnalytics: AnalyticsData = {
  period: '2024',
  projects: {
    total: 24,
    active: 8,
    completed: 14,
    onHold: 2
  },
  revenue: {
    total: 125000,
    thisMonth: 18500,
    lastMonth: 16200,
    growth: 14.2
  },
  performance: {
    onTime: 87,
    delayed: 13,
    quality: 94,
    satisfaction: 96
  },
  team: {
    totalMembers: 12,
    activeMembers: 10,
    productivity: 89,
    utilization: 92
  }
}

const timePeriods = [
  { value: '7d', label: 'Ostatnie 7 dni' },
  { value: '30d', label: 'Ostatnie 30 dni' },
  { value: '90d', label: 'Ostatnie 90 dni' },
  { value: '1y', label: 'Ostatni rok' },
  { value: 'all', label: 'Wszystkie' },
]

export function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('1y')
  const [selectedMetric, setSelectedMetric] = useState('overview')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value}%`
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 lg:p-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analityka i Raporty
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Analityka
              </h1>
              <p className="text-xl text-indigo-100 mb-6 max-w-2xl">
                Szczegółowe metryki wydajności projektów i zespołu
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-white/80 text-sm">
                  <Target className="h-4 w-4 mr-2" />
                  Projekty: {mockAnalytics.projects.total}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Przychód: {formatCurrency(mockAnalytics.revenue.total)}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Zespół: {mockAnalytics.team.totalMembers}
                </div>
              </div>
            </div>
            <div className="hidden lg:block mt-8 lg:mt-0">
              <div className="flex space-x-3">
                <Button className="btn-secondary-modern text-lg px-6 py-4 bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Download className="h-5 w-5 mr-2" />
                  Eksportuj
                </Button>
                <Button className="btn-primary-modern text-lg px-6 py-4 bg-indigo-600 hover:bg-indigo-700">
                  <Eye className="h-5 w-5 mr-2" />
                  Szczegóły
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48 h-12 text-lg border-slate-200/50 rounded-xl">
                <SelectValue placeholder="Okres" />
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map(period => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-48 h-12 text-lg border-slate-200/50 rounded-xl">
                <SelectValue placeholder="Metryka" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Przegląd ogólny</SelectItem>
                <SelectItem value="projects">Projekty</SelectItem>
                <SelectItem value="revenue">Przychody</SelectItem>
                <SelectItem value="performance">Wydajność</SelectItem>
                <SelectItem value="team">Zespół</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <Button 
              variant="outline" 
              className="h-12 px-6 border-slate-200/50 rounded-xl hover:bg-slate-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtry
            </Button>
            
            <Button 
              variant="outline" 
              className="h-12 px-6 border-slate-200/50 rounded-xl hover:bg-slate-50"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Odśwież
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-blue-900">Aktywne Projekty</CardTitle>
            <div className="p-2.5 bg-blue-200 rounded-xl group-hover:bg-blue-300 transition-colors">
              <Target className="h-5 w-5 text-blue-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-1">{mockAnalytics.projects.active}</div>
            <p className="text-sm text-blue-700 font-medium">
              z {mockAnalytics.projects.total} wszystkich
            </p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-green-900">Przychód Miesięczny</CardTitle>
            <div className="p-2.5 bg-green-200 rounded-xl group-hover:bg-green-300 transition-colors">
              <TrendingUp className="h-5 w-5 text-green-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-1">{formatCurrency(mockAnalytics.revenue.thisMonth)}</div>
            <p className="text-sm text-green-700 font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{mockAnalytics.revenue.growth}% vs poprzedni miesiąc
            </p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-purple-900">Jakość Projektów</CardTitle>
            <div className="p-2.5 bg-purple-200 rounded-xl group-hover:bg-purple-300 transition-colors">
              <Award className="h-5 w-5 text-purple-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-1">{formatPercentage(mockAnalytics.performance.quality)}</div>
            <p className="text-sm text-purple-700 font-medium">
              Średnia ocena jakości
            </p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-orange-900">Wykorzystanie Zespołu</CardTitle>
            <div className="p-2.5 bg-orange-200 rounded-xl group-hover:bg-orange-300 transition-colors">
              <Users className="h-5 w-5 text-orange-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-1">{formatPercentage(mockAnalytics.team.utilization)}</div>
            <p className="text-sm text-orange-700 font-medium">
              {mockAnalytics.team.activeMembers} z {mockAnalytics.team.totalMembers} aktywnych
            </p>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-green-600" />
              Przychody w Czasie
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Trend przychodów w ostatnich miesiącach
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p className="text-green-600 font-medium">Wykres przychodów</p>
                <p className="text-green-500 text-sm">Integracja z biblioteką wykresów</p>
              </div>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-700">
              <span>Styczeń: {formatCurrency(15000)}</span>
              <span>Luty: {formatCurrency(16200)}</span>
              <span>Marzec: {formatCurrency(18500)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Projects Status Chart */}
        <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-600" />
              Status Projektów
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Rozkład projektów według statusu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-blue-600 font-medium">Wykres statusów</p>
                <p className="text-blue-500 text-sm">Integracja z biblioteką wykresów</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-900">{mockAnalytics.projects.active}</div>
                <div className="text-sm text-blue-600">Aktywne</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">{mockAnalytics.projects.completed}</div>
                <div className="text-sm text-green-600">Ukończone</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-900">{mockAnalytics.projects.onHold}</div>
                <div className="text-sm text-orange-600">Wstrzymane</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-600" />
            Metryki Wydajności
          </CardTitle>
          <CardDescription className="text-slate-600 text-base">
            Szczegółowe wskaźniki KPI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{formatPercentage(mockAnalytics.performance.onTime)}</div>
              <div className="text-sm text-slate-600">Projektów na czas</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">{formatPercentage(mockAnalytics.performance.delayed)}</div>
              <div className="text-sm text-slate-600">Projektów opóźnionych</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{formatPercentage(mockAnalytics.performance.satisfaction)}</div>
              <div className="text-sm text-slate-600">Zadowolenie klientów</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">{formatPercentage(mockAnalytics.team.productivity)}</div>
              <div className="text-sm text-slate-600">Produktywność zespołu</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Export Button */}
      <div className="lg:hidden">
        <Button className="btn-primary-modern w-full text-lg py-4 bg-indigo-600 hover:bg-indigo-700">
          <Download className="h-5 w-5 mr-2" />
          Eksportuj Raport
        </Button>
      </div>
    </div>
  )
}

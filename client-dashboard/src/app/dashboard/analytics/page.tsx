'use client'

import { useAWSAuth } from '@/hooks/use-aws-auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'

// Lazy load AnalyticsDashboard component
const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics/analytics-dashboard').then(mod => ({ default: mod.AnalyticsDashboard })),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-80 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    ),
    ssr: false
  }
)

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAWSAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analityka</h1>
          <p className="text-muted-foreground">
            Szczegółowe metryki i statystyki Twoich projektów
          </p>
        </div>
        
        <Suspense fallback={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-80 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        }>
          <AnalyticsDashboard />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}













'use client'

import { useAWSAuth } from '@/hooks/use-aws-auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'

// Lazy load DashboardOverview component
const DashboardOverview = dynamic(
  () => import('@/components/dashboard/dashboard-overview').then(mod => ({ default: mod.DashboardOverview })),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    ),
    ssr: false
  }
)

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAWSAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
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
      <Suspense fallback={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      }>
        <DashboardOverview />
      </Suspense>
    </DashboardLayout>
  )
}
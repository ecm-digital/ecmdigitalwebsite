'use client'

import { useAWSAuth } from '@/hooks/use-aws-auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TestPage() {
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
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Strona testowa</h1>
        <p className="text-gray-600">
          To jest strona testowa do sprawdzania funkcjonalności dashboardu.
        </p>
      </div>
    </DashboardLayout>
  )
}
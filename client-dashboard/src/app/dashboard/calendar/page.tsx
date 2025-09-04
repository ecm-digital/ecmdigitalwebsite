'use client'

import { useAWSAuth } from '@/hooks/use-aws-auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { CalendarDashboard } from '@/components/calendar/calendar-dashboard'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CalendarPage() {
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
      <CalendarDashboard />
    </DashboardLayout>
  )
}












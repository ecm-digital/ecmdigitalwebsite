'use client'

import { useAuth } from '@/hooks/use-auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProjectsList } from '@/components/projects/projects-list'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProjectsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
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
      <ProjectsList />
    </DashboardLayout>
  )
}
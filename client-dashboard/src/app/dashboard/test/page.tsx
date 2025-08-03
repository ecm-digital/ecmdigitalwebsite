'use client'

import { useAuth } from '@/hooks/use-auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { FileUploadTest } from '@/components/ui/file-upload-test'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TestPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Upload Plików</h1>
          <p className="text-gray-600 mt-2">
            Strona testowa do sprawdzania funkcjonalności uploadu plików
          </p>
        </div>

        <FileUploadTest />
      </div>
    </DashboardLayout>
  )
}
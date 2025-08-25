'use client'

import { useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { useProjects } from '@/hooks/use-projects'
import { useAWSAuth } from '@/hooks/use-aws-auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, DollarSign, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAWSAuth()
  const { projects, getProjectById, fetchProjects } = useProjects()

  const projectId = params?.id

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!projects.length) {
      fetchProjects()
    }
  }, [projects.length, fetchProjects])

  const project = useMemo(() => (projectId ? getProjectById(projectId) : null), [projectId, projects])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (!project) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Wróć
          </Button>
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p className="text-slate-700">Nie znaleziono projektu.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const budgetProgress = project.budget_total && project.budget_used
    ? (project.budget_used / project.budget_total) * 100
    : 0

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(amount)

  const formatDate = (dateString: string) => format(new Date(dateString), 'dd MMM yyyy', { locale: pl })

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Button variant="outline" onClick={() => router.push('/dashboard/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Wszystkie projekty
        </Button>

        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
              {project.description && (
                <p className="text-slate-600 mt-2 max-w-2xl">{project.description}</p>
              )}
            </div>
            <Badge>{project.status}</Badge>
          </div>

          {project.budget_total && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600" /> Budżet projektu
                </span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(project.budget_used || 0)} / {formatCurrency(project.budget_total)}
                </span>
              </div>
              <Progress value={budgetProgress} className="h-3 bg-slate-200" />
            </div>
          )}

          {(project.start_date || project.end_date) && (
            <div className="mt-6 flex items-center space-x-3 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium">
                {project.start_date && formatDate(project.start_date)}
                {project.start_date && project.end_date && ' - '}
                {project.end_date && formatDate(project.end_date)}
              </span>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}



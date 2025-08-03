'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Info, 
  Plus, 
  Trash2, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { createDemoDataForUser, removeDemoData, hasDemoData } from '@/lib/supabase/demo-data'

export function DemoDataBanner() {
  const [hasDemo, setHasDemo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    checkDemoData()
  }, [])

  const checkDemoData = async () => {
    try {
      const result = await hasDemoData()
      setHasDemo(result)
    } catch (error) {
      console.error('Error checking demo data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDemo = async () => {
    setActionLoading(true)
    setMessage(null)

    try {
      const result = await createDemoDataForUser()
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setHasDemo(true)
        // Odśwież stronę po 2 sekundach
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setMessage({ type: 'error', text: result.error || 'Wystąpił błąd' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Wystąpił nieoczekiwany błąd' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveDemo = async () => {
    if (!confirm('Czy na pewno chcesz usunąć wszystkie przykładowe dane?')) {
      return
    }

    setActionLoading(true)
    setMessage(null)

    try {
      const result = await removeDemoData()
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setHasDemo(false)
        // Odśwież stronę po 2 sekundach
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setMessage({ type: 'error', text: result.error || 'Wystąpił błąd' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Wystąpił nieoczekiwany błąd' })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return null
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-medium text-blue-900">
                {hasDemo ? 'Przykładowe dane' : 'Witaj w ECM Digital Dashboard!'}
              </h3>
              {hasDemo && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  DEMO
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-blue-800 mb-3">
              {hasDemo 
                ? 'Twój dashboard zawiera przykładowe projekty i dane demonstracyjne. Możesz je usunąć w dowolnym momencie.'
                : 'Aby lepiej poznać funkcjonalności dashboardu, możesz dodać przykładowe projekty i dane demonstracyjne.'
              }
            </p>

            {message && (
              <div className={`flex items-center space-x-2 mb-3 p-2 rounded ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <div className="flex space-x-2">
              {!hasDemo ? (
                <Button
                  size="sm"
                  onClick={handleCreateDemo}
                  disabled={actionLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Dodaj przykładowe dane
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRemoveDemo}
                  disabled={actionLoading}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Usuń dane demo
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
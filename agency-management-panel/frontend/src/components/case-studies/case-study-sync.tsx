'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Download, Eye, Sync } from 'lucide-react'

interface ExistingCaseStudy {
  category: string
  fileName: string
  slug: string
  path: string
}

const categoryLabels = {
  www: 'Strony WWW',
  shopify: 'Sklepy Shopify',
  mvp: 'Prototypy MVP',
  ux: 'Audyty UX'
}

export function CaseStudySync() {
  const [existingCaseStudies, setExistingCaseStudies] = useState<ExistingCaseStudy[]>([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState<string | null>(null)

  const fetchExistingCaseStudies = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/case-studies/publish')
      const result = await response.json()
      
      if (result.success) {
        setExistingCaseStudies(result.caseStudies)
      } else {
        console.error('Error fetching case studies:', result.error)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncCaseStudy = async (caseStudy: ExistingCaseStudy) => {
    setSyncing(caseStudy.slug)
    
    // Tu będzie logika importu case study z markdown do bazy danych
    // Na razie tylko symulacja
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert(`✅ Case study "${caseStudy.fileName}" został zsynchronizowany z panelem zarządzania`)
    setSyncing(null)
  }

  const viewOnWebsite = (caseStudy: ExistingCaseStudy) => {
    // Tu będzie link do strony www z case study
    const websiteUrl = `https://ecm-digital.com/portfolio/${caseStudy.category}/${caseStudy.slug}`
    window.open(websiteUrl, '_blank')
  }

  useEffect(() => {
    fetchExistingCaseStudies()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Synchronizacja Case Studies</CardTitle>
            <CardDescription>
              Zarządzaj istniejącymi case studies z folderu dokumentacja-ecm
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchExistingCaseStudies}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Odśwież
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Ładowanie case studies...
          </div>
        ) : existingCaseStudies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nie znaleziono istniejących case studies w dokumentacji
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Znaleziono {existingCaseStudies.length} case studies w dokumentacji
            </div>
            
            <div className="grid gap-4">
              {existingCaseStudies.map((caseStudy) => (
                <div 
                  key={`${caseStudy.category}-${caseStudy.slug}`}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">
                      {categoryLabels[caseStudy.category as keyof typeof categoryLabels]}
                    </Badge>
                    <div>
                      <div className="font-medium">
                        {caseStudy.fileName.replace('.md', '').replace(/-/g, ' ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {caseStudy.path}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewOnWebsite(caseStudy)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => syncCaseStudy(caseStudy)}
                      disabled={syncing === caseStudy.slug}
                    >
                      {syncing === caseStudy.slug ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sync className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Ostatnia synchronizacja: {new Date().toLocaleString('pl-PL')}
                </span>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Importuj wszystkie
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Globe, Download } from 'lucide-react'
import Link from 'next/link'
import { CaseStudyExporter } from '@/components/case-studies/case-study-exporter'

// Mock data - w rzeczywistej aplikacji będzie z API
const mockCaseStudy = {
  id: '1',
  title: 'TechFlow Solutions - Startup Website',
  client: 'TechFlow Solutions',
  industry: 'Technology & SaaS',
  projectType: 'www' as const,
  duration: '3 miesiące',
  teamSize: '5 osób',
  technologies: ['Gatsby', 'Strapi', 'GraphQL', 'Netlify'],
  status: 'Zakończony, w trakcie wsparcia',
  
  challenge: {
    situation: 'TechFlow Solutions to młody startup technologiczny rozwijający platformę automatyzacji procesów biznesowych dla firm B2B. Zespół składający się z doświadczonych programistów potrzebował profesjonalnej strony internetowej, która pomoże im pozyskać pierwszych klientów i inwestorów.',
    problems: [
      'Brak wiarygodności online - startup bez profesjonalnej strony miał trudności z budowaniem zaufania',
      'Słaba komunikacja wartości - trudność w wyjaśnieniu złożonego produktu SaaS w prosty sposób',
      'Brak leadów - brak kanału pozyskiwania potencjalnych klientów i inwestorów'
    ],
    goals: [
      'Pozyskanie 50 leadów miesięcznie w ciągu 3 miesięcy od wdrożenia',
      'Budowanie marki w branży automatyzacji procesów',
      'Przygotowanie do rundy inwestycyjnej',
      'Zwiększenie ruchu organicznego o 250%'
    ],
    constraints: 'Budżet: 28,000 PLN (ograniczony budżet startupowy), Czas: 3 miesiące (przed targami technologicznymi), Techniczne: Szybkość ładowania, SEO, skalowalność, Prawne: Zgodność z RODO, ochrona IP'
  },
  
  solution: {
    strategy: 'Zaprojektowaliśmy nowoczesną, szybką stronę opartą na architekturze JAMstack, która skutecznie komunikuje wartość produktu SaaS i generuje leady. Skupiliśmy się na storytellingu i budowaniu zaufania przez prezentację zespołu i technologii.',
    phases: [
      {
        name: 'Strategia i Branding',
        description: 'Warsztat z założycielami nt. pozycjonowania produktu, opracowanie strategii content marketingu, stworzenie systemu identyfikacji wizualnej',
        results: 'Jasno zdefiniowana propozycja wartości i strategia komunikacji'
      },
      {
        name: 'Rozwój i Implementacja',
        description: 'Implementacja frontendu w Gatsby, rozwój headless CMS (Strapi), integracja z narzędziami marketingowymi',
        results: 'Funkcjonalna strona z systemem zarządzania treścią'
      },
      {
        name: 'Optymalizacja i Launch',
        description: 'Optymalizacja wydajności, testy A/B elementów konwersyjnych, przygotowanie strategii content marketingu',
        results: 'Zoptymalizowana strona gotowa do generowania leadów'
      }
    ],
    features: [
      'Interaktywne demo produktu - prezentacja możliwości platformy bez rejestracji',
      'Kalkulator ROI - narzędzie pokazujące potencjalne oszczędności',
      'Blog techniczny - centrum wiedzy o automatyzacji procesów'
    ],
    technologies: [
      {
        category: 'Frontend',
        technology: 'Gatsby + React',
        justification: 'Szybkość, SEO, developer experience'
      },
      {
        category: 'CMS',
        technology: 'Strapi (Headless)',
        justification: 'Elastyczność, API-first'
      },
      {
        category: 'Hosting',
        technology: 'Netlify + CDN',
        justification: 'Wydajność, CI/CD'
      }
    ]
  },
  
  results: {
    kpis: [
      {
        metric: 'Leady miesięcznie',
        before: '0',
        after: '65',
        change: '+6500%'
      },
      {
        metric: 'Ruch organiczny',
        before: '200/miesiąc',
        after: '700/miesiąc',
        change: '+250%'
      },
      {
        metric: 'Page Speed Score',
        before: 'N/A',
        after: '98/100',
        change: 'Nowy'
      }
    ],
    businessResults: [
      'Pozyskanie klientów: 8 nowych klientów B2B w pierwszym kwartale',
      'Runda inwestycyjna: Pozyskanie 500,000 EUR seed funding',
      'Budowanie marki: 2,500 subskrypcji newslettera technicznego'
    ],
    technicalResults: [
      'Wydajność: Średni czas ładowania 0.8s',
      'SEO: 45 fraz w top 10 Google w ciągu 6 miesięcy',
      'Skalowalność: Architektura przygotowana na viral growth'
    ],
    uxResults: [
      'Użyteczność: 89% użytkowników rozumie propozycję wartości w <30s',
      'Engagement: 35% użytkowników testuje interaktywne demo',
      'Mobile experience: 92% ruchu mobilnego z wysoką konwersją'
    ],
    roi: {
      investment: '28,000 PLN',
      returnFirstYear: '420,000 PLN',
      roiPercentage: '1,400%',
      paybackTime: '6 tygodni'
    }
  },
  
  testimonial: {
    quote: 'ECM Digital nie tylko stworzył nam profesjonalną stronę, ale pomógł zdefiniować naszą komunikację marketingową. Dzięki stronie pozyskaliśmy pierwszych klientów i inwestorów. To była najlepsza inwestycja w historii naszego startupu.',
    author: 'Michał Kowalski',
    position: 'CEO & Co-founder',
    company: 'TechFlow Solutions',
    additionalComments: [
      'Strona ładuje się błyskawicznie - nasi potencjalni klienci są pod wrażeniem',
      'Interaktywne demo produktu to strzał w dziesiątkę - konwersja znacznie wzrosła',
      'Blog techniczny pomógł nam zbudować pozycję eksperta w branży'
    ],
    ratings: {
      quality: 5,
      timeline: 5,
      communication: 5,
      support: 5,
      overall: 5
    }
  }
}

const projectTypeLabels = {
  www: 'Strona WWW',
  shopify: 'Sklep Shopify',
  mvp: 'Prototyp MVP',
  ux: 'Audyt UX'
}

export default function CaseStudyPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const [showExporter, setShowExporter] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/case-studies">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Podgląd Case Study</h1>
            <p className="text-muted-foreground">
              {mockCaseStudy.title}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/case-studies/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edytuj
            </Button>
          </Link>
          <Button onClick={() => setShowExporter(!showExporter)}>
            <Globe className="mr-2 h-4 w-4" />
            Eksportuj
          </Button>
        </div>
      </div>

      {/* Export Section */}
      {showExporter && (
        <CaseStudyExporter caseStudy={mockCaseStudy} />
      )}

      {/* Case Study Preview */}
      <div className="grid gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informacje o Projekcie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <strong>Klient:</strong> {mockCaseStudy.client}
              </div>
              <div>
                <strong>Branża:</strong> {mockCaseStudy.industry}
              </div>
              <div>
                <strong>Typ Projektu:</strong> 
                <Badge variant="outline" className="ml-2">
                  {projectTypeLabels[mockCaseStudy.projectType]}
                </Badge>
              </div>
              <div>
                <strong>Czas Realizacji:</strong> {mockCaseStudy.duration}
              </div>
              <div>
                <strong>Zespół:</strong> {mockCaseStudy.teamSize}
              </div>
              <div>
                <strong>Status:</strong> {mockCaseStudy.status}
              </div>
            </div>
            <div className="mt-4">
              <strong>Technologie:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {mockCaseStudy.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Challenge */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Wyzwanie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Sytuacja Wyjściowa</h4>
              <p className="text-muted-foreground">{mockCaseStudy.challenge.situation}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Główne Problemy</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {mockCaseStudy.challenge.problems.map((problem, index) => (
                  <li key={index}>{problem}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Cele Biznesowe</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {mockCaseStudy.challenge.goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Solution */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Rozwiązanie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Nasza Strategia</h4>
              <p className="text-muted-foreground">{mockCaseStudy.solution.strategy}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Proces Realizacji</h4>
              <div className="space-y-3">
                {mockCaseStudy.solution.phases.map((phase, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h5 className="font-medium">Faza {index + 1}: {phase.name}</h5>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                    <p className="text-sm font-medium text-green-600">Rezultaty: {phase.results}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Kluczowe Funkcjonalności</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {mockCaseStudy.solution.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Rezultaty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Kluczowe Wskaźniki</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">Wskaźnik</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Przed</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Po</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Zmiana</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCaseStudy.results.kpis.map((kpi, index) => (
                      <tr key={index}>
                        <td className="border border-gray-200 px-4 py-2">{kpi.metric}</td>
                        <td className="border border-gray-200 px-4 py-2">{kpi.before}</td>
                        <td className="border border-gray-200 px-4 py-2">{kpi.after}</td>
                        <td className="border border-gray-200 px-4 py-2 font-semibold text-green-600">
                          {kpi.change}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h5 className="font-medium mb-2">Rezultaty Biznesowe</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {mockCaseStudy.results.businessResults.map((result, index) => (
                    <li key={index}>• {result}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Rezultaty Techniczne</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {mockCaseStudy.results.technicalResults.map((result, index) => (
                    <li key={index}>• {result}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Rezultaty UX/UI</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {mockCaseStudy.results.uxResults.map((result, index) => (
                    <li key={index}>• {result}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonial */}
        <Card>
          <CardHeader>
            <CardTitle>💬 Opinia Klienta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
              "{mockCaseStudy.testimonial.quote}"
            </blockquote>
            <div className="text-right">
              <div className="font-semibold">{mockCaseStudy.testimonial.author}</div>
              <div className="text-sm text-muted-foreground">
                {mockCaseStudy.testimonial.position}, {mockCaseStudy.testimonial.company}
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">Ocena Współpracy</h5>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="flex justify-between">
                  <span>Jakość wykonania:</span>
                  <span>{'⭐'.repeat(mockCaseStudy.testimonial.ratings.quality)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dotrzymanie terminów:</span>
                  <span>{'⭐'.repeat(mockCaseStudy.testimonial.ratings.timeline)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Komunikacja:</span>
                  <span>{'⭐'.repeat(mockCaseStudy.testimonial.ratings.communication)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wsparcie:</span>
                  <span>{'⭐'.repeat(mockCaseStudy.testimonial.ratings.support)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
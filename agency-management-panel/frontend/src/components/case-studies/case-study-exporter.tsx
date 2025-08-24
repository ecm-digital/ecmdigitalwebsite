'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Globe, Copy, Check } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface CaseStudyData {
  id: string
  title: string
  client: string
  industry: string
  projectType: 'www' | 'shopify' | 'mvp' | 'ux'
  duration: string
  teamSize: string
  technologies: string[]
  status: string
  
  challenge: {
    situation: string
    problems: string[]
    goals: string[]
    constraints: string
  }
  solution: {
    strategy: string
    phases: Array<{
      name: string
      description: string
      results: string
    }>
    features: string[]
    technologies: Array<{
      category: string
      technology: string
      justification: string
    }>
  }
  results: {
    kpis: Array<{
      metric: string
      before: string
      after: string
      change: string
    }>
    businessResults: string[]
    technicalResults: string[]
    uxResults: string[]
    roi: {
      investment: string
      returnFirstYear: string
      roiPercentage: string
      paybackTime: string
    }
  }
  testimonial: {
    quote: string
    author: string
    position: string
    company: string
    additionalComments: string[]
    ratings: {
      quality: number
      timeline: number
      communication: number
      support: number
      overall: number
    }
  }
}

interface CaseStudyExporterProps {
  caseStudy: CaseStudyData
}

const projectTypeLabels = {
  www: 'Strona WWW',
  shopify: 'Sklep Shopify',
  mvp: 'Prototyp MVP',
  ux: 'Audyt UX'
}

export function CaseStudyExporter({ caseStudy }: CaseStudyExporterProps) {
  const [exportedMarkdown, setExportedMarkdown] = useState('')
  const [copied, setCopied] = useState(false)

  const generateMarkdown = () => {
    const markdown = `# ${caseStudy.title} - Case Study

## Informacje o Projekcie

| | |
|---|---|
| **Klient** | ${caseStudy.client} |
| **Branża** | ${caseStudy.industry} |
| **Typ Projektu** | ${projectTypeLabels[caseStudy.projectType]} |
| **Czas Realizacji** | ${caseStudy.duration} |
| **Zespół** | ${caseStudy.teamSize} |
| **Technologie** | ${caseStudy.technologies.join(', ')} |
| **Status** | ${caseStudy.status} |

---

## 🎯 Wyzwanie

### Sytuacja Wyjściowa

${caseStudy.challenge.situation}

### Główne Problemy do Rozwiązania

${caseStudy.challenge.problems.map(problem => `- **Problem**: ${problem}`).join('\n')}

### Cele Biznesowe

${caseStudy.challenge.goals.map(goal => `- ${goal}`).join('\n')}

### Ograniczenia i Wymagania

${caseStudy.challenge.constraints}

---

## 💡 Rozwiązanie

### Nasza Strategia

${caseStudy.solution.strategy}

### Proces Realizacji

${caseStudy.solution.phases.map((phase, index) => `
#### Faza ${index + 1}: ${phase.name}
- ${phase.description}
- **Rezultaty fazy**: ${phase.results}
`).join('\n')}

### Kluczowe Funkcjonalności

${caseStudy.solution.features.map(feature => `- **${feature}**`).join('\n')}

### Zastosowane Technologie

| Kategoria | Technologia | Uzasadnienie |
|-----------|-------------|--------------|
${caseStudy.solution.technologies.map(tech => 
  `| ${tech.category} | ${tech.technology} | ${tech.justification} |`
).join('\n')}

---

## 📈 Rezultaty

### Kluczowe Wskaźniki Efektywności

| Wskaźnik | Przed | Po | Zmiana |
|----------|-------|----|---------| 
${caseStudy.results.kpis.map(kpi => 
  `| ${kpi.metric} | ${kpi.before} | ${kpi.after} | **${kpi.change}** |`
).join('\n')}

### Szczegółowe Rezultaty

#### Rezultaty Biznesowe
${caseStudy.results.businessResults.map(result => `- **${result}**`).join('\n')}

#### Rezultaty Techniczne
${caseStudy.results.technicalResults.map(result => `- **${result}**`).join('\n')}

#### Rezultaty UX/UI
${caseStudy.results.uxResults.map(result => `- **${result}**`).join('\n')}

### ROI (Return on Investment)

- **Inwestycja**: ${caseStudy.results.roi.investment}
- **Zwrot w pierwszym roku**: ${caseStudy.results.roi.returnFirstYear}
- **ROI**: **${caseStudy.results.roi.roiPercentage}**
- **Czas zwrotu**: ${caseStudy.results.roi.paybackTime}

---

## 💬 Opinia Klienta

> "${caseStudy.testimonial.quote}"
>
> **${caseStudy.testimonial.author}**  
> *${caseStudy.testimonial.position}, ${caseStudy.testimonial.company}*

### Dodatkowe Komentarze

${caseStudy.testimonial.additionalComments.map(comment => `- "${comment}"`).join('\n')}

### Ocena Współpracy

| Aspekt | Ocena |
|--------|-------|
| Jakość wykonania | ${'⭐'.repeat(caseStudy.testimonial.ratings.quality)} |
| Dotrzymanie terminów | ${'⭐'.repeat(caseStudy.testimonial.ratings.timeline)} |
| Komunikacja | ${'⭐'.repeat(caseStudy.testimonial.ratings.communication)} |
| Wsparcie po wdrożeniu | ${'⭐'.repeat(caseStudy.testimonial.ratings.support)} |
| **Ogólna ocena** | **${'⭐'.repeat(caseStudy.testimonial.ratings.overall)}** |

---

## 📞 Chcesz Podobny Projekt?

Jeśli ten case study Cię zainspirował i chcesz zrealizować podobny projekt, skontaktuj się z nami:

### Bezpłatna Konsultacja
- **Telefon**: +48 535 330 323
- **Email**: hello@ecm-digital.com
- **Formularz kontaktowy**: [Link do formularza](../kontakt.md)

### Co Otrzymasz?
- ✅ Bezpłatną analizę Twojej sytuacji
- ✅ Spersonalizowaną propozycję rozwiązania
- ✅ Wstępną wycenę projektu
- ✅ Harmonogram realizacji

---

*Case study przygotowany przez zespół ECM Digital | Data: ${new Date().toLocaleDateString('pl-PL')} | Wersja: 1.0*`

    setExportedMarkdown(markdown)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportedMarkdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const downloadMarkdown = () => {
    const blob = new Blob([exportedMarkdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${caseStudy.client.toLowerCase().replace(/\s+/g, '-')}-case-study.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const publishToWebsite = async () => {
    if (!exportedMarkdown) {
      alert('Najpierw wygeneruj markdown!')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/case-studies/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseStudyId: caseStudy.id,
          markdown: exportedMarkdown,
          projectType: caseStudy.projectType,
          client: caseStudy.client
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`✅ Case study został opublikowany!\nŚcieżka: ${result.filePath}`)
      } else {
        alert(`❌ Błąd publikacji: ${result.error}`)
      }
    } catch (error) {
      console.error('Publish error:', error)
      alert('❌ Błąd podczas publikacji case study')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Eksport Case Study</CardTitle>
          <CardDescription>
            Wygeneruj markdown i opublikuj case study na stronie www
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={generateMarkdown}>
                <Globe className="mr-2 h-4 w-4" />
                Generuj Markdown
              </Button>
              {exportedMarkdown && (
                <>
                  <Button variant="outline" onClick={copyToClipboard}>
                    {copied ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    {copied ? 'Skopiowano!' : 'Kopiuj'}
                  </Button>
                  <Button variant="outline" onClick={downloadMarkdown}>
                    <Download className="mr-2 h-4 w-4" />
                    Pobierz .md
                  </Button>
                  <Button onClick={publishToWebsite}>
                    <Globe className="mr-2 h-4 w-4" />
                    Opublikuj na stronie
                  </Button>
                </>
              )}
            </div>

            {exportedMarkdown && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Wygenerowany Markdown:</label>
                <Textarea
                  value={exportedMarkdown}
                  readOnly
                  className="min-h-[400px] font-mono text-sm"
                />
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Długość: {exportedMarkdown.length} znaków
                  </Badge>
                  <Badge variant="secondary">
                    Linie: {exportedMarkdown.split('\n').length}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
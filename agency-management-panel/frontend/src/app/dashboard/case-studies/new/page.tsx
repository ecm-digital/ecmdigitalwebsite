'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react'
import Link from 'next/link'

interface CaseStudyFormData {
  title: string
  client: string
  industry: string
  projectType: 'www' | 'shopify' | 'mvp' | 'ux'
  duration: string
  teamSize: string
  technologies: string[]
  status: 'draft' | 'published'
  featured: boolean
  
  // Content sections
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

const initialFormData: CaseStudyFormData = {
  title: '',
  client: '',
  industry: '',
  projectType: 'www',
  duration: '',
  teamSize: '',
  technologies: [],
  status: 'draft',
  featured: false,
  challenge: {
    situation: '',
    problems: [''],
    goals: [''],
    constraints: ''
  },
  solution: {
    strategy: '',
    phases: [{ name: '', description: '', results: '' }],
    features: [''],
    technologies: [{ category: '', technology: '', justification: '' }]
  },
  results: {
    kpis: [{ metric: '', before: '', after: '', change: '' }],
    businessResults: [''],
    technicalResults: [''],
    uxResults: [''],
    roi: {
      investment: '',
      returnFirstYear: '',
      roiPercentage: '',
      paybackTime: ''
    }
  },
  testimonial: {
    quote: '',
    author: '',
    position: '',
    company: '',
    additionalComments: [''],
    ratings: {
      quality: 5,
      timeline: 5,
      communication: 5,
      support: 5,
      overall: 5
    }
  }
}

export default function NewCaseStudyPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CaseStudyFormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [newTechnology, setNewTechnology] = useState('')

  const steps = [
    { id: 1, name: 'Podstawowe informacje', description: 'Klient, typ projektu, technologie' },
    { id: 2, name: 'Wyzwanie', description: 'Sytuacja wyjściowa, problemy, cele' },
    { id: 3, name: 'Rozwiązanie', description: 'Strategia, proces, funkcjonalności' },
    { id: 4, name: 'Rezultaty', description: 'KPI, ROI, rezultaty biznesowe' },
    { id: 5, name: 'Opinia klienta', description: 'Testimonial, oceny, komentarze' }
  ]

  const addArrayItem = (path: string, defaultValue: any) => {
    const keys = path.split('.')
    const newData = { ...formData }
    let current = newData
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    const lastKey = keys[keys.length - 1]
    current[lastKey] = [...current[lastKey], defaultValue]
    
    setFormData(newData)
  }

  const removeArrayItem = (path: string, index: number) => {
    const keys = path.split('.')
    const newData = { ...formData }
    let current = newData
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    const lastKey = keys[keys.length - 1]
    current[lastKey] = current[lastKey].filter((_, i) => i !== index)
    
    setFormData(newData)
  }

  const updateArrayItem = (path: string, index: number, value: any) => {
    const keys = path.split('.')
    const newData = { ...formData }
    let current = newData
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    const lastKey = keys[keys.length - 1]
    current[lastKey][index] = value
    
    setFormData(newData)
  }

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTechnology.trim()]
      })
      setNewTechnology('')
    }
  }

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index)
    })
  }

  const handleSave = async (status: 'draft' | 'published') => {
    const dataToSave = { ...formData, status }
    
    // Tu będzie wywołanie API do zapisania case study
    console.log('Saving case study:', dataToSave)
    
    // Przekierowanie po zapisaniu
    router.push('/dashboard/case-studies')
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Tytuł Case Study *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="np. TechFlow Solutions - Startup Website"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">Klient *</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            placeholder="Nazwa klienta"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="industry">Branża *</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="np. Technology & SaaS"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectType">Typ Projektu *</Label>
          <select
            id="projectType"
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value as any })}
            className="w-full px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="www">Strona WWW</option>
            <option value="shopify">Sklep Shopify</option>
            <option value="mvp">Prototyp MVP</option>
            <option value="ux">Audyt UX</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration">Czas Realizacji</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="np. 3 miesiące"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="teamSize">Wielkość Zespołu</Label>
          <Input
            id="teamSize"
            value={formData.teamSize}
            onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
            placeholder="np. 5 osób"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Technologie</Label>
        <div className="flex gap-2">
          <Input
            value={newTechnology}
            onChange={(e) => setNewTechnology(e.target.value)}
            placeholder="Dodaj technologię"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
          />
          <Button type="button" onClick={addTechnology}>Dodaj</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.technologies.map((tech, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tech}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeTechnology(index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="featured">Wyróżniony case study</Label>
      </div>
    </div>
  )

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
            <h1 className="text-3xl font-bold tracking-tight">Nowy Case Study</h1>
            <p className="text-muted-foreground">
              Stwórz nowy case study dla portfolio agencji
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave('draft')}>
            <Save className="mr-2 h-4 w-4" />
            Zapisz szkic
          </Button>
          <Button onClick={() => handleSave('published')}>
            <Eye className="mr-2 h-4 w-4" />
            Opublikuj
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className="text-sm font-medium">{step.name}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-muted mx-4 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && renderStep1()}
          {/* Pozostałe kroki będą dodane w kolejnych iteracjach */}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Poprzedni
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              disabled={currentStep === 5}
            >
              Następny
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Calendar as CalendarIcon, 
  Plus,
  Clock,
  MapPin,
  Users,
  Bell,
  Video,
  Phone,
  Coffee,
  Briefcase,
  Home,
  Car,
  Plane,
  Train,
  Bus,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  start: Date
  end: Date
  type: 'meeting' | 'deadline' | 'milestone' | 'personal' | 'travel'
  location?: string
  attendees?: string[]
  projectId?: string
  projectName?: string
  color: string
}

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Spotkanie z klientem - UX Research',
    description: 'Prezentacja wyników badań UX dla projektu e-commerce',
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 11, 30),
    type: 'meeting',
    location: 'Zoom Meeting',
    attendees: ['Jan Kowalski', 'Anna Nowak', 'Klient XYZ'],
    projectId: 'proj-1',
    projectName: 'UX Research E-commerce',
    color: 'blue'
  },
  {
    id: '2',
    title: 'Deadline - Prototyp Figma',
    description: 'Finalizacja prototypu interfejsu użytkownika',
    start: new Date(2024, 0, 16, 17, 0),
    end: new Date(2024, 0, 16, 17, 0),
    type: 'deadline',
    projectId: 'proj-1',
    projectName: 'UX Research E-commerce',
    color: 'red'
  },
  {
    id: '3',
    title: 'Kamień milowy - MVP',
    description: 'Ukończenie pierwszej wersji produktu',
    start: new Date(2024, 0, 20, 12, 0),
    end: new Date(2024, 0, 20, 12, 0),
    type: 'milestone',
    projectId: 'proj-2',
    projectName: 'MVP Learning Platform',
    color: 'green'
  },
  {
    id: '4',
    title: 'Spotkanie zespołu',
    description: 'Cotygodniowe spotkanie zespołu projektowego',
    start: new Date(2024, 0, 17, 9, 0),
    end: new Date(2024, 0, 17, 9, 30),
    type: 'meeting',
    location: 'Sala konferencyjna A',
    attendees: ['Cały zespół'],
    color: 'purple'
  },
  {
    id: '5',
    title: 'Podróż - Konferencja UX',
    description: 'Wyjazd na konferencję UX w Warszawie',
    start: new Date(2024, 0, 25, 8, 0),
    end: new Date(2024, 0, 27, 18, 0),
    type: 'travel',
    location: 'Warszawa, Centrum Kongresowe',
    color: 'orange'
  }
]

const eventTypes = [
  { value: 'all', label: 'Wszystkie typy', icon: CalendarIcon },
  { value: 'meeting', label: 'Spotkania', icon: Video },
  { value: 'deadline', label: 'Deadline\'y', icon: Clock },
  { value: 'milestone', label: 'Kamienie milowe', icon: Briefcase },
  { value: 'personal', label: 'Osobiste', icon: Home },
  { value: 'travel', label: 'Podróże', icon: Plane },
]

const eventColors = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  pink: 'bg-pink-500',
  indigo: 'bg-indigo-500',
}

export function CalendarDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEventType, setSelectedEventType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const matchesType = selectedEventType === 'all' || event.type === selectedEventType
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [selectedEventType, searchQuery])

  const getDaysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Add empty days for previous month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'meeting':
        return <Video className="h-4 w-4" />
      case 'deadline':
        return <Clock className="h-4 w-4" />
      case 'milestone':
        return <Briefcase className="h-4 w-4" />
      case 'personal':
        return <Home className="h-4 w-4" />
      case 'travel':
        return <Plane className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const days = getDaysInMonth(currentMonth, currentYear)
  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ]

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-8 lg:p-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Kalendarz i Harmonogram
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Kalendarz
              </h1>
              <p className="text-xl text-emerald-100 mb-6 max-w-2xl">
                Zarządzaj harmonogramem, spotkaniami i kamieniami milowymi projektów
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-white/80 text-sm">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Wydarzenia: {filteredEvents.length}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Ten miesiąc: {filteredEvents.filter(e => e.start.getMonth() === currentMonth).length}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Spotkania: {filteredEvents.filter(e => e.type === 'meeting').length}
                </div>
              </div>
            </div>
            <div className="hidden lg:block mt-8 lg:mt-0">
              <Button className="btn-primary-modern text-lg px-8 py-4 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-5 w-5 mr-2" />
                Nowe Wydarzenie
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-10 w-10 p-0 border-slate-200/50 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-10 w-10 p-0 border-slate-200/50 rounded-xl"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              onClick={goToToday}
              className="h-10 px-4 border-slate-200/50 rounded-xl"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Dziś
            </Button>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <Select value={viewMode} onValueChange={(value: 'month' | 'week' | 'day') => setViewMode(value)}>
              <SelectTrigger className="w-32 h-10 border-slate-200/50 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Miesiąc</SelectItem>
                <SelectItem value="week">Tydzień</SelectItem>
                <SelectItem value="day">Dzień</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedEventType} onValueChange={setSelectedEventType}>
              <SelectTrigger className="w-48 h-10 border-slate-200/50 rounded-xl">
                <SelectValue placeholder="Typ wydarzenia" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      <type.icon className="h-4 w-4 mr-2" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Szukaj wydarzeń..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-10 pl-10 border-slate-200/50 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-emerald-600" />
            Kalendarz Miesięczny
          </CardTitle>
          <CardDescription className="text-slate-600 text-base">
            {monthNames[currentMonth]} {currentYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-slate-600 bg-white rounded-lg">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const events = day ? getEventsForDate(day) : []
              const isToday = day && day.toDateString() === new Date().toDateString()
              const isCurrentMonth = day && day.getMonth() === currentMonth
              
              return (
                <div
                  key={index}
                  className={`min-h-32 p-2 border border-slate-200/50 rounded-lg transition-all duration-200 hover:shadow-md ${
                    isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
                  } ${!isCurrentMonth ? 'opacity-50' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-2 ${
                        isToday ? 'text-blue-600' : 'text-slate-700'
                      }`}>
                        {day.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {events.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className={`p-1 rounded text-xs text-white cursor-pointer hover:opacity-80 transition-opacity ${
                              eventColors[event.color as keyof typeof eventColors]
                            }`}
                            title={`${event.title} - ${formatTime(event.start)}`}
                          >
                            <div className="flex items-center space-x-1">
                              {getEventIcon(event.type)}
                              <span className="truncate">{event.title}</span>
                            </div>
                          </div>
                        ))}
                        
                        {events.length > 3 && (
                          <div className="text-xs text-slate-500 text-center">
                            +{events.length - 3} więcej
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-600" />
            Nadchodzące Wydarzenia
          </CardTitle>
          <CardDescription className="text-slate-600 text-base">
            Najbliższe spotkania i deadline'y
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents
              .filter(event => event.start > new Date())
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .slice(0, 5)
              .map(event => (
                <div
                  key={event.id}
                  className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className={`w-3 h-3 rounded-full ${eventColors[event.color as keyof typeof eventColors]}`} />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 truncate">{event.title}</h4>
                    <p className="text-sm text-slate-600 truncate">{event.description}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                      )}
                      {event.projectName && (
                        <Badge variant="secondary" className="text-xs">
                          {event.projectName}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-8 px-3">
                      <Bell className="h-3 w-3 mr-1" />
                      Przypomnij
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-3">
                      <Users className="h-3 w-3 mr-1" />
                      Szczegóły
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Add Event Button */}
      <div className="lg:hidden">
        <Button className="btn-primary-modern w-full text-lg py-4 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-5 w-5 mr-2" />
          Nowe Wydarzenie
        </Button>
      </div>
    </div>
  )
}

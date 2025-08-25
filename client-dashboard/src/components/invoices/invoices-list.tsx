'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  CreditCard,
  DollarSign,
  Calendar,
  TrendingUp,
  Plus,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight
} from 'lucide-react'

interface Invoice {
  id: string
  number: string
  projectName: string
  amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  dueDate: string
  issueDate: string
  description: string
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    projectName: 'Strona WWW',
    amount: 5000,
    currency: 'PLN',
    status: 'paid',
    dueDate: '2024-01-15',
    issueDate: '2024-01-01',
    description: 'Projektowanie i rozwój strony internetowej'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    projectName: 'Sklep Online',
    amount: 8000,
    currency: 'PLN',
    status: 'sent',
    dueDate: '2024-02-15',
    issueDate: '2024-02-01',
    description: 'Implementacja sklepu e-commerce'
  },
  {
    id: '3',
    number: 'INV-2024-003',
    projectName: 'Audyt UX',
    amount: 2500,
    currency: 'PLN',
    status: 'draft',
    dueDate: '2024-03-15',
    issueDate: '2024-03-01',
    description: 'Analiza użyteczności aplikacji'
  }
]

const statusOptions = [
  { value: 'all', label: 'Wszystkie statusy' },
  { value: 'draft', label: 'Szkic' },
  { value: 'sent', label: 'Wysłana' },
  { value: 'paid', label: 'Opłacona' },
  { value: 'overdue', label: 'Przeterminowana' },
]

const statusColors = {
  'draft': 'bg-slate-100 text-slate-800 border-slate-200',
  'sent': 'bg-blue-100 text-blue-800 border-blue-200',
  'paid': 'bg-green-100 text-green-800 border-green-200',
  'overdue': 'bg-red-100 text-red-800 border-red-200',
}

const statusLabels = {
  'draft': 'Szkic',
  'sent': 'Wysłana',
  'paid': 'Opłacona',
  'overdue': 'Przeterminowana',
}

export function InvoicesList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    const filtered = mockInvoices.filter(invoice => {
      const matchesSearch = invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           invoice.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           invoice.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort invoices
    const sortedFiltered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
        case 'amount':
          return b.amount - a.amount
        case 'newest':
        default:
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
      }
    })

    return sortedFiltered
  }, [searchQuery, statusFilter, sortBy])

  const totalAmount = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = mockInvoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0)

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL')
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-8 lg:p-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                <CreditCard className="h-4 w-4 mr-2" />
                Faktury i Płatności
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Faktury
              </h1>
              <p className="text-xl text-emerald-100 mb-6 max-w-2xl">
                Zarządzaj fakturami i śledź status płatności
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-white/80 text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Wszystkich: {mockInvoices.length}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Opłaconych: {mockInvoices.filter(inv => inv.status === 'paid').length}
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Łącznie: {formatCurrency(totalAmount, 'PLN')}
                </div>
              </div>
            </div>
            <div className="hidden lg:block mt-8 lg:mt-0">
              <Button className="btn-primary-modern text-lg px-8 py-4 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-5 w-5 mr-2" />
                Nowa Faktura
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 font-medium text-sm">Łączna Wartość</p>
              <p className="text-3xl font-bold text-emerald-900">{formatCurrency(totalAmount, 'PLN')}</p>
            </div>
            <div className="p-3 bg-emerald-200 rounded-xl">
              <DollarSign className="h-6 w-6 text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium text-sm">Opłacone</p>
              <p className="text-3xl font-bold text-green-900">{formatCurrency(paidAmount, 'PLN')}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 font-medium text-sm">Oczekujące</p>
              <p className="text-3xl font-bold text-orange-900">{formatCurrency(pendingAmount, 'PLN')}</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-xl">
              <Clock className="h-6 w-6 text-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Szukaj faktur, numerów, projektów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-modern pl-12 text-lg"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48 h-12 text-lg border-slate-200/50 rounded-xl">
              <SelectValue placeholder="Status faktury" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48 h-12 text-lg border-slate-200/50 rounded-xl">
              <SelectValue placeholder="Sortuj" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Najnowsze</SelectItem>
              <SelectItem value="oldest">Najstarsze</SelectItem>
              <SelectItem value="amount">Wartość</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            className="h-12 px-6 border-slate-200/50 rounded-xl hover:bg-slate-50"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filtry
          </Button>
        </div>
      </div>

      {/* Invoices Grid */}
      {filteredInvoices.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 hover:from-white hover:to-emerald-50 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-slate-200/50">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 transition-colors">
                      <CreditCard className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {invoice.number}
                      </CardTitle>
                      <CardDescription className="mt-1 text-slate-600 font-medium">
                        {invoice.projectName}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${statusColors[invoice.status]} border font-medium px-3 py-1`}
                  >
                    {statusLabels[invoice.status]}
                  </Badge>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                  {invoice.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 relative z-10">
                {/* Amount */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Kwota:</span>
                  <span className="text-2xl font-bold text-emerald-900">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Data wystawienia:</span>
                    </div>
                    <p className="text-slate-900 font-semibold mt-1">{formatDate(invoice.issueDate)}</p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Termin płatności:</span>
                    </div>
                    <p className="text-slate-900 font-semibold mt-1">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2 border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 rounded-xl px-3 py-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">Podgląd</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl px-3 py-2"
                    >
                      <Download className="h-4 w-4" />
                      <span className="font-medium">Pobierz</span>
                    </Button>
                  </div>
                  
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            {mockInvoices.length === 0 
              ? 'Brak faktur'
              : 'Brak faktur spełniających kryteria'
            }
          </h3>
          <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto">
            {mockInvoices.length === 0
              ? 'Utwórz pierwszą fakturę dla swojego projektu'
              : 'Spróbuj zmienić filtry wyszukiwania lub rozszerzyć kryteria'
            }
          </p>
          {mockInvoices.length === 0 && (
            <Button className="btn-primary-modern text-lg px-8 py-4 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-5 w-5 mr-2" />
              Utwórz fakturę
            </Button>
          )}
        </div>
      )}

      {/* Mobile New Invoice Button */}
      <div className="lg:hidden">
        <Button className="btn-primary-modern w-full text-lg py-4 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-5 w-5 mr-2" />
          Nowa Faktura
        </Button>
      </div>
    </div>
  )
}






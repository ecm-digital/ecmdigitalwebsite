'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Switch
} from '@/components/ui/switch'
import { 
  Settings, 
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Key,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Bezpieczeństwo', icon: Shield },
    { id: 'notifications', label: 'Powiadomienia', icon: Bell },
    { id: 'appearance', label: 'Wygląd', icon: Palette },
    { id: 'integrations', label: 'Integracje', icon: Database },
    { id: 'api', label: 'API', icon: Key },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-600 via-slate-700 to-gray-800 rounded-3xl p-8 lg:p-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                <Settings className="h-4 w-4 mr-2" />
                Ustawienia i Konfiguracja
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Ustawienia
              </h1>
              <p className="text-xl text-slate-100 mb-6 max-w-2xl">
                Dostosuj swój profil, bezpieczeństwo i preferencje aplikacji
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-white/80 text-sm">
                  <User className="h-4 w-4 mr-2" />
                  Profil użytkownika
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Ustawienia bezpieczeństwa
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Powiadomienia
                </div>
              </div>
            </div>
            <div className="hidden lg:block mt-8 lg:mt-0">
              <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Settings className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800">Kategorie</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${
                        activeTab === tab.id ? 'text-white' : 'text-slate-500'
                      }`} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Profil Użytkownika
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  Aktualizuj swoje dane osobowe i informacje kontaktowe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                      Imię
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Jan"
                      defaultValue="Jan"
                      className="h-11 border-slate-200/50 rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                      Nazwisko
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Kowalski"
                      defaultValue="Kowalski"
                      className="h-11 border-slate-200/50 rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jan.kowalski@example.com"
                      defaultValue="jan.kowalski@example.com"
                      className="h-11 border-slate-200/50 rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                      Telefon
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+48 123 456 789"
                      defaultValue="+48 123 456 789"
                      className="h-11 border-slate-200/50 rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium text-slate-700">
                      Firma
                    </Label>
                    <Input
                      id="company"
                      placeholder="Nazwa firmy"
                      defaultValue="ECM Digital"
                      className="h-11 border-slate-200/50 rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium text-slate-700">
                      Stanowisko
                    </Label>
                    <Input
                      id="position"
                      placeholder="Stanowisko"
                      defaultValue="Project Manager"
                      className="h-11 border-slate-200/50 rounded-xl"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-slate-700">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    rows={4}
                    placeholder="Krótki opis o sobie..."
                    defaultValue="Doświadczony Project Manager z pasją do cyfrowych transformacji i innowacyjnych rozwiązań."
                    className="w-full px-4 py-3 border border-slate-200/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Bezpieczeństwo
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  Zarządzaj hasłem i ustawieniami bezpieczeństwa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">
                    Obecne hasło
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Wprowadź obecne hasło"
                      className="h-11 border-slate-200/50 rounded-xl pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                    Nowe hasło
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Wprowadź nowe hasło"
                    className="h-11 border-slate-200/50 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Potwierdź nowe hasło
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Potwierdź nowe hasło"
                    className="h-11 border-slate-200/50 rounded-xl"
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-800">Wymagania hasła:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-600">Minimum 8 znaków</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-600">Wielkie i małe litery</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-600">Cyfry</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-600">Znaki specjalne</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-orange-600" />
                  Powiadomienia
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  Dostosuj preferencje powiadomień
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                    <div>
                      <h4 className="font-medium text-slate-800">Powiadomienia email</h4>
                      <p className="text-sm text-slate-600">Otrzymuj powiadomienia na email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                    <div>
                      <h4 className="font-medium text-slate-800">Powiadomienia push</h4>
                      <p className="text-sm text-slate-600">Powiadomienia w przeglądarce</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                    <div>
                      <h4 className="font-medium text-slate-800">Aktualizacje projektów</h4>
                      <p className="text-sm text-slate-600">Informacje o postępach projektów</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                    <div>
                      <h4 className="font-medium text-slate-800">Nowe wiadomości</h4>
                      <p className="text-sm text-slate-600">Powiadomienia o nowych wiadomościach</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                    <div>
                      <h4 className="font-medium text-slate-800">Raporty tygodniowe</h4>
                      <p className="text-sm text-slate-600">Cotygodniowe podsumowania</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-purple-600" />
                  Wygląd
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  Dostosuj wygląd interfejsu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme" className="text-sm font-medium text-slate-700">
                      Motyw
                    </Label>
                    <Select defaultValue="system">
                      <SelectTrigger className="h-11 border-slate-200/50 rounded-xl">
                        <SelectValue placeholder="Wybierz motyw" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Jasny</SelectItem>
                        <SelectItem value="dark">Ciemny</SelectItem>
                        <SelectItem value="system">Systemowy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm font-medium text-slate-700">
                      Język
                    </Label>
                    <Select defaultValue="pl">
                      <SelectTrigger className="h-11 border-slate-200/50 rounded-xl">
                        <SelectValue placeholder="Wybierz język" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pl">Polski</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fontSize" className="text-sm font-medium text-slate-700">
                      Rozmiar czcionki
                    </Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="h-11 border-slate-200/50 rounded-xl">
                        <SelectValue placeholder="Wybierz rozmiar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Mały</SelectItem>
                        <SelectItem value="medium">Średni</SelectItem>
                        <SelectItem value="large">Duży</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="density" className="text-sm font-medium text-slate-700">
                      Gęstość interfejsu
                    </Label>
                    <Select defaultValue="comfortable">
                      <SelectTrigger className="h-11 border-slate-200/50 rounded-xl">
                        <SelectValue placeholder="Wybierz gęstość" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Kompaktowy</SelectItem>
                        <SelectItem value="comfortable">Komfortowy</SelectItem>
                        <SelectItem value="spacious">Przestronny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-indigo-600" />
                  Integracje
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  Zarządzaj połączeniami z zewnętrznymi serwisami
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">Google Workspace</h4>
                        <p className="text-sm text-slate-600">Synchronizacja z Google Drive</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                      Połączone
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Database className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">Slack</h4>
                        <p className="text-sm text-slate-600">Powiadomienia na Slack</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-800 border-slate-200">
                      Nie połączone
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Bell className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">Microsoft Teams</h4>
                        <p className="text-sm text-slate-600">Integracja z Teams</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-800 border-slate-200">
                      Nie połączone
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <Card className="border-0 bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Key className="h-5 w-5 mr-2 text-amber-600" />
                  API i Klucze
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  Zarządzaj kluczami API i tokenami dostępu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="text-sm font-medium text-slate-700">
                    Klucz API
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="apiKey"
                      type="password"
                      value="sk-1234567890abcdef"
                      readOnly
                      className="h-11 border-slate-200/50 rounded-xl font-mono text-sm"
                    />
                    <Button variant="outline" className="px-4 border-slate-200/50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Odśwież
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">Użyj tego klucza do autoryzacji żądań API</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl" className="text-sm font-medium text-slate-700">
                    URL Webhook
                  </Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://example.com/webhook"
                    className="h-11 border-slate-200/50 rounded-xl"
                  />
                  <p className="text-xs text-slate-500">URL do wysyłania powiadomień webhook</p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-800">Aktywne sesje:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Chrome - Windows</p>
                        <p className="text-xs text-slate-500">Ostatnia aktywność: 2 minuty temu</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        Wyloguj
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Safari - macOS</p>
                        <p className="text-xs text-slate-500">Ostatnia aktywność: 1 godzinę temu</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        Wyloguj
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary-modern text-lg px-8 py-4"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Zapisz zmiany
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}













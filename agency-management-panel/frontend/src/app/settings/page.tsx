"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Bell,
  Shield,
  Palette,
  Users,
  CreditCard,
  Mail,
  Save,
  RotateCcw,
  Key,
  Globe,
  Database
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  
  // Form states
  const [companyName, setCompanyName] = useState("ECM Digital Agency");
  const [companyEmail, setCompanyEmail] = useState("contact@ecmdigital.pl");
  const [companyPhone, setCompanyPhone] = useState("+48 123 456 789");
  const [companyAddress, setCompanyAddress] = useState("ul. Przykładowa 123, 00-001 Warszawa");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("pl");

  const handleSave = () => {
    // Save settings logic would go here
    alert("Ustawienia zostały zapisane!");
  };

  const handleReset = () => {
    // Reset settings logic would go here
    setCompanyName("ECM Digital Agency");
    setCompanyEmail("contact@ecmdigital.pl");
    setCompanyPhone("+48 123 456 789");
    setCompanyAddress("ul. Przykładowa 123, 00-001 Warszawa");
    setNotificationsEnabled(true);
    setEmailNotifications(true);
    setSmsNotifications(false);
    setDarkMode(false);
    setLanguage("pl");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ustawienia Systemu</h1>
          <p className="text-muted-foreground mt-2">
            Konfiguracja aplikacji i preferencje użytkownika
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetuj
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Zapisz
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">Ogólne</TabsTrigger>
          <TabsTrigger value="notifications">Powiadomienia</TabsTrigger>
          <TabsTrigger value="appearance">Wygląd</TabsTrigger>
          <TabsTrigger value="security">Bezpieczeństwo</TabsTrigger>
          <TabsTrigger value="integrations">Integracje</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Dane Firmy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nazwa firmy</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email kontaktowy</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Telefon kontaktowy</Label>
                  <Input
                    id="companyPhone"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Adres firmy</Label>
                  <Textarea
                    id="companyAddress"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Konfiguracja Systemu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Tryb konserwacji</Label>
                    <p className="text-sm text-muted-foreground">
                      Tymczasowo wyłącz system dla użytkowników
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Automatyczne kopie zapasowe</Label>
                    <p className="text-sm text-muted-foreground">
                      Codzienne kopie zapasowe danych
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Logowanie aktywności</Label>
                    <p className="text-sm text-muted-foreground">
                      Zapisuj wszystkie działania użytkowników
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Automatyczne aktualizacje</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatycznie instaluj aktualizacje systemu
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferencje Powiadomień
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Włącz powiadomienia</Label>
                    <p className="text-sm text-muted-foreground">
                      Otrzymuj powiadomienia o ważnych wydarzeniach
                    </p>
                  </div>
                  <Switch 
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Powiadomienia email</Label>
                    <p className="text-sm text-muted-foreground">
                      Wysyłaj powiadomienia na email
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Powiadomienia SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Wysyłaj pilne powiadomienia SMS
                    </p>
                  </div>
                  <Switch 
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Typy Powiadomień
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Nowe projekty</Label>
                    <p className="text-sm text-muted-foreground">
                      Powiadomienia o nowych projektach
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Deadliny projektów</Label>
                    <p className="text-sm text-muted-foreground">
                      Przypomnienia o zbliżających się terminach
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Płatności</Label>
                    <p className="text-sm text-muted-foreground">
                      Informacje o fakturach i płatnościach
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Raporty</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatyczne raporty miesięczne
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Motyw i Wygląd
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Tryb ciemny</Label>
                    <p className="text-sm text-muted-foreground">
                      Użyj ciemnego motywu interfejsu
                    </p>
                  </div>
                  <Switch 
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Język interfejsu</Label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2 border border-border rounded-lg bg-background"
                  >
                    <option value="pl">Polski</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Strefa Czasowa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Strefa czasowa</Label>
                  <select
                    id="timezone"
                    className="w-full p-2 border border-border rounded-lg bg-background"
                  >
                    <option value="Europe/Warsaw">Europa/Warszawa (UTC+1)</option>
                    <option value="Europe/London">Europa/Londyn (UTC+0)</option>
                    <option value="America/New_York">Ameryka/Nowy Jork (UTC-5)</option>
                    <option value="Asia/Tokyo">Azja/Tokio (UTC+9)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Format daty</Label>
                  <div className="flex gap-2">
                    <Badge variant="secondary">DD.MM.YYYY</Badge>
                    <Badge variant="outline">MM/DD/YYYY</Badge>
                    <Badge variant="outline">YYYY-MM-DD</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Uwierzytelnianie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Wymagaj uwierzytelniania dwuskładnikowego</Label>
                    <p className="text-sm text-muted-foreground">
                      Dodatkowe zabezpieczenie konta
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Zmień hasło</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Wprowadź nowe hasło"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Potwierdź nowe hasło"
                  />
                </div>
                
                <Button variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  Zresetuj klucze API
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Zarządzanie Użytkownikami
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Limit prób logowania</Label>
                    <p className="text-sm text-muted-foreground">
                      Zablokuj konta po 5 nieudanych próbach
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Wyloguj nieaktywne sesje</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatycznie wyloguj po 24 godzinach
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Wymuszaj zmianę hasła</Label>
                    <p className="text-sm text-muted-foreground">
                      Wymagaj zmiany hasła co 90 dni
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Integracje Zewnętrzne
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold">H</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">HubSpot</h3>
                      <p className="text-sm text-muted-foreground">
                        Integracja z CRM HubSpot
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">Połączono</Badge>
                    <Button variant="outline">Zarządzaj</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center">
                      <span className="text-white font-bold">G</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Google Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Analiza ruchu i zachowań użytkowników
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">Połączono</Badge>
                    <Button variant="outline">Zarządzaj</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-red-500 flex items-center justify-center">
                      <span className="text-white font-bold">S</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Slack</h3>
                      <p className="text-sm text-muted-foreground">
                        Powiadomienia w kanale Slack
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Rozłączono</Badge>
                    <Button variant="outline">Połącz</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-400 flex items-center justify-center">
                      <span className="text-white font-bold">M</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Mailchimp</h3>
                      <p className="text-sm text-muted-foreground">
                        Automatyzacja mailingowa
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Rozłączono</Badge>
                    <Button variant="outline">Połącz</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
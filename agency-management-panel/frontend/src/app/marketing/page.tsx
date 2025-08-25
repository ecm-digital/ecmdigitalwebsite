"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Eye,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface MarketingStats {
  overview: {
    totalClients: number;
    activeClients: number;
    newClientsToday: number;
    newClientsThisWeek: number;
    newClientsThisMonth: number;
    conversionRate: number;
    avgProjectValue: number;
    totalRevenue: number;
  };
  trends: {
    clientsByDay: Array<{ date: string; count: number }>;
    revenueByMonth: Array<{ month: string; revenue: number }>;
  };
  sources: {
    organic: number;
    referral: number;
    paid: number;
    direct: number;
  };
  topPerforming: {
    services: Array<{ name: string; conversions: number; revenue: number }>;
    clients: Array<{ name: string; revenue: number; projects: number }>;
  };
  alerts: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
    timestamp: string;
  }>;
}

export default function MarketingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const { data: stats, isLoading, error } = useQuery<MarketingStats>({
    queryKey: ['marketing-stats'],
    queryFn: async () => {
      const response = await fetch('/api/marketing/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch marketing stats');
      }
      return response.json();
    },
    refetchInterval: 30000, // Odświeżaj co 30 sekund
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Błąd ładowania statystyk marketingowych
          </h3>
          <p className="text-gray-600 mb-4">
            Nie udało się załadować danych. Spróbuj ponownie później.
          </p>
          <Button onClick={() => window.location.reload()}>
            Odśwież stronę
          </Button>
        </div>
      </div>
    );
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Statystyki klientów i efektywność pozyskiwania leadów
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('week')}
          >
            Ten tydzień
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('month')}
          >
            Ten miesiąc
          </Button>
          <Button
            variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('quarter')}
          >
            Ten kwartał
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {stats?.alerts && stats.alerts.length > 0 && (
        <div className="space-y-3">
          {stats.alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getAlertBgColor(alert.type)}`}
            >
              <div className="flex items-start space-x-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(alert.timestamp).toLocaleString('pl-PL')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wszyscy klienci</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview.totalClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.overview.newClientsToday || 0} dziś
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Konwersja</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUp className="inline w-3 h-3 mr-1" />
              +5.2% od zeszłego miesiąca
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Średnia wartość projektu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.overview.avgProjectValue ? (stats.overview.avgProjectValue / 1000).toFixed(0) + 'k' : '0k'} PLN
            </div>
            <p className="text-xs text-muted-foreground">
              <ArrowUp className="inline w-3 h-3 mr-1" />
              +12% od zeszłego miesiąca
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Całkowity przychód</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.overview.totalRevenue ? (stats.overview.totalRevenue / 1000).toFixed(0) + 'k' : '0k'} PLN
            </div>
            <p className="text-xs text-muted-foreground">
              <ArrowUp className="inline w-3 h-3 mr-1" />
              +18% od zeszłego miesiąca
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Źródła pozyskiwania klientów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Organic</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats?.sources.organic || 0}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{stats?.sources.organic || 0}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Referral</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats?.sources.referral || 0}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{stats?.sources.referral || 0}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Paid</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats?.sources.paid || 0}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{stats?.sources.paid || 0}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Direct</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${stats?.sources.direct || 0}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{stats?.sources.direct || 0}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Services */}
        <Card>
          <CardHeader>
            <CardTitle>Najlepiej sprzedające się usługi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topPerforming.services.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.conversions} konwersji</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{(service.revenue / 1000).toFixed(0)}k PLN</p>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Najlepsi klienci</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats?.topPerforming.clients.map((client, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{client.name}</h4>
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
                <p className="text-2xl font-bold text-green-600 mb-1">
                  {(client.revenue / 1000).toFixed(0)}k PLN
                </p>
                <p className="text-sm text-gray-600">
                  {client.projects} projektów
                </p>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="w-3 h-3 mr-1" />
                    Zadzwoń
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Szybkie akcje marketingowe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <Mail className="w-6 h-6 mb-2" />
              <span>Wyślij newsletter</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Phone className="w-6 h-6 mb-2" />
              <span>Zadzwoń do leadów</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Calendar className="w-6 h-6 mb-2" />
              <span>Umów konsultację</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

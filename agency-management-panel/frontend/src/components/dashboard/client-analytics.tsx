'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  Star,
  MessageCircle,
  Search,
  Filter,
  Eye
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  company: string;
  totalSpent: number;
  projectsCompleted: number;
  satisfaction: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
}

export function ClientAnalytics() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const clients: Client[] = [
    {
      id: '1',
      name: 'Anna Kowalska',
      company: 'ABC Corp',
      totalSpent: 45000,
      projectsCompleted: 3,
      satisfaction: 95,
      lastActivity: '2 dni temu',
      status: 'active'
    },
    {
      id: '2',
      name: 'Michał Wiśniewski',
      company: 'XYZ Ltd',
      totalSpent: 28000,
      projectsCompleted: 2,
      satisfaction: 88,
      lastActivity: '1 tydzień temu',
      status: 'active'
    },
    {
      id: '3',
      name: 'Ewa Nowak',
      company: 'Tech Solutions',
      totalSpent: 15000,
      projectsCompleted: 1,
      satisfaction: 92,
      lastActivity: '3 dni temu',
      status: 'active'
    },
    {
      id: '4',
      name: 'Piotr Zieliński',
      company: 'Data Analytics Sp. z o.o.',
      totalSpent: 75000,
      projectsCompleted: 5,
      satisfaction: 98,
      lastActivity: '1 dzień temu',
      status: 'active'
    },
    {
      id: '5',
      name: 'Katarzyna Wójcik',
      company: 'Marketing Plus',
      totalSpent: 32000,
      projectsCompleted: 2,
      satisfaction: 85,
      lastActivity: '2 tygodnie temu',
      status: 'inactive'
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0);
  const activeClients = clients.filter(client => client.status === 'active').length;
  const averageSatisfaction = clients.reduce((sum, client) => sum + client.satisfaction, 0) / clients.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktywny';
      case 'inactive':
        return 'Nieaktywny';
      case 'pending':
        return 'Oczekujący';
      default:
        return 'Nieznany';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Łączne Przychody</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} zł</div>
            <p className="text-xs text-muted-foreground">Od wszystkich klientów</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktywni Klienci</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">Z {clients.length} wszystkich</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Średnia Satysfakcja</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageSatisfaction)}%</div>
            <Progress value={averageSatisfaction} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Analiza Klientów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Szukaj klientów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                Wszystkie
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
                size="sm"
              >
                Aktywne
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
                size="sm"
              >
                Nieaktywne
              </Button>
            </div>
          </div>

          {/* Clients Table */}
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {client.avatar ? (
                        <img src={client.avatar} alt={client.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Users className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.company}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Wydatek</p>
                      <p className="font-medium">{client.totalSpent.toLocaleString()} zł</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Projekty</p>
                      <p className="font-medium">{client.projectsCompleted}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Satysfakcja</p>
                      <div className="flex items-center gap-1">
                        <Progress value={client.satisfaction} className="w-12" />
                        <span className="text-xs font-medium">{client.satisfaction}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(client.status)}`}></div>
                        <span className="text-xs">{getStatusText(client.status)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Szczegóły
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Kontakt
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Ostatnia aktywność: {client.lastActivity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

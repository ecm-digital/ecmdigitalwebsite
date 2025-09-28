"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  FolderKanban,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Edit,
  Star
} from "lucide-react";

// Mock data for clients
const clients = [
  {
    id: 1,
    name: "ABC Corporation",
    contact: "Jan Kowalski",
    email: "jan.kowalski@abc.com",
    phone: "+48 123 456 789",
    company: "ABC Corp",
    status: "active",
    totalProjects: 5,
    activeProjects: 2,
    totalRevenue: 85000,
    lastContact: "2024-01-05",
    rating: 5,
    avatar: "",
    industry: "E-commerce"
  },
  {
    id: 2,
    name: "XYZ Technologies",
    contact: "Anna Nowak",
    email: "anna.nowak@xyz.tech",
    phone: "+48 987 654 321",
    company: "XYZ Tech",
    status: "active",
    totalProjects: 3,
    activeProjects: 1,
    totalRevenue: 42000,
    lastContact: "2024-01-03",
    rating: 4,
    avatar: "",
    industry: "Fintech"
  },
  {
    id: 3,
    name: "Premium Estates",
    contact: "Michał Wiśniewski",
    email: "michal@premiumestates.pl",
    phone: "+48 555 123 456",
    company: "Premium Estates",
    status: "prospect",
    totalProjects: 0,
    activeProjects: 0,
    totalRevenue: 0,
    lastContact: "2024-01-02",
    rating: 0,
    avatar: "",
    industry: "Real Estate"
  },
  {
    id: 4,
    name: "HealthTech Solutions",
    contact: "Dr. Maria Kowalczyk",
    email: "maria@healthtech.pl",
    phone: "+48 666 789 012",
    company: "HealthTech",
    status: "active",
    totalProjects: 2,
    activeProjects: 1,
    totalRevenue: 28000,
    lastContact: "2024-01-01",
    rating: 5,
    avatar: "",
    industry: "Healthcare"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="default" className="bg-green-500">Aktywny</Badge>;
    case "prospect":
      return <Badge variant="secondary">Potencjalny</Badge>;
    case "inactive":
      return <Badge variant="outline">Nieaktywny</Badge>;
    default:
      return <Badge variant="outline">Nieznany</Badge>;
  }
};

export default function ClientsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && client.status === selectedTab;
  });

  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === "active").length,
    prospects: clients.filter(c => c.status === "prospect").length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalRevenue, 0),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zarządzanie Klientami</h1>
          <p className="text-muted-foreground mt-2">
            Przegląd i zarządzanie bazą klientów agencji
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Dodaj Klienta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wszyscy Klienci</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Łączna liczba klientów
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktywni Klienci</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              Klienci z aktywnymi projektami
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potencjalni Klienci</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prospects}</div>
            <p className="text-xs text-muted-foreground">
              Leads i potencjalni klienci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Łączny Przychód</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} zł</div>
            <p className="text-xs text-muted-foreground">
              Ze wszystkich projektów
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Szukaj klientów..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtry
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Klientów</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">Wszyscy ({clients.length})</TabsTrigger>
              <TabsTrigger value="active">Aktywni ({stats.activeClients})</TabsTrigger>
              <TabsTrigger value="prospect">Potencjalni ({stats.prospects})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={client.avatar} />
                        <AvatarFallback>
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{client.name}</h3>
                          {getStatusBadge(client.status)}
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < client.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {client.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">{client.activeProjects}</div>
                        <div className="text-xs text-muted-foreground">Aktywne</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{client.totalProjects}</div>
                        <div className="text-xs text-muted-foreground">Łącznie</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{client.totalRevenue.toLocaleString()} zł</div>
                        <div className="text-xs text-muted-foreground">Przychód</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{client.lastContact}</div>
                        <div className="text-xs text-muted-foreground">Ostatni kontakt</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
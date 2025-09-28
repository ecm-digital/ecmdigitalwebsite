"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Target,
  MoreHorizontal,
  Eye,
  Edit
} from "lucide-react";

// Mock data for projects
const projects = [
  {
    id: 1,
    name: "E-commerce Platform ABC",
    client: "ABC Corporation",
    clientId: 1,
    status: "in-progress",
    priority: "high",
    progress: 75,
    startDate: "2024-11-01",
    endDate: "2024-01-15",
    budget: 45000,
    spent: 33750,
    team: ["Jan Kowalski", "Anna Nowak", "Piotr Wiśniewski"],
    description: "Budowa kompletnej platformy e-commerce z integracją płatności",
    type: "Sklep Shopify",
    phase: "Development"
  },
  {
    id: 2,
    name: "Mobile App XYZ",
    client: "XYZ Technologies",
    clientId: 2,
    status: "in-progress",
    priority: "medium",
    progress: 45,
    startDate: "2024-12-01",
    endDate: "2024-02-28",
    budget: 28000,
    spent: 12600,
    team: ["Maria Kowalczyk", "Tomasz Nowak"],
    description: "Aplikacja mobilna dla fintech z funkcjami płatności",
    type: "Aplikacja Mobilna",
    phase: "Design"
  },
  {
    id: 3,
    name: "Website Redesign Premium",
    client: "Premium Estates",
    clientId: 3,
    status: "planning",
    priority: "low",
    progress: 15,
    startDate: "2024-01-10",
    endDate: "2024-03-10",
    budget: 12000,
    spent: 1800,
    team: ["Katarzyna Zielińska"],
    description: "Przeprojektowanie strony internetowej dla premium estates",
    type: "Strona WWW",
    phase: "Planning"
  },
  {
    id: 4,
    name: "HealthTech MVP",
    client: "HealthTech Solutions",
    clientId: 4,
    status: "completed",
    priority: "high",
    progress: 100,
    startDate: "2023-10-01",
    endDate: "2023-12-15",
    budget: 35000,
    spent: 34500,
    team: ["Jan Kowalski", "Maria Kowalczyk", "Anna Nowak"],
    description: "Prototyp MVP dla aplikacji medycznej",
    type: "Prototyp MVP",
    phase: "Completed"
  },
  {
    id: 5,
    name: "UX Audit - Banking App",
    client: "XYZ Technologies",
    clientId: 2,
    status: "delayed",
    priority: "medium",
    progress: 60,
    startDate: "2023-11-15",
    endDate: "2024-01-05",
    budget: 8000,
    spent: 6400,
    team: ["Katarzyna Zielińska", "Piotr Wiśniewski"],
    description: "Kompleksowy audyt UX dla aplikacji bankowej",
    type: "Audyt UX",
    phase: "Review"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Zakończony</Badge>;
    case "in-progress":
      return <Badge variant="default" className="bg-blue-500"><Clock className="h-3 w-3 mr-1" />W trakcie</Badge>;
    case "planning":
      return <Badge variant="secondary"><Target className="h-3 w-3 mr-1" />Planowanie</Badge>;
    case "delayed":
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Opóźniony</Badge>;
    case "cancelled":
      return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Anulowany</Badge>;
    default:
      return <Badge variant="outline">Nieznany</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">Wysoki</Badge>;
    case "medium":
      return <Badge variant="secondary">Średni</Badge>;
    case "low":
      return <Badge variant="outline">Niski</Badge>;
    default:
      return <Badge variant="outline">-</Badge>;
  }
};

export default function ProjectsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && project.status === selectedTab;
  });

  const stats = {
    totalProjects: projects.length,
    inProgress: projects.filter(p => p.status === "in-progress").length,
    completed: projects.filter(p => p.status === "completed").length,
    delayed: projects.filter(p => p.status === "delayed").length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zarządzanie Projektami</h1>
          <p className="text-muted-foreground mt-2">
            Śledzenie postępu i zarządzanie projektami agencji
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nowy Projekt
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wszystkie Projekty</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Łączna liczba projektów
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">W Trakcie</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Aktywnie realizowane
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zakończone</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Pomyślnie ukończone
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budżet vs Wydatki</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((stats.totalSpent / stats.totalBudget) * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalSpent.toLocaleString()} z {stats.totalBudget.toLocaleString()} zł
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
                placeholder="Szukaj projektów..."
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

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Projektów</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">Wszystkie ({projects.length})</TabsTrigger>
              <TabsTrigger value="in-progress">W trakcie ({stats.inProgress})</TabsTrigger>
              <TabsTrigger value="completed">Zakończone ({stats.completed})</TabsTrigger>
              <TabsTrigger value="delayed">Opóźnione ({stats.delayed})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="p-6 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{project.name}</h3>
                          {getStatusBadge(project.status)}
                          {getPriorityBadge(project.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Klient: <strong>{project.client}</strong></span>
                          <span>Typ: <strong>{project.type}</strong></span>
                          <span>Faza: <strong>{project.phase}</strong></span>
                        </div>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Termin:</span>
                        </div>
                        <div className="text-sm font-medium">
                          {project.startDate} - {project.endDate}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Budżet:</span>
                        </div>
                        <div className="text-sm font-medium">
                          {project.spent.toLocaleString()} / {project.budget.toLocaleString()} zł
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Zespół:</span>
                        </div>
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map((member, idx) => (
                            <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                              <AvatarFallback className="text-xs">
                                {member.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {project.team.length > 3 && (
                            <div className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium">
                              +{project.team.length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Postęp:</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="w-full" />
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
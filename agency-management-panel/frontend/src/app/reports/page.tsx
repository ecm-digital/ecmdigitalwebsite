"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Eye,
  Send,
  Printer
} from "lucide-react";

const reports = [
  {
    id: 1,
    title: "Raport Miesięczny - Styczeń 2024",
    type: "monthly",
    date: "2024-02-01",
    status: "generated",
    size: "2.4 MB",
    description: "Pełny raport miesięczny z analizą przychodów, projektów i wydajności zespołu"
  },
  {
    id: 2,
    title: "Analiza Rentowności Klientów",
    type: "financial",
    date: "2024-01-28",
    status: "generated",
    size: "1.8 MB",
    description: "Szczegółowa analiza rentowności poszczególnych klientów i projektów"
  },
  {
    id: 3,
    title: "Raport Kwartalny Q4 2023",
    type: "quarterly",
    date: "2024-01-15",
    status: "generated",
    size: "5.2 MB",
    description: "Kwartalny raport z podsumowaniem wyników i prognozami na kolejny kwartał"
  },
  {
    id: 4,
    title: "Analiza Wydajności Zespołu",
    type: "performance",
    date: "2024-01-10",
    status: "generated",
    size: "3.1 MB",
    description: "Raport z analizą wydajności zespołu i indywidualnych członków"
  },
  {
    id: 5,
    title: "Raport Kampanii Marketingowych",
    type: "marketing",
    date: "2024-01-05",
    status: "pending",
    size: "-",
    description: "Analiza efektywności kampanii marketingowych i ROI"
  }
];

const reportTypes = [
  { value: "all", label: "Wszystkie" },
  { value: "monthly", label: "Miesięczne" },
  { value: "quarterly", label: "Kwartalne" },
  { value: "financial", label: "Finansowe" },
  { value: "performance", label: "Wydajność" },
  { value: "marketing", label: "Marketing" }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "generated":
      return <Badge variant="default" className="bg-green-500">Wygenerowany</Badge>;
    case "pending":
      return <Badge variant="secondary">Oczekujący</Badge>;
    case "draft":
      return <Badge variant="outline">Szkic</Badge>;
    default:
      return <Badge variant="outline">Nieznany</Badge>;
  }
};

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedType === "all") return matchesSearch;
    return matchesSearch && report.type === selectedType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Raporty i Analizy</h1>
          <p className="text-muted-foreground mt-2">
            Generowanie, przeglądanie i zarządzanie raportami
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Nowy Raport
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Szukaj raportów..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {reportTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Zaawansowane
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:bg-secondary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
                {getStatusBadge(report.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Data wygenerowania:</span>
                  <span>{report.date}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rozmiar:</span>
                  <span>{report.size}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Typ:</span>
                  <Badge variant="secondary" className="capitalize">
                    {report.type}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" disabled={report.status !== "generated"}>
                    <Eye className="h-4 w-4 mr-2" />
                    Podgląd
                  </Button>
                  <Button variant="outline" size="sm" disabled={report.status !== "generated"}>
                    <Download className="h-4 w-4 mr-2" />
                    Pobierz
                  </Button>
                  <Button variant="outline" size="sm" disabled={report.status !== "generated"}>
                    <Printer className="h-4 w-4 mr-2" />
                    Drukuj
                  </Button>
                  <Button variant="outline" size="sm" disabled={report.status !== "generated"}>
                    <Send className="h-4 w-4 mr-2" />
                    Wyślij
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Szablony Raportów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Raport Miesięczny</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Pełny miesięczny raport z analizą finansową i operacyjną
              </p>
              <Button variant="outline" size="sm">Użyj szablonu</Button>
            </div>
            
            <div className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <PieChart className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Analiza Finansowa</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Szczegółowa analiza przychodów, kosztów i rentowności
              </p>
              <Button variant="outline" size="sm">Użyj szablonu</Button>
            </div>
            
            <div className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Raport Wydajności</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Analiza wydajności zespołu i indywidualnych członków
              </p>
              <Button variant="outline" size="sm">Użyj szablonu</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
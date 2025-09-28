"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Send
} from "lucide-react";

// Mock data for finances
const invoices = [
  {
    id: "INV-2024-001",
    client: "ABC Corporation",
    project: "E-commerce Platform",
    amount: 15000,
    status: "paid",
    issueDate: "2024-01-01",
    dueDate: "2024-01-31",
    paidDate: "2024-01-25",
    type: "project"
  },
  {
    id: "INV-2024-002",
    client: "XYZ Technologies",
    project: "Mobile App Development",
    amount: 8000,
    status: "pending",
    issueDate: "2024-01-05",
    dueDate: "2024-02-05",
    paidDate: null,
    type: "milestone"
  },
  {
    id: "INV-2024-003",
    client: "HealthTech Solutions",
    project: "MVP Prototype",
    amount: 12000,
    status: "overdue",
    issueDate: "2023-12-15",
    dueDate: "2024-01-15",
    paidDate: null,
    type: "project"
  },
  {
    id: "INV-2024-004",
    client: "Premium Estates",
    project: "Website Redesign",
    amount: 6000,
    status: "draft",
    issueDate: "2024-01-08",
    dueDate: "2024-02-08",
    paidDate: null,
    type: "retainer"
  }
];

const expenses = [
  {
    id: 1,
    description: "Hosting i domeny",
    category: "Infrastructure",
    amount: 850,
    date: "2024-01-05",
    status: "approved",
    vendor: "AWS"
  },
  {
    id: 2,
    description: "Licencje oprogramowania",
    category: "Software",
    amount: 1200,
    date: "2024-01-03",
    status: "approved",
    vendor: "Adobe"
  },
  {
    id: 3,
    description: "Marketing i reklama",
    category: "Marketing",
    amount: 2500,
    date: "2024-01-02",
    status: "pending",
    vendor: "Google Ads"
  }
];

const monthlyRevenue = [
  { month: "Sty", revenue: 45000, expenses: 12000, profit: 33000 },
  { month: "Lut", revenue: 52000, expenses: 14000, profit: 38000 },
  { month: "Mar", revenue: 48000, expenses: 13500, profit: 34500 },
  { month: "Kwi", revenue: 58000, expenses: 15000, profit: 43000 },
  { month: "Maj", revenue: 62000, expenses: 16000, profit: 46000 },
  { month: "Cze", revenue: 55000, expenses: 14500, profit: 40500 }
];

const getInvoiceStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Opłacona</Badge>;
    case "pending":
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Oczekująca</Badge>;
    case "overdue":
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Przeterminowana</Badge>;
    case "draft":
      return <Badge variant="outline"><FileText className="h-3 w-3 mr-1" />Szkic</Badge>;
    default:
      return <Badge variant="outline">Nieznany</Badge>;
  }
};

const getExpenseStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <Badge variant="default" className="bg-green-500">Zatwierdzone</Badge>;
    case "pending":
      return <Badge variant="secondary">Oczekujące</Badge>;
    case "rejected":
      return <Badge variant="destructive">Odrzucone</Badge>;
    default:
      return <Badge variant="outline">Nieznany</Badge>;
  }
};

export default function FinancesPage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = {
    totalRevenue: invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0),
    pendingRevenue: invoices.filter(i => i.status === "pending" || i.status === "overdue").reduce((sum, i) => sum + i.amount, 0),
    totalExpenses: expenses.filter(e => e.status === "approved").reduce((sum, e) => sum + e.amount, 0),
    pendingExpenses: expenses.filter(e => e.status === "pending").reduce((sum, e) => sum + e.amount, 0),
    paidInvoices: invoices.filter(i => i.status === "paid").length,
    pendingInvoices: invoices.filter(i => i.status === "pending").length,
    overdueInvoices: invoices.filter(i => i.status === "overdue").length
  };

  const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1];
  const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2];
  const revenueChange = ((currentMonthRevenue.revenue - previousMonthRevenue.revenue) / previousMonthRevenue.revenue * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zarządzanie Finansami</h1>
          <p className="text-muted-foreground mt-2">
            Przegląd przychodów, wydatków i analizy finansowe
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Eksport
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nowa Faktura
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Przychody Miesięczne</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthRevenue.revenue.toLocaleString()} zł</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {revenueChange >= 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(revenueChange).toFixed(1)}% z poprzedniego miesiąca
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oczekujące Płatności</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRevenue.toLocaleString()} zł</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingInvoices + stats.overdueInvoices} faktury do zapłacenia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wydatki Miesięczne</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthRevenue.expenses.toLocaleString()} zł</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingExpenses.toLocaleString()} zł oczekujących
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zysk Miesięczny</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthRevenue.profit.toLocaleString()} zł</div>
            <p className="text-xs text-muted-foreground">
              Marża: {Math.round((currentMonthRevenue.profit / currentMonthRevenue.revenue) * 100)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Przychody vs Wydatki (6 miesięcy)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyRevenue.map((month, index) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium">{month.month}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Przychody</span>
                    <span className="font-medium">{month.revenue.toLocaleString()} zł</span>
                  </div>
                  <Progress value={(month.revenue / 70000) * 100} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span>Wydatki</span>
                    <span className="font-medium">{month.expenses.toLocaleString()} zł</span>
                  </div>
                  <Progress value={(month.expenses / 20000) * 100} className="h-2 bg-red-100" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed views */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="invoices" value={selectedTab} onValueChange={setSelectedTab}>
            <div className="p-6 pb-0">
              <TabsList>
                <TabsTrigger value="invoices">Faktury ({invoices.length})</TabsTrigger>
                <TabsTrigger value="expenses">Wydatki ({expenses.length})</TabsTrigger>
                <TabsTrigger value="analytics">Analityka</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Invoices Tab */}
            <TabsContent value="invoices" className="p-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Szukaj faktur..."
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

                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{invoice.id}</h3>
                          {getInvoiceStatusBadge(invoice.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Klient: <strong>{invoice.client}</strong></div>
                          <div>Projekt: {invoice.project}</div>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-lg font-bold">{invoice.amount.toLocaleString()} zł</div>
                        <div className="text-sm text-muted-foreground">
                          Termin: {invoice.dueDate}
                        </div>
                        {invoice.paidDate && (
                          <div className="text-sm text-green-600">
                            Opłacono: {invoice.paidDate}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status === "pending" && (
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Expenses Tab */}
            <TabsContent value="expenses" className="p-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Wydatki</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj Wydatek
                  </Button>
                </div>

                <div className="space-y-3">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{expense.description}</h3>
                          {getExpenseStatusBadge(expense.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Kategoria: <strong>{expense.category}</strong></div>
                          <div>Dostawca: {expense.vendor}</div>
                          <div>Data: {expense.date}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold">{expense.amount.toLocaleString()} zł</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {expense.status === "pending" && (
                          <>
                            <Button variant="default" size="sm">Zatwierdź</Button>
                            <Button variant="destructive" size="sm">Odrzuć</Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="p-6 pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status Faktur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Opłacone</span>
                        </div>
                        <span className="text-sm font-medium">{stats.paidInvoices}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Oczekujące</span>
                        </div>
                        <span className="text-sm font-medium">{stats.pendingInvoices}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">Przeterminowane</span>
                        </div>
                        <span className="text-sm font-medium">{stats.overdueInvoices}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Analiza Rentowności</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Średnia marża zysku</span>
                          <span className="font-medium">73%</span>
                        </div>
                        <Progress value={73} className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Wskaźnik odbioru płatności</span>
                          <span className="font-medium">89%</span>
                        </div>
                        <Progress value={89} className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Wzrost przychodów (YoY)</span>
                          <span className="font-medium">24%</span>
                        </div>
                        <Progress value={24} className="w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
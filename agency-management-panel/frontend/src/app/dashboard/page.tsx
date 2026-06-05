"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Bell,
  Calendar,
  BarChart3,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
  Settings,
  Loader2,
} from "lucide-react";
import { useDashboardStats, useNotifications } from "@/hooks/use-dashboard";

const formatTimeAgo = (date: string | Date) => {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (seconds < 60) return "przed chwilą";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minutę' : minutes < 5 ? 'minuty' : 'minut'} temu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'godzinę' : hours < 5 ? 'godziny' : 'godzin'} temu`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'dzień' : 'dni'} temu`;
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: notificationsData, isLoading: notificationsLoading } = useNotifications({
    limit: 3,
    unreadOnly: false,
  });

  if (statsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Błąd podczas ładowania danych dashboardu</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const kpis = stats?.kpis || {
    activeClients: 0,
    activeClientsChange: 0,
    monthlyRevenue: 0,
    monthlyRevenueChange: 0,
    activeProjects: 0,
    activeProjectsChange: 0,
    clientSatisfaction: 0,
  };

  const projectStatus = stats?.projectStatus || {
    completed: 0,
    "in-progress": 0,
    planning: 0,
    delayed: 0,
  };

  const servicePerformance = stats?.servicePerformance || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const notifications = notificationsData?.notifications || [];
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold gradient-text-primary">Dashboard Zarządzania</h1>
        <p className="text-muted-foreground mt-2">Przegląd kluczowych metryk i wydajności agencji</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Add stagger animation delays */}
        <Card className="animate-slide-up animate-delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktywni Klienci</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.activeClients}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {kpis.activeClientsChange >= 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {kpis.activeClientsChange >= 0 ? '+' : ''}{kpis.activeClientsChange}% z poprzedniego miesiąca
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up animate-delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Przychody Miesięczne</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {kpis.monthlyRevenueChange >= 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {kpis.monthlyRevenueChange >= 0 ? '+' : ''}{kpis.monthlyRevenueChange}% z poprzedniego miesiąca
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up animate-delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projekty w Toku</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.activeProjects}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {kpis.activeProjectsChange >= 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {kpis.activeProjectsChange >= 0 ? '+' : ''}{kpis.activeProjectsChange} z poprzedniego tygodnia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satysfakcja Klientów</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Wydajność Usług</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicePerformance.length > 0 ? (
                servicePerformance.map((service: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={service.progress} className="w-20" />
                      <span className="text-sm font-medium">{service.progress}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Brak danych o wydajności usług</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Projektów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Zakończone</span>
                </div>
                <span className="text-sm font-medium">{projectStatus.completed || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">W trakcie</span>
                </div>
                <span className="text-sm font-medium">{projectStatus["in-progress"] || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Oczekujące</span>
                </div>
                <span className="text-sm font-medium">{projectStatus.planning || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Opóźnione</span>
                </div>
                <span className="text-sm font-medium">{projectStatus.delayed || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ostatnia Aktywność</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.slice(0, 4).map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp ? formatTimeAgo(activity.timestamp) : "Przed chwilą"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Brak ostatniej aktywności</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Powiadomienia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notificationsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length > 0 ? (
              <>
                <div className="space-y-4">
                  {notifications.map((notification: any) => (
                    <div key={notification.id} className="flex items-start gap-3">
                      <Badge
                        variant={
                          notification.priority === "high"
                            ? "destructive"
                            : notification.priority === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {notification.priority === "high"
                          ? "Pilne"
                          : notification.priority === "medium"
                          ? "Info"
                          : "Normal"}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {notification.createdAt ? formatTimeAgo(notification.createdAt) : "Przed chwilą"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Zobacz wszystkie
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Brak powiadomień</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

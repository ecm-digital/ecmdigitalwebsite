"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Eye
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analityka Biznesowa</h1>
          <p className="text-muted-foreground mt-2">
            Szczegółowe analizy wydajności i wskaźniki KPI
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtry
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Eksport
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Konwersja Leadów</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">
              +3.2% z poprzedniego miesiąca
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Średni Czas Projeku</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 dni</div>
            <p className="text-xs text-muted-foreground">
              -5 dni z poprzedniego okresu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Kampanii</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342%</div>
            <p className="text-xs text-muted-foreground">
              +15% z poprzedniego kwartału
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zadowolenie Klientów</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">
              94% klientów poleca
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wydajność Usług (30 dni)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Strony WWW</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Sklepy Shopify</span>
                  <span className="font-medium">87%</span>
                </div>
                <Progress value={87} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Aplikacje Mobilne</span>
                  <span className="font-medium">95%</span>
                </div>
                <Progress value={95} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Prototypy MVP</span>
                  <span className="font-medium">89%</span>
                </div>
                <Progress value={89} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Audyty UX</span>
                  <span className="font-medium">91%</span>
                </div>
                <Progress value={91} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Przychody według Kanałów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Rekomendacje</span>
                </div>
                <span className="text-sm font-medium">42%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Kampanie PPC</span>
                </div>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Social Media</span>
                </div>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Bezpośrednie</span>
                </div>
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Szczegółowe Metryki</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Metryka</th>
                  <th className="text-right py-3 px-4">Obecny</th>
                  <th className="text-right py-3 px-4">Poprzedni</th>
                  <th className="text-right py-3 px-4">Zmiana</th>
                  <th className="text-right py-3 px-4">Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-secondary/50">
                  <td className="py-3 px-4">CAC (Koszt pozyskania klienta)</td>
                  <td className="text-right py-3 px-4">1,250 zł</td>
                  <td className="text-right py-3 px-4">1,420 zł</td>
                  <td className="text-right py-3 px-4 text-green-500">-12%</td>
                  <td className="text-right py-3 px-4">
                    <TrendingUp className="h-4 w-4 text-green-500 inline" />
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/50">
                  <td className="py-3 px-4">LTV (Wartość życiowa klienta)</td>
                  <td className="text-right py-3 px-4">12,800 zł</td>
                  <td className="text-right py-3 px-4">11,900 zł</td>
                  <td className="text-right py-3 px-4 text-green-500">+7.6%</td>
                  <td className="text-right py-3 px-4">
                    <TrendingUp className="h-4 w-4 text-green-500 inline" />
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/50">
                  <td className="py-3 px-4">Churn Rate</td>
                  <td className="text-right py-3 px-4">2.3%</td>
                  <td className="text-right py-3 px-4">3.1%</td>
                  <td className="text-right py-3 px-4 text-green-500">-25.8%</td>
                  <td className="text-right py-3 px-4">
                    <TrendingUp className="h-4 w-4 text-green-500 inline" />
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/50">
                  <td className="py-3 px-4">Retention Rate</td>
                  <td className="text-right py-3 px-4">97.7%</td>
                  <td className="text-right py-3 px-4">96.9%</td>
                  <td className="text-right py-3 px-4 text-green-500">+0.8%</td>
                  <td className="text-right py-3 px-4">
                    <TrendingUp className="h-4 w-4 text-green-500 inline" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  FileText,
  CreditCard,
  Wallet,
  Target
} from "lucide-react";

interface FinancialData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  projects: number;
}

export function FinancialAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const monthlyData: FinancialData[] = [
    { month: 'Sty', revenue: 45000, expenses: 32000, profit: 13000, projects: 8 },
    { month: 'Lut', revenue: 52000, expenses: 35000, profit: 17000, projects: 9 },
    { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000, projects: 7 },
    { month: 'Kwi', revenue: 60000, expenses: 38000, profit: 22000, projects: 11 },
    { month: 'Maj', revenue: 55000, expenses: 36000, profit: 19000, projects: 10 },
    { month: 'Cze', revenue: 65000, expenses: 40000, profit: 25000, projects: 12 }
  ];

  const totalRevenue = monthlyData.reduce((sum, data) => sum + data.revenue, 0);
  const totalExpenses = monthlyData.reduce((sum, data) => sum + data.expenses, 0);
  const totalProfit = monthlyData.reduce((sum, data) => sum + data.profit, 0);
  const totalProjects = monthlyData.reduce((sum, data) => sum + data.projects, 0);

  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const averageRevenue = totalRevenue / monthlyData.length;
  const growthRate = monthlyData.length > 1 ?
    ((monthlyData[monthlyData.length - 1].revenue - monthlyData[0].revenue) / monthlyData[0].revenue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Łączne Przychody</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} zł</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +{Math.round(growthRate)}% wzrost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wydatki</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses.toLocaleString()} zł</div>
            <p className="text-xs text-muted-foreground">Średnio {Math.round(totalExpenses / monthlyData.length).toLocaleString()} zł/msc</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zysk Netto</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProfit.toLocaleString()} zł</div>
            <p className="text-xs text-muted-foreground">{Math.round(profitMargin)}% marża</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projekty</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">Średnio {Math.round(totalProjects / monthlyData.length)}/msc</p>
          </CardContent>
        </Card>
      </div>

      {/* Period Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analiza Finansowa</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('month')}
              >
                Miesiąc
              </Button>
              <Button
                variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('quarter')}
              >
                Kwartał
              </Button>
              <Button
                variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('year')}
              >
                Rok
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="revenue">Przychody</TabsTrigger>
              <TabsTrigger value="expenses">Wydatki</TabsTrigger>
              <TabsTrigger value="profit">Zysk</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Przychody miesięczne</h3>
                  <div className="space-y-3">
                    {monthlyData.map((data) => (
                      <div key={data.month} className="flex items-center justify-between">
                        <span className="text-sm">{data.month}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{data.revenue.toLocaleString()} zł</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Podsumowanie</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Średnie przychody</span>
                      <span className="font-medium">{Math.round(averageRevenue).toLocaleString()} zł</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Najwyższy miesiąc</span>
                      <span className="font-medium">{Math.max(...monthlyData.map(d => d.revenue)).toLocaleString()} zł</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Najniższy miesiąc</span>
                      <span className="font-medium">{Math.min(...monthlyData.map(d => d.revenue)).toLocaleString()} zł</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Struktura wydatków</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Personel</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Narzędzia/Software</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Marketing</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Infrastruktura</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Inne</span>
                      <span className="font-medium">5%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Trend wydatków</h3>
                  <div className="space-y-3">
                    {monthlyData.map((data) => (
                      <div key={data.month} className="flex items-center justify-between">
                        <span className="text-sm">{data.month}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(data.expenses / Math.max(...monthlyData.map(d => d.expenses))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{data.expenses.toLocaleString()} zł</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profit" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Zysk miesięczny</h3>
                  <div className="space-y-3">
                    {monthlyData.map((data) => (
                      <div key={data.month} className="flex items-center justify-between">
                        <span className="text-sm">{data.month}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${data.profit > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.abs(data.profit) / Math.max(...monthlyData.map(d => Math.abs(d.profit))) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${data.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.profit > 0 ? '+' : ''}{data.profit.toLocaleString()} zł
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Metryki efektywności</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Marża zysku</span>
                      <span className="font-medium">{Math.round(profitMargin)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ROI</span>
                      <span className="font-medium text-green-600">+{Math.round((totalProfit / totalExpenses) * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Zysk na projekt</span>
                      <span className="font-medium">{Math.round(totalProfit / totalProjects).toLocaleString()} zł</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Efektywność</span>
                      <Badge variant={profitMargin > 20 ? "default" : profitMargin > 10 ? "secondary" : "destructive"}>
                        {profitMargin > 20 ? "Wysoka" : profitMargin > 10 ? "Średnia" : "Niska"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

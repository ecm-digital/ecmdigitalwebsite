"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Briefcase, DollarSign, Clock } from "lucide-react";

const stats = [
  {
    title: "Aktywne Projekty",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Briefcase,
    description: "vs poprzedni miesiąc"
  },
  {
    title: "Przychody",
    value: "€45,231",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    description: "vs poprzedni miesiąc"
  },
  {
    title: "Klienci",
    value: "18",
    change: "+3",
    trend: "up",
    icon: Users,
    description: "nowi w tym miesiącu"
  },
  {
    title: "Średni czas projektu",
    value: "6.2 tyg",
    change: "-0.8 tyg",
    trend: "down",
    icon: Clock,
    description: "vs poprzedni miesiąc"
  }
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-lg chip-gradient">
                <Icon className="h-4 w-4 text-foreground/80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text-primary">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendIcon 
                  className={`h-3 w-3 ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`} 
                />
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
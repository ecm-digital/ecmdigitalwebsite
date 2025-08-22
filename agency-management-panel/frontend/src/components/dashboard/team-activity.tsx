"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageCircle, FileText, CheckCircle } from "lucide-react";

const activities = [
  {
    id: 1,
    user: "Anna Kowalska",
    initials: "AK",
    action: "zaktualizowała status projektu",
    target: "Redesign TechStore",
    time: "2 min temu",
    type: "update",
    icon: CheckCircle
  },
  {
    id: 2,
    user: "Piotr Wiśniewski",
    initials: "PW",
    action: "dodał komentarz do",
    target: "Portal MedCorp",
    time: "15 min temu",
    type: "comment",
    icon: MessageCircle
  },
  {
    id: 3,
    user: "Katarzyna Lewandowska",
    initials: "KL",
    action: "przesłała dokumenty do",
    target: "Landing StartupXYZ",
    time: "1 godz temu",
    type: "document",
    icon: FileText
  },
  {
    id: 4,
    user: "Jan Kowalczyk",
    initials: "JK",
    action: "rozpoczął pracę nad",
    target: "Aplikacja FinanceApp",
    time: "2 godz temu",
    type: "start",
    icon: Clock
  },
  {
    id: 5,
    user: "Michał Nowak",
    initials: "MN",
    action: "zakończył zadanie w",
    target: "Portal MedCorp",
    time: "3 godz temu",
    type: "complete",
    icon: CheckCircle
  }
];

const typeColors = {
  update: "bg-blue-100 text-blue-800",
  comment: "bg-green-100 text-green-800",
  document: "bg-purple-100 text-purple-800",
  start: "bg-orange-100 text-orange-800",
  complete: "bg-emerald-100 text-emerald-800"
};

const iconColors = {
  update: "text-blue-500",
  comment: "text-green-500",
  document: "text-purple-500",
  start: "text-orange-500",
  complete: "text-emerald-500"
};

export function TeamActivity() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Aktywność Zespołu</CardTitle>
          <Badge variant="secondary" className="text-xs">
            Ostatnie 24h
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {activity.initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className={`w-4 h-4 ${iconColors[activity.type]}`} />
                    <span className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      {" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                      {" "}
                      <span className="font-medium">{activity.target}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${typeColors[activity.type]}`}
                    >
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            Zobacz wszystkie aktywności →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
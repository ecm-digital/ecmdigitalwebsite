"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    name: "Redesign sklepu TechStore",
    client: "TechStore Sp. z o.o.",
    status: "W trakcie",
    progress: 75,
    deadline: "2025-02-15",
    team: ["JK", "AM", "PW"],
    priority: "high"
  },
  {
    id: 2,
    name: "Aplikacja mobilna FinanceApp",
    client: "FinTech Solutions",
    status: "Planowanie",
    progress: 25,
    deadline: "2025-03-01",
    team: ["AM", "KL"],
    priority: "medium"
  },
  {
    id: 3,
    name: "Portal korporacyjny MedCorp",
    client: "MedCorp International",
    status: "W trakcie",
    progress: 60,
    deadline: "2025-02-28",
    team: ["PW", "JK", "MN", "AM"],
    priority: "high"
  },
  {
    id: 4,
    name: "Landing page StartupXYZ",
    client: "StartupXYZ",
    status: "Testowanie",
    progress: 90,
    deadline: "2025-02-10",
    team: ["KL", "MN"],
    priority: "low"
  }
];

const statusColors = {
  "W trakcie": "bg-blue-100 text-blue-800",
  "Planowanie": "bg-yellow-100 text-yellow-800",
  "Testowanie": "bg-green-100 text-green-800",
  "Zakończony": "bg-gray-100 text-gray-800"
};

const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500"
};

export function RecentProjects() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Ostatnie Projekty</CardTitle>
          <Button variant="outline" size="sm">
            Zobacz wszystkie
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`p-4 border rounded-lg border-l-4 ${priorityColors[project.priority]} hover:bg-muted/50 transition-colors`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-sm">{project.name}</h3>
                    <Badge 
                      variant="secondary" 
                      className={statusColors[project.status]}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {project.client}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{project.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{project.team.length} osób</span>
                      </div>
                    </div>
                    
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, index) => (
                        <Avatar key={index} className="w-6 h-6 border-2 border-background">
                          <AvatarFallback className="text-xs">{member}</AvatarFallback>
                        </Avatar>
                      ))}
                      {project.team.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            +{project.team.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {project.progress}%
                    </span>
                  </div>
                </div>
                
                <Button variant="ghost" size="icon" className="ml-2">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
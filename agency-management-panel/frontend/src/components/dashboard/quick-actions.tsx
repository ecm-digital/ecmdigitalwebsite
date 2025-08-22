"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, Calendar, DollarSign, Settings } from "lucide-react";

const actions = [
  {
    title: "Nowy Projekt",
    description: "Utwórz nowy projekt dla klienta",
    icon: Plus,
    color: "bg-blue-500 hover:bg-blue-600"
  },
  {
    title: "Dodaj Klienta",
    description: "Dodaj nowego klienta do systemu",
    icon: Users,
    color: "bg-green-500 hover:bg-green-600"
  },
  {
    title: "Utwórz Fakturę",
    description: "Wygeneruj nową fakturę",
    icon: FileText,
    color: "bg-purple-500 hover:bg-purple-600"
  },
  {
    title: "Zaplanuj Spotkanie",
    description: "Dodaj spotkanie do kalendarza",
    icon: Calendar,
    color: "bg-orange-500 hover:bg-orange-600"
  },
  {
    title: "Raport Finansowy",
    description: "Wygeneruj raport przychodów",
    icon: DollarSign,
    color: "bg-emerald-500 hover:bg-emerald-600"
  },
  {
    title: "Zarządzaj Usługami",
    description: "Przejdź do sekcji usług agencji",
    icon: Settings,
    color: "bg-indigo-500 hover:bg-indigo-600",
    href: "/services"
  },
  {
    title: "Ustawienia",
    description: "Zarządzaj ustawieniami agencji",
    icon: Settings,
    color: "bg-gray-500 hover:bg-gray-600"
  }
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Szybkie Akcje</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            
            const buttonContent = (
              <div className="flex items-center space-x-3 w-full">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </div>
            );

            if (action.href) {
              return (
                <a key={index} href={action.href} className="block">
                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start hover:bg-muted/50 w-full"
                  >
                    {buttonContent}
                  </Button>
                </a>
              );
            }

            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 justify-start hover:bg-muted/50"
                onClick={() => console.log(`Clicked: ${action.title}`)}
              >
                {buttonContent}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
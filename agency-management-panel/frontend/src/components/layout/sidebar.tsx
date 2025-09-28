"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  DollarSign,
  Settings,
  Building2,
  BarChart3,
  FileText,
  Bell,
  User
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Klienci",
    href: "/clients",
    icon: Users,
  },
  {
    name: "Projekty",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Finanse",
    href: "/finances",
    icon: DollarSign,
  },
  {
    name: "Analityka",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Raporty",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Ustawienia",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <Building2 className="h-8 w-8 text-primary" />
        <div className="flex flex-col">
          <span className="text-lg font-bold">ECM Digital</span>
          <span className="text-xs text-muted-foreground">Panel Zarządzania</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin</span>
            <span className="text-xs text-muted-foreground">admin@ecmdigital.pl</span>
          </div>
        </div>
      </div>
    </div>
  );
}
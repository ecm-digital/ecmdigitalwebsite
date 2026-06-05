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
    <div className="flex h-full w-64 flex-col glass-background border-r border-border/30 backdrop-blur-[20px] backdrop-saturate-[180%] shadow-[2px_0_20px_rgba(0,0,0,0.1)] dark:shadow-[2px_0_20px_rgba(0,0,0,0.3)]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border/30 liquid-edge">
        <div className="relative">
            <Building2 className="h-8 w-8 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
          <div className="absolute inset-0 blur-xl opacity-30 bg-primary rounded-full" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold gradient-text-primary">ECM Digital</span>
          <span className="text-xs text-muted-foreground">Panel Zarządzania</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-liquid relative overflow-hidden",
                "animate-fade-in",
                isActive
                  ? "bg-primary/90 text-primary-foreground shadow-[0_4px_16px_hsl(var(--primary)/0.3)] scale-[1.02]"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:shadow-sm hover:scale-[1.01] backdrop-blur-[5px]"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-pulse-glow" />
              )}
              <item.icon className={cn(
                "h-4 w-4 relative z-10 transition-liquid",
                isActive && "drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"
              )} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border/30 p-4">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/30 transition-liquid cursor-pointer group">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_4px_12px_hsl(var(--primary)/0.4)] group-hover:shadow-[0_6px_16px_hsl(var(--primary)/0.5)] group-hover:scale-110 transition-liquid">
              <User className="h-4 w-4 text-primary-foreground relative z-10" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
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
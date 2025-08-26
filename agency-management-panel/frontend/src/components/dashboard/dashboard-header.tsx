"use client";

import { Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "./navigation";
import { NotificationsPanel } from "./notifications";

import { usePathname } from "next/navigation";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-secondary/60 backdrop-blur-xl supports-[backdrop-filter]:bg-secondary/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-[10px] tracking-wide">ECM</span>
              </div>
              <span className="font-semibold text-lg text-foreground">ECM Digital management</span>
            </div>
            
            <nav className="hidden md:flex space-x-6">
  {[
    { href: "/", label: "Dashboard" },
    { href: "/projects", label: "Projekty" },
    { href: "/clients", label: "Klienci" },
    { href: "/team", label: "Zespół" },
    { href: "/services", label: "Usługi" },
    { href: "/finances", label: "Finanse" },
  ].map(({ href, label }) => {
    const pathname = usePathname();
    const active = pathname === href || (href !== "/" && pathname.startsWith(href));
    return (
      <a
        key={href}
        href={href}
        className={
          active
            ? "text-primary font-semibold border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground/90"
        }
      >
        {label}
      </a>
    );
  })}
</nav>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Szukaj..."
                className="pl-10 pr-4 py-2 rounded-xl w-64 text-sm bg-secondary/80 border border-border/40 focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              />
            </div>

            {/* Notifications */}
            <NotificationsPanel />

            {/* Settings */}
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-secondary/70">
              <Settings className="w-5 h-5" />
            </Button>

            {/* User Profile */}
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-secondary/70">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
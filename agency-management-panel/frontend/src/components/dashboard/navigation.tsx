"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    exact: true
  },
  {
    name: "Projekty",
    href: "/projects"
  },
  {
    name: "Klienci",
    href: "/clients"
  },
  {
    name: "Case Studies",
    href: "/dashboard/case-studies"
  },
  {
    name: "Zespół",
    href: "/team"
  },
  {
    name: "Usługi",
    href: "/services"
  },
  {
    name: "Finanse",
    href: "/finances"
  }
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (item: typeof navigationItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <nav className="hidden md:flex space-x-6">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "transition-colors hover:text-primary",
            isActive(item)
              ? "text-foreground font-medium border-b-2 border-primary pb-1"
              : "text-muted-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
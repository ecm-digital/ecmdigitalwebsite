import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "flex h-10 w-full min-w-0 rounded-2xl border border-border/30",
        "bg-secondary/40 px-3 py-2 text-base",
        "backdrop-blur-[10px] backdrop-saturate-[150%]",
        "shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.05)]",
        "transition-liquid outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm supports-[backdrop-filter]:bg-secondary/30",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring/50",
        "focus-visible:shadow-[0_4px_16px_hsl(var(--primary)/0.15),inset_0_1px_1px_rgba(255,255,255,0.1)]",
        "hover:border-border/50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }

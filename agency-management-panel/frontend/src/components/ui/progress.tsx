"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/10 relative h-2.5 w-full overflow-hidden rounded-full",
        "backdrop-blur-[5px] border border-border/20",
        "shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-liquid",
          "bg-gradient-to-r from-primary via-primary/90 to-primary",
          "shadow-[0_2px_8px_hsl(var(--primary)/0.4),inset_0_1px_0_rgba(255,255,255,0.3)]",
          "relative overflow-hidden"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }

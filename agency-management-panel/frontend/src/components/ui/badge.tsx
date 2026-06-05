import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-liquid backdrop-blur-[10px] backdrop-saturate-[150%] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/90 text-primary-foreground shadow-[0_2px_8px_hsl(var(--primary)/0.3)] hover:bg-primary hover:shadow-[0_4px_12px_hsl(var(--primary)/0.4)] hover:scale-105",
        secondary:
          "border-border/30 bg-secondary/50 text-secondary-foreground hover:bg-secondary/60 hover:shadow-sm",
        destructive:
          "border-destructive/30 bg-destructive/90 text-destructive-foreground shadow-[0_2px_8px_hsl(var(--destructive)/0.3)] hover:bg-destructive hover:shadow-[0_4px_12px_hsl(var(--destructive)/0.4)] hover:scale-105",
        outline: "text-foreground border-border/30 bg-secondary/30 hover:bg-secondary/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
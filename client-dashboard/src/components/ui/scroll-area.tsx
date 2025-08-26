"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, viewportClassName, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.600)_transparent]",
            "scrollbar-thin scrollbar-thumb-slate-600/70 scrollbar-track-transparent",
            viewportClassName
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

export default ScrollArea;



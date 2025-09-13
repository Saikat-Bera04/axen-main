"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface FloatingDockProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
}

export function FloatingDock({ className, children, ...props }: FloatingDockProps) {
  return (
    <div
      className={cn(
        "floating-dock fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-4">{children}</div>
    </div>
  )
}

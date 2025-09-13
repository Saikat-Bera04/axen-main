"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface Card3DProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
}

export function Card3D({ className, children, ...props }: Card3DProps) {
  return (
    <div
      className={cn(
        "card-3d bg-card text-card-foreground rounded-xl border shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface TextHoverEffectProps extends React.ComponentProps<"h1"> {
  children: React.ReactNode
}

export function TextHoverEffect({ className, children, ...props }: TextHoverEffectProps) {
  return (
    <h1 className={cn("text-hover-effect text-4xl md:text-6xl font-bold text-center", className)} {...props}>
      {children}
    </h1>
  )
}

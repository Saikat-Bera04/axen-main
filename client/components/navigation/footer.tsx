"use client"
import Link from "next/link"
import { FloatingDock } from "@/components/ui/floating-dock"
import { Button } from "@/components/ui/button"
import { Home, Plus, Search, BarChart3, MessageSquare, Mail, Heart } from "lucide-react"

const dockItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/submit", icon: Plus, label: "Submit" },
  { href: "/track", icon: Search, label: "Track" },
  { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
]

export function Footer() {
  return (
    <>
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Contact Information */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:work.4bytes@gmail.com" className="hover:text-primary transition-colors duration-200">
                work.4bytes@gmail.com
              </a>
            </div>

            {/* Branding */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>@</span>
              <span className="font-semibold text-foreground">team 4bytes</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Floating Dock */}
      <FloatingDock className="md:hidden">
        {dockItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              asChild
              className="flex flex-col items-center gap-1 p-2 h-auto text-xs"
            >
              <Link href={item.href}>
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </Button>
          )
        })}
      </FloatingDock>
    </>
  )
}

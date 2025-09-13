"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Package, Plus, Search, BarChart3, MessageSquare, User, Home, Menu, X } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/submit", label: "Submit Event", icon: Plus },
  { href: "/track", label: "Track Product", icon: Search },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/insights", label: "AI Insights", icon: Package },
  { href: "/chat", label: "RAG Assistant", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="Supply Chain Tracker Logo"
                width={120}
                height={120}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300"></span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300 hover:scale-105",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
            >
              Connect Wallet
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg">
            <div className="py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className={cn(
                      "w-full justify-start gap-3 transition-all duration-300",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "hover:bg-primary/10 hover:text-primary",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
              <Button
                variant="default"
                size="sm"
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground transition-all duration-300"
              >
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

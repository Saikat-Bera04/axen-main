"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Package, Plus, Search, BarChart3, MessageSquare, User, Home } from "lucide-react";

export function NavbarDemo() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/submit", label: "Submit Event", icon: Plus },
    { href: "/track", label: "Track Product", icon: Search },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/insights", label: "AI Insights", icon: Package },
    { href: "/chat", label: "RAG Assistant", icon: MessageSquare },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="https://i.postimg.cc/SR09W3Zp/Untitled-design-removebg-preview.png"
                  alt="Supply Chain Tracker Logo"
                  width={120}
                  height={120}
                  className="transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>
            </Link>
          </NavbarLogo>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

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
                      : "hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" className="hidden sm:flex">
              Connect Wallet
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo>
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <Image
                    src="https://i.postimg.cc/SR09W3Zp/Untitled-design-removebg-preview.png"
                    alt="Supply Chain Tracker Logo"
                    width={120}
                    height={120}
                    className="transition-transform duration-300 group-hover:scale-110"
                    priority
                  />
                </div>
              </Link>
            </NavbarLogo>

            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

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
                      : "hover:bg-primary/10 hover:text-primary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}

            <div className="flex w-full flex-col gap-4 mt-4">
              <NavbarButton variant="secondary" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                Connect Wallet
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

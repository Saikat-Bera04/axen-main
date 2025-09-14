import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { NavbarDemo } from "@/components/navigation/navbar"
import { Footer } from "@/components/navigation/footer"
import { GeminiBackground } from "@/components/ui/gemini-background"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Supply Chain Tracker DApp",
  description: "Modern blockchain-based supply chain tracking application",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning={true}>
        <Suspense fallback={<div>Loading...</div>}>
          <GeminiBackground />
          <NavbarDemo />
          <main className="pt-16 min-h-screen">{children}</main>
          <Footer />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

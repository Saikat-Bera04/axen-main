import { TextHoverEffect } from "@/components/ui/text-hover-effect"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Shield, Bot, Search, Wallet, Plus, BarChart3, CheckCircle, Globe, Zap, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="secondary" className="mb-4">
            Powered by Blockchain & AI
          </Badge>

          <TextHoverEffect className="text-balance">Supply Chain Tracker</TextHoverEffect>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Revolutionize your supply chain with blockchain transparency, AI verification, and real-time tracking from
            farm to customer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center color-blue items-center mt-8">
            <Button size="lg" className="flex items-center  gap-2">
              <Wallet className="h-5 w-5" />
              Connect Wallet
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/submit" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Submit Event
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/track" className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Track Product
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the future of supply chain management with our cutting-edge technology stack.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card3D className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Secure Logging</h3>
            <p className="text-muted-foreground">
              Immutable blockchain records ensure data integrity and transparency throughout the entire supply chain
              process.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <CheckCircle className="h-4 w-4" />
              <span>Blockchain Verified</span>
            </div>
          </Card3D>

          <Card3D className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">AI Verification</h3>
            <p className="text-muted-foreground">
              Advanced AI algorithms automatically verify data authenticity, detect anomalies, and ensure compliance
              standards.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <Zap className="h-4 w-4" />
              <span>AI Powered</span>
            </div>
          </Card3D>

          <Card3D className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Product Tracking</h3>
            <p className="text-muted-foreground">
              Real-time visibility from farm to customer with GPS tracking, timestamps, and comprehensive metadata
              logging.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <Search className="h-4 w-4" />
              <span>Real-time Tracking</span>
            </div>
          </Card3D>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple steps to transform your supply chain management.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold text-lg">
              1
            </div>
            <h3 className="font-semibold">Connect Wallet</h3>
            <p className="text-sm text-muted-foreground">
              Link your MetaMask wallet to start tracking products on the blockchain.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold text-lg">
              2
            </div>
            <h3 className="font-semibold">Submit Events</h3>
            <p className="text-sm text-muted-foreground">
              Log product events at each stage with photos, GPS, and metadata.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold text-lg">
              3
            </div>
            <h3 className="font-semibold">AI Verification</h3>
            <p className="text-sm text-muted-foreground">
              Our AI automatically verifies data authenticity and flags anomalies.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold text-lg">
              4
            </div>
            <h3 className="font-semibold">Track & Analyze</h3>
            <p className="text-sm text-muted-foreground">
              Monitor products in real-time and gain insights from AI analytics.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card3D className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold">Ready to Transform Your Supply Chain?</h2>
          <p className="text-muted-foreground">
            Join the future of transparent, AI-powered supply chain management today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </Card3D>
      </section>
    </div>
  )
}

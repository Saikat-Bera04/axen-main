"use client"

import { useState } from "react"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  QrCode,
  MapPin,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  AlertTriangle,
} from "lucide-react"
import { apiService, Event } from "@/lib/api"

export default function TrackProductPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [trackingData, setTrackingData] = useState<Event[] | null>(null)
  const [productId, setProductId] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError(null)
    setProductId(searchQuery)

    try {
      const events = await apiService.getProductEvents(searchQuery)
      setTrackingData(events)
    } catch (err) {
      setError('Failed to fetch product events. Please check if the product ID exists and the backend server is running.')
      console.error('Error fetching product events:', err)
      setTrackingData(null)
    } finally {
      setIsSearching(false)
    }
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "farm":
        return "🌱"
      case "warehouse":
        return "🏭"
      case "store":
        return "🏪"
      case "customer":
        return "👤"
      default:
        return "📦"
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "farm":
        return "bg-green-500"
      case "warehouse":
        return "bg-blue-500"
      case "store":
        return "bg-purple-500"
      case "customer":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
      default:
        return null
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Track Product Journey</h1>
          <p className="text-muted-foreground">
            Enter a Product ID or scan a QR code to view the complete supply chain history.
          </p>
        </div>

        {/* Search Section */}
        <Card3D className="mb-8">
          <div className="space-y-4">
            <Label htmlFor="search" className="text-lg font-semibold">
              Product ID / QR Code
            </Label>

            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  id="search"
                  placeholder="Enter Product ID (e.g., BATCH-2024-001)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="flex items-center gap-2">
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <QrCode className="h-4 w-4" />
                Scan QR
              </Button>
            </div>
          </div>
        </Card3D>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Timeline Visualization */}
        {trackingData && trackingData.length > 0 && (
          <div className="space-y-6">
            <Card3D>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Product Journey: {productId}</h2>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {trackingData.filter((event) => event.aiVerified === "verified").length} / {trackingData.length}{" "}
                  Verified
                </Badge>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

                {trackingData.map((event, index) => (
                  <div key={event._id} className="relative flex items-start gap-6 pb-8 last:pb-0">
                    {/* Timeline Node */}
                    <div
                      className={`relative z-10 w-16 h-16 ${getStageColor(event.stage)} rounded-full flex items-center justify-center text-2xl shadow-lg`}
                    >
                      {getStageIcon(event.stage)}
                    </div>

                    {/* Event Card */}
                    <div className="flex-1">
                      <Card3D className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold capitalize">{event.stage}</h3>
                            <p className="text-sm text-muted-foreground">
                              Submitted by {event.submitter}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getVerificationIcon(event.aiVerified)}
                            <span className="text-sm capitalize">{event.aiVerified}</span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatDate(event.timestamp)}
                          </div>

                          {event.metadata.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {event.metadata.location.lat.toFixed(4)}, {event.metadata.location.lng.toFixed(4)}
                            </div>
                          )}

                          {event.metadata.temperature && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">🌡️</span>
                              {event.metadata.temperature}°C
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {event.submitter}
                          </div>
                        </div>

                        {event.metadata.notes && (
                          <div className="mb-4">
                            <p className="text-sm bg-muted/50 rounded p-2">{event.metadata.notes}</p>
                          </div>
                        )}

                        <Separator className="my-3" />

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              IPFS: {event.ipfsHash}
                            </span>
                            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Evidence
                            </Button>
                          </div>
                          <span>TX: {event.transactionHash}</span>
                        </div>
                      </Card3D>
                    </div>
                  </div>
                ))}
              </div>
            </Card3D>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card3D className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{trackingData.length}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </Card3D>

              <Card3D className="text-center p-4">
                <div className="text-2xl font-bold text-green-500">
                  {trackingData.filter((e) => e.aiVerified === "verified").length}
                </div>
                <div className="text-sm text-muted-foreground">AI Verified</div>
              </Card3D>

              <Card3D className="text-center p-4">
                <div className="text-2xl font-bold text-blue-500">
                  {Math.round((Date.now() - new Date(trackingData[0].timestamp).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-muted-foreground">Days in Transit</div>
              </Card3D>

              <Card3D className="text-center p-4">
                <div className="text-2xl font-bold text-purple-500">{new Set(trackingData.map(e => e.stage)).size}</div>
                <div className="text-sm text-muted-foreground">Stages Completed</div>
              </Card3D>
            </div>
          </div>
        )}

        {/* No Results State */}
        {trackingData && trackingData.length === 0 && (
          <Card3D className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
            <p className="text-muted-foreground">No events were found for product ID: {productId}</p>
          </Card3D>
        )}

        {/* Empty State */}
        {!trackingData && !isSearching && (
          <Card3D className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Ready to Track</h3>
            <p className="text-muted-foreground">Enter a Product ID above to view its complete supply chain journey.</p>
          </Card3D>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
} from "lucide-react"

interface TrackingEvent {
  id: string
  stage: "farm" | "warehouse" | "store" | "customer"
  submitter: string
  role: string
  timestamp: string
  metadata: {
    temperature?: number
    notes?: string
    location?: { lat: number; lng: number }
  }
  ipfsHash: string
  aiVerified: "verified" | "failed" | "pending"
  transactionHash: string
}

const mockTrackingData: TrackingEvent[] = [
  {
    id: "1",
    stage: "farm",
    submitter: "0x1234...5678",
    role: "Farmer",
    timestamp: "2024-01-15T08:30:00Z",
    metadata: {
      temperature: 18,
      notes: "Organic tomatoes harvested at optimal ripeness",
      location: { lat: 40.7128, lng: -74.006 },
    },
    ipfsHash: "QmX1Y2Z3...",
    aiVerified: "verified",
    transactionHash: "0xabc123...",
  },
  {
    id: "2",
    stage: "warehouse",
    submitter: "0x9876...5432",
    role: "Warehouse Manager",
    timestamp: "2024-01-16T14:15:00Z",
    metadata: {
      temperature: 4,
      notes: "Received and stored in cold storage facility",
      location: { lat: 40.7589, lng: -73.9851 },
    },
    ipfsHash: "QmA4B5C6...",
    aiVerified: "verified",
    transactionHash: "0xdef456...",
  },
  {
    id: "3",
    stage: "store",
    submitter: "0x5555...7777",
    role: "Store Manager",
    timestamp: "2024-01-18T10:45:00Z",
    metadata: {
      temperature: 6,
      notes: "Displayed in produce section",
      location: { lat: 40.7505, lng: -73.9934 },
    },
    ipfsHash: "QmG7H8I9...",
    aiVerified: "pending",
    transactionHash: "0xghi789...",
  },
  {
    id: "4",
    stage: "customer",
    submitter: "0x3333...9999",
    role: "Customer",
    timestamp: "2024-01-19T16:20:00Z",
    metadata: {
      notes: "Purchased and consumed - excellent quality!",
      location: { lat: 40.7282, lng: -73.7949 },
    },
    ipfsHash: "QmJ1K2L3...",
    aiVerified: "verified",
    transactionHash: "0xjkl012...",
  },
]

export default function TrackProductPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [trackingData, setTrackingData] = useState<TrackingEvent[] | null>(null)
  const [productId, setProductId] = useState("")

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setProductId(searchQuery)

    // Simulate API call
    setTimeout(() => {
      setTrackingData(mockTrackingData)
      setIsSearching(false)
    }, 1500)
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
              <Button onClick={handleSearch} disabled={isSearching} className="flex items-center gap-2">
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

        {/* Timeline Visualization */}
        {trackingData && (
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
                  <div key={event.id} className="relative flex items-start gap-6 pb-8 last:pb-0">
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
                              Submitted by {event.role} ({event.submitter})
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
                            {event.role}
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
                <div className="text-2xl font-bold text-purple-500">4</div>
                <div className="text-sm text-muted-foreground">Stages Completed</div>
              </Card3D>
            </div>
          </div>
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

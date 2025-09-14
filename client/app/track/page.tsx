"use client"

import { useState, useEffect } from "react"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QRCodeGenerator } from "@/components/ui/qr-code-generator"
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
  Package,
  RefreshCw,
} from "lucide-react"
import { apiService, Event, Product } from "@/lib/api"

export default function TrackProductPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [trackingData, setTrackingData] = useState<Event[] | null>(null)
  const [productId, setProductId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [showAllProducts, setShowAllProducts] = useState(true)

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      const data = await apiService.getProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching products:', err)
      setProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSearch = async (productIdToSearch?: string) => {
    const searchId = productIdToSearch || searchQuery
    if (!searchId.trim()) return

    setIsSearching(true)
    setError(null)
    setProductId(searchId)
    setShowAllProducts(false)

    try {
      const events = await apiService.getProductEvents(searchId)
      setTrackingData(events)
    } catch (err) {
      setError('Failed to fetch product events. Please check if the product ID exists and the backend server is running.')
      console.error('Error fetching product events:', err)
      setTrackingData(null)
    } finally {
      setIsSearching(false)
    }
  }

  const handleProductSelect = (productId: string) => {
    setSearchQuery(productId)
    handleSearch(productId)
  }

  const handleBackToProducts = () => {
    setShowAllProducts(true)
    setTrackingData(null)
    setProductId("")
    setSearchQuery("")
    setError(null)
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
              <Button onClick={() => handleSearch()} disabled={isSearching || !searchQuery.trim()} className="flex items-center gap-2">
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

        {/* Available Products Section */}
        {showAllProducts && (
          <Card3D className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Package className="h-6 w-6 text-primary" />
                  Available Products
                </h2>
                <p className="text-muted-foreground">Click on any product to view its complete supply chain journey.</p>
              </div>
              <Button onClick={fetchProducts} disabled={loadingProducts} className="flex items-center gap-2">
                <RefreshCw className={`h-4 w-4 ${loadingProducts ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {loadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading products...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                <p className="text-muted-foreground">No products have been submitted yet. Submit your first event to get started.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Current Stage</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id} className="hover:bg-muted/50 cursor-pointer">
                        <TableCell className="font-medium">{product.productId}</TableCell>
                        <TableCell>{product.batchId}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getStageColor(product.currentStage)} text-white`}>
                            {product.currentStage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(product.lastUpdated).toLocaleDateString()}</TableCell>
                        <TableCell>{product.eventsCount}</TableCell>
                        <TableCell>
                          {product.verificationStatus === "verified" && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {product.verificationStatus === "pending" && (
                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {product.verificationStatus === "failed" && (
                            <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">
                              <XCircle className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleProductSelect(product.productId)}
                              className="flex items-center gap-1"
                            >
                              <Search className="h-3 w-3" />
                              Track
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  <QrCode className="h-3 w-3" />
                                  QR
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>QR Code for {product.productId}</DialogTitle>
                                </DialogHeader>
                                <div className="flex justify-center py-4">
                                  <QRCodeGenerator 
                                    value={product.productId}
                                    size={200}
                                    showActions={true}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card3D>
        )}

        {/* Back to Products Button */}
        {!showAllProducts && (
          <div className="mb-6">
            <Button variant="outline" onClick={handleBackToProducts} className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Back to All Products
            </Button>
          </div>
        )}

        {/* Timeline Visualization */}
        {trackingData && trackingData.length > 0 && (
          <div className="space-y-6">
            <Card3D>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Product Journey: {productId}</h2>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {trackingData.filter((event) => event.aiVerified === "verified").length} / {trackingData.length}{" "}
                    Verified
                  </Badge>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        Show QR Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>QR Code for {productId}</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center py-4">
                        <QRCodeGenerator 
                          value={productId}
                          size={250}
                          showActions={true}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
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

                          {event.metadata?.location?.lat && event.metadata?.location?.lng && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {event.metadata.location.lat.toFixed(4)}, {event.metadata.location.lng.toFixed(4)}
                            </div>
                          )}

                          {event.metadata?.temperature && (
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

                        {event.metadata?.notes && (
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

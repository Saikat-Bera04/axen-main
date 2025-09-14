"use client"

import { useState, useEffect } from "react"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Bot,
  Package,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Activity,
  Users,
  MapPin,
  Thermometer,
  Shield,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiService, Product } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AIWorkerLog {
  id: string
  timestamp: string
  action: string
  productId: string
  status: "success" | "error" | "processing"
  details: string
}

const mockAILogs: AIWorkerLog[] = [
  {
    id: "1",
    timestamp: "2024-01-19T16:25:00Z",
    action: "Anomaly Detection",
    productId: "BATCH-2024-001",
    status: "success",
    details: "Temperature readings within normal range",
  },
  {
    id: "2",
    timestamp: "2024-01-19T16:20:00Z",
    action: "Image Verification",
    productId: "BATCH-2024-002",
    status: "processing",
    details: "Analyzing uploaded product images",
  },
  {
    id: "3",
    timestamp: "2024-01-19T16:15:00Z",
    action: "Location Validation",
    productId: "BATCH-2024-003",
    status: "success",
    details: "GPS coordinates verified against expected route",
  },
  {
    id: "4",
    timestamp: "2024-01-19T16:10:00Z",
    action: "Document Analysis",
    productId: "BATCH-2024-004",
    status: "error",
    details: "Certificate validation failed - document appears tampered",
  },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setError(null)
      const data = await apiService.getProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to fetch products. Please check if the backend server is running.')
      console.error('Error fetching products:', err)
      setProducts([]) // Ensure products is always an array
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const safeProducts = Array.isArray(products) ? products : []
  const filteredProducts = safeProducts.filter((product) => {
    const matchesSearch = product.batchId?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const matchesStage = stageFilter === "all" || product.currentStage === stageFilter
    const matchesVerification = verificationFilter === "all" || product.verificationStatus === verificationFilter

    return matchesSearch && matchesStage && matchesVerification
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchProducts()
    setIsRefreshing(false)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "manufacturing":
        return "bg-indigo-500"
      case "farm":
        return "bg-green-500"
      case "processing":
        return "bg-cyan-500"
      case "warehouse":
        return "bg-blue-500"
      case "distribution":
        return "bg-teal-500"
      case "store":
        return "bg-purple-500"
      case "customer":
        return "bg-orange-500"
      case "quality_check":
        return "bg-yellow-500"
      case "packaging":
        return "bg-pink-500"
      case "shipping":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Supply Chain Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage all products in your supply chain network.</p>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading products...</span>
          </div>
        ) : (
          <>
            {/* Enhanced Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card3D className="p-6 hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {products.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      +{Math.floor(products.length * 0.12)} this week
                    </p>
                  </div>
                  <div className="relative">
                    <Package className="h-8 w-8 text-primary" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </Card3D>

              <Card3D className="p-6 hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Verified</p>
                    <p className="text-3xl font-bold text-green-500">
                      {products.filter((p) => p.verificationStatus === "verified").length}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <p className="text-xs text-green-500">
                        {Math.round((products.filter((p) => p.verificationStatus === "verified").length / products.length) * 100) || 0}% success rate
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </Card3D>

              <Card3D className="p-6 hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-3xl font-bold text-yellow-500">
                      {products.filter((p) => p.verificationStatus === "pending").length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg. processing: 2.3 days
                    </p>
                  </div>
                  <div className="relative">
                    <Clock className="h-8 w-8 text-yellow-500" />
                    {products.filter((p) => p.verificationStatus === "pending").length > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-bounce" />
                    )}
                  </div>
                </div>
              </Card3D>

              <Card3D className="p-6 hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Issues Found</p>
                    <p className="text-3xl font-bold text-red-500">
                      {products.filter((p) => p.verificationStatus === "failed").length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Requires attention
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </Card3D>
            </div>

            {/* Supply Chain Flow Visualization */}
            <Card3D className="p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Supply Chain Flow
              </h3>
              <div className="flex items-center justify-between overflow-x-auto pb-4">
                {[
                  { stage: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
                  { stage: 'farm', label: 'Farm', icon: '🌾' },
                  { stage: 'processing', label: 'Processing', icon: '⚙️' },
                  { stage: 'quality_check', label: 'Quality Check', icon: '🔍' },
                  { stage: 'packaging', label: 'Packaging', icon: '📦' },
                  { stage: 'warehouse', label: 'Warehouse', icon: '🏪' },
                  { stage: 'distribution', label: 'Distribution', icon: '🚛' },
                  { stage: 'shipping', label: 'Shipping', icon: '🚢' },
                  { stage: 'store', label: 'Store', icon: '🏬' },
                  { stage: 'customer', label: 'Customer', icon: '👤' }
                ].map((item, index, array) => {
                  const count = products.filter(p => p.currentStage === item.stage).length
                  const maxCount = Math.max(...array.map(s => products.filter(p => p.currentStage === s.stage).length))
                  const intensity = count > 0 ? Math.max(0.3, count / maxCount) : 0.1
                  
                  return (
                    <div key={item.stage} className="flex items-center">
                      <div className="flex flex-col items-center min-w-[80px]">
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                            count > 0 ? 'bg-primary/20 border-2 border-primary' : 'bg-muted border-2 border-muted-foreground/20'
                          }`}
                          style={{ 
                            backgroundColor: count > 0 ? `rgba(var(--primary), ${intensity})` : undefined,
                            transform: count > 0 ? 'scale(1.1)' : 'scale(1)'
                          }}
                        >
                          {item.icon}
                        </div>
                        <p className="text-xs font-medium mt-1 text-center">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{count}</p>
                      </div>
                      {index < array.length - 1 && (
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 mx-2 min-w-[20px]" />
                      )}
                    </div>
                  )
                })}
              </div>
            </Card3D>

            <Tabs defaultValue="products" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="products">Products Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="ai-logs">AI Worker Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="space-y-6">
                <Card3D>
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Label htmlFor="search" className="sr-only">
                        Search products
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search by Batch ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Select value={stageFilter} onValueChange={setStageFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stages</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="farm">Farm</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="distribution">Distribution</SelectItem>
                          <SelectItem value="store">Store</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="quality_check">Quality Check</SelectItem>
                          <SelectItem value="packaging">Packaging</SelectItem>
                          <SelectItem value="shipping">Shipping</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Batch ID</TableHead>
                          <TableHead>Current Stage</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Verification</TableHead>
                          <TableHead>Events</TableHead>
                          <TableHead>Submitter</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              {safeProducts.length === 0 ? "No products found. Submit your first event to get started." : "No products match your filters."}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredProducts.map((product) => (
                            <TableRow key={product._id}>
                              <TableCell className="font-medium">{product.batchId}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={`${getStageColor(product.currentStage)} text-white`}>
                                  {product.currentStage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(product.lastUpdated)}</TableCell>
                              <TableCell>{getVerificationBadge(product.verificationStatus)}</TableCell>
                              <TableCell>{product.eventsCount}</TableCell>
                              <TableCell className="font-mono text-sm">{product.submitter}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Re-run AI Verification
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card3D>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Stage Distribution Chart */}
                  <Card3D className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Stage Distribution
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(
                        products.reduce((acc, p) => {
                          acc[p.currentStage] = (acc[p.currentStage] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)
                      )
                        .sort(([,a], [,b]) => b - a)
                        .map(([stage, count]) => {
                          const percentage = (count / products.length) * 100
                          return (
                            <div key={stage} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize">{stage.replace('_', ' ')}</span>
                                <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-1000 ${getStageColor(stage)}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </Card3D>

                  {/* Verification Status Chart */}
                  <Card3D className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Verification Status
                    </h3>
                    <div className="space-y-4">
                      {[
                        { status: 'verified', color: 'bg-green-500', icon: CheckCircle },
                        { status: 'pending', color: 'bg-yellow-500', icon: Clock },
                        { status: 'failed', color: 'bg-red-500', icon: XCircle }
                      ].map(({ status, color, icon: Icon }) => {
                        const count = products.filter(p => p.verificationStatus === status).length
                        const percentage = products.length > 0 ? (count / products.length) * 100 : 0
                        return (
                          <div key={status} className="flex items-center gap-3">
                            <Icon className={`h-4 w-4 ${status === 'verified' ? 'text-green-500' : status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`} />
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize">{status}</span>
                                <span className="font-medium">{count}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-1000 ${color}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Card3D>

                  {/* Activity Metrics */}
                  <Card3D className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Activity Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">
                          {products.reduce((sum, p) => sum + p.eventsCount, 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Events</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">
                          {products.length > 0 ? (products.reduce((sum, p) => sum + p.eventsCount, 0) / products.length).toFixed(1) : '0'}
                        </p>
                        <p className="text-xs text-muted-foreground">Avg Events/Product</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">
                          {new Set(products.map(p => p.submitter)).size}
                        </p>
                        <p className="text-xs text-muted-foreground">Active Submitters</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">
                          {Math.round((products.filter(p => p.verificationStatus === 'verified').length / Math.max(products.length, 1)) * 100)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                      </div>
                    </div>
                  </Card3D>

                  {/* Top Performers */}
                  <Card3D className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Top Performers
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(
                        products.reduce((acc, p) => {
                          acc[p.submitter] = (acc[p.submitter] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)
                      )
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([submitter, count], index) => (
                          <div key={submitter} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              index === 2 ? 'bg-amber-600 text-white' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium truncate">{submitter}</p>
                              <p className="text-xs text-muted-foreground">{count} products submitted</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card3D>
                </div>
              </TabsContent>

              <TabsContent value="ai-logs" className="space-y-6">
                <Card3D>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        AI Worker Activity Log
                      </h2>
                      <p className="text-sm text-muted-foreground">Real-time AI verification and analysis activities</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <RefreshCw className="h-4 w-4" />
                      Re-run All Verifications
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {mockAILogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="mt-1">{getLogStatusIcon(log.status)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{log.action}</h3>
                            <span className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Product: {log.productId}</p>
                          <p className="text-sm">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card3D>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}

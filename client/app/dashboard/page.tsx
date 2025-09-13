"use client"

import { useState } from "react"
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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Product {
  id: string
  batchId: string
  currentStage: "farm" | "warehouse" | "store" | "customer"
  lastUpdated: string
  verificationStatus: "verified" | "failed" | "pending"
  eventsCount: number
  submitter: string
}

interface AIWorkerLog {
  id: string
  timestamp: string
  action: string
  productId: string
  status: "success" | "error" | "processing"
  details: string
}

const mockProducts: Product[] = [
  {
    id: "1",
    batchId: "BATCH-2024-001",
    currentStage: "customer",
    lastUpdated: "2024-01-19T16:20:00Z",
    verificationStatus: "verified",
    eventsCount: 4,
    submitter: "0x1234...5678",
  },
  {
    id: "2",
    batchId: "BATCH-2024-002",
    currentStage: "store",
    lastUpdated: "2024-01-19T14:30:00Z",
    verificationStatus: "pending",
    eventsCount: 3,
    submitter: "0x9876...5432",
  },
  {
    id: "3",
    batchId: "BATCH-2024-003",
    currentStage: "warehouse",
    lastUpdated: "2024-01-19T10:15:00Z",
    verificationStatus: "verified",
    eventsCount: 2,
    submitter: "0x5555...7777",
  },
  {
    id: "4",
    batchId: "BATCH-2024-004",
    currentStage: "farm",
    lastUpdated: "2024-01-19T08:45:00Z",
    verificationStatus: "failed",
    eventsCount: 1,
    submitter: "0x3333...9999",
  },
]

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

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.batchId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = stageFilter === "all" || product.currentStage === stageFilter
    const matchesVerification = verificationFilter === "all" || product.verificationStatus === verificationFilter

    return matchesSearch && matchesStage && matchesVerification
  })

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
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

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card3D className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{mockProducts.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </Card3D>

          <Card3D className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-500">
                  {mockProducts.filter((p) => p.verificationStatus === "verified").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card3D>

          <Card3D className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {mockProducts.filter((p) => p.verificationStatus === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </Card3D>

          <Card3D className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-500">
                  {mockProducts.filter((p) => p.verificationStatus === "failed").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </Card3D>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products Overview</TabsTrigger>
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
                      <SelectItem value="farm">Farm</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="store">Store</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
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
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.batchId}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getStageColor(product.currentStage)} text-white`}>
                            {product.currentStage}
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card3D>
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
      </div>
    </div>
  )
}

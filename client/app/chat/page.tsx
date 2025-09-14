"use client"

import { useState, useRef, useEffect } from "react"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, User, Loader2, MessageSquare, Lightbulb, Clock, BarChart3, TrendingUp, AlertCircle, Database } from "lucide-react"
import { apiService, Product, Event } from "@/lib/api"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
  data?: any
  charts?: ChartData[]
}

interface ChartData {
  type: 'bar' | 'line' | 'pie'
  title: string
  data: any[]
}

const suggestedQuestions = [
  "Show me all products in the system",
  "What products are currently being shipped?",
  "Find products with pending verification",
  "Show me products by verification status",
  "Which products have the most events?",
  "Show me recent supply chain activity",
  "What's the distribution of products by stage?",
  "Find products that need attention"
]

const mockResponses: Record<string, string> = {
  "where was batch":
    "Batch BATCH-2024-001 was last stored at the Downtown Distribution Center (Warehouse ID: WH-NYC-001) on January 18th, 2024 at 2:30 PM. The storage conditions were optimal with temperature maintained at 4.2°C. The batch has since been moved to Metro Grocery Store for retail distribution.",
  "show me all delays":
    "I found 3 delays in the past week:\n\n1. BATCH-2024-003: 2-day delay at Port Authority due to customs inspection\n2. BATCH-2024-007: 4-hour delay during warehouse transfer due to equipment maintenance\n3. BATCH-2024-012: 1-day delay in final delivery due to weather conditions\n\nTotal impact: 5 products affected, average delay of 18 hours.",
  "what products are currently at risk":
    "Currently, 4 products are flagged as at-risk:\n\n1. BATCH-2024-002: Temperature fluctuations detected (Risk: Medium)\n2. BATCH-2024-008: Delayed beyond optimal timeline (Risk: High)\n3. BATCH-2024-015: Missing verification documents (Risk: Low)\n4. BATCH-2024-019: Unusual GPS route deviation (Risk: Medium)\n\nRecommendation: Prioritize inspection of BATCH-2024-008.",
  "which warehouse has the best":
    "Based on AI analysis of temperature control performance:\n\n1. Central Cold Storage (WH-NYC-003): 99.2% uptime, ±0.1°C variance\n2. Metro Distribution Hub (WH-NYC-001): 98.7% uptime, ±0.2°C variance\n3. Riverside Warehouse (WH-NYC-002): 97.1% uptime, ±0.3°C variance\n\nCentral Cold Storage consistently maintains the most stable conditions.",
  "predict demand for organic":
    "AI demand forecast for organic tomatoes (next 30 days):\n\n• Week 1: 145 units (+12% from current)\n• Week 2: 162 units (+8% growth)\n• Week 3: 178 units (+10% growth)\n• Week 4: 195 units (+9% growth)\n\nFactors: Seasonal trends, weather patterns, and historical data suggest increasing demand. Recommend scaling production by 15%.",
  "find all products with failed":
    "Found 3 products with failed AI verification:\n\n1. BATCH-2024-004: Document authenticity check failed\n2. BATCH-2024-011: Temperature data inconsistency detected\n3. BATCH-2024-016: GPS location mismatch with declared route\n\nAll require manual review and re-verification. Would you like me to generate inspection reports?",
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI Supply Chain Assistant. I can help you track products, analyze data, and answer questions about your supply chain. I have access to real-time data from your backend system. What would you like to know?",
      timestamp: new Date(),
      suggestions: suggestedQuestions.slice(0, 3),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Load initial data
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, eventsData] = await Promise.all([
        apiService.getProducts(),
        // We'll need to implement getEvents in apiService
        Promise.resolve([]) // Placeholder for now
      ])
      setProducts(Array.isArray(productsData) ? productsData : [])
      setEvents(Array.isArray(eventsData) ? eventsData : [])
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const analyzeQuery = (query: string): { response: string, data?: any, charts?: ChartData[] } => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('show me all products') || lowerQuery.includes('list products')) {
      const response = `I found ${products.length} products in the system:\n\n${products.map(p => 
        `• ${p.batchId} - Stage: ${p.currentStage} - Status: ${p.verificationStatus} - Events: ${p.eventsCount}`
      ).join('\n')}`
      
      const stageDistribution = products.reduce((acc, p) => {
        acc[p.currentStage] = (acc[p.currentStage] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      return {
        response,
        data: products,
        charts: [{
          type: 'pie',
          title: 'Products by Stage',
          data: Object.entries(stageDistribution).map(([stage, count]) => ({ stage, count }))
        }]
      }
    }
    
    if (lowerQuery.includes('verification status') || lowerQuery.includes('by status')) {
      const statusCounts = products.reduce((acc, p) => {
        acc[p.verificationStatus] = (acc[p.verificationStatus] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const response = `Verification Status Summary:\n\n${Object.entries(statusCounts).map(([status, count]) => 
        `• ${status.charAt(0).toUpperCase() + status.slice(1)}: ${count} products`
      ).join('\n')}`
      
      return {
        response,
        charts: [{
          type: 'bar',
          title: 'Products by Verification Status',
          data: Object.entries(statusCounts).map(([status, count]) => ({ status, count }))
        }]
      }
    }
    
    if (lowerQuery.includes('shipping') || lowerQuery.includes('being shipped')) {
      const shippingProducts = products.filter(p => p.currentStage === 'shipping')
      const response = `Found ${shippingProducts.length} products currently being shipped:\n\n${shippingProducts.map(p => 
        `• ${p.batchId} - Submitter: ${p.submitter} - Last Updated: ${new Date(p.lastUpdated).toLocaleDateString()}`
      ).join('\n')}`
      
      return { response, data: shippingProducts }
    }
    
    if (lowerQuery.includes('pending') || lowerQuery.includes('need attention')) {
      const pendingProducts = products.filter(p => p.verificationStatus === 'pending')
      const response = `Found ${pendingProducts.length} products with pending verification:\n\n${pendingProducts.map(p => 
        `• ${p.batchId} - Stage: ${p.currentStage} - Events: ${p.eventsCount}`
      ).join('\n')}\n\nRecommendation: These products should be prioritized for manual review.`
      
      return { response, data: pendingProducts }
    }
    
    if (lowerQuery.includes('most events') || lowerQuery.includes('activity')) {
      const sortedProducts = [...products].sort((a, b) => b.eventsCount - a.eventsCount)
      const topProducts = sortedProducts.slice(0, 5)
      
      const response = `Top 5 products with most supply chain events:\n\n${topProducts.map((p, i) => 
        `${i + 1}. ${p.batchId} - ${p.eventsCount} events - Stage: ${p.currentStage}`
      ).join('\n')}`
      
      return {
        response,
        data: topProducts,
        charts: [{
          type: 'bar',
          title: 'Products by Event Count',
          data: topProducts.map(p => ({ product: p.batchId, events: p.eventsCount }))
        }]
      }
    }
    
    return {
      response: "I understand your question about the supply chain. Based on the current data, I can help you analyze products, track verification status, monitor supply chain stages, and generate insights. Try asking about specific products, verification statuses, or supply chain stages."
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI processing time
    setTimeout(() => {
      const analysis = analyzeQuery(content)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: analysis.response,
        timestamp: new Date(),
        data: analysis.data,
        charts: analysis.charts,
        suggestions: suggestedQuestions
          .filter((q) => !content.toLowerCase().includes(q.toLowerCase().split(" ")[0]))
          .slice(0, 3),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            RAG Assistant
          </h1>
          <p className="text-muted-foreground">
            Ask questions about your supply chain data and get AI-powered insights in real-time.
          </p>
        </div>

        <Card3D className={`${isExpanded ? 'h-[80vh]' : 'h-[600px]'} flex flex-col transition-all duration-300`}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Supply Chain AI</h3>
                <p className="text-xs text-muted-foreground">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                {products.length} Products
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs"
              >
                {isExpanded ? 'Minimize' : 'Expand'}
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      
                      {/* Data Visualization */}
                      {message.charts && message.charts.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {message.charts.map((chart, index) => (
                            <div key={index} className="bg-background/50 rounded-lg p-3">
                              <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
                                <BarChart3 className="h-3 w-3" />
                                {chart.title}
                              </h4>
                              <div className="space-y-1">
                                {chart.data.slice(0, 5).map((item, i) => {
                                  const key = Object.keys(item)[0]
                                  const value = Object.values(item)[1] as number
                                  const maxValue = Math.max(...chart.data.map(d => Object.values(d)[1] as number))
                                  const percentage = (value / maxValue) * 100
                                  
                                  return (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                      <span className="w-16 truncate">{item[key]}</span>
                                      <div className="flex-1 bg-background rounded-full h-2">
                                        <div 
                                          className="bg-primary h-2 rounded-full transition-all duration-500" 
                                          style={{ width: `${percentage}%` }}
                                        />
                                      </div>
                                      <span className="w-8 text-right">{value}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Raw Data Table */}
                      {message.data && Array.isArray(message.data) && message.data.length > 0 && (
                        <div className="mt-4">
                          <div className="bg-background/50 rounded-lg p-3 max-h-48 overflow-y-auto">
                            <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
                              <Database className="h-3 w-3" />
                              Data ({message.data.length} items)
                            </h4>
                            <div className="space-y-1 text-xs">
                              {message.data.slice(0, 10).map((item: any, i) => (
                                <div key={i} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                                  <span className="font-mono">{item.batchId || item.productId || `Item ${i + 1}`}</span>
                                  <span className="text-muted-foreground">{item.currentStage || item.stage || item.status}</span>
                                </div>
                              ))}
                              {message.data.length > 10 && (
                                <div className="text-center text-muted-foreground py-1">
                                  ... and {message.data.length - 10} more items
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                        message.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {formatTime(message.timestamp)}
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-muted-foreground">Suggested questions:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs h-auto py-1 px-2 bg-transparent"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user" ? "order-1 ml-2 bg-secondary" : "order-2 mr-2 bg-primary"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is analyzing your request...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          {/* Input Area */}
          <div className="p-4">
            <div className="flex gap-2">
              {isExpanded ? (
                <Textarea
                  placeholder="Ask detailed questions about your supply chain data..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && !isLoading && handleSendMessage(inputValue)}
                  disabled={isLoading}
                  className="flex-1 min-h-[80px] resize-none"
                />
              ) : (
                <Input
                  placeholder="Ask about your supply chain data..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage(inputValue)}
                  disabled={isLoading}
                  className="flex-1"
                />
              )}
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSendMessage("Show me all products in the system")}
                className="text-xs h-auto py-1 px-2"
              >
                <Database className="h-3 w-3 mr-1" />
                All Products
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSendMessage("What products need attention?")}
                className="text-xs h-auto py-1 px-2"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Need Attention
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSendMessage("Show me products by verification status")}
                className="text-xs h-auto py-1 px-2"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Status Analysis
              </Button>
            </div>
          </div>
        </Card3D>

        {/* Help Section */}
        <Card3D className="mt-6 p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            What can I help you with?
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Product Tracking</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Find product locations and history</li>
                <li>• Check verification status</li>
                <li>• View supply chain timeline</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Analytics & Insights</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Demand forecasting</li>
                <li>• Risk assessment</li>
                <li>• Performance metrics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Operational Queries</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Warehouse performance</li>
                <li>• Delay analysis</li>
                <li>• Temperature monitoring</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Reporting</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Generate custom reports</li>
                <li>• Export data summaries</li>
                <li>• Compliance documentation</li>
              </ul>
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  )
}

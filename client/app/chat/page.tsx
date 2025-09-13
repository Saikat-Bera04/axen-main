"use client"

import { useState, useRef, useEffect } from "react"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, Bot, User, Loader2, MessageSquare, Lightbulb, Clock } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const suggestedQuestions = [
  "Where was Batch BATCH-2024-001 stored last?",
  "Show me all delays in the past week",
  "What products are currently at risk?",
  "Which warehouse has the best temperature control?",
  "Predict demand for organic tomatoes next month",
  "Find all products with failed AI verification",
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
        "Hello! I'm your AI Supply Chain Assistant. I can help you track products, analyze data, and answer questions about your supply chain. What would you like to know?",
      timestamp: new Date(),
      suggestions: suggestedQuestions.slice(0, 3),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

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

    // Simulate AI response
    setTimeout(() => {
      const lowerContent = content.toLowerCase()
      let response =
        "I understand your question about the supply chain. Let me analyze the data and provide you with the most relevant information based on our current records and AI insights."

      // Find matching response
      for (const [key, value] of Object.entries(mockResponses)) {
        if (lowerContent.includes(key)) {
          response = value
          break
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
        suggestions: suggestedQuestions
          .filter((q) => !lowerContent.includes(q.toLowerCase().split(" ")[0]))
          .slice(0, 3),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
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

        <Card3D className="h-[600px] flex flex-col">
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
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              Smart Assistant
            </Badge>
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
              <Input
                placeholder="Ask about your supply chain data..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage(inputValue)}
                disabled={isLoading}
                className="flex-1"
              />
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
                onClick={() => handleSendMessage("Show me today's summary")}
                className="text-xs h-auto py-1 px-2"
              >
                Today's Summary
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSendMessage("What needs my attention?")}
                className="text-xs h-auto py-1 px-2"
              >
                Urgent Items
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSendMessage("Generate weekly report")}
                className="text-xs h-auto py-1 px-2"
              >
                Weekly Report
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

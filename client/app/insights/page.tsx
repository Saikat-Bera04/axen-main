"use client"

import { useState } from "react"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { Brain, TrendingUp, AlertTriangle, Download, Package, Target, Zap, Activity } from "lucide-react"

const anomalyData = [
  { month: "Jan", anomalies: 12, resolved: 10 },
  { month: "Feb", anomalies: 8, resolved: 8 },
  { month: "Mar", anomalies: 15, resolved: 12 },
  { month: "Apr", anomalies: 6, resolved: 6 },
  { month: "May", anomalies: 9, resolved: 7 },
  { month: "Jun", anomalies: 4, resolved: 4 },
]

const demandForecastData = [
  { week: "Week 1", actual: 120, predicted: 115 },
  { week: "Week 2", actual: 135, predicted: 140 },
  { week: "Week 3", actual: 148, predicted: 145 },
  { week: "Week 4", actual: 162, predicted: 160 },
  { week: "Week 5", actual: null, predicted: 175 },
  { week: "Week 6", actual: null, predicted: 185 },
]

const stageDistribution = [
  { name: "Farm", value: 25, color: "#22c55e" },
  { name: "Warehouse", value: 35, color: "#3b82f6" },
  { name: "Store", value: 30, color: "#a855f7" },
  { name: "Customer", value: 10, color: "#f97316" },
]

const temperatureData = [
  { time: "00:00", temperature: 4.2, threshold: 5 },
  { time: "04:00", temperature: 4.5, threshold: 5 },
  { time: "08:00", temperature: 4.8, threshold: 5 },
  { time: "12:00", temperature: 5.2, threshold: 5 },
  { time: "16:00", temperature: 4.9, threshold: 5 },
  { time: "20:00", temperature: 4.3, threshold: 5 },
]

const aiInsights = [
  {
    id: "1",
    productId: "BATCH-2024-001",
    type: "Quality Prediction",
    confidence: 94,
    summary: "Product quality expected to remain optimal for 7 more days based on temperature and handling patterns.",
    recommendations: ["Maintain current storage temperature", "Prioritize for next shipment"],
  },
  {
    id: "2",
    productId: "BATCH-2024-002",
    type: "Risk Assessment",
    confidence: 87,
    summary: "Elevated risk detected due to temperature fluctuations during warehouse storage phase.",
    recommendations: ["Inspect product quality", "Review warehouse cooling systems", "Consider expedited shipping"],
  },
  {
    id: "3",
    productId: "BATCH-2024-003",
    type: "Demand Forecast",
    confidence: 91,
    summary: "High demand predicted for this product category. Recommend increasing production by 15%.",
    recommendations: ["Scale up production", "Secure additional storage capacity", "Optimize distribution routes"],
  },
]

export default function InsightsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("anomalies")

  const handleExport = (format: string) => {
    // Simulate export functionality
    console.log(`Exporting data as ${format}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              AI Insights & Analytics
            </h1>
            <p className="text-muted-foreground">
              Advanced AI-powered analytics for supply chain optimization and predictive insights.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => handleExport("csv")}
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>

            <Button
              variant="outline"
              onClick={() => handleExport("json")}
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card3D className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Accuracy</p>
                <p className="text-2xl font-bold">94.2%</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +2.1% from last month
                </p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </Card3D>

          <Card3D className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Anomalies Detected</p>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3" />4 unresolved
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </Card3D>

          <Card3D className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing Speed</p>
                <p className="text-2xl font-bold">1.2s</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <Zap className="h-3 w-3" />
                  Average per event
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </Card3D>

          <Card3D className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Events Processed</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                  <Package className="h-3 w-3" />
                  This month
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </Card3D>
        </div>

        <Tabs defaultValue="anomalies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="forecasting">Demand Forecasting</TabsTrigger>
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="anomalies" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card3D>
                <h3 className="text-lg font-semibold mb-4">Anomaly Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={anomalyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4d4d4d" />
                    <XAxis dataKey="month" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#333333",
                        border: "1px solid #4d4d4d",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                    <Bar dataKey="anomalies" fill="#f39c12" />
                    <Bar dataKey="resolved" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </Card3D>

              <Card3D>
                <h3 className="text-lg font-semibold mb-4">Supply Chain Stage Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stageDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#333333",
                        border: "1px solid #4d4d4d",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card3D>
            </div>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <Card3D>
              <h3 className="text-lg font-semibold mb-4">Demand Forecast vs Actual</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={demandForecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4d4d4d" />
                  <XAxis dataKey="week" stroke="#ffffff" />
                  <YAxis stroke="#ffffff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333333",
                      border: "1px solid #4d4d4d",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                  <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="predicted" stroke="#f39c12" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </Card3D>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card3D>
              <h3 className="text-lg font-semibold mb-4">Temperature Monitoring</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4d4d4d" />
                  <XAxis dataKey="time" stroke="#ffffff" />
                  <YAxis stroke="#ffffff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333333",
                      border: "1px solid #4d4d4d",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                  <Area type="monotone" dataKey="temperature" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </Card3D>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-6">
              {aiInsights.map((insight) => (
                <Card3D key={insight.id}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{insight.type}</h3>
                      <p className="text-sm text-muted-foreground">Product: {insight.productId}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        {insight.confidence}% Confidence
                      </Badge>
                      <Progress value={insight.confidence} className="w-24" />
                    </div>
                  </div>

                  <p className="text-sm mb-4">{insight.summary}</p>

                  <div>
                    <h4 className="font-medium mb-2">AI Recommendations:</h4>
                    <ul className="space-y-1">
                      {insight.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card3D>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

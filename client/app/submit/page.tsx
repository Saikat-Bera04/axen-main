"use client"

import type React from "react"

import { useState } from "react"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, MapPin, Camera, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { apiService } from "@/lib/api"

export default function SubmitEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    productId: "",
    stage: "",
    submitter: "",
    temperature: "",
    timestamp: new Date().toISOString().slice(0, 16),
    notes: ""
  })

  const handleGPSCapture = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("GPS Error:", error)
          setError("Failed to get GPS location. Please enter coordinates manually.")
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('productId', formData.productId)
      submitData.append('stage', formData.stage)
      submitData.append('submitter', formData.submitter)
      submitData.append('timestamp', formData.timestamp)
      
      if (formData.temperature) {
        submitData.append('temperature', formData.temperature)
      }
      
      if (formData.notes) {
        submitData.append('notes', formData.notes)
      }

      if (gpsLocation) {
        submitData.append('latitude', gpsLocation.lat.toString())
        submitData.append('longitude', gpsLocation.lng.toString())
      }

      // Add files
      selectedFiles.forEach((file, index) => {
        submitData.append('evidence', file)
      })

      const result = await apiService.submitEvent(submitData)
      setTransactionHash(result.transactionHash)
      setIsSubmitted(true)
    } catch (err) {
      setError('Failed to submit event. Please check if the backend server is running and try again.')
      console.error('Error submitting event:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setTransactionHash("")
    setSelectedFiles([])
    setGpsLocation(null)
    setError(null)
    setFormData({
      productId: "",
      stage: "",
      submitter: "",
      temperature: "",
      timestamp: new Date().toISOString().slice(0, 16),
      notes: ""
    })
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card3D className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold">Event Submitted Successfully!</h1>
            <p className="text-muted-foreground">
              Your supply chain event has been recorded on the blockchain and uploaded to IPFS.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <Label className="text-sm font-medium">Transaction Hash:</Label>
              <div className="font-mono text-sm break-all bg-background rounded p-2 border">{transactionHash}</div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetForm}>Submit Another Event</Button>
              <Button variant="outline" asChild>
                <a href={`/track?productId=${formData.productId}`}>View on Tracker</a>
              </Button>
            </div>
          </Card3D>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Submit Supply Chain Event</h1>
          <p className="text-muted-foreground">Record a new event in your product's journey from farm to customer.</p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Card3D>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Product Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">Product ID / Batch ID</Label>
                  <Input 
                    id="productId" 
                    placeholder="e.g., BATCH-2024-001" 
                    value={formData.productId}
                    onChange={(e) => handleInputChange('productId', e.target.value)}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">Supply Chain Stage</Label>
                  <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="farm">Farm</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="quality_check">Quality Check</SelectItem>
                      <SelectItem value="packaging">Packaging</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="distribution">Distribution</SelectItem>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="store">Store</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submitter">Submitter Name</Label>
                  <Input 
                    id="submitter" 
                    placeholder="e.g., John Smith" 
                    value={formData.submitter}
                    onChange={(e) => handleInputChange('submitter', e.target.value)}
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Event Metadata</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input 
                    id="temperature" 
                    type="number" 
                    step="0.1"
                    placeholder="e.g., 4.5" 
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timestamp">Timestamp</Label>
                  <Input 
                    id="timestamp" 
                    type="datetime-local" 
                    value={formData.timestamp}
                    onChange={(e) => handleInputChange('timestamp', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Enter any additional information about this event..." 
                  rows={3} 
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Evidence Upload
              </h2>

              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Upload photos, documents, or QR codes</p>
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileUpload"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('fileUpload')?.click()}
                  className="cursor-pointer"
                >
                  Choose Files
                </Button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files:</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {file.name}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-1 text-xs hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* GPS Location */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </h2>

              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGPSCapture}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <MapPin className="h-4 w-4" />
                  Auto-detect GPS
                </Button>

                {gpsLocation && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
                  </Badge>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 40.7128"
                    value={gpsLocation?.lat || ""}
                    onChange={(e) =>
                      setGpsLocation((prev) => (prev ? { ...prev, lat: Number.parseFloat(e.target.value) } : { lat: Number.parseFloat(e.target.value), lng: 0 }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., -74.0060"
                    value={gpsLocation?.lng || ""}
                    onChange={(e) =>
                      setGpsLocation((prev) => (prev ? { ...prev, lng: Number.parseFloat(e.target.value) } : { lat: 0, lng: Number.parseFloat(e.target.value) }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will create a blockchain transaction and upload files to IPFS. Make sure all information is
                  correct.
                </AlertDescription>
              </Alert>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !formData.productId || !formData.stage}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting to Blockchain...
                  </>
                ) : (
                  "Submit Event"
                )}
              </Button>
            </div>
          </form>
        </Card3D>
      </div>
    </div>
  )
}

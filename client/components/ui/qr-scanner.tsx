"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Camera, X, AlertTriangle } from "lucide-react"

interface QRScannerProps {
  onScan: (result: string) => void
  trigger?: React.ReactNode
}

export function QRScanner({ onScan, trigger }: QRScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [jsQR, setJsQR] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Dynamically import jsQR when component mounts
  useEffect(() => {
    const loadJsQR = async () => {
      try {
        const jsQRModule = await import('jsqr')
        setJsQR(jsQRModule.default)
      } catch (err) {
        console.error('Failed to load jsQR:', err)
        setError('QR scanner library failed to load')
      }
    }
    loadJsQR()
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      setIsScanning(true)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        
        // Start scanning for QR codes
        scanIntervalRef.current = setInterval(scanQRCode, 500)
      }
    } catch (err: any) {
      console.error("Camera access error:", err)
      let errorMessage = "Unable to access camera."
      
      if (err.name === 'NotAllowedError') {
        errorMessage = "Camera permission denied. Please allow camera access and try again."
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No camera found on this device."
      } else if (err.name === 'NotSupportedError') {
        errorMessage = "Camera not supported in this browser."
      }
      
      setError(errorMessage)
      setIsScanning(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    
    setIsScanning(false)
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !jsQR) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    
    try {
      const qrResult = detectQRCode(imageData)
      if (qrResult) {
        onScan(qrResult)
        handleClose()
      }
    } catch (err) {
      console.error("QR scan error:", err)
    }
  }

  // Real QR code detection using jsQR library
  const detectQRCode = (imageData: ImageData): string | null => {
    if (!jsQR) return null
    
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    })
    return code ? code.data : null
  }

  const handleClose = () => {
    stopCamera()
    setIsOpen(false)
    setError(null)
  }

  useEffect(() => {
    if (isOpen && jsQR) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen, jsQR])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Scan QR
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Scan QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {!jsQR && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Loading QR scanner...</AlertDescription>
            </Alert>
          )}

          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {/* Scanning overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Position the QR code within the frame to scan
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={startCamera}
              disabled={isScanning || !jsQR}
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isScanning ? "Scanning..." : "Start Camera"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export interface EventData {
  productId: string;
  stage: string;
  actorId: string;
  actorType?: string;
  temperature?: number;
  notes?: string;
  location?: {
    lat: number;
    lng: number;
  };
  evidenceHashes?: string[];
  timestamp?: number;
}

export interface AIVerificationResult {
  eventId: string;
  verificationData: {
    imageClassification: {
      labels: string[];
      confidence: number;
      isValid: boolean;
    };
    ocrResults: {
      extractedText: string;
      lotNumbers: string[];
      isValid: boolean;
    };
    gpsValidation: {
      coordinates: {
        latitude: number;
        longitude: number;
      };
      isValid: boolean;
    };
    anomalyDetection: {
      hasAnomalies: boolean;
      anomalies: string[];
      score: number;
    };
    overallScore: number;
    isVerified: boolean;
  };
  ipfsHash: string;
}

export interface ProductData {
  productId: string;
  name: string;
  description?: string;
}

export interface DatabaseEvent extends EventData {
  _id: string;
  ipfsHash: string;
  txHash: string;
  verified: boolean;
  verifiedAt?: Date;
  verificationData?: any;
  createdAt: Date;
  updatedAt: Date;
}
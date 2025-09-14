import { Readable } from 'stream';

// Convert buffer to stream
export const bufferToStream = (buffer: Buffer): Readable => {
  return Readable.from(buffer);
};

// Generate unique product ID
export const generateProductId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `prod_${timestamp}_${randomStr}`;
};

// Validate GPS coordinates
export const isValidGPS = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Calculate verification score
export const calculateScore = (verificationData: any): number => {
  let score = 0;
  if (verificationData.imageClassification?.isValid) score += 25;
  if (verificationData.ocrResults?.isValid) score += 25;
  if (verificationData.gpsValidation?.isValid) score += 25;
  if (!verificationData.anomalyDetection?.hasAnomalies) score += 25;
  return score;
};
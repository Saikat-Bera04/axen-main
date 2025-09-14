import { Request } from 'express';

// Validate event submission
export const validateEventData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.productId || typeof data.productId !== 'string') {
    errors.push('Valid productId is required');
  }
  
  if (!data.stage || !['farm', 'warehouse', 'store', 'customer'].includes(data.stage)) {
    errors.push('Valid stage is required (farm, warehouse, store, customer)');
  }
  
  if (!data.actorId || typeof data.actorId !== 'string') {
    errors.push('Valid actorId is required');
  }
  
  if (!data.actorType || !['farm', 'warehouse', 'store', 'customer'].includes(data.actorType)) {
    errors.push('Valid actorType is required (farm, warehouse, store, customer)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate product data
export const validateProductData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Valid product name is required');
  }
  
  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate AI verification result
export const validateAIVerification = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.eventId || typeof data.eventId !== 'string') {
    errors.push('Valid eventId is required');
  }
  
  if (!data.verificationData || typeof data.verificationData !== 'object') {
    errors.push('Valid verificationData is required');
  }
  
  if (!data.ipfsHash || typeof data.ipfsHash !== 'string') {
    errors.push('Valid ipfsHash is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
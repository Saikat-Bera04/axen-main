const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Add debugging for API calls
const DEBUG_API = process.env.NODE_ENV === 'development';

export interface Product {
  _id: string;
  productId: string;
  batchId: string;
  currentStage: 'manufacturing' | 'farm' | 'processing' | 'warehouse' | 'distribution' | 'store' | 'customer' | 'quality_check' | 'packaging' | 'shipping';
  lastUpdated: string;
  verificationStatus: 'verified' | 'failed' | 'pending';
  eventsCount: number;
  submitter: string;
  metadata?: any;
}

export interface Event {
  _id: string;
  productId: string;
  stage: 'manufacturing' | 'farm' | 'processing' | 'warehouse' | 'distribution' | 'store' | 'customer' | 'quality_check' | 'packaging' | 'shipping';
  submitter: string;
  timestamp: string;
  metadata: {
    temperature?: number;
    notes?: string;
    location?: { lat: number; lng: number };
  };
  ipfsHash: string;
  aiVerified: 'verified' | 'failed' | 'pending';
  transactionHash: string;
}

export interface VerificationResult {
  _id: string;
  eventId: string;
  status: 'verified' | 'failed' | 'pending';
  aiAnalysis: string;
  timestamp: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'include',
      ...options,
    };

    if (DEBUG_API) {
      console.log(`🔗 API Request: ${options.method || 'GET'} ${url}`);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      if (DEBUG_API) {
        console.log(`✅ API Response: ${endpoint}`, data);
      }
      
      return data;
    } catch (error) {
      console.error(`❌ API request failed: ${endpoint}`, error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Network error: Cannot connect to backend at ${API_BASE_URL}. Make sure the backend server is running on port 3001.`);
      }
      
      throw error;
    }
  }

  // Product endpoints
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/api/products');
  }

  async getProduct(productId: string): Promise<Product> {
    return this.request<Product>(`/api/products/${productId}`);
  }

  async createProduct(productData: {
    productId: string;
    batchId: string;
    stage: string;
    metadata?: any;
  }): Promise<Product> {
    return this.request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Event endpoints
  async submitEvent(eventData: FormData): Promise<Event> {
    return this.request<Event>('/api/events', {
      method: 'POST',
      body: eventData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  async getProductEvents(productId: string): Promise<Event[]> {
    return this.request<Event[]>(`/api/events/product/${productId}`);
  }

  // Verification endpoints
  async getVerificationStatus(eventId: string): Promise<VerificationResult> {
    return this.request<VerificationResult>(`/api/verification/event/${eventId}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/health');
  }
}

export const apiService = new ApiService();

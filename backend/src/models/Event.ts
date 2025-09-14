import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  productId: string;
  stage: string;
  submitter: string;
  timestamp: Date;
  metadata: {
    temperature?: number;
    notes?: string;
    location?: {
      lat: number;
      lng: number;
    };
  };
  ipfsHash: string;
  aiVerified: 'verified' | 'failed' | 'pending';
  transactionHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  productId: {
    type: String,
    required: true,
    index: true
  },
  stage: {
    type: String,
    required: true,
    enum: ['manufacturing', 'farm', 'processing', 'warehouse', 'distribution', 'store', 'customer', 'quality_check', 'packaging', 'shipping']
  },
  submitter: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    temperature: {
      type: Number
    },
    notes: {
      type: String
    },
    location: {
      lat: {
        type: Number
      },
      lng: {
        type: Number
      }
    }
  },
  ipfsHash: {
    type: String,
    required: true
  },
  aiVerified: {
    type: String,
    enum: ['verified', 'failed', 'pending'],
    default: 'pending'
  },
  transactionHash: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
EventSchema.index({ productId: 1, timestamp: 1 });

export const EventModel = mongoose.model<IEvent>('Event', EventSchema);
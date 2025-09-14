import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  productId: string;
  batchId: string;
  currentStage: 'manufacturing' | 'farm' | 'processing' | 'warehouse' | 'distribution' | 'store' | 'customer' | 'quality_check' | 'packaging' | 'shipping';
  lastUpdated: Date;
  verificationStatus: 'verified' | 'failed' | 'pending';
  eventsCount: number;
  submitter: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  batchId: {
    type: String,
    required: true
  },
  currentStage: {
    type: String,
    enum: ['manufacturing', 'farm', 'processing', 'warehouse', 'distribution', 'store', 'customer', 'quality_check', 'packaging', 'shipping'],
    default: 'farm'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  verificationStatus: {
    type: String,
    enum: ['verified', 'failed', 'pending'],
    default: 'pending'
  },
  eventsCount: {
    type: Number,
    default: 0
  },
  submitter: {
    type: String,
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
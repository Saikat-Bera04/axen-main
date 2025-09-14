import mongoose, { Document, Schema } from 'mongoose';

export interface IVerificationResult extends Document {
  eventId: string;
  status: 'verified' | 'failed' | 'pending';
  aiAnalysis: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationResultSchema: Schema = new Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['verified', 'failed', 'pending'],
    default: 'pending'
  },
  aiAnalysis: {
    type: String,
    default: 'AI verification in progress'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IVerificationResult>('VerificationResult', VerificationResultSchema);
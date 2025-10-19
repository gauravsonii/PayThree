import mongoose, { Schema, Document } from "mongoose";

export interface ITreasuryTransaction extends Document {
  type: 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  description: string;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
  userId?: string;
  walletAddress?: string;
}

const TreasuryTransactionSchema = new Schema<ITreasuryTransaction>({
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdrawal'],
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
  },
  description: {
    type: String,
    required: true,
  },
  txHash: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  userId: {
    type: String,
    required: false,
  },
  walletAddress: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.TreasuryTransaction || mongoose.model<ITreasuryTransaction>('TreasuryTransaction', TreasuryTransactionSchema); 
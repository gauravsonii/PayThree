import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPayoutBatch extends Document {
  txHash: string;
  totalAmount: number;
  createdAt: Date;
}

const PayoutBatchSchema = new Schema<IPayoutBatch>({
  txHash: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.PayoutBatch ||
  mongoose.model<IPayoutBatch>("PayoutBatch", PayoutBatchSchema);

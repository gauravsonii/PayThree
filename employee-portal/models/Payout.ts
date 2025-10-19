import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPayout extends Document {
  batchId: Types.ObjectId;
  employeeId: Types.ObjectId;
  amountUSD: number;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

const PayoutSchema = new Schema<IPayout>({
  batchId: { type: Schema.Types.ObjectId, ref: "PayoutBatch", required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  amountUSD: { type: Number, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payout ||
  mongoose.model<IPayout>("Payout", PayoutSchema);

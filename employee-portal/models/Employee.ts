import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  email: string;
  walletAddress: string;
  salaryUSD: number;
  designation?: string;
  createdAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true },
  salaryUSD: { type: Number, required: true },
  designation: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);

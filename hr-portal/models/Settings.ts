import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  organizationName: string;
  tokenAddress: string;
  network: string;
  autoPayouts: boolean;
  notifications: boolean;
  databaseUrl: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>({
  organizationName: { type: String, required: true, default: 'Acme Corp' },
  tokenAddress: { type: String, required: true, default: 'usdt' },
  network: { type: String, required: true, default: 'somnia' },
  autoPayouts: { type: Boolean, default: true },
  notifications: { type: Boolean, default: true },
  databaseUrl: { type: String, default: 'https://api.example.com' },
  apiKey: { type: String, default: 'sk-1234567890abcdef' },
}, {
  timestamps: true
});

// Ensure only one settings document exists
SettingsSchema.index({}, { unique: true });

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema); 
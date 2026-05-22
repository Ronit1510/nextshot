import { Schema, model, models } from 'mongoose';

export interface ISettings {
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrl?: string;
  heroImageUrl?: string;
  globalPromoText?: string;
  taxRate: number;
  freeShippingThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>({
  heroTitle: { type: String, default: "NextShot" },
  heroSubtitle: { type: String, default: "Rare Spirits. Unrivaled Speed. The Luxury Liquor Cabinet, Delivered." },
  heroVideoUrl: { type: String },
  heroImageUrl: { type: String },
  globalPromoText: { type: String },
  taxRate: { type: Number, default: 0.08 }, // 8% Default state tax
  freeShippingThreshold: { type: Number, default: 150 } // Free shipping for orders > $150
}, {
  timestamps: true
});

export default models.Settings || model<ISettings>('Settings', SettingsSchema);

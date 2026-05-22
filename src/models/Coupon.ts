import { Schema, model, models } from 'mongoose';

export interface ICoupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountAmount: number;
  minPurchase: number;
  maxDiscount?: number;
  expiresAt: Date;
  active: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
  discountAmount: { type: Number, required: true },
  minPurchase: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  expiresAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default models.Coupon || model<ICoupon>('Coupon', CouponSchema);

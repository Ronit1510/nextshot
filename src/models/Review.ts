import { Schema, model, models, Types } from 'mongoose';

export interface IReview {
  product: Types.ObjectId;
  user: Types.ObjectId;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  comment: { type: String, required: true },
  approved: { type: Boolean, default: false } // Moderated by Admin Panel
}, {
  timestamps: true
});

export default models.Review || model<IReview>('Review', ReviewSchema);

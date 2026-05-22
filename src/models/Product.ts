import { Schema, model, models, Types } from 'mongoose';

export interface IProduct {
  title: string;
  slug: string;
  description: string;
  story?: string;
  price: number;
  costPrice: number;
  sku: string;
  stock: number;
  category: Types.ObjectId;
  images: string[];
  abv: number;
  origin: string;
  size: string;
  ratings: {
    average: number;
    count: number;
  };
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  story: { type: String },
  price: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String, required: true }],
  abv: { type: Number, required: true },
  origin: { type: String, required: true },
  size: { type: String, required: true },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  metaTitle: { type: String },
  metaDescription: { type: String }
}, {
  timestamps: true
});

export default models.Product || model<IProduct>('Product', ProductSchema);

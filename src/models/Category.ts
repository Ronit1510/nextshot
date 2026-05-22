import { Schema, model, models } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  image: { type: String },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default models.Category || model<ICategory>('Category', CategorySchema);

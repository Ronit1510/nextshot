import { Schema, model, models } from 'mongoose';

export interface IUserAddress {
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface IUser {
  clerkId: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  loyaltyPoints: number;
  referralCode: string;
  referredBy?: string;
  addresses: IUserAddress[];
  ageVerified: boolean;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IUserAddress>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  street: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'USA' },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  loyaltyPoints: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, required: true },
  referredBy: { type: String },
  addresses: [AddressSchema],
  ageVerified: { type: Boolean, default: false },
  birthDate: { type: Date }
}, {
  timestamps: true
});

export default models.User || model<IUser>('User', UserSchema);

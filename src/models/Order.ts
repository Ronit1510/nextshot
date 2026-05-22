import { Schema, model, models, Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  title: string;
  image: string;
}

export interface IOrderAddress {
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IOrder {
  user?: Types.ObjectId;
  guestEmail?: string;
  items: IOrderItem[];
  shippingAddress: IOrderAddress;
  billingAddress: IOrderAddress;
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  couponUsed?: Types.ObjectId;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  carrier?: string;
  loyaltyPointsEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true }
});

const OrderAddressSchema = new Schema<IOrderAddress>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  street: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'USA' },
  phone: { type: String, required: true }
});

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  guestEmail: { type: String },
  items: [OrderItemSchema],
  shippingAddress: { type: OrderAddressSchema, required: true },
  billingAddress: { type: OrderAddressSchema, required: true },
  pricing: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  couponUsed: { type: Schema.Types.ObjectId, ref: 'Coupon' },
  stripeSessionId: { type: String, required: true, unique: true },
  stripePaymentIntentId: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  trackingNumber: { type: String },
  carrier: { type: String },
  loyaltyPointsEarned: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default models.Order || model<IOrder>('Order', OrderSchema);

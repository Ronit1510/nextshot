export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  story?: string;
  price: number;
  costPrice: number;
  sku: string;
  stock: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  } | string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
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

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  loyaltyPoints: number;
  referralCode: string;
  referredBy?: string;
  addresses: Address[];
  ageVerified: boolean;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string | Product;
  quantity: number;
  price: number;
  title: string;
  image: string;
}

export interface Order {
  _id: string;
  user?: string | User;
  guestEmail?: string;
  items: OrderItem[];
  shippingAddress: Omit<Address, 'isDefault'>;
  billingAddress: Omit<Address, 'isDefault'>;
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  couponUsed?: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  carrier?: string;
  loyaltyPointsEarned: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  product: string;
  user: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountAmount: number;
  minPurchase: number;
  maxDiscount?: number;
  expiresAt: string;
  active: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  _id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrl?: string;
  heroImageUrl?: string;
  globalPromoText?: string;
  taxRate: number;
  freeShippingThreshold: number;
  createdAt: string;
  updatedAt: string;
}

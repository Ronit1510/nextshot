import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Product id
  title: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  abv: number;
  size: string;
}

export interface AppliedCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountAmount: number;
  minPurchase: number;
  maxDiscount?: number;
}

interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  taxRate: number;
  shippingCost: number;
  freeShippingThreshold: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (coupon: AppliedCoupon | null) => void;
  clearCart: () => void;
  
  // Selectors/Computed values
  getTotals: () => {
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      taxRate: 0.08, // 8% Tax
      shippingCost: 15, // $15 standard shipping
      freeShippingThreshold: 150, // Free shipping above $150
      
      addItem: (item, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        
        if (existingItem) {
          const newQty = Math.min(existingItem.quantity + quantity, item.stock);
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...item, quantity: Math.min(quantity, item.stock) }],
          });
        }
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
        });
      },
      
      updateQuantity: (id, quantity) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        
        const newQty = Math.max(1, Math.min(quantity, item.stock));
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: newQty } : i
          ),
        });
      },
      
      applyCoupon: (coupon) => {
        set({ coupon });
      },
      
      clearCart: () => {
        set({ items: [], coupon: null });
      },
      
      getTotals: () => {
        const { items, coupon, taxRate, shippingCost, freeShippingThreshold } = get();
        
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        
        let discount = 0;
        if (coupon && subtotal >= coupon.minPurchase) {
          if (coupon.discountType === 'percentage') {
            discount = (subtotal * coupon.discountAmount) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.discountAmount;
          }
        }
        
        const taxableAmount = Math.max(0, subtotal - discount);
        const tax = Math.round(taxableAmount * taxRate * 100) / 100;
        
        const shipping = subtotal > 0 && subtotal >= freeShippingThreshold ? 0 : (subtotal > 0 ? shippingCost : 0);
        const total = Math.round((taxableAmount + tax + shipping) * 100) / 100;
        
        return {
          subtotal,
          discount: Math.round(discount * 100) / 100,
          tax,
          shipping,
          total,
        };
      },
    }),
    {
      name: 'nextshot-cart', // Persist cart in local storage
    }
  )
);

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight,
  ShieldCheck,
  Percent,
  Undo2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { items, coupon, updateQuantity, removeItem, applyCoupon, getTotals } = useCartStore();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const { subtotal, discount, tax, shipping, total } = getTotals();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponCodeInput) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setCheckingCoupon(true);

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCodeInput, purchaseAmount: subtotal })
      });

      const data = await res.json();

      if (!res.ok) {
        setCouponError(data.message || 'Invalid coupon code.');
      } else {
        applyCoupon(data.coupon);
        setCouponSuccess(`Coupon ${data.coupon.code.toUpperCase()} successfully applied!`);
        setCouponCodeInput('');
      }
    } catch (err) {
      setCouponError('Error validating coupon. Please try again.');
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    applyCoupon(null);
    setCouponSuccess('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-16 text-center lg:text-left">
        <span className="text-[9px] uppercase tracking-[0.35em] text-primary font-bold">
          Your Cabinet
        </span>
        <h1 className="text-3xl md:text-5xl text-editorial tracking-wide text-foreground">
          Shopping Cart
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-24 border border-dashed border-border/80 luxury-glass space-y-6 max-w-2xl mx-auto"
          >
            <ShoppingBag className="h-10 w-10 text-muted-foreground/30 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm uppercase tracking-widest text-foreground font-semibold">Your Cart is Empty</h3>
              <p className="text-[11px] text-muted-foreground/60">No premium bottles have been allocated to your cabinet yet.</p>
            </div>
            <Link 
              href="/shop"
              className="inline-block bg-primary text-background py-3.5 px-8 text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-accent duration-300 cursor-pointer shadow-md"
            >
              Browse Cellar Portfolio
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Cart Items Column */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  exit={{ opacity: 0, x: -50 }}
                  className="luxury-glass p-6 flex items-center gap-6 relative overflow-hidden group"
                >
                  {/* Visual Bottle */}
                  <div className="h-24 w-20 shrink-0 bg-muted/10 p-2 flex items-center justify-center border border-border/60">
                    <img src={item.image} alt={item.title} className="h-full object-contain filter brightness-[0.88] group-hover:brightness-100 duration-300" />
                  </div>

                  {/* Info details */}
                  <div className="flex-grow space-y-1">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                      {item.size} &bull; {item.abv}% ABV
                    </div>
                    <Link href={`/product/${item.slug}`} className="hover:text-primary duration-300 text-[12px] sm:text-sm uppercase tracking-wide font-medium text-foreground">
                      {item.title}
                    </Link>
                    <div className="text-xs text-primary font-semibold font-mono mt-1">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-border/80 bg-muted/40">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:text-primary duration-300 cursor-pointer text-muted-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-foreground select-none font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-2 hover:text-primary duration-300 cursor-pointer text-muted-foreground disabled:opacity-30"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Trash Button */}
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        alert(`Removed ${item.title} from cart.`);
                      }}
                      className="text-muted-foreground/60 hover:text-red-400 p-2 duration-300 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 stroke-[1.25]" />
                    </button>
                  </div>
                </motion.div>
              ))}

              <Link 
                href="/shop"
                className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-primary hover:text-accent duration-300 font-semibold mt-4"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Add More Expressions
              </Link>
            </div>

            {/* Checkout Pricing Column */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Promo validation box */}
              <div className="luxury-glass p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  Promo Codes
                </h3>

                <AnimatePresence mode="wait">
                  {coupon ? (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="bg-primary/5 border border-primary/20 p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary font-semibold">
                        <Percent className="h-3.5 w-3.5" />
                        {coupon.code} Applied (-${discount})
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-[9px] uppercase tracking-widest text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        Remove
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      onSubmit={handleApplyCoupon}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder="ENTER COUPON (e.g. LUXURY20)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-grow bg-muted border border-border text-[10px] py-3 px-3 uppercase tracking-wider text-foreground placeholder:text-muted-foreground/30 rounded-none focus:border-primary"
                      />
                      <button
                        type="submit"
                        disabled={checkingCoupon}
                        className="bg-secondary hover:bg-primary border border-primary/10 hover:border-primary hover:text-background text-foreground text-[9px] uppercase tracking-wider font-semibold py-3 px-4 rounded-none duration-300 cursor-pointer disabled:opacity-50"
                      >
                        {checkingCoupon ? 'Checking...' : 'Apply'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {couponError && (
                  <div className="text-[9px] uppercase tracking-widest text-red-500 bg-red-950/20 border border-red-500/10 p-2.5">
                    {couponError}
                  </div>
                )}
                {couponSuccess && (
                  <div className="text-[9px] uppercase tracking-widest text-green-400 bg-green-950/20 border border-green-500/10 p-2.5">
                    {couponSuccess}
                  </div>
                )}
              </div>

              {/* Order total balance display */}
              <div className="luxury-glass p-6 space-y-6">
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground border-b border-border/60 pb-3">
                  Summary
                </h3>

                <div className="space-y-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-foreground font-semibold font-mono">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-primary font-semibold">
                      <span>Discount</span>
                      <span className="font-mono">-${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>State Tax (8%)</span>
                    <span className="text-foreground font-semibold font-mono">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Concierge Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-primary font-semibold">FREE</span>
                    ) : (
                      <span className="text-foreground font-semibold font-mono">${shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end border-b border-border/40 pb-5">
                  <span className="text-xs uppercase tracking-[0.25em] font-semibold text-foreground">Total Acquisition</span>
                  <span className="text-xl font-bold tracking-wider text-primary font-sans">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="space-y-4">
                  <Link 
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-accent to-primary text-background py-4 text-[10px] uppercase tracking-[0.35em] font-bold duration-300 shadow-xl hover:opacity-90"
                  >
                    Acquisition Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 leading-none">
                    <ShieldCheck className="h-4 w-4 text-primary/70" />
                    SSL Secure Payments Managed by Stripe
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { useUserStore } from '@/lib/store/user-store';
import { useUser } from '@clerk/nextjs';
import { ShieldCheck, ArrowRight, CreditCard, Loader2, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Checkout() {
  const { user } = useUser();
  const { items, coupon, getTotals } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Address State
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    country: 'USA'
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    country: 'USA'
  });

  useEffect(() => {
    setMounted(true);
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phoneNumbers?.[0]?.phoneNumber || ''
      }));
    }
  }, [user]);

  if (!mounted) return null;

  const { subtotal, discount, tax, shipping, total } = getTotals();

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setLoading(true);

    const billAddr = billingSameAsShipping ? shippingAddress : billingAddress;

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity, title: i.title })),
          couponCode: coupon?.code,
          userEmail: user?.primaryEmailAddress?.emailAddress || 'collector@example.com',
          userId: user?.id,
          shippingAddress,
          billingAddress: billAddr
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Checkout failed.');
      } else if (data.url) {
        // Redirect to Stripe checkout page (or mock success receipt)
        window.location.href = data.url;
      }
    } catch (err) {
      alert('Error initiating checkout. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-16 text-center lg:text-left">
        <span className="text-[9px] uppercase tracking-[0.35em] text-primary font-bold">
          Acquisition Vault
        </span>
        <h1 className="text-3xl md:text-5xl text-editorial tracking-wide text-foreground">
          Premium Checkout
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border luxury-glass max-w-xl mx-auto space-y-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Cart items missing</p>
          <Link href="/shop" className="inline-block bg-primary text-background py-3 px-6 text-[9px] font-semibold uppercase tracking-widest">
            Enter Vault
          </Link>
        </div>
      ) : (
        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Addresses Forms Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Shipping Address */}
            <div className="luxury-glass p-6 md:p-8 space-y-6">
              <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                <CreditCard className="h-4.5 w-4.5 text-primary" />
                Shipping Allocation Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingAddress.firstName}
                    onChange={handleShippingChange}
                    className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingAddress.lastName}
                    onChange={handleShippingChange}
                    className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Street Address</label>
                <input
                  type="text"
                  name="street"
                  placeholder="e.g. 500 Madison Avenue"
                  value={shippingAddress.street}
                  onChange={handleShippingChange}
                  className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none placeholder:text-muted-foreground/20"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Apartment, Suite (Optional)</label>
                  <input
                    type="text"
                    name="apartment"
                    value={shippingAddress.apartment}
                    onChange={handleShippingChange}
                    className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleShippingChange}
                    className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="e.g. NY"
                    value={shippingAddress.state}
                    onChange={handleShippingChange}
                    className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleShippingChange}
                    className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Contact Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleShippingChange}
                    className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Billing Address Options */}
            <div className="luxury-glass p-6 md:p-8 space-y-6">
              <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-foreground border-b border-border/60 pb-3">
                Billing Address
              </h2>
              
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={billingSameAsShipping}
                  onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  className="h-4 w-4 rounded-none border border-border bg-muted accent-primary cursor-pointer"
                />
                <span className="text-[11px] uppercase tracking-wider text-foreground font-semibold">
                  Billing Address Same As Shipping Address
                </span>
              </label>

              {!billingSameAsShipping && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6 pt-4 border-t border-border/40 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={billingAddress.firstName}
                        onChange={handleBillingChange}
                        className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={billingAddress.lastName}
                        onChange={handleBillingChange}
                        className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={billingAddress.street}
                      onChange={handleBillingChange}
                      className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Apartment (Optional)</label>
                      <input
                        type="text"
                        name="apartment"
                        value={billingAddress.apartment}
                        onChange={handleBillingChange}
                        className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={billingAddress.city}
                        onChange={handleBillingChange}
                        className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={billingAddress.state}
                        onChange={handleBillingChange}
                        className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={billingAddress.postalCode}
                        onChange={handleBillingChange}
                        className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={billingAddress.phone}
                        onChange={handleBillingChange}
                        className="w-full bg-muted border border-border text-[11px] py-3 px-4 text-foreground rounded-none"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

          {/* Cart Pricing Details Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="luxury-glass p-6 space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground border-b border-border/60 pb-3">
                Acquisition Summary
              </h3>

              {/* Minimized cart items */}
              <div className="space-y-4 max-h-48 overflow-y-auto pr-1 border-b border-border/40 pb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-mono font-semibold">x{item.quantity}</span>
                      <span className="text-[11px] text-foreground font-medium uppercase line-clamp-1">{item.title}</span>
                    </div>
                    <span className="text-[11px] text-primary font-semibold font-mono">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-foreground font-semibold font-mono">${subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-primary font-semibold">
                    <span>Discount Applied</span>
                    <span className="font-mono">-${discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>State Tax (8%)</span>
                  <span className="text-foreground font-semibold font-mono">${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Concierge Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-primary font-semibold">FREE</span>
                  ) : (
                    <span className="text-foreground font-semibold font-mono">${shipping.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground">Total Acquisition</span>
                <span className="text-lg font-bold tracking-wider text-primary font-sans">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-accent to-primary text-background py-4 text-[10px] uppercase tracking-[0.35em] font-bold duration-300 shadow-xl cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Redirecting to Vault Checkout...
                  </>
                ) : (
                  <>
                    Acquire & Secure Portfolio
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[8.5px] uppercase tracking-[0.2em] text-muted-foreground/60 text-center leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                Payments verified and securely handled via Stripe
              </div>
            </div>
          </div>

        </form>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart-store';
import { CheckCircle2, ShoppingBag, ArrowRight, Gift, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import LuxuryStamp from '@/components/branding/luxury-stamp';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const clearCart = useCartStore((state) => state.clearCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Clear shopping cart on checkout success
    clearCart();
  }, [clearCart]);

  if (!mounted) return null;

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-20 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04)_0%,rgba(11,11,12,1)_80%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-xl w-full luxury-glass p-8 md:p-12 text-center flex flex-col items-center shadow-2xl border-primary/10 overflow-hidden"
      >
        {/* Top subtle golden light leak */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Dynamic visual seal stamp */}
        <LuxuryStamp className="mb-6" size={120} />

        <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 animate-pulse-slow">
          <CheckCircle2 className="h-6 w-6 stroke-[1.5]" />
        </div>

        <h1 className="text-2xl md:text-3xl text-editorial tracking-wide text-foreground mb-4">
          Acquisition Secured
        </h1>
        
        <p className="text-[12px] uppercase tracking-[0.25em] text-muted-foreground max-w-xs mx-auto mb-8 leading-relaxed">
          Your luxury portfolio has been verified and allocated for dispatch.
        </p>

        {/* Transaction Summary Panel */}
        <div className="w-full bg-muted/40 border border-border/60 p-5 mb-8 text-left space-y-4 text-[11px] uppercase tracking-wider text-muted-foreground">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <span>Portfolio Allocation ID</span>
            <span className="text-foreground font-semibold font-mono select-all">
              {sessionId ? sessionId.substring(0, 16) : 'NX-ALLOC-2026-X'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4.5 w-4.5 text-primary shrink-0" />
            <div className="space-y-0.5">
              <span className="text-foreground font-semibold block">Estimated Dispatch</span>
              <span className="text-[9.5px]">Next Business Day (10:00 AM Signature Delivery)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-4.5 w-4.5 text-primary shrink-0" />
            <div className="space-y-0.5">
              <span className="text-foreground font-semibold block">Fulfillment Notification</span>
              <span className="text-[9.5px]">A tracking receipt has been sent to your registered email.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Gift className="h-4.5 w-4.5 text-primary shrink-0" />
            <div className="space-y-0.5">
              <span className="text-foreground font-semibold block">Connoisseur Points Earned</span>
              <span className="text-[9.5px] text-primary font-bold">5% Allocation Loyalty Balance Credited</span>
            </div>
          </div>
        </div>

        {/* Navigation triggers */}
        <div className="w-full space-y-4">
          <Link
            href="/dashboard/orders"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-accent to-primary text-background py-4 text-[10px] uppercase tracking-[0.3em] font-bold duration-300 shadow-lg cursor-pointer"
          >
            Track Allocation Status
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/shop"
            className="w-full flex items-center justify-center border border-border/80 hover:border-primary bg-background/20 text-foreground py-4 text-[10px] uppercase tracking-[0.3em] font-semibold duration-300 cursor-pointer"
          >
            Return to spirits catalog
          </Link>
        </div>

        <div className="mt-8 text-[8.5px] uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed max-w-xs">
          Thank you for choosing NextShot. For corporate custom gifting, concierge requests, or cellar cataloging, please email concierge@nextshot.com.
        </div>

      </motion.div>
    </div>
  );
}

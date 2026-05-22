'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserStore } from '@/lib/store/user-store';
import { 
  Award, 
  Share2, 
  MapPin, 
  Heart, 
  History, 
  Settings as SettingsIcon,
  Copy,
  CheckCircle,
  Loader2,
  Calendar,
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function UserDashboard() {
  const { user } = useUser();
  const { loyaltyPoints, setLoyaltyPoints } = useUserStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Sync mock loyalty points for verified user
    if (loyaltyPoints === 0) {
      setLoyaltyPoints(350); // Seed 350 connoisseur points!
    }

    async function fetchUserOrders() {
      try {
        const res = await fetch(`/api/user/dashboard?email=${user?.primaryEmailAddress?.emailAddress || ''}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchUserOrders();
    } else {
      // Simulate slow loading in case session is being resolved
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [user, loyaltyPoints, setLoyaltyPoints]);

  const handleCopyReferral = () => {
    const refCode = user?.id ? user.id.substring(6, 14).toUpperCase() : 'NEXTSHOT-VIP';
    const referralLink = `${window.location.origin}/signup?ref=${refCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const vipTier = loyaltyPoints >= 1000 ? 'Imperial Collector' : (loyaltyPoints >= 500 ? 'Reserve Member' : 'Connoisseur');
  const refCode = user?.id ? user.id.substring(6, 14).toUpperCase() : 'NEXTSHOT-VIP';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-border/60">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-[9px] uppercase tracking-[0.35em] text-primary font-bold">
            Private Cellar
          </span>
          <h1 className="text-2xl md:text-3xl text-editorial tracking-wide text-foreground">
            Connoisseur Dashboard
          </h1>
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono">
            Welcome back, <span className="text-foreground font-semibold">{user?.fullName || 'Collector'}</span>
          </p>
        </div>

        {/* VIP Status Badge */}
        <div className="luxury-glass px-5 py-3.5 flex items-center gap-3">
          <Award className="h-6 w-6 text-primary stroke-[1.25] animate-pulse-slow" />
          <div className="text-left">
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground block">Tasting Rank</span>
            <span className="text-[11px] uppercase tracking-widest text-primary font-bold">{vipTier}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Side: Stats and referral system */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Loyalty Points Info */}
          <div className="luxury-glass p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-primary" />
              Allocation Balance
            </h3>
            
            <div className="text-center py-4 space-y-1 bg-muted/40 border border-border/60">
              <span className="text-3xl font-bold tracking-wider font-sans text-primary">{loyaltyPoints}</span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-muted-foreground block">Redeemable Connoisseur Points</span>
            </div>
            
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Earn 5% points on all purchases. Redeem points for guaranteed allocations on highly sought-after rare bourbons, scotch vintages, and collector cases.
            </p>
          </div>

          {/* Referral system */}
          <div className="luxury-glass p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <Share2 className="h-4.5 w-4.5 text-primary" />
              Private Invitations
            </h3>
            
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Invite other connoisseurs to the NextShot portal. When they complete their first acquisition of $150+, both of you will receive 200 loyalty points and a free $50 flat promo credit.
            </p>

            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-muted-foreground">Your Referral Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/signup?ref=${refCode}`}
                  readOnly
                  className="flex-grow bg-muted border border-border text-[9px] py-2.5 px-3 text-muted-foreground font-mono select-all rounded-none"
                />
                <button
                  onClick={handleCopyReferral}
                  className="bg-secondary hover:bg-primary border border-primary/10 hover:border-primary hover:text-background text-foreground py-2 px-3 duration-300 cursor-pointer"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Navigation links */}
          <div className="luxury-glass p-6">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground border-b border-border/60 pb-3 mb-4">
              Cellar Vault Navigation
            </h3>
            <div className="flex flex-col gap-3 text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
              <Link href="/dashboard/orders" className="hover:text-primary duration-300 flex items-center gap-2.5">
                <History className="h-4 w-4 text-primary/70" />
                Acquisition History
              </Link>
              <Link href="/dashboard/wishlist" className="hover:text-primary duration-300 flex items-center gap-2.5">
                <Heart className="h-4 w-4 text-primary/70" />
                Cellar Wishlist
              </Link>
              <Link href="/dashboard/addresses" className="hover:text-primary duration-300 flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary/70" />
                Shipping Addresses
              </Link>
              <Link href="/dashboard/settings" className="hover:text-primary duration-300 flex items-center gap-2.5">
                <SettingsIcon className="h-4 w-4 text-primary/70" />
                Profile Settings
              </Link>
            </div>
          </div>

        </div>

        {/* Right Side: Order history list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="luxury-glass p-6 md:p-8 space-y-6">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-primary" />
              Recent Portfolio Acquisitions
            </h2>

            <AnimatePresence mode="wait">
              {loading ? (
                <div className="text-center py-12 space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Accessing archives...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border/80 bg-muted/10 space-y-4">
                  <PackageCheck className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase tracking-widest text-foreground font-semibold">No Acquisitions Logged</p>
                    <p className="text-[10px] text-muted-foreground/60">You have not completed any portfolio acquisitions yet.</p>
                  </div>
                  <Link href="/shop" className="inline-block bg-primary text-background py-3 px-6 text-[9px] uppercase tracking-widest font-bold hover:bg-accent duration-300 cursor-pointer shadow-md">
                    Acquire spirits
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div 
                      key={ord._id}
                      className="bg-muted/40 border border-border p-5 space-y-4 hover:border-primary/10 duration-300"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-muted-foreground block uppercase font-mono">Allocation ID: {ord.stripeSessionId.substring(0, 14)}</span>
                          <span className="text-[11px] font-semibold text-foreground uppercase flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-primary/70" />
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-green-950/20 border border-green-500/20 text-green-400 font-bold">
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Display items */}
                      <div className="space-y-3">
                        {ord.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] uppercase tracking-wider">
                            <span className="text-muted-foreground font-semibold font-mono">x{item.quantity}</span>
                            <span className="text-foreground font-medium flex-grow pl-3 truncate">{item.title}</span>
                            <span className="text-primary font-bold font-mono">${(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-border/40 pt-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                        <span>Earned: <span className="text-primary font-bold">{ord.loyaltyPointsEarned} Pts</span></span>
                        <span className="text-foreground">Total Acquisition: <span className="text-primary text-xs font-bold font-sans">${ord.pricing.total.toLocaleString()}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

    </div>
  );
}

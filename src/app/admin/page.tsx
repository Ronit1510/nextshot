'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Calendar,
  Loader2,
  Package,
  CheckCircle,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    revenue: 12450.95,
    orders: 34,
    customers: 86,
    avgValue: 366.20
  });
  
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadAdminData() {
      // Simulate dashboard loading details
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setRecentOrders([
        { id: '1', email: 'vanderbilt@example.com', total: 4350.00, items: 'Louis XIII Cognac', status: 'delivered', date: 'May 21' },
        { id: '2', email: 'rockefeller@example.com', total: 3499.99, items: 'Pappy Van Winkle 23Yr', status: 'processing', date: 'May 21' },
        { id: '3', email: 'morgan@example.com', total: 639.99, items: 'Clase Azul + Opus One', status: 'processing', date: 'May 20' },
        { id: '4', email: 'astor@example.com', total: 450.00, items: 'Macallan 18 Year', status: 'shipped', date: 'May 19' },
        { id: '5', email: 'connoisseur@example.com', total: 189.99, items: 'Don Julio 1942', status: 'delivered', date: 'May 18' }
      ]);
      setLoading(false);
    }
    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Accessing executive terminal...</p>
      </div>
    );
  }

  // Monthly Sales Dynamic SVG Line Graph coordinates for the premium chart
  const points = "20,130 80,110 140,120 200,90 260,85 320,60 380,45 440,30 500,10";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-border/60">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-[9px] uppercase tracking-[0.35em] text-primary font-bold">
            Executive Terminal
          </span>
          <h1 className="text-2xl md:text-3xl text-editorial tracking-wide text-foreground">
            NextShot Executive Board
          </h1>
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono">
            Direct Revenue, Inventory Controls & Vault Moderation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[9px] uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary font-bold px-3 py-1.5 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Live Analytics
          </span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Revenue */}
        <div className="luxury-glass p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground block font-semibold">Total Revenue</span>
            <span className="text-2xl font-bold tracking-wider text-primary font-sans">
              ${stats.revenue.toLocaleString()}
            </span>
          </div>
          <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Orders */}
        <div className="luxury-glass p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground block font-semibold">Secured Acquisitions</span>
            <span className="text-2xl font-bold tracking-wider text-foreground font-sans">
              {stats.orders}
            </span>
          </div>
          <div className="h-10 w-10 bg-muted/80 border border-border/80 rounded-full flex items-center justify-center text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>

        {/* Customers */}
        <div className="luxury-glass p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground block font-semibold">Registered Collectors</span>
            <span className="text-2xl font-bold tracking-wider text-foreground font-sans">
              {stats.customers}
            </span>
          </div>
          <div className="h-10 w-10 bg-muted/80 border border-border/80 rounded-full flex items-center justify-center text-primary">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="luxury-glass p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground block font-semibold">Average Ticket Value</span>
            <span className="text-2xl font-bold tracking-wider text-primary font-sans">
              ${stats.avgValue.toLocaleString()}
            </span>
          </div>
          <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Custom SVG Sales Graph */}
        <div className="lg:col-span-2 space-y-6">
          <div className="luxury-glass p-6 md:p-8 space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              Annual Acquisition Yield (USD)
            </h3>

            {/* Premium Gold Custom SVG Graph */}
            <div className="relative h-60 w-full bg-muted/20 border border-border/40 p-4 flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#FFF_1px,transparent_1px),linear-gradient(to_bottom,#FFF_1px,transparent_1px)] bg-[size:2rem_2rem]" />
              
              <svg viewBox="0 0 520 150" className="w-full h-full text-primary shrink-0 select-none">
                {/* Horizontal grid lines */}
                <line x1="0" y1="30" x2="520" y2="30" stroke="#242427" strokeWidth="0.5" strokeDasharray="4,4" />
                <line x1="0" y1="80" x2="520" y2="80" stroke="#242427" strokeWidth="0.5" strokeDasharray="4,4" />
                <line x1="0" y1="130" x2="520" y2="130" stroke="#242427" strokeWidth="0.5" strokeDasharray="4,4" />

                {/* Graph Fill Area */}
                <path
                  d={`M 20, 150 L ${points} L 500, 150 Z`}
                  fill="url(#chartGrad)"
                  opacity="0.1"
                />

                {/* Graph Main Line */}
                <polyline
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                  className="drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
                />

                {/* Plot points */}
                {points.split(' ').map((pt, idx) => {
                  const [x, y] = pt.split(',');
                  return (
                    <circle key={idx} cx={x} cy={y} r="4" fill="#FFF" stroke="#D4AF37" strokeWidth="2" />
                  );
                })}

                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="150" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="20" y1="130" x2="500" y2="10" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F4ECCE" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#E5C158" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Chart X Labels */}
              <div className="flex justify-between text-[8px] uppercase tracking-widest text-muted-foreground font-mono font-semibold pt-2">
                <span>Q1-26</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May (Current)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick actions and list */}
        <div className="lg:col-span-1 space-y-6">
          <div className="luxury-glass p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground border-b border-border/60 pb-3">
              Fulfillment Command
            </h3>
            
            <div className="flex flex-col gap-3 text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              <Link href="/admin/products" className="hover:text-primary duration-300 flex items-center gap-2.5 bg-muted/40 border border-border/60 p-3 w-full">
                <Package className="h-4.5 w-4.5 text-primary" />
                Product CRUD vaults
              </Link>

              <a 
                href="/api/admin/seed" 
                target="_blank"
                className="hover:text-primary duration-300 flex items-center gap-2.5 bg-muted/40 border border-border/60 p-3 w-full"
              >
                <CheckCircle className="h-4.5 w-4.5 text-primary" />
                Re-seed Database
              </a>

              <Link href="/shop" className="hover:text-primary duration-300 flex items-center gap-2.5 bg-muted/40 border border-border/60 p-3 w-full">
                <Tag className="h-4.5 w-4.5 text-primary" />
                View Front Catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity lists */}
      <div className="luxury-glass p-6 md:p-8 mt-10 space-y-6">
        <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground border-b border-border/60 pb-3">
          Recent Portfolio Transits
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <thead>
              <tr className="border-b border-border text-foreground font-semibold">
                <th className="pb-3">Collector handle</th>
                <th className="pb-3">Acquisitions</th>
                <th className="pb-3 text-right">Value</th>
                <th className="pb-3 text-right">Fulfillment status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:text-foreground duration-200">
                  <td className="py-4 select-all">{ord.email}</td>
                  <td className="py-4 text-foreground">{ord.items}</td>
                  <td className="py-4 text-right text-primary font-bold font-mono">${ord.total.toLocaleString()}</td>
                  <td className="py-4 text-right">
                    <span className={`text-[8.5px] font-bold px-2 py-0.5 border ${
                      ord.status === 'delivered' 
                        ? 'border-green-500/20 bg-green-950/20 text-green-400' 
                        : (ord.status === 'shipped' ? 'border-primary/20 bg-primary/10 text-primary' : 'border-amber-500/20 bg-amber-950/20 text-amber-400')
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

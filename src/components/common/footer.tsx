import React from 'react';
import Link from 'next/link';
import Logo from '@/components/branding/logo';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  ArrowRight,
  ShieldAlert,
  Truck,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing to NextShot. Exclusive offers will be sent to your inbox.');
  };

  return (
    <footer className="bg-background border-t border-border/80 relative overflow-hidden z-10 pt-16 pb-8">
      {/* Light glow leaks */}
      <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-primary/3 blur-[120px] pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-accent/3 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-border/60 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-muted/80 flex items-center justify-center border border-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-foreground">
              Express Concierge Delivery
            </h4>
            <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
              Premium secure dispatch across the USA. Free signature shipping on purchases exceeding $150.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-muted/80 flex items-center justify-center border border-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-foreground">
              100% Curated Provenance
            </h4>
            <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
              Every single bottle is sourced directly from certified distilleries and premium wineries.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-muted/80 flex items-center justify-center border border-primary/10">
              <RotateCcw className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-foreground">
              Collector Guarantee
            </h4>
            <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
              Meticulous temperature-controlled warehousing ensures your spirits arrive in flawless condition.
            </p>
          </div>
        </div>

        {/* Editorial Foot Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 py-16">
          {/* Brand block */}
          <div className="lg:col-span-2 space-y-6">
            <Logo className="h-9" showTagline={true} />
            <p className="text-[12px] text-muted-foreground leading-relaxed max-w-md">
              NextShot is America's premier luxury digital spirits purveyor. We blend state-of-the-art logistics with ancient craftsmanship to deliver rare expressions, collector vintages, and high-end essentials directly to your private cabinet.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com" className="text-muted-foreground hover:text-primary duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://facebook.com" className="text-muted-foreground hover:text-primary duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-primary duration-300">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-foreground">
              Our Cellar
            </h4>
            <ul className="space-y-2.5">
              {['Whisky', 'Wine', 'Champagne', 'Tequila', 'Cognac', 'Rare Vintages'].map((item) => (
                <li key={item}>
                  <Link href={`/shop?category=${item.toLowerCase()}`} className="text-[11px] text-muted-foreground hover:text-primary duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-foreground">
              Concierge
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Corporate Gifting', href: '/contact' },
                { label: 'Fulfillment & Delivery', href: '/faq' },
                { label: 'Help & FAQ', href: '/faq' },
                { label: 'Secure Checkout', href: '/terms' },
                { label: 'Privacy Standards', href: '/privacy' },
                { label: 'Contact Support', href: '/contact' }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[11px] text-muted-foreground hover:text-primary duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-foreground">
              Private Release List
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Subscribe to receive exclusive access to allocations of rare, highly sought-after spirits and private events.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-muted border border-border/80 text-[11px] text-foreground py-3 pl-4 pr-12 rounded-none font-medium placeholder:text-muted-foreground/40 focus:border-primary"
                required
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-primary hover:text-accent duration-300 cursor-pointer"
              >
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Legal Regulatory Warning */}
        <div className="border-t border-border/60 py-8 flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-between">
          <div className="flex items-center gap-3 text-red-500 max-w-3xl">
            <ShieldAlert className="h-6 w-6 shrink-0" />
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground leading-relaxed">
              Government Warning: (1) According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects. (2) Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problems. Strictly 21+ only.
            </p>
          </div>
        </div>

        {/* Bottom copy & legal standards */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          <span>&copy; {currentYear} NextShot Inc. All Rights Reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-primary duration-300">Terms of Use</Link>
            <Link href="/privacy" className="hover:text-primary duration-300">Privacy Policy</Link>
            <span>Lic. No. NY-LIQ-2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

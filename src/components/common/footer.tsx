import Link from 'next/link';
import Logo from '@/components/branding/logo';

import {
  Mail,
  ArrowRight,
  ShieldAlert,
  Truck,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-10">

        <div className="flex flex-col md:flex-row justify-between gap-10">

          <div className="max-w-sm">
            <Logo />

            <p className="mt-4 text-sm text-muted-foreground">
              Premium liquor delivery experience with fast shipping and verified quality products.
            </p>

            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://instagram.com"
                className="text-muted-foreground hover:text-primary duration-300"
              >
                Instagram
              </a>

              <a
                href="https://facebook.com"
                className="text-muted-foreground hover:text-primary duration-300"
              >
                Facebook
              </a>

              <a
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary duration-300"
              >
                Twitter
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>

            <div className="flex flex-col gap-2 text-sm">
              <Link href="/">Home</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Features</h3>

            <div className="space-y-3 text-sm text-muted-foreground">

              <div className="flex items-center gap-2">
                <Truck size={16} />
                Fast Delivery
              </div>

              <div className="flex items-center gap-2">
                <RotateCcw size={16} />
                Easy Returns
              </div>

              <div className="flex items-center gap-2">
                <ShieldAlert size={16} />
                Secure Checkout
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Verified Products
              </div>

            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>

            <div className="flex items-center border rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Enter email"
                className="bg-transparent px-3 py-2 outline-none text-sm"
              />

              <button className="px-3">
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Mail size={16} />
              support@nextshot.com
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
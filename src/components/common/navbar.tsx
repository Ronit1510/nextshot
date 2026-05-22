'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart-store';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/branding/logo';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  X, 
  Heart, 
  Compass, 
  HelpCircle,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import {
  UserButton,
  SignInButton
} from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/shop', label: 'Spirits Catalog', icon: Compass },
    { href: '/categories', label: 'Categories', icon: TrendingUp },
    { href: '/about', label: 'Our Story', icon: HelpCircle },
  ];

  if (!mounted) return null;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'py-4 bg-background/85 backdrop-blur-md border-b border-border/40 shadow-lg' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Nav (Desktop) */}
            <nav className="hidden lg:flex items-center gap-8 w-1/3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className="relative group text-[10px] tracking-[0.25em] uppercase text-foreground/80 hover:text-primary transition-colors duration-300 font-medium"
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 right-0 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : ''}`} />
                  </Link>
                );
              })}
            </nav>

            {/* Brand Logo (Center) */}
            <div className="flex items-center justify-center lg:w-1/3">
              <Link href="/" className="cursor-pointer">
                <Logo className="h-8 sm:h-9" showTagline={true} />
              </Link>
            </div>

            {/* Right Controls (Desktop) */}
            <div className="hidden lg:flex items-center justify-end gap-6 w-1/3">
              {/* Wishlist Link */}
              <Link 
                href="/dashboard/wishlist"
                className="text-foreground/80 hover:text-primary transition-colors duration-300 relative"
              >
                <Heart className="h-5 w-5 stroke-[1.25]" />
              </Link>

              {/* Shopping Cart Drawer Link */}
              <Link 
                href="/cart"
                className="text-foreground/80 hover:text-primary transition-colors duration-300 relative flex items-center"
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.25]" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-2 bg-gradient-to-r from-primary to-accent text-background text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-md font-sans"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <div className="h-4 w-[1px] bg-border/80" />

              {/* Authentication */}
              <div className="flex items-center">
                <SignedIn>
                  <div className="flex items-center gap-4">
                    <Link 
                      href="/dashboard"
                      className="text-[9px] uppercase tracking-[0.2em] text-foreground/75 hover:text-primary duration-300 flex items-center gap-1 font-medium"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                    <UserButton 
                      appearance={{
                        elements: {
                          userButtonAvatarBox: 'border border-primary/20 h-7 w-7'
                        }
                      }} 
                    />
                  </div>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-[10px] tracking-[0.25em] uppercase text-foreground/80 hover:text-primary transition-colors duration-300 flex items-center gap-1.5 cursor-pointer font-medium">
                      <UserIcon className="h-4 w-4 stroke-[1.5]" />
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>

            {/* Mobile Controls (Touch Screens) */}
            <div className="lg:hidden flex items-center gap-4">
              <Link 
                href="/cart"
                className="text-foreground/80 hover:text-primary relative"
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-background text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center font-sans">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground/80 hover:text-primary cursor-pointer"
              >
                {mobileMenuOpen ? <X className="h-6 w-6 stroke-[1.5]" /> : <Menu className="h-6 w-6 stroke-[1.5]" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-[72px] sm:top-[80px] left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/80 lg:hidden overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6 flex flex-col">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[12px] tracking-[0.25em] uppercase text-foreground/80 hover:text-primary flex items-center gap-3 transition-colors duration-300 font-medium"
                  >
                    <Icon className="h-4.5 w-4.5 text-primary/70" />
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href="/dashboard/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[12px] tracking-[0.25em] uppercase text-foreground/80 hover:text-primary flex items-center gap-3 transition-colors duration-300 font-medium"
              >
                <Heart className="h-4.5 w-4.5 text-primary/70" />
                Wishlist
              </Link>

              <div className="h-[1px] bg-border/60 w-full" />

              {/* Auth Panel */}
              <div className="pt-2">
                <SignedIn>
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[12px] tracking-[0.25em] uppercase text-foreground/80 hover:text-primary flex items-center gap-3 font-medium"
                    >
                      <LayoutDashboard className="h-4.5 w-4.5 text-primary/70" />
                      Dashboard Portal
                    </Link>
                    <div className="flex items-center gap-3">
                      <UserButton showName />
                    </div>
                  </div>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full bg-gradient-to-r from-primary to-accent text-background py-3 text-center text-[10px] tracking-[0.3em] uppercase font-semibold hover:opacity-90 duration-300 cursor-pointer"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

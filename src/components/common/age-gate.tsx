'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/branding/logo';
import LuxuryStamp from '@/components/branding/luxury-stamp';

export default function AgeGate() {
  const { ageVerified, setAgeVerified } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // If age already verified, do not show age gate
  if (ageVerified) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!day || !month || !year) {
      setError('Please fill in your complete birthdate.');
      return;
    }

    const birthDateObj = new Date(Number(year), Number(month) - 1, Number(day));
    
    // Check if valid date
    if (
      birthDateObj.getFullYear() !== Number(year) ||
      birthDateObj.getMonth() !== Number(month) - 1 ||
      birthDateObj.getDate() !== Number(day)
    ) {
      setError('Please enter a valid date.');
      return;
    }

    // Check if 21+ years old
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    if (age >= 21) {
      setAgeVerified(true, birthDateObj.toISOString());
    } else {
      setError('You must be 21 years of age or older to enter NextShot.');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background p-4 overflow-y-auto"
      >
        {/* Dynamic Dark Luxury Cinematic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,rgba(11,11,12,1)_80%)]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#FFF_1px,transparent_1px),linear-gradient(to_bottom,#FFF_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="relative max-w-lg w-full luxury-glass rounded-none p-8 md:p-12 text-center flex flex-col items-center shadow-2xl border-primary/10 overflow-hidden"
        >
          {/* Top subtle golden light leak */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Luxury Rotating Seal Stamp */}
          <LuxuryStamp className="mb-8" size={130} />

          {/* Logo */}
          <Logo className="h-10 mb-4" showTagline={true} />

          <h1 className="text-xl md:text-2xl text-editorial tracking-wide text-foreground mt-4 mb-2">
            Fine Spirits Await
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
            Please verify that you are at least 21 years of age to enter our premium cellar.
          </p>

          <form onSubmit={handleVerify} className="w-full space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {/* Month */}
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-muted-foreground text-left mb-2 font-medium">
                  Month (MM)
                </label>
                <input
                  type="number"
                  placeholder="05"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  min="1"
                  max="12"
                  className="w-full bg-muted border border-border/80 text-foreground py-3 px-4 text-center rounded-none text-sm placeholder:text-muted-foreground/40 font-medium focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Day */}
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-muted-foreground text-left mb-2 font-medium">
                  Day (DD)
                </label>
                <input
                  type="number"
                  placeholder="22"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  min="1"
                  max="31"
                  className="w-full bg-muted border border-border/80 text-foreground py-3 px-4 text-center rounded-none text-sm placeholder:text-muted-foreground/40 font-medium focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-muted-foreground text-left mb-2 font-medium">
                  Year (YYYY)
                </label>
                <input
                  type="number"
                  placeholder="1995"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full bg-muted border border-border/80 text-foreground py-3 px-4 text-center rounded-none text-sm placeholder:text-muted-foreground/40 font-medium focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] text-red-500 uppercase tracking-widest bg-red-950/20 border border-red-500/10 py-2.5 px-4"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary via-accent to-primary text-background py-4 text-[10px] uppercase tracking-[0.35em] font-semibold hover:opacity-90 duration-300 rounded-none shadow-lg cursor-pointer mt-4"
            >
              Enter Cellar
            </button>
          </form>

          <div className="mt-8 text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 leading-relaxed max-w-xs">
            By entering NextShot, you agree to our Terms of Service & Privacy Policy. We support responsible drinking.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      
      {/* Editorial Hero Section */}
      <section className="relative h-[65vh] w-full flex items-center justify-center overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1600" 
            alt="Luxury spirits cellar" 
            className="w-full h-full object-cover scale-105 select-none"
          />
        </div>

        <div className="relative z-20 text-center max-w-3xl mx-auto px-4 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold block"
          >
            The Heritage & The Vision
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl text-editorial tracking-wide leading-tight"
          >
            Curating Liquid Artistry
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="h-[1px] w-12 bg-primary mx-auto my-6"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[12px] md:text-sm text-muted-foreground uppercase tracking-widest font-mono leading-relaxed"
          >
            NextShot is the premier American e-commerce vault built for the sophisticated collector. 
            We bridge the gap between rare, allocated spirits and immediate, concierge delivery.
          </motion.p>
        </div>
      </section>

      {/* Story Narrative Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-mono">01 / The Curation</span>
              <h2 className="text-3xl text-editorial tracking-wide text-foreground">
                Only the Exceptional
              </h2>
            </div>
            
            <p className="text-muted-foreground text-sm font-sans leading-relaxed">
              At NextShot, we do not believe in saturated shelves. Every single bottle inside our vault is hand-inspected, approved, and cataloged by our master tasting panel. From historical single-barrel bourbons aging in the heart of Kentucky to vintage reserve Bordeaux wines and limited-release reposado tequilas, our collection is curated for those who understand that spirits are not merely beverages, but assets.
            </p>

            <p className="text-muted-foreground text-sm font-sans leading-relaxed">
              We leverage direct partnerships with historic distilleries, private collectors, and licensed importers to secure allocations that are typically hidden behind closed doors. With NextShot, the cabinet of your dreams is just a click away.
            </p>

            <div className="pt-4">
              <Link href="/shop" className="btn-gold px-6 py-3 text-xs uppercase tracking-widest font-bold font-mono">
                Explore the Vault
              </Link>
            </div>
          </div>

          <div className="relative h-[500px] bg-muted/20 border border-border/80 p-4">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=1000" 
              alt="Rare whiskey glass" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700"
            />
          </div>

        </div>
      </section>

      {/* Brand Values Row */}
      <section className="bg-muted/10 border-y border-border/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            
            {/* Value 1 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary mb-2">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-foreground">
                Uncompromising Quality
              </h3>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono max-w-xs leading-relaxed">
                Direct origin validation ensures 100% authentic spirits. Every seal is checked, tracked, and certified.
              </p>
            </div>

            {/* Value 2 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary mb-2">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-foreground">
                Bespoke Logistics
              </h3>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono max-w-xs leading-relaxed">
                Temperature-controlled transit ensures aging properties are never disturbed. Safe, white-glove hand-delivery.
              </p>
            </div>

            {/* Value 3 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-foreground">
                Legal & Secure
              </h3>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono max-w-xs leading-relaxed">
                Fully compliant 21+ verification gates and state liquor regulations handling. Safe transactions backed by Stripe.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Locations and Contact Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <MapPin className="h-7 w-7 text-primary mx-auto animate-bounce" />
        <h2 className="text-2xl md:text-3xl text-editorial tracking-wide max-w-xl mx-auto">
          Delivering Exclusivity Coast to Coast
        </h2>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground max-w-md mx-auto font-mono leading-relaxed">
          Headquartered in Manhattan, New York, with compliance hubs spanning California, Florida, and Texas. NextShot guarantees swift routing to certified addresses.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link href="/contact" className="border border-primary text-primary hover:bg-primary hover:text-black duration-300 px-6 py-2.5 text-xs font-bold uppercase tracking-widest font-mono">
            Get in Touch
          </Link>
        </div>
      </section>

    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductCard from '@/components/product/product-card';
import { 
  Sparkles, 
  ArrowRight, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  Award,
  Globe2,
  Compass
} from 'lucide-react';

async function getFeaturedData() {
  try {
    await connectToDatabase();
    
    // Fetch featured/trending items
    const featured = await Product.find({ featured: true })
      .populate('category', 'name')
      .limit(4)
      .lean();
      
    const trending = await Product.find({ trending: true })
      .populate('category', 'name')
      .limit(4)
      .lean();

    const categories = await Category.find({ featured: true }).limit(4).lean();

    // Map Mongo objects to standard JS objects for serialization
    return {
      featured: JSON.parse(JSON.stringify(featured)),
      trending: JSON.parse(JSON.stringify(trending)),
      categories: JSON.parse(JSON.stringify(categories))
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return { featured: [], trending: [], categories: [] };
  }
}

export default async function Home() {
  const { featured, trending, categories } = await getFeaturedData();

  return (
    <div className="relative overflow-hidden min-h-screen">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center py-20 px-4 md:px-8 bg-background">
        {/* Dynamic Dark Luxury Video/Image Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04)_0%,rgba(11,11,12,1)_85%)]" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.3] scale-105 duration-1000 animate-pulse-slow"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1569937756447-1d44f657bc69?q=80&w=1920&auto=format&fit=crop")' }}
        />

        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8 px-4">
          <div className="inline-flex items-center gap-2 border border-primary/20 bg-muted/40 backdrop-blur-md py-1.5 px-4 rounded-none text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-primary animate-fade-in-down font-semibold shadow-md">
            <Sparkles className="h-3 w-3" />
            Allocated Spirits Cellar &bull; Express US Dispatch
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl text-editorial tracking-tight text-foreground font-light leading-[1.08] animate-fade-in">
            Rare Spirits.<br />
            <span className="font-normal italic gold-text-gradient">Unrivaled Speed.</span>
          </h1>
          
          <p className="text-[12px] sm:text-sm text-muted-foreground uppercase tracking-[0.28em] max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-light">
            Welcome to the digital cabinet for serious spirits collectors. We source directly from elite distilleries and deliver with concierge velocity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up">
            <Link 
              href="/shop" 
              className="w-full sm:w-auto bg-gradient-to-r from-primary via-accent to-primary text-background py-4 px-10 text-[10px] uppercase tracking-[0.35em] font-semibold hover:opacity-90 duration-300 shadow-xl cursor-pointer"
            >
              Enter the Cellar
            </Link>
            <Link 
              href="/about" 
              className="w-full sm:w-auto border border-border/80 hover:border-primary bg-background/30 hover:bg-muted/30 backdrop-blur-sm text-foreground py-4 px-10 text-[10px] uppercase tracking-[0.35em] font-semibold duration-300 cursor-pointer"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Visual Categories Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-semibold block">Curated Portfolios</span>
            <h2 className="text-2xl md:text-3xl text-editorial tracking-wide text-foreground">
              Shop by Category
            </h2>
          </div>
          <Link href="/categories" className="text-[10px] uppercase tracking-[0.25em] text-primary hover:text-accent font-semibold flex items-center gap-1.5 duration-300 mt-4 md:mt-0">
            View All Categories
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.length > 0 ? (
            categories.map((cat: any) => (
              <Link 
                key={cat._id}
                href={`/shop?category=${cat.slug}`}
                className="group relative aspect-[4/5] overflow-hidden border border-border/80 hover:border-primary/20 duration-500 bg-muted flex items-end p-6 cursor-pointer"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center duration-700 ease-out group-hover:scale-105 filter brightness-[0.5] group-hover:brightness-[0.4]"
                  style={{ backgroundImage: `url(${cat.image || 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=600&auto=format&fit=crop'})` }}
                />
                {/* Thin border overlay */}
                <div className="absolute inset-4 border border-white/5 group-hover:border-primary/10 duration-500" />
                <div className="relative z-10 space-y-1">
                  <h3 className="text-sm uppercase tracking-[0.22em] font-medium text-foreground">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground/80 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            // Category Fallback Cards if not seeded
            ['Whisky', 'Tequila', 'Champagne', 'Wine'].map((catName) => (
              <div 
                key={catName}
                className="relative aspect-[4/5] border border-dashed border-border flex flex-col items-center justify-center p-6 text-center space-y-2 bg-muted/20"
              >
                <Compass className="h-6 w-6 text-muted-foreground/40" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{catName} Collection</span>
                <span className="text-[9px] text-muted-foreground/60">Awaiting database seeding.</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Seeding Advice Widget (shown only if database is completely empty) */}
      {featured.length === 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12 mb-16 border border-dashed border-primary/25 bg-primary/5 text-center space-y-4">
          <Award className="h-8 w-8 text-primary mx-auto" />
          <h3 className="text-sm uppercase tracking-[0.25em] text-foreground font-semibold">Initial Setup Required</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Welcome to NextShot! The MongoDB Atlas database is currently connected but empty. To populate the store with curated luxury bottles (Pappy Van Winkle, Clase Azul, Dom Pérignon), please click the seed button below.
          </p>
          <a 
            href="/api/admin/seed" 
            target="_blank"
            className="inline-block bg-primary text-background py-3 px-6 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent duration-300"
          >
            Seed Database Now
          </a>
        </section>
      )}

      {/* 3. Featured Allocated Collection */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-semibold block">The Vault</span>
              <h2 className="text-2xl md:text-3xl text-editorial tracking-wide text-foreground">
                Allocated Masterpieces
              </h2>
            </div>
            <Link href="/shop?featured=true" className="text-[10px] uppercase tracking-[0.25em] text-primary hover:text-accent font-semibold flex items-center gap-1.5 duration-300 mt-4 md:mt-0">
              Browse Allocated Vault
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Luxury Cinematic Promotion Banner */}
      <section className="relative py-24 my-16 bg-muted/50 border-y border-border/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03)_0%,transparent_75%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="text-[9px] uppercase tracking-[0.35em] text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1">
            Private Allocation Offer
          </span>
          <h2 className="text-3xl md:text-5xl text-editorial tracking-wide text-foreground font-light">
            Take 20% Off Your First Acquisition
          </h2>
          <p className="text-[12px] uppercase tracking-[0.25em] text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Apply luxury coupon code <span className="text-primary font-semibold tracking-widest bg-muted border border-border py-1 px-2.5 ml-1">LUXURY20</span> during checkout.
          </p>
          <div className="pt-4">
            <Link 
              href="/shop"
              className="bg-primary text-background py-4 px-10 text-[10px] uppercase tracking-[0.35em] font-semibold hover:bg-accent duration-300 cursor-pointer"
            >
              Acquire Allocations
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Trending Spirits Grid */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-semibold block">High Demand</span>
              <h2 className="text-2xl md:text-3xl text-editorial tracking-wide text-foreground">
                Trending Vintages
              </h2>
            </div>
            <Link href="/shop?trending=true" className="text-[10px] uppercase tracking-[0.25em] text-primary hover:text-accent font-semibold flex items-center gap-1.5 duration-300 mt-4 md:mt-0">
              Browse Trending Spirits
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Brand Credibility / Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border/60">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          <div className="space-y-3">
            <Globe2 className="h-7 w-7 text-primary mx-auto stroke-[1.25]" />
            <h3 className="text-xs uppercase tracking-[0.25em] text-foreground font-semibold">Worldwide Sourcing</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Meticulous connections from the rolling hills of Kentucky to the prestigious vineyards of Bordeaux.
            </p>
          </div>
          
          <div className="space-y-3">
            <ShieldCheck className="h-7 w-7 text-primary mx-auto stroke-[1.25]" />
            <h3 className="text-xs uppercase tracking-[0.25em] text-foreground font-semibold">Concierge Delivery</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Full transit protection, signature-required deliveries, and professional courier handling.
            </p>
          </div>

          <div className="space-y-3">
            <Percent className="h-7 w-7 text-primary mx-auto stroke-[1.25]" />
            <h3 className="text-xs uppercase tracking-[0.25em] text-foreground font-semibold">Loyalty Allocations</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Earn 5% back on every single acquisition. Redeem points for guaranteed allocations on rare releases.
            </p>
          </div>

          <div className="space-y-3">
            <Calendar className="h-7 w-7 text-primary mx-auto stroke-[1.25]" />
            <h3 className="text-xs uppercase tracking-[0.25em] text-foreground font-semibold">Collector Network</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Unlock private online tasting events, concierge cellar cataloging, and corporate gift custom services.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

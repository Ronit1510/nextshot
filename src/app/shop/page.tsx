'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/product/product-card';
import { Product } from '@/types';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Star, 
  Compass, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [onlyAllocated, setOnlyAllocated] = useState(false);
  const [onlyTrending, setOnlyTrending] = useState(false);
  const [sort, setSort] = useState('newest');

  // Load Categories & Products on mount
  useEffect(() => {
    async function fetchFilterData() {
      try {
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchFilterData();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError('');
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('q', search);
        if (selectedCategory) queryParams.set('category', selectedCategory);
        if (selectedOrigin) queryParams.set('origin', selectedOrigin);
        if (priceRange < 5000) queryParams.set('maxPrice', priceRange.toString());
        if (onlyAllocated) queryParams.set('featured', 'true');
        if (onlyTrending) queryParams.set('trending', 'true');
        queryParams.set('sort', sort);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Failed to retrieve vault spirits.');
        
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err: any) {
        setError(err.message || 'Error occurred.');
      } finally {
        setLoading(false);
      }
    }

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); // 300ms debounce for typing search

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory, selectedOrigin, priceRange, onlyAllocated, onlyTrending, sort]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedOrigin('');
    setPriceRange(5000);
    setOnlyAllocated(false);
    setOnlyTrending(false);
    setSort('newest');
  };

  const origins = ['USA', 'Mexico', 'France', 'Scotland'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Editorial Title Header */}
      <div className="space-y-4 mb-16 text-center lg:text-left">
        <span className="text-[9px] uppercase tracking-[0.35em] text-primary font-bold">
          NextShot Vault
        </span>
        <h1 className="text-3xl md:text-5xl text-editorial tracking-wide text-foreground">
          The Curated spirits portfolio
        </h1>
        <p className="text-[12px] uppercase tracking-[0.25em] text-muted-foreground max-w-xl leading-relaxed">
          Filter rare bourbon allocations, elite vintage champagne, and artisanal agave distillations with complete precision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Filters Sidebar */}
        <div className="space-y-8 lg:col-span-1">
          <div className="luxury-glass p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-foreground flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Refine Spirits
              </h3>
              <button 
                onClick={handleResetFilters}
                className="text-[9px] uppercase tracking-widest text-primary hover:text-accent duration-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            {/* 1. Search */}
            <div className="space-y-2">
              <label className="block text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                Tasting Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Bourbon, peat, sherry, 23yr..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-muted border border-border text-[11px] py-3 pl-4 pr-10 rounded-none text-foreground placeholder:text-muted-foreground/30 focus:border-primary"
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
              </div>
            </div>

            {/* 2. Categories */}
            <div className="space-y-2">
              <label className="block text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-muted border border-border text-[11px] py-3 px-4 rounded-none text-foreground cursor-pointer appearance-none focus:border-primary"
                >
                  <option value="">All Spirits</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                  ))}
                  {categories.length === 0 && (
                    ['Whisky', 'Tequila', 'Champagne', 'Wine', 'Cognac', 'Vodka', 'Gin', 'Rum', 'Beer'].map((name) => (
                      <option key={name} value={name.toLowerCase()}>{name}</option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
              </div>
            </div>

            {/* 3. Origin */}
            <div className="space-y-2">
              <label className="block text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                Distillery Origin
              </label>
              <div className="relative">
                <select
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="w-full bg-muted border border-border text-[11px] py-3 px-4 rounded-none text-foreground cursor-pointer appearance-none focus:border-primary"
                >
                  <option value="">All Regions</option>
                  {origins.map((origin) => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
              </div>
            </div>

            {/* 4. Price Limit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-muted-foreground">
                <span className="font-semibold">Maximum Price</span>
                <span className="text-primary font-bold font-mono">
                  {priceRange >= 5000 ? 'No Limit' : `$${priceRange}`}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-muted accent-primary cursor-pointer"
              />
            </div>

            {/* 5. Special Flags */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAllocated}
                  onChange={(e) => setOnlyAllocated(e.target.checked)}
                  className="h-4 w-4 rounded-none border border-border bg-muted accent-primary cursor-pointer"
                />
                <span className="text-[10px] uppercase tracking-wider text-foreground font-medium">
                  Allocations Only
                </span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyTrending}
                  onChange={(e) => setOnlyTrending(e.target.checked)}
                  className="h-4 w-4 rounded-none border border-border bg-muted accent-primary cursor-pointer"
                />
                <span className="text-[10px] uppercase tracking-wider text-foreground font-medium">
                  Trending Expressions
                </span>
              </label>
            </div>

          </div>
        </div>

        {/* Catalog Main Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-border/80 bg-muted/20 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{products.length}</span> Curated expressions
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-[9px] uppercase tracking-wider text-muted-foreground">Sort By</label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-muted border border-border text-[10px] uppercase tracking-widest py-2 pl-3 pr-8 text-foreground cursor-pointer appearance-none focus:border-primary"
                >
                  <option value="newest">New Releases</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid Layouts */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i} 
                    className="border border-border/80 bg-muted/40 aspect-[4/6] animate-pulse relative flex flex-col justify-end p-6 space-y-3"
                  >
                    <div className="h-[60%] w-full bg-border/40" />
                    <div className="h-4 w-[40%] bg-border/40" />
                    <div className="h-5 w-full bg-border/40" />
                    <div className="h-4 w-[25%] bg-border/40" />
                  </div>
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-16 border border-dashed border-red-500/20 bg-red-950/10 text-red-400 space-y-2 uppercase tracking-widest text-xs"
              >
                <ShieldAlert className="h-8 w-8 mx-auto" />
                <p>Error: {error}</p>
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-20 border border-dashed border-border/80 text-muted-foreground space-y-4 uppercase tracking-widest text-xs"
              >
                <Compass className="h-8 w-8 mx-auto text-muted-foreground/30 animate-spin" style={{ animationDuration: '30s' }} />
                <p className="text-foreground">No Expressions Found</p>
                <p className="text-[10px] text-muted-foreground/60">Try adjustments to your filter parameters or search queries.</p>
                <button 
                  onClick={handleResetFilters}
                  className="bg-primary text-background text-[9px] font-semibold py-3 px-6 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store/cart-store';
import { ShoppingCart, Star, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Map Product properties to CartItem
    addItem({
      id: product._id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
      stock: product.stock,
      abv: product.abv,
      size: product.size
    }, 1);

    alert(`Added ${product.title} to your luxury cart.`);
  };

  const isOutOfStock = product.stock <= 0;
  const categoryName = typeof product.category === 'object' && product.category 
    ? product.category.name 
    : 'Premium Spirits';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group relative bg-[#121214] border border-border/80 hover:border-primary/20 duration-500 overflow-hidden flex flex-col h-full shadow-lg"
    >
      {/* Decorative Golden Corner Highlights */}
      <div className="absolute top-0 left-0 w-[1px] h-0 group-hover:h-8 bg-gradient-to-b from-primary to-transparent duration-700" />
      <div className="absolute top-0 left-0 h-[1px] w-0 group-hover:w-8 bg-gradient-to-r from-primary to-transparent duration-700" />
      <div className="absolute bottom-0 right-0 w-[1px] h-0 group-hover:h-8 bg-gradient-to-t from-primary to-transparent duration-700" />
      <div className="absolute bottom-0 right-0 h-[1px] w-0 group-hover:w-8 bg-gradient-to-l from-primary to-transparent duration-700" />

      {/* Floating Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        {product.featured && (
          <div className="bg-primary/95 text-background text-[8px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 flex items-center gap-1 shadow-md">
            <Sparkles className="h-2.5 w-2.5" />
            Allocation
          </div>
        )}
        {product.trending && (
          <div className="bg-secondary/95 text-primary text-[8px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 border border-primary/20 shadow-md">
            Trending
          </div>
        )}
        {isOutOfStock && (
          <div className="bg-red-950 text-red-400 text-[8px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 border border-red-500/20 shadow-md">
            Sold Out
          </div>
        )}
      </div>

      {/* Action Hover Triggers */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            alert('Saved to your private cellar wishlist.');
          }}
          className="h-8 w-8 rounded-full bg-background/80 hover:bg-primary hover:text-background text-foreground/80 flex items-center justify-center border border-border/80 duration-300 backdrop-blur-md cursor-pointer"
        >
          <Heart className="h-4 w-4 stroke-[1.25]" />
        </button>
      </div>

      {/* Product Image Link */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] bg-muted/20 overflow-hidden cursor-pointer">
        <motion.img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-contain p-6 duration-700 ease-out group-hover:scale-105 filter brightness-[0.88] group-hover:brightness-100"
          loading="lazy"
        />
        {/* Sleek bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent opacity-0 group-hover:opacity-100 duration-500" />
      </Link>

      {/* Product Metadata Info */}
      <div className="p-6 flex flex-col flex-grow space-y-3">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>{categoryName}</span>
          <span className="font-semibold text-foreground/85">{product.size} &bull; {product.abv}% ABV</span>
        </div>

        <Link href={`/product/${product.slug}`} className="block group-hover:text-primary duration-300 cursor-pointer">
          <h3 className="text-[13px] tracking-wide font-medium text-foreground uppercase line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Origin */}
        <div className="text-[10px] text-muted-foreground font-serif italic">
          {product.origin}
        </div>

        {/* Ratings and Pricing Row */}
        <div className="flex items-center justify-between pt-2">
          {/* Price */}
          <div className="text-sm font-semibold tracking-wider font-sans text-primary">
            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          {/* Rating */}
          {product.ratings.count > 0 ? (
            <div className="flex items-center gap-1 text-[10px] text-primary">
              <Star className="h-3 w-3 fill-primary stroke-[1.5]" />
              <span className="font-semibold text-foreground">{product.ratings.average}</span>
              <span className="text-muted-foreground">({product.ratings.count})</span>
            </div>
          ) : (
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Unrated</span>
          )}
        </div>

        {/* Cart Trigger Button */}
        <div className="pt-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center gap-2 py-3 text-[9px] uppercase tracking-[0.25em] font-semibold duration-300 cursor-pointer border ${
              isOutOfStock
                ? 'bg-muted/40 border-border/80 text-muted-foreground/40 cursor-not-allowed'
                : 'bg-secondary hover:bg-primary border-primary/10 hover:border-primary hover:text-background text-foreground'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {isOutOfStock ? 'Sold Out' : 'Request Allocation'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

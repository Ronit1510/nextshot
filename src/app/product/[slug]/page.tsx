import React from 'react';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import ReviewSection from '@/components/product/review-section';
import SEOSchema from '@/components/common/seo-schema';
import ProductCard from '@/components/product/product-card';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MapPin, 
  Droplet, 
  Scale, 
  TrendingUp, 
  AlertCircle,
  Undo2,
  CalendarDays
} from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductData(slug: string) {
  try {
    await connectToDatabase();
    
    // Find product
    const product = await Product.findOne({ slug })
      .populate('category', 'name slug')
      .lean();

    if (!product) return null;

    // Fetch related recommendations (same category, excluding current product)
    const recommendations = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id }
    })
      .populate('category', 'name')
      .limit(3)
      .lean();

    return {
      product: JSON.parse(JSON.stringify(product)),
      recommendations: JSON.parse(JSON.stringify(recommendations))
    };
  } catch (error) {
    console.error('Error fetching product detail page:', error);
    return null;
  }
}

export default async function ProductDetails({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductData(slug);

  if (!data) {
    return notFound();
  }

  const { product, recommendations } = data;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen py-12 relative">
      {/* Inject Product-specific dynamic Schema JSON-LD */}
      <SEOSchema type="product" product={product} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Backlink */}
        <Link 
          href="/shop"
          className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary duration-300 mb-12 font-medium"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Back to Cellar Portfolio
        </Link>

        {/* Core Product Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Visual Gallery */}
          <div className="space-y-6">
            <div className="luxury-glass aspect-square flex items-center justify-center p-12 bg-muted/20 relative overflow-hidden group">
              <img 
                src={product.images[0]} 
                alt={product.title}
                className="max-h-[82%] object-contain duration-700 ease-out group-hover:scale-105 filter brightness-[0.9] group-hover:brightness-100"
              />
              
              {/* Golden layout leak corners */}
              <div className="absolute top-4 left-4 h-6 w-6 border-t border-l border-primary/20" />
              <div className="absolute bottom-4 right-4 h-6 w-6 border-b border-r border-primary/20" />
            </div>
            
            {/* Multiple thumbnail placeholders simulating interactive gallery */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img: string, idx: number) => (
                <div key={idx} className="luxury-glass aspect-square p-4 flex items-center justify-center bg-muted/10 opacity-70 hover:opacity-100 duration-300 cursor-pointer">
                  <img src={img} alt={`${product.title} view ${idx + 1}`} className="max-h-full object-contain filter brightness-[0.85]" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Premium Details Spec sheet */}
          <div className="flex flex-col justify-center space-y-8">
            
            {/* Classification */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.35em] text-primary font-bold">
                {product.category.name} Allocation
              </span>
              <h1 className="text-3xl md:text-5xl text-editorial tracking-wide text-foreground leading-[1.12]">
                {product.title}
              </h1>
              
              {/* Micro specs */}
              <div className="flex items-center gap-6 pt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary/70" /> {product.origin}</span>
                <span className="flex items-center gap-1.5"><Droplet className="h-3.5 w-3.5 text-primary/70" /> {product.abv}% ABV</span>
                <span className="flex items-center gap-1.5"><Scale className="h-3.5 w-3.5 text-primary/70" /> {product.size}</span>
              </div>
            </div>

            {/* Price section */}
            <div className="border-y border-border/80 py-6 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">Vault Pricing</span>
                <span className="text-2xl sm:text-3xl font-semibold tracking-wider text-primary font-sans">
                  ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground block text-right mb-1">Status</span>
                {isOutOfStock ? (
                  <span className="text-[10px] uppercase tracking-widest text-red-400 bg-red-950/20 border border-red-500/10 py-1.5 px-3 font-semibold">Allocations Depleted</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-widest text-green-400 bg-green-950/20 border border-green-500/10 py-1.5 px-3 font-semibold">Allocations Available ({product.stock})</span>
                )}
              </div>
            </div>

            {/* Editorial Story description */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground">The Story</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              {product.story && (
                <p className="text-[12px] font-serif italic text-muted-foreground/80 leading-relaxed pl-4 border-l border-primary/20">
                  "{product.story}"
                </p>
              )}
            </div>

            {/* Premium Guarantee Pillars */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-muted/40 border border-border/80 p-3.5 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <div className="space-y-0.5">
                  <h4 className="text-[9px] uppercase tracking-wider font-semibold text-foreground">Guaranteed Origin</h4>
                  <p className="text-[9px] text-muted-foreground leading-tight">Certified directly from distillery.</p>
                </div>
              </div>

              <div className="bg-muted/40 border border-border/80 p-3.5 flex items-start gap-3">
                <CalendarDays className="h-5 w-5 text-primary shrink-0" />
                <div className="space-y-0.5">
                  <h4 className="text-[9px] uppercase tracking-wider font-semibold text-foreground">Next-Day Transit</h4>
                  <p className="text-[9px] text-muted-foreground leading-tight">Climate-controlled dispatch.</p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="pt-4">
              {/* Dynamic Add to Cart integration */}
              {/* For Server component, we can use a client component trigger wrapper or standard interactive forms. */}
              {/* We render a beautiful Client Trigger button */}
              {/* To make it instantly functional, we provide link or client actions */}
              <Link 
                href="/cart"
                className={`w-full flex items-center justify-center gap-2 py-4.5 text-[10px] uppercase tracking-[0.3em] font-bold duration-300 ${
                  isOutOfStock
                    ? 'bg-muted border border-border text-muted-foreground/40 cursor-not-allowed pointer-events-none'
                    : 'bg-gradient-to-r from-primary via-accent to-primary text-background shadow-xl hover:opacity-90'
                }`}
              >
                {isOutOfStock ? 'Depleted Allocation' : 'Acquire Allocation'}
              </Link>
            </div>

          </div>

        </div>

        {/* Testimonial review board */}
        <ReviewSection 
          productId={product._id} 
          averageRating={product.ratings.average} 
          reviewCount={product.ratings.count} 
        />

        {/* Similar recommendations section */}
        {recommendations.length > 0 && (
          <div className="border-t border-border/80 pt-16 mt-20">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl text-editorial tracking-wide text-foreground">
                You May Also Appreciate
              </h3>
              <Link href="/shop" className="text-[9px] uppercase tracking-widest text-primary hover:text-accent font-semibold flex items-center gap-1 duration-300">
                Browse Full Vault <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec: any) => (
                <ProductCard key={rec._id} product={rec} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

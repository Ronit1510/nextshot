import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';

const SEED_CATEGORIES = [
  { name: 'Whisky', slug: 'whisky', description: 'Rare Single Malts, Small Batch Bourbons & Allocated Ryes', image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=600&auto=format&fit=crop', featured: true },
  { name: 'Tequila', slug: 'tequila', description: 'Extra Añejo, Reposado & Small-Estate Agave Vintages', image: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?q=80&w=600&auto=format&fit=crop', featured: true },
  { name: 'Champagne', slug: 'champagne', description: 'Prestigious Brut, Rosé & Vintage Champagne Expressions', image: 'https://images.unsplash.com/photo-1594487787947-f5dc6e98f29d?q=80&w=600&auto=format&fit=crop', featured: true },
  { name: 'Wine', slug: 'wine', description: 'Exceptional Bordeaux, Napa Cabernet & Old World Vintages', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop', featured: true },
  { name: 'Cognac', slug: 'cognac', description: 'Luxury Grande Champagne Cognacs Aged For Generations', image: 'https://images.unsplash.com/photo-1569937756447-1d44f657bc69?q=80&w=600&auto=format&fit=crop', featured: false },
  { name: 'Vodka', slug: 'vodka', description: 'Ultra-Pure Custom Distilled & Elite Gold Vintages', image: 'https://images.unsplash.com/photo-1550976092-2b622c830901?q=80&w=600&auto=format&fit=crop', featured: false },
  { name: 'Gin', slug: 'gin', description: 'Botanical Infused Craft Expressions & Artisanal Distillations', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=600&auto=format&fit=crop', featured: false },
  { name: 'Rum', slug: 'rum', description: 'Deep Oak Aged Caribbean Single Cask Rum Selections', image: 'https://images.unsplash.com/photo-1614313511387-1436a4480edd?q=80&w=600&auto=format&fit=crop', featured: false },
  { name: 'Beer', slug: 'beer', description: 'Kentucky Stout Cask Aged Ales & Rare Micro-Brews', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop', featured: false }
];

const SEED_PRODUCTS = [
  // WHISKY
  {
    title: 'Pappy Van Winkle 23 Year Family Reserve',
    slug: 'pappy-van-winkle-23-year',
    sku: 'WH-PVW-23',
    price: 3499.99,
    costPrice: 950.00,
    stock: 3,
    description: 'The pinnacle of Kentucky Bourbon. A highly sought-after wheated bourbon expression aged for 23 long summers.',
    story: 'Pappy Van Winkle 23 Year Family Reserve is the holy grail of American Bourbon. Crafted using wheat instead of rye, this legendary mash bill has matured in deep-charred heavy oak casks for nearly a quarter of a century. The result is a smooth, extraordinarily complex profile defined by notes of dark cocoa, dried cherries, mahogany wood, and warm leather. Only a handful of bottles are released worldwide each year.',
    images: ['https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=800&auto=format&fit=crop'],
    abv: 47.8,
    origin: 'Kentucky, USA',
    size: '750ml',
    ratings: { average: 4.9, count: 24 },
    featured: true,
    trending: true,
    bestSeller: false
  },
  {
    title: 'Macallan Sherry Oak 18 Year Single Malt',
    slug: 'macallan-sherry-oak-18-year',
    sku: 'WH-MAC-18',
    price: 450.00,
    costPrice: 160.00,
    stock: 15,
    description: 'An iconic highland scotch matured exclusively in hand-picked Oloroso sherry oak casks from Jerez, Spain.',
    story: 'The Macallan Sherry Oak 18 Years Old reveals the unrivaled commitment to the mastery of wood and spirit for which The Macallan is renowned. Maturing for eighteen years in seasoned sherry wood gives this Scotch robust notes of dried ginger, sweet dates, rich clove spices, and toasted orange zest. An absolute essential for any serious collector.',
    images: ['https://images.unsplash.com/photo-1588581282844-4c6eea7bd3d2?q=80&w=800&auto=format&fit=crop'],
    abv: 43.0,
    origin: 'Speyside, Scotland',
    size: '750ml',
    ratings: { average: 4.8, count: 87 },
    featured: true,
    trending: false,
    bestSeller: true
  },
  
  // TEQUILA
  {
    title: 'Clase Azul Reposado Tequila',
    slug: 'clase-azul-reposado',
    sku: 'TQ-CLA-REP',
    price: 189.99,
    costPrice: 65.00,
    stock: 24,
    description: 'An ultra-premium reposado tequila housed in a signature hand-painted cobalt blue decanter.',
    story: 'Clase Azul Reposado is an ultra-premium tequila crafted from 100% blue Weber agave harvested at the peak of maturity in Jalisco. Slow-cooked in traditional brick ovens and matured for 8 months in American whiskey barrels, it yields sweet notes of vanilla, candied orange peel, and agave syrup. Its decanter is hand-sculpted and painted by Mexican artisans.',
    images: ['https://images.unsplash.com/photo-1516535794938-6063878f08cc?q=80&w=800&auto=format&fit=crop'],
    abv: 40.0,
    origin: 'Jalisco, Mexico',
    size: '750ml',
    ratings: { average: 4.7, count: 142 },
    featured: true,
    trending: true,
    bestSeller: true
  },
  {
    title: 'Don Julio 1942 Extra Añejo',
    slug: 'don-julio-1942',
    sku: 'TQ-DON-1942',
    price: 199.99,
    costPrice: 70.00,
    stock: 35,
    description: 'A spectacular celebratory extra-añejo tequila, aged in American white oak barrels.',
    story: 'Don Julio 1942 is handcrafted in tribute to the year that Don Julio González began his tequila-making journey. Aged for a minimum of two and a half years in small batches, this liquid is celebrated in elite cocktail circles for its unmatched smoothness. Taste layers of warm caramel, dark chocolate, sweet oak, and a lingering warm vanilla finish.',
    images: ['https://images.unsplash.com/photo-1608885898957-a599fb16ec8c?q=80&w=800&auto=format&fit=crop'],
    abv: 40.0,
    origin: 'Jalisco, Mexico',
    size: '750ml',
    ratings: { average: 4.9, count: 215 },
    featured: false,
    trending: true,
    bestSeller: true
  },

  // CHAMPAGNE
  {
    title: 'Dom Pérignon Brut Vintage',
    slug: 'dom-perignon-vintage',
    sku: 'CH-DP-BRUT',
    price: 289.99,
    costPrice: 90.00,
    stock: 18,
    description: 'The standard of luxury champagne. A complex blend of Chardonnay and Pinot Noir from a stellar vintage year.',
    story: 'Dom Pérignon is vintage-only champagne. Each vintage is a unique creation, expressing both the character of the year and the Dom Pérignon style. Dom Pérignon Vintage offers a perfect tension between acid structure, opulent white peach notes, toasted brioche, and fine minerality. It represents the height of luxury celebration.',
    images: ['https://images.unsplash.com/photo-1594487787947-f5dc6e98f29d?q=80&w=800&auto=format&fit=crop'],
    abv: 12.5,
    origin: 'Champagne, France',
    size: '750ml',
    ratings: { average: 4.8, count: 64 },
    featured: true,
    trending: false,
    bestSeller: true
  },

  // WINE
  {
    title: 'Opus One Napa Valley Cabernet Sauvignon',
    slug: 'opus-one-napa-valley',
    sku: 'WN-OPUS-ONE',
    price: 395.00,
    costPrice: 140.00,
    stock: 12,
    description: 'A legendary Bordeaux-style red blend born from a collaboration between Mondavi and Baron Philippe de Rothschild.',
    story: 'Opus One is the premier luxury red wine of California. Exhibiting aromas of fresh red fruits, sweet baking spices, black tea, and cocoa, this vintage offers velvety tannins and a long, seamless finish. Cultivated in heart of Napa Valley, this elegant blend is suitable for cellaring for up to 30 years.',
    images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop'],
    abv: 14.5,
    origin: 'Napa Valley, California',
    size: '750ml',
    ratings: { average: 4.9, count: 52 },
    featured: true,
    trending: true,
    bestSeller: false
  },

  // COGNAC
  {
    title: 'Louis XIII Rémy Martin Grande Champagne Cognac',
    slug: 'louis-xiii-remy-martin',
    sku: 'CG-LXIII',
    price: 4350.00,
    costPrice: 1250.00,
    stock: 2,
    description: 'An exceptional blend of up to 1,200 eaux-de-vie, 100% sourced from Grande Champagne.',
    story: 'Louis XIII is an absolute masterpiece of blending. Housed in a hand-crafted Baccarat crystal decanter decorated with historical fleur-de-lys symbols, this prestigious cognac offers deep aromas of myrrh, plum, honey, immortelle flowers, and leather. Some of the liquid inside has been aged for over 100 years.',
    images: ['https://images.unsplash.com/photo-1569937756447-1d44f657bc69?q=80&w=800&auto=format&fit=crop'],
    abv: 40.0,
    origin: 'Cognac, France',
    size: '750ml',
    ratings: { average: 5.0, count: 8 },
    featured: true,
    trending: false,
    bestSeller: false
  }
];

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Seed Categories
    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(SEED_CATEGORIES);
    console.log('Seeded categories successfully!');

    // Create a map to look up category ObjectID by slug
    const categoryMap: { [key: string]: string } = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id.toString();
    });

    // 2. Map Products to Categories and Seed
    const formattedProducts = SEED_PRODUCTS.map((prod) => {
      // Find the category key in our map
      let catSlug = 'whisky';
      if (prod.sku.startsWith('TQ')) catSlug = 'tequila';
      if (prod.sku.startsWith('CH')) catSlug = 'champagne';
      if (prod.sku.startsWith('WN')) catSlug = 'wine';
      if (prod.sku.startsWith('CG')) catSlug = 'cognac';

      return {
        ...prod,
        category: categoryMap[catSlug]
      };
    });

    await Product.deleteMany({});
    await Product.insertMany(formattedProducts);
    console.log('Seeded products successfully!');

    // 3. Seed Luxury Coupons
    await Coupon.deleteMany({});
    await Coupon.insertMany([
      {
        code: 'LUXURY20',
        discountType: 'percentage',
        discountAmount: 20,
        minPurchase: 100,
        maxDiscount: 200,
        expiresAt: new Date('2028-12-31'),
        active: true
      },
      {
        code: 'FIRSTSHOT',
        discountType: 'flat',
        discountAmount: 50,
        minPurchase: 250,
        expiresAt: new Date('2028-12-31'),
        active: true
      }
    ]);
    console.log('Seeded coupons successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database seeded with custom luxury categories, products, and premium coupons successfully.',
      categoriesSeeded: SEED_CATEGORIES.length,
      productsSeeded: SEED_PRODUCTS.length
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

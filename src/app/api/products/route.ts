import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    
    // Parse query params
    const query = searchParams.get('q') || '';
    const categorySlug = searchParams.get('category') || '';
    const origin = searchParams.get('origin') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const featured = searchParams.get('featured') === 'true';
    const trending = searchParams.get('trending') === 'true';
    const bestSeller = searchParams.get('bestSeller') === 'true';
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    // Build Mongoose Query Filter
    const filter: any = {};

    // 1. Text Search Query
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { sku: { $regex: query, $options: 'i' } }
      ];
    }

    // 2. Category filtering
    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug.toLowerCase() });
      if (cat) {
        filter.category = cat._id;
      } else {
        // Return empty results if category slug is provided but not found
        return NextResponse.json({
          products: [],
          pagination: { total: 0, pages: 0, currentPage: page, limit }
        });
      }
    }

    // 3. Origin Filtering
    if (origin) {
      filter.origin = { $regex: origin, $options: 'i' };
    }

    // 4. Price range filtering
    if (minPrice > 0 || maxPrice < 999999) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    // 5. Special collections flags
    if (featured) filter.featured = true;
    if (trending) filter.trending = true;
    if (bestSeller) filter.bestSeller = true;

    // Define Sorting Orders
    let sortOptions: any = {};
    if (sort === 'newest') {
      sortOptions.createdAt = -1;
    } else if (sort === 'price-low') {
      sortOptions.price = 1;
    } else if (sort === 'price-high') {
      sortOptions.price = -1;
    } else if (sort === 'rating') {
      sortOptions['ratings.average'] = -1;
    } else if (sort === 'alphabetical') {
      sortOptions.title = 1;
    }

    // Fetch and populate results
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug description image')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });

  } catch (error: any) {
    console.error('Error fetching catalog products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const { 
      title, 
      slug, 
      description, 
      story, 
      price, 
      costPrice, 
      sku, 
      stock, 
      category, 
      images, 
      abv, 
      origin, 
      size, 
      featured, 
      trending, 
      bestSeller, 
      metaTitle, 
      metaDescription 
    } = body;
    
    if (!title || !slug || !description || price === undefined || costPrice === undefined || !sku || !category || !images || !images.length || abv === undefined || !origin || !size) {
      return NextResponse.json({ success: false, error: 'Missing required product fields' }, { status: 400 });
    }

    const newProduct = new Product({
      title,
      slug: slug.toLowerCase(),
      description,
      story,
      price,
      costPrice,
      sku,
      stock: stock || 0,
      category,
      images,
      abv,
      origin,
      size,
      ratings: { average: 0, count: 0 },
      featured: !!featured,
      trending: !!trending,
      bestSeller: !!bestSeller,
      metaTitle,
      metaDescription
    });

    await newProduct.save();

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Product with this SKU or slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

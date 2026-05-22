import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch categories, featured first, then alphabetical
    const categories = await Category.find({})
      .sort({ featured: -1, name: 1 });

    return NextResponse.json({
      success: true,
      categories
    });

  } catch (error: any) {
    console.error('Error fetching e-commerce categories:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const newCategory = new Category(body);
    await newCategory.save();
    
    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

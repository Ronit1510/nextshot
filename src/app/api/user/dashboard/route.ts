import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, message: 'User email is required' }, { status: 400 });
    }

    // Fetch user order records, sorted newest first
    const orders = await Order.find({
      $or: [
        { guestEmail: email.toLowerCase() },
        // If we also link by userId, we would query here, but email is extremely standard and robust!
      ]
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({
      success: true,
      orders
    });

  } catch (error: any) {
    console.error('Error fetching dashboard order logs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

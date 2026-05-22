import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { code, purchaseAmount } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid coupon code' }, { status: 404 });
    }

    if (!coupon.active) {
      return NextResponse.json({ success: false, message: 'This coupon is inactive' }, { status: 400 });
    }

    const now = new Date();
    if (coupon.expiresAt < now) {
      return NextResponse.json({ success: false, message: 'This coupon has expired' }, { status: 400 });
    }

    if (purchaseAmount < coupon.minPurchase) {
      return NextResponse.json({
        success: false,
        message: `Minimum purchase amount of $${coupon.minPurchase} is required to apply this coupon.`
      }, { status: 400 });
    }

    // Coupon is valid
    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount
      }
    });

  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import Order from '@/models/Order';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Initialize Stripe gracefully
const stripe = STRIPE_SECRET_KEY 
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any }) 
  : null;

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { items, couponCode, userEmail, userId, shippingAddress, billingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart items are required' }, { status: 400 });
    }

    // 1. Verify items and stock in database
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const verifiedOrderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) {
        return NextResponse.json({ success: false, message: `Product not found: ${item.title}` }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          success: false, 
          message: `Insufficient stock for ${product.title}. Only ${product.stock} available.` 
        }, { status: 400 });
      }

      subtotal += product.price * item.quantity;
      verifiedOrderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        title: product.title,
        image: product.images[0]
      });

      // Construct Stripe Line Item
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: [product.images[0]],
            description: product.description,
          },
          unit_amount: Math.round(product.price * 100), // In cents
        },
        quantity: item.quantity,
      });
    }

    // 2. Validate and apply coupon
    let discount = 0;
    let appliedCouponObj = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (coupon && coupon.expiresAt > new Date() && subtotal >= coupon.minPurchase) {
        appliedCouponObj = coupon;
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountAmount) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountAmount;
        }
      }
    }

    // 3. Calculate taxes and shipping
    const shippingThreshold = 150;
    const shipping = subtotal >= shippingThreshold ? 0 : 15;
    const taxRate = 0.08; // 8% State Tax
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * taxRate * 100) / 100;
    const total = Math.round((taxableAmount + tax + shipping) * 100) / 100;

    // Apply Stripe shipping options if Stripe is configured
    const stripeDiscounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];

    // If Stripe is NOT active, mock the checkout session redirect for rapid testing!
    if (!stripe) {
      console.warn('STRIPE_SECRET_KEY is not defined. Simulating checkout order generation.');
      
      // Save order in database with status 'pending' (simulating what webhook does)
      const mockSessionId = 'mock_stripe_' + Math.random().toString(36).substr(2, 9);
      
      const newOrder = new Order({
        user: userId || undefined,
        guestEmail: userEmail,
        items: verifiedOrderItems,
        shippingAddress,
        billingAddress,
        pricing: {
          subtotal,
          shipping,
          tax,
          discount,
          total
        },
        couponUsed: appliedCouponObj?._id,
        stripeSessionId: mockSessionId,
        paymentStatus: 'paid', // Mark as paid directly in mock mode
        orderStatus: 'processing',
        loyaltyPointsEarned: Math.floor(total * 0.05) // 5% points reward
      });

      await newOrder.save();

      // Deduct inventory
      for (const item of verifiedOrderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }

      // Add mock success redirect URL
      return NextResponse.json({
        success: true,
        url: `/checkout/success?session_id=${mockSessionId}`
      });
    }

    // 4. Create Stripe Checkout Session
    // If a coupon is applied, we create an on-the-fly coupon on Stripe or represent it via custom invoice items.
    // For simplicity, we can pass metadata and calculate the balance, or use Stripe's dynamic discounts.
    // Let's create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: userEmail,
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout/cancel`,
      metadata: {
        userId: userId || '',
        guestEmail: userEmail || '',
        couponCode: couponCode || '',
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        subtotal: subtotal.toString(),
        discount: discount.toString(),
        tax: tax.toString(),
        shipping: shipping.toString(),
        total: total.toString()
      }
    });

    return NextResponse.json({
      success: true,
      url: session.url
    });

  } catch (error: any) {
    console.error('Error generating checkout session:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

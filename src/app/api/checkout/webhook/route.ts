import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Coupon from '@/models/Coupon';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = STRIPE_SECRET_KEY 
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any }) 
  : null;

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured locally' }, { status: 400 });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET || '');
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed:`, err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    await connectToDatabase();

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const {
        userId,
        guestEmail,
        couponCode,
        shippingAddress,
        billingAddress,
        subtotal,
        discount,
        tax,
        shipping,
        total
      } = session.metadata || {};

      // 1. Extract addresses
      const parsedShipping = shippingAddress ? JSON.parse(shippingAddress) : {};
      const parsedBilling = billingAddress ? JSON.parse(billingAddress) : {};

      // 2. Fetch line items from Stripe to construct Order items
      const stripeLineItems = await stripe.checkout.sessions.listLineItems(session.id);
      
      const orderItems = [];
      for (const item of stripeLineItems.data) {
        // Fetch product by SKU or search description
        // In full production, we link metadata with line items, but for now we look up by title or product name
        const product = await Product.findOne({ title: item.description });
        
        if (product) {
          orderItems.push({
            product: product._id,
            quantity: item.quantity || 1,
            price: (item.price?.unit_amount || 0) / 100,
            title: product.title,
            image: product.images[0]
          });

          // Deduct inventory
          await Product.findByIdAndUpdate(product._id, {
            $inc: { stock: -(item.quantity || 1) }
          });
        }
      }

      // 3. Find coupon if applied
      let couponUsedId = undefined;
      if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          couponUsedId = coupon._id;
          // Increment usage count
          await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usageCount: 1 } });
        }
      }

      const orderTotal = parseFloat(total || '0');

      // 4. Create Order
      const newOrder = new Order({
        user: userId || undefined,
        guestEmail: guestEmail || session.customer_details?.email || undefined,
        items: orderItems,
        shippingAddress: parsedShipping,
        billingAddress: parsedBilling,
        pricing: {
          subtotal: parseFloat(subtotal || '0'),
          shipping: parseFloat(shipping || '0'),
          tax: parseFloat(tax || '0'),
          discount: parseFloat(discount || '0'),
          total: orderTotal
        },
        couponUsed: couponUsedId,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string || undefined,
        paymentStatus: 'paid',
        orderStatus: 'processing',
        loyaltyPointsEarned: Math.floor(orderTotal * 0.05) // Credit 5% loyalty points
      });

      await newOrder.save();

      // 5. Update user loyalty points
      if (userId) {
        await User.findOneAndUpdate(
          { clerkId: userId },
          { $inc: { loyaltyPoints: Math.floor(orderTotal * 0.05) } }
        );
      }

      console.log(`✅ Order fulfilled successfully for Session: ${session.id}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

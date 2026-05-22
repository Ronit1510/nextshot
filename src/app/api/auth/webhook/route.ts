import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { data, type } = payload;

    if (!data) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Handle User Created Event
    if (type === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = data;
      const primaryEmail = email_addresses?.[0]?.email_address || '';
      const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'Valued Connoisseur';

      // Generate a unique 8-character referral code for the new user
      const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Check if user already exists
      let user = await User.findOne({ clerkId: id });
      if (!user) {
        user = new User({
          clerkId: id,
          email: primaryEmail,
          name: fullName,
          avatar: image_url || undefined,
          role: 'user',
          loyaltyPoints: 100, // Gift 100 points on registration!
          referralCode,
          ageVerified: false
        });
        await user.save();
        console.log(`👤 Sync Webhook: Created user ${fullName} (${id})`);
      }
    }

    // 2. Handle User Updated Event
    if (type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = data;
      const primaryEmail = email_addresses?.[0]?.email_address || '';
      const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'Valued Connoisseur';

      await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: primaryEmail,
          name: fullName,
          avatar: image_url
        },
        { upsert: true }
      );
      console.log(`👤 Sync Webhook: Updated user ${fullName} (${id})`);
    }

    // 3. Handle User Deleted Event
    if (type === 'user.deleted') {
      const { id } = data;
      await User.findOneAndDelete({ clerkId: id });
      console.log(`👤 Sync Webhook: Deleted user (${id})`);
    }

    return NextResponse.json({ success: true, message: 'Clerk sync executed successfully' });

  } catch (error: any) {
    console.error('Error handling Clerk webhook sync:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function GET() {
  return NextResponse.json({ message: 'Clerk Auth Webhook is live. Send POST requests.' });
}

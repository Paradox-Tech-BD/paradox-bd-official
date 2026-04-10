import { NextRequest, NextResponse } from 'next/server';
import { createClerkClient } from '@clerk/nextjs/server';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const eventType = payload?.type;

    if (eventType === 'user.created') {
      const userId = payload?.data?.id;
      if (!userId) {
        return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
      }

      const user = await clerk.users.getUser(userId);
      const existingRole = (user.publicMetadata as { role?: string })?.role;

      if (!existingRole) {
        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: { role: 'learner' },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Clerk webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

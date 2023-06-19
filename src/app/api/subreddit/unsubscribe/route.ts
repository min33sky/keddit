import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubredditSubscriptionValidator } from '@/lib/validators/subreddit';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to unsubscribe to a subreddit' },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    // check if user has already subscribed to subreddit
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return NextResponse.json(
        {
          error: 'You are already unsubscribed to this subreddit',
        },
        { status: 400 },
      );
    }

    // create subreddit and associate it with the user
    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({
      subredditId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        error:
          'Could not unsubscribe to subreddit at this time. Please try later',
      },
      { status: 500 },
    );
  }
}

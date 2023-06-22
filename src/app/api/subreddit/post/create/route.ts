import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validators/post';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { subredditId, title, content } = PostValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          message: '로그인이 필요합니다.',
        },
        {
          status: 401,
        },
      );
    }

    // verify user is subscribed to passed subreddit id
    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        subredditId,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        {
          message: 'You must be subscribed to the subreddit to post',
        },
        {
          status: 401,
        },
      );
    }

    await db.post.create({
      data: {
        title,
        content,
        subredditId,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message:
          'Could not post to subreddit at thie time. Please try again later.',
      },
      {
        status: 500,
      },
    );
  }
}
